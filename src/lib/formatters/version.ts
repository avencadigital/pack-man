/**
 * Cleans a version string by removing common prefixes and suffixes
 * @param version - The version string to clean
 * @returns Cleaned version string
 * 
 * @example
 * cleanVersion("^1.2.3") // "1.2.3"
 * cleanVersion("~2.0.0") // "2.0.0"
 * cleanVersion("v3.0.0") // "3.0.0"
 * cleanVersion(">=4.0.0") // "4.0.0"
 */
export function cleanVersion(version: string): string {
  return version
    .replace(/[\^~>=<]/g, "")  // Remove version range operators
    .replace(/v/gi, "")         // Remove 'v' prefix (case insensitive)
    .trim();
}

/**
 * Extracts the version prefix from a version string
 * @param versionString - The version string with potential prefix
 * @returns The prefix (^, ~, >=, etc.) or empty string
 * 
 * @example
 * getVersionPrefix("^1.2.3") // "^"
 * getVersionPrefix("~2.0.0") // "~"
 * getVersionPrefix("1.0.0") // ""
 */
export function getVersionPrefix(versionString: string): string {
  const match = versionString.match(/^([\^~>=<]+)/);
  return match ? match[1] : "";
}
