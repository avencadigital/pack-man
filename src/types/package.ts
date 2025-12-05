/**
 * Represents information about a package dependency with accessibility-focused metadata.
 * 
 * @interface PackageInfo
 * @description Core data structure for package analysis results. Status values are designed
 * to be screen reader friendly and support semantic color coding for visual users.
 * 
 * @accessibility
 * - Status values use clear, descriptive text suitable for screen readers
 * - Homepage URLs should be validated for accessibility before display
 * - Description text should be concise for better screen reader experience
 * 
 * @example
 * `	ypescript
 * const packageInfo: PackageInfo = {
 *   name: "react",
 *   currentVersion: "18.0.0",
 *   latestVersion: "18.2.0",
 *   status: "outdated", // Clear semantic meaning for assistive technology
 *   packageManager: "npm",
 *   homepage: "https://reactjs.org",
 *   description: "A JavaScript library for building user interfaces"
 * };
 * `
 */
export interface PackageInfo {
  /** 
   * Package name as it appears in the package manager registry.
   * @accessibility Should be displayed in a consistent, readable format
   */
  name: string;
  
  /** 
   * Currently installed version of the package.
   * @accessibility Version numbers should be announced clearly by screen readers
   */
  currentVersion: string;
  
  /** 
   * Latest available version from the package registry.
   * @accessibility Should be clearly distinguished from current version for comparison
   */
  latestVersion: string;
  
  /** 
   * Package update status with semantic meaning.
   * @accessibility 
   * - "up-to-date": Conveys positive status, typically shown in green
   * - "outdated": Indicates action needed, typically shown in yellow/orange
   * - "error": Indicates problem, typically shown in red with error icon
   */
  status: "up-to-date" | "outdated" | "error";
  
  /** 
   * Package manager type for context and proper handling.
   * @accessibility Should be displayed with recognizable icons and clear labels
   */
  packageManager: "npm" | "pip" | "pub";
  
  /** 
   * Optional homepage URL for the package.
   * @accessibility 
   * - Should be validated for HTTPS when possible
   * - Links should have descriptive text and proper ARIA labels
   * - External link indicators should be provided
   */
  homepage?: string;
  
  /** 
   * Optional package description for context.
   * @accessibility 
   * - Should be concise to avoid overwhelming screen reader users
   * - May be truncated in UI with expand option for full text
   */
  description?: string;
}

/**
 * Summary statistics for package analysis results with accessibility considerations.
 * 
 * @interface AnalysisSummary
 * @description Provides aggregate data for displaying analysis overview.
 * Numbers should be presented with clear context and semantic meaning.
 * 
 * @accessibility
 * - All counts should be announced with proper context
 * - Visual representations should include text alternatives
 * - Color coding should not be the only way to convey status information
 * 
 * @example
 * `	ypescript
 * const summary: AnalysisSummary = {
 *   total: 25,      // "25 packages analyzed"
 *   upToDate: 20,   // "20 packages up to date"
 *   outdated: 4,    // "4 packages need updates"
 *   errors: 1       // "1 package has errors"
 * };
 * `
 */
export interface AnalysisSummary {
  /** 
   * Total number of packages analyzed.
   * @accessibility Should be announced as "X packages analyzed" or similar
   */
  total: number;
  
  /** 
   * Number of packages that are up to date.
   * @accessibility Should be announced with positive context, e.g., "X packages up to date"
   */
  upToDate: number;
  
  /** 
   * Number of packages that have newer versions available.
   * @accessibility Should be announced with actionable context, e.g., "X packages need updates"
   */
  outdated: number;
  
  /** 
   * Number of packages that encountered errors during analysis.
   * @accessibility Should be announced with error context, e.g., "X packages have errors"
   */
  errors: number;
}

/**
 * Raw package manager file data structure for parsing dependency files.
 * 
 * @interface PackageManagerData
 * @description Represents the structure of dependency files (package.json, requirements.txt, etc.)
 * before processing into PackageInfo objects.
 * 
 * @accessibility
 * - File parsing errors should be communicated clearly to users
 * - Dependency counts should be announced when files are processed
 * 
 * @example
 * `	ypescript
 * // For package.json
 * const npmData: PackageManagerData = {
 *   dependencies: { "react": "^18.0.0", "next": "^13.0.0" },
 *   devDependencies: { "typescript": "^4.9.0" },
 *   packageManager: "npm"
 * };
 * `
 */
export interface PackageManagerData {
  /** 
   * Production dependencies with version constraints.
   * @accessibility Dependency count should be announced when processing
   */
  dependencies: Record<string, string>;
  
  /** 
   * Development dependencies (optional, npm/yarn only).
   * @accessibility Should be clearly distinguished from production dependencies
   */
  devDependencies?: Record<string, string>;
  
  /** 
   * Package manager type for proper parsing logic.
   * @accessibility Should be announced when file type is detected
   */
  packageManager: "npm" | "pip" | "pub";
}

/**
 * Version information retrieved from package registries during analysis.
 * 
 * @interface PackageVersionInfo
 * @description Intermediate data structure used during package analysis process.
 * Contains registry response data before transformation to PackageInfo.
 * 
 * @accessibility
 * - Error messages should be user-friendly and actionable
 * - Registry failures should not prevent analysis of other packages
 * 
 * @example
 * `	ypescript
 * const versionInfo: PackageVersionInfo = {
 *   name: "lodash",
 *   latestVersion: "4.17.21",
 *   description: "A modern JavaScript utility library",
 *   homepage: "https://lodash.com",
 *   error: undefined // No error occurred
 * };
 * `
 */
export interface PackageVersionInfo {
  /** 
   * Package name from registry.
   * @accessibility Should match the name from dependency file for consistency
   */
  name: string;
  
  /** 
   * Latest version available in registry.
   * @accessibility Version format should be consistent across package managers
   */
  latestVersion: string;
  
  /** 
   * Package description from registry (optional).
   * @accessibility Should be sanitized and length-limited for display
   */
  description?: string;
  
  /** 
   * Package homepage URL from registry (optional).
   * @accessibility Should be validated and marked as external links
   */
  homepage?: string;
  
  /** 
   * Error message if registry lookup failed (optional).
   * @accessibility Error messages should be clear and actionable for users
   */
  error?: string;
}

/**
 * Type alias for package status values with semantic meaning.
 * @accessibility Status should be conveyed through multiple channels (color, icon, text)
 */
export type PackageStatus = PackageInfo["status"];

/**
 * Type alias for supported package manager types.
 * @accessibility Each type should have recognizable visual indicators and clear labels
 */
export type PackageManagerType = PackageInfo["packageManager"];
