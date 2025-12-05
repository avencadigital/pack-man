/**
 * Parsers module - File parsing utilities for dependency files
 * @module parsers
 */

// Main exports
export { 
  detectFileType,
  getExtensionFromKind,
  getMimeFromKind,
  Parsers
} from './detector';

// Type exports
export type { 
  FileKind,
  PackageManager,
  ParsedDependencies,
  DependencyParser 
} from './types';

// Re-export for compatibility with old code
// TODO: Update imports to use ParsedDependencies instead
export type { ParsedDependencies as DetectedFileType } from './types';

// Import types for helper function
import type { ParsedDependencies } from './types';

/**
 * Helper function to get all dependencies (including dev) from ParsedDependencies
 * @param parsed - Parsed dependencies object
 * @returns Combined dependencies object
 */
export function getAllDependencies(parsed: ParsedDependencies): Record<string, string> {
  if (parsed.devDependencies) {
    return {
      ...parsed.dependencies,
      ...parsed.devDependencies
    };
  }
  return parsed.dependencies;
}
