import { UpdateStrategy, UpdateOptions } from '../types';
import { PackageInfo } from '@/types/package';
import { FileKind } from '@/lib/parsers';
import { shouldUpdateVersion } from '@/lib/package';

/**
 * Update strategy for requirements.txt files
 */
export class PipUpdateStrategy implements UpdateStrategy {
  getFileKind(): FileKind {
    return 'requirements.txt';
  }

  canHandle(fileKind: FileKind): boolean {
    return fileKind === 'requirements.txt';
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
      // Create regex to match the package line
      // Escape special characters in package name
      const escapedName = pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Match various version specifier formats
      const regex = new RegExp(
        `^(${escapedName})(==|>=|<=|>|<|~=|!=)?(.*)$`,
        'gm'
      );
      
      newContent = newContent.replace(regex, (match, name, operator) => {
        const newLine = `${name}==${pkg.latestVersion}`;
        console.log(`Updated requirement ${pkg.name}: ${match.trim()} -> ${newLine}`);
        return newLine;
      });
    });

    return newContent;
  }
}
