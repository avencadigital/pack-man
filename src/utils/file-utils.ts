/**
 * File utility functions for consistent file handling across all input methods
 */

/**
 * Creates a File object from string content and filename
 * @param content - The file content as a string
 * @param fileName - The name of the file
 * @returns A File object
 */
export function createFileFromContent(content: string, fileName: string): File {
  // Determine the MIME type based on the file extension
  const mimeType = getMimeTypeFromFileName(fileName);
  
  // Create a Blob from the content
  const blob = new Blob([content], { type: mimeType });
  
  // Create and return a File object
  return new File([blob], fileName, { type: mimeType });
}

/**
 * Gets the MIME type based on the file name
 * @param fileName - The name of the file
 * @returns The appropriate MIME type
 */
export function getMimeTypeFromFileName(fileName: string): string {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName.endsWith('.json') || lowerFileName === 'package.json') {
    return 'application/json';
  } else if (lowerFileName.endsWith('.txt') || lowerFileName === 'requirements.txt') {
    return 'text/plain';
  } else if (lowerFileName.endsWith('.yaml') || lowerFileName.endsWith('.yml') || lowerFileName === 'pubspec.yaml') {
    return 'text/yaml';
  }
  
  // Default to text/plain for unknown types
  return 'text/plain';
}

/**
 * Validates if a file name is valid
 * @param fileName - The name to validate
 * @returns true if valid, false otherwise
 */
export function validateFileName(fileName: string): boolean {
  if (!fileName || fileName.trim().length === 0) {
    return false;
  }
  
  // Check for invalid characters (basic validation)
  const invalidChars = /[<>:"|?*\x00-\x1F]/;
  if (invalidChars.test(fileName)) {
    return false;
  }
  
  // Check if it's one of our supported file types
  const supportedFiles = ['package.json', 'requirements.txt', 'pubspec.yaml'];
  const lowerFileName = fileName.toLowerCase();
  
  return supportedFiles.some(supported => 
    lowerFileName === supported || 
    lowerFileName.endsWith('.json') || 
    lowerFileName.endsWith('.txt') || 
    lowerFileName.endsWith('.yaml') || 
    lowerFileName.endsWith('.yml')
  );
}

/**
 * Gets the file type from the file name
 * @param fileName - The name of the file
 * @returns The file type or 'unknown'
 */
export function getFileTypeFromName(fileName: string): 'package.json' | 'requirements.txt' | 'pubspec.yaml' | 'unknown' {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName === 'package.json' || lowerFileName.endsWith('package.json')) {
    return 'package.json';
  } else if (lowerFileName === 'requirements.txt' || lowerFileName.endsWith('requirements.txt')) {
    return 'requirements.txt';
  } else if (lowerFileName === 'pubspec.yaml' || lowerFileName.endsWith('pubspec.yaml')) {
    return 'pubspec.yaml';
  }
  
  return 'unknown';
}

/**
 * Ensures a file name has the correct extension based on its type
 * @param fileName - The original file name
 * @param content - The file content (used to detect type if needed)
 * @returns The file name with the correct extension
 */
export function ensureCorrectExtension(fileName: string, content: string): string {
  // If fileName is already one of our standard names, return it as is
  const standardNames = ['package.json', 'requirements.txt', 'pubspec.yaml'];
  if (standardNames.includes(fileName)) {
    return fileName;
  }
  
  // Try to detect the file type from content
  try {
    // Check if it's JSON (package.json)
    JSON.parse(content);
    if (!fileName.endsWith('.json')) {
      return 'package.json';
    }
    return fileName;
  } catch {
    // Not JSON, check for other formats
    const lines = content.trim().split('\n');
    
    // Check for requirements.txt format (package==version or package>=version)
    const isRequirements = lines.some(line => 
      /^[a-zA-Z0-9\-_]+(==|>=|<=|>|<|~=)/.test(line.trim())
    );
    if (isRequirements) {
      if (!fileName.endsWith('.txt')) {
        return 'requirements.txt';
      }
      return fileName;
    }
    
    // Check for pubspec.yaml format
    const isPubspec = content.includes('dependencies:') || 
                      content.includes('dev_dependencies:') ||
                      content.includes('flutter:');
    if (isPubspec) {
      if (!fileName.endsWith('.yaml') && !fileName.endsWith('.yml')) {
        return 'pubspec.yaml';
      }
      return fileName;
    }
  }
  
  // Return original fileName if we can't determine the type
  return fileName;
}
