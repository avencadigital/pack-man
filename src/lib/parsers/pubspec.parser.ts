import { DependencyParser, ParsedDependencies, FileKind, PackageManager } from './types';

/**
 * Parser for pubspec.yaml files (Dart/Flutter)
 */
export class PubspecParser implements DependencyParser {
  getFileType(): FileKind {
    return 'pubspec.yaml';
  }

  getPackageManager(): PackageManager {
    return 'pub';
  }

  canParse(content: string, fileName?: string): boolean {
    // Check filename
    if (fileName?.toLowerCase().includes('pubspec')) {
      return true;
    }

    // Check for YAML structure with Dart/Flutter specific fields
    const hasYamlStructure = (
      content.includes('dependencies:') ||
      content.includes('dev_dependencies:')
    );
    
    // A file with name: and dependencies: is likely a pubspec.yaml
    const hasDartFields = (
      content.includes('name:') || 
      content.includes('version:') ||
      content.includes('sdk: flutter')
    );

    return hasYamlStructure && hasDartFields;
  }

  parse(content: string): ParsedDependencies {
    const dependencies: Record<string, string> = {};
    const devDependencies: Record<string, string> = {};
    const lines = content.split('\n');
    
    let currentSection: 'dependencies' | 'dev_dependencies' | null = null;
    let indentLevel = 0;
    let skipNextLine = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip if we should skip this line
      if (skipNextLine) {
        // Check if this line is a sub-property (sdk: flutter)
        if (trimmed.startsWith('sdk:')) {
          skipNextLine = false;
          continue;
        }
        skipNextLine = false;
      }
      
      // Calculate indent level (assuming 2 spaces per level)
      const currentIndent = line.length - line.trimStart().length;

      // Check for section headers
      if (trimmed === 'dependencies:') {
        currentSection = 'dependencies';
        indentLevel = currentIndent;
        continue;
      } else if (trimmed === 'dev_dependencies:') {
        currentSection = 'dev_dependencies';
        indentLevel = currentIndent;
        continue;
      } else if (trimmed && !line.startsWith(' '.repeat(indentLevel + 2)) && currentSection) {
        // Exit section if we're back at the same or lower indent level
        if (currentIndent <= indentLevel) {
          currentSection = null;
          continue;
        }
      }

      // Parse dependencies in current section
      if (currentSection && trimmed && currentIndent > indentLevel) {
        const match = trimmed.match(/^([^:]+):\s*(.*)$/);
        if (match) {
          const [, name, versionPart] = match;
          const packageName = name.trim();
          
          // Skip Flutter SDK references entirely
          if ((packageName === 'flutter' || packageName === 'flutter_test')) {
            // Check if next line is 'sdk: flutter'
            if (i + 1 < lines.length) {
              const nextLine = lines[i + 1].trim();
              if (nextLine.startsWith('sdk:')) {
                skipNextLine = true;
                continue;
              }
            }
            // If it's a direct flutter dependency without sdk sub-property, skip it
            if (!versionPart || versionPart === '') {
              skipNextLine = true;
              continue;
            }
          }
          
          // Skip if this is the 'sdk' line from a Flutter dependency
          if (packageName === 'sdk' && versionPart === 'flutter') {
            continue;
          }

          let version = versionPart.trim();
          
          // Handle various version formats
          if (!version || version === '') {
            // Check next line for version on separate line or sub-properties
            if (i + 1 < lines.length) {
              const nextLine = lines[i + 1].trim();
              const nextIndent = lines[i + 1].length - lines[i + 1].trimStart().length;
              
              // If next line is more indented, it's likely a sub-property - skip this package
              if (nextIndent > currentIndent) {
                skipNextLine = true;
                continue;
              }
              
              if (nextLine.startsWith('version:')) {
                version = nextLine.replace('version:', '').trim();
              } else {
                version = 'any';
              }
            } else {
              version = 'any';
            }
          }

          // Clean up version string
          version = version.replace(/["']/g, ''); // Remove quotes
          
          // Store in appropriate section
          if (currentSection === 'dependencies') {
            dependencies[packageName] = version;
          } else if (currentSection === 'dev_dependencies') {
            devDependencies[packageName] = version;
          }
        }
      }
    }

    return {
      kind: this.getFileType(),
      dependencies,
      devDependencies: Object.keys(devDependencies).length > 0 ? devDependencies : undefined,
      packageManager: this.getPackageManager()
    };
  }
}
