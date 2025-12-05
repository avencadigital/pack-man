import { PackageInfo } from '@/types/package';
import { detectFileType } from '@/lib/parsers';
import { NpmUpdateStrategy } from './strategies/npm-strategy';
import { PipUpdateStrategy } from './strategies/pip-strategy';
import { PubUpdateStrategy } from './strategies/pub-strategy';
import { UpdateStrategy, UpdateOptions } from './types';

/**
 * Registry of available update strategies
 */
const strategies: UpdateStrategy[] = [
  new NpmUpdateStrategy(),
  new PipUpdateStrategy(),
  new PubUpdateStrategy()
];

/**
 * Generates an updated package file with new versions
 * @param originalContent - Original file content
 * @param packages - Package information with current and latest versions
 * @param options - Update options (which version types to update)
 * @param fileName - Optional filename for better file type detection
 * @returns Updated file content with new package versions
 */
export function generateUpdatedPackageFile(
  originalContent: string,
  packages: PackageInfo[],
  options: UpdateOptions,
  fileName?: string
): string {
  console.log('[generateUpdatedPackageFile] Called with:', {
    packagesCount: packages.length,
    options,
    fileName,
    contentLength: originalContent.length
  });

  try {
    // Detect file type
    const detected = detectFileType(originalContent, fileName);
    const fileKind = detected.kind;
    
    console.log('[generateUpdatedPackageFile] File detection:', {
      detectedKind: fileKind,
      originalFileName: fileName
    });

    // Find appropriate strategy
    const strategy = strategies.find(s => s.canHandle(fileKind));
    
    if (!strategy) {
      console.error(`No update strategy found for file kind: ${fileKind}`);
      return originalContent;
    }

    // Generate updated content
    return strategy.generateUpdate(originalContent, packages, options);
  } catch (error) {
    console.error('[generateUpdatedPackageFile] Error:', error);
    return originalContent;
  }
}

/**
 * Export strategies for direct use if needed
 */
export const UpdateStrategies = {
  Npm: NpmUpdateStrategy,
  Pip: PipUpdateStrategy,
  Pub: PubUpdateStrategy
} as const;
