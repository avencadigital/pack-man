/**
 * File types that can be parsed
 */
export type FileKind = "package.json" | "requirements.txt" | "pubspec.yaml";

/**
 * Package manager types
 */
export type PackageManager = "npm" | "pip" | "pub";

/**
 * Result of parsing a dependency file
 */
export interface ParsedDependencies {
  kind: FileKind;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager: PackageManager;
}

/**
 * Base interface for dependency file parsers
 */
export interface DependencyParser {
  /**
   * Check if this parser can handle the given content/filename
   */
  canParse(content: string, fileName?: string): boolean;
  
  /**
   * Parse the content and extract dependencies
   */
  parse(content: string): ParsedDependencies;
  
  /**
   * Get the file type this parser handles
   */
  getFileType(): FileKind;
  
  /**
   * Get the package manager for this file type
   */
  getPackageManager(): PackageManager;
}
