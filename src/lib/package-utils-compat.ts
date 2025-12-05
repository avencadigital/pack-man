/**
 * Compatibility layer for package-utils.ts
 * This file re-exports all functions from their new locations
 * to maintain backward compatibility during migration
 * 
 * @deprecated Use direct imports from specific modules instead
 */

// Re-export from formatters
export { formatFileSize, cleanVersion } from './formatters';

// Re-export from package utilities
export { getPackageUrl, getStatusColor } from './package';
export { getChangeType } from './package';

// Re-export from parsers
export { 
  detectFileType,
  getExtensionFromKind,
  getMimeFromKind 
} from './parsers';

// Re-export types for compatibility
export type { 
  FileKind,
  DetectedFileType 
} from './parsers';

// Re-export from generators
export { generateUpdatedPackageFile } from './generators';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[DEPRECATION] package-utils-compat.ts is deprecated. ' +
    'Please update imports to use specific modules: ' +
    '@/lib/formatters, @/lib/package, @/lib/parsers, @/lib/generators'
  );
}
