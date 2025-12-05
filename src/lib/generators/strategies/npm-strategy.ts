import { UpdateStrategy, UpdateOptions } from '../types';
import { PackageInfo } from '@/types/package';
import { FileKind } from '@/lib/parsers';
import { getVersionPrefix } from '@/lib/formatters';
import { shouldUpdateVersion } from '@/lib/package';

/**
 * Detects the indentation style used in a JSON string
 * @param jsonString - The JSON string to analyze
 * @returns The indentation string (e.g., "  " for 2 spaces, "\t" for tab)
 */
function detectIndentation(jsonString: string): string {
  // Split into lines
  const lines = jsonString.split(/\r?\n/);

  // Look for the first line that has leading whitespace and content
  for (const line of lines) {
    const match = line.match(/^(\s+)\S/);
    if (match) {
      return match[1];
    }
  }

  // Default to 2 spaces if no indentation found
  return "  ";
}

/**
 * Update strategy for package.json files
 */
export class NpmUpdateStrategy implements UpdateStrategy {
  getFileKind(): FileKind {
    return 'package.json';
  }

  canHandle(fileKind: FileKind): boolean {
    return fileKind === 'package.json';
  }

  generateUpdate(
    originalContent: string,
    packages: PackageInfo[],
    options: UpdateOptions
  ): string {
    try {
      const content = JSON.parse(originalContent);

      // Detect line ending style
      const EOL = originalContent.includes('\r\n') ? '\r\n' : '\n';

      // Filter packages that should be updated
      const packagesToUpdate = packages.filter(pkg => {
        if (!pkg.latestVersion || pkg.status !== 'outdated') {
          return false;
        }
        return shouldUpdateVersion(pkg.currentVersion, pkg.latestVersion, options);
      });

      // Update each package
      packagesToUpdate.forEach(pkg => {
        const prefix = getVersionPrefix(pkg.currentVersion);
        const newVersion = prefix + pkg.latestVersion;

        // Update in dependencies
        if (content.dependencies && content.dependencies[pkg.name]) {
          content.dependencies[pkg.name] = newVersion;
          console.log(`Updated dependency ${pkg.name}: ${pkg.currentVersion} -> ${newVersion}`);
        }

        // Update in devDependencies
        if (content.devDependencies && content.devDependencies[pkg.name]) {
          content.devDependencies[pkg.name] = newVersion;
          console.log(`Updated devDependency ${pkg.name}: ${pkg.currentVersion} -> ${newVersion}`);
        }

        // Update in peerDependencies
        if (content.peerDependencies && content.peerDependencies[pkg.name]) {
          content.peerDependencies[pkg.name] = newVersion;
          console.log(`Updated peerDependency ${pkg.name}: ${pkg.currentVersion} -> ${newVersion}`);
        }
      });

      // Detect indentation style
      const indentation = detectIndentation(originalContent);

      // Preserve formatting and line endings
      return JSON.stringify(content, null, indentation).replace(/\n/g, EOL) + EOL;
    } catch (error) {
      console.error('Error updating package.json:', error);
      return originalContent;
    }
  }
}
