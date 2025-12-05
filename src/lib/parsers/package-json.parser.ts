import { DependencyParser, ParsedDependencies, FileKind, PackageManager } from './types';

/**
 * Parser for package.json files (npm/yarn/pnpm)
 */
export class PackageJsonParser implements DependencyParser {
  getFileType(): FileKind {
    return 'package.json';
  }

  getPackageManager(): PackageManager {
    return 'npm';
  }

  canParse(content: string, fileName?: string): boolean {
    // Check filename first for quick identification
    if (fileName?.toLowerCase().includes('package.json')) {
      return true;
    }

    // Try to parse as JSON and check for npm-specific fields
    try {
      const parsed = JSON.parse(content);
      return (
        typeof parsed === 'object' &&
        (
          'dependencies' in parsed ||
          'devDependencies' in parsed ||
          'peerDependencies' in parsed ||
          ('name' in parsed && 'version' in parsed)
        )
      );
    } catch {
      return false;
    }
  }

  parse(content: string): ParsedDependencies {
    try {
      const parsed = JSON.parse(content);
      
      const dependencies = parsed.dependencies || {};
      const devDependencies = parsed.devDependencies || {};
      
      return {
        kind: this.getFileType(),
        dependencies,
        devDependencies: Object.keys(devDependencies).length > 0 ? devDependencies : undefined,
        packageManager: this.getPackageManager()
      };
    } catch (error) {
      throw new Error(`Failed to parse package.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
