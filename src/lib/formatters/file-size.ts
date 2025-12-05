/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - The size in bytes
 * @returns Formatted string with appropriate unit (Bytes, KB, MB, GB)
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Ensure we don't go beyond our sizes array
  const sizeIndex = Math.min(i, sizes.length - 1);
  
  return parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(1)) + " " + sizes[sizeIndex];
}
