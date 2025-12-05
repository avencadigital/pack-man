import { PackageInfo } from "@/types/package";
import { FileKind } from "@/lib/parsers";

/**
 * Options for package updates
 */
export interface UpdateOptions {
  updateMajor: boolean;
  updateMinor: boolean;
  updatePatch: boolean;
}

/**
 * Strategy interface for generating updated package files
 */
export interface UpdateStrategy {
  /**
   * Check if this strategy can handle the given file type
   */
  canHandle(fileKind: FileKind): boolean;
  
  /**
   * Generate updated content with new package versions
   */
  generateUpdate(
    originalContent: string,
    packages: PackageInfo[],
    options: UpdateOptions
  ): string;
  
  /**
   * Get the file kind this strategy handles
   */
  getFileKind(): FileKind;
}
