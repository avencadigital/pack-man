import { UpdateStrategy, UpdateOptions } from '../types';
import { PackageInfo } from '@/types/package';
import { FileKind } from '@/lib/parsers';
import { shouldUpdateVersion } from '@/lib/package';

/**
 * Update strategy for pubspec.yaml files
 */
export class PubUpdateStrategy implements UpdateStrategy {
  getFileKind(): FileKind {
    return 'pubspec.yaml';
  }

  canHandle(fileKind: FileKind): boolean {
    return fileKind === 'pubspec.yaml';
  }

  generateUpdate(
    originalContent: string,
    packages: PackageInfo[],
    options: UpdateOptions
  ): string {
    let newContent = originalContent;
    
    // Filter packages that should be updated
    const packagesToUpdate = packages.filter(pkg => {
      if (!pkg.latestVersion || pkg.status !== 'outdated') {
        return false;
      }
      return shouldUpdateVersion(pkg.currentVersion, pkg.latestVersion, options);
    });

    // Update each package
    packagesToUpdate.forEach(pkg => {
      // Escape special characters in package name
      const escapedName = pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Match package in YAML format (with proper indentation)
      const regex = new RegExp(
        `^(\\s+${escapedName}:\\s*)(.*)$`,
        'gm'
      );
      
      newContent = newContent.replace(regex, (match, prefix, version) => {
        // Preserve original prefix (^, ~, etc.) if exists
        const versionMatch = version.match(/^[\^~]/);
        const originalPrefix = versionMatch ? versionMatch[0] : '^';
        const newLine = `${prefix}${originalPrefix}${pkg.latestVersion}`;
        console.log(`Updated pubspec dependency ${pkg.name}: ${match.trim()} -> ${newLine.trim()}`);
        return newLine;
      });
    });

    return newContent;
  }
}
