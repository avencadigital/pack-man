import { DependencyParser, ParsedDependencies, FileKind, PackageManager } from './types';

/**
 * Parser for requirements.txt files (pip/Python)
 */
export class RequirementsParser implements DependencyParser {
  getFileType(): FileKind {
    return 'requirements.txt';
  }

  getPackageManager(): PackageManager {
    return 'pip';
  }

  canParse(content: string, fileName?: string): boolean {
    // Check filename
    if (fileName?.toLowerCase().includes('requirements')) {
      return true;
    }

    // Check content patterns typical of requirements.txt
    const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    
    // If no lines, try simple package==version format
    if (lines.length === 0 && content.trim()) {
      lines.push(content.trim());
    }
    
    // Look for pip-specific patterns
    const pipPatterns = [
      /^[\w-]+==\d+[.\d]*/,     // package==1.0.0 or package==1
      /^[\w-]+>=\d+[.\d]*/,     // package>=1.0.0
      /^[\w-]+~=\d+[.\d]*/,     // package~=1.0.0
      /^[\w-]+\[[\w,]+\]/,   // package[extra]
      /^-e\s+/,              // editable installs
      /^git\+/,              // git dependencies
    ];

    return lines.some(line => 
      pipPatterns.some(pattern => pattern.test(line.trim()))
    );
  }

  parse(content: string): ParsedDependencies {
    const dependencies: Record<string, string> = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      // Skip pip options
      if (trimmed.startsWith('-')) continue;

      let name = trimmed;
      let version = 'latest';

      // Parse different version specifier formats
      const specifiers = ['==', '>=', '<=', '~=', '!=', '>', '<'];
      for (const spec of specifiers) {
        if (trimmed.includes(spec)) {
          const parts = trimmed.split(spec);
          name = parts[0].trim();
          // Extract just the version number, removing operators
          const versionPart = parts.slice(1).join(spec).trim();
          // Remove commas and extract first version if multiple constraints
          const cleanVersion = versionPart.split(',')[0].replace(/[<>=!~]/g, '').trim();
          version = cleanVersion || 'latest';
          break;
        }
      }

      // Handle extras like package[extra]==1.0.0
      const extraMatch = name.match(/^([^[]+)\[([^\]]+)\]/);
      if (extraMatch) {
        name = extraMatch[1].trim();
        // We could store extras info if needed
      }

      // Clean up the package name
      name = name.split(';')[0].trim(); // Remove environment markers

      if (name && !name.startsWith('git+') && !name.startsWith('http')) {
        dependencies[name] = version;
      }
    }

    return {
      kind: this.getFileType(),
      dependencies,
      packageManager: this.getPackageManager()
    };
  }
}
