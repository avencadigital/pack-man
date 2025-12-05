import * as semver from "semver";
import { cleanVersion } from "@/lib/formatters";

export type ChangeType = "major" | "minor" | "patch" | "none" | "error";

/**
 * Determines the type of change between two versions
 * @param currentVersion - Current version string
 * @param latestVersion - Latest version string
 * @returns Type of change (major, minor, patch, none, or error)
 * 
 * @example
 * getChangeType("1.0.0", "2.0.0") // "major"
 * getChangeType("1.0.0", "1.1.0") // "minor"
 * getChangeType("1.0.0", "1.0.1") // "patch"
 * getChangeType("1.0.0", "1.0.0") // "none"
 */
export function getChangeType(
  currentVersion: string, 
  latestVersion: string
): ChangeType {
  try {
    const current = semver.coerce(cleanVersion(currentVersion));
    const latest = semver.coerce(cleanVersion(latestVersion));

    if (!current || !latest) return "error";

    const diff = semver.diff(current, latest);

    // If no difference, no need to update
    if (!diff) return "none";

    // Normalize pre-release changes to their base type
    switch (diff) {
      case "major":
      case "premajor":
        return "major";
      case "minor":
      case "preminor":
        return "minor";
      case "patch":
      case "prepatch":
      case "prerelease":
        return "patch";
      default:
        return "none";
    }
  } catch (e) {
    console.error(`Error comparing versions: ${currentVersion} vs ${latestVersion}`, e);
    return "error";
  }
}

/**
 * Checks if a version should be updated based on change type and options
 * @param currentVersion - Current version
 * @param latestVersion - Latest version
 * @param options - Update options
 * @returns Whether the version should be updated
 */
export function shouldUpdateVersion(
  currentVersion: string,
  latestVersion: string,
  options: {
    updateMajor: boolean;
    updateMinor: boolean;
    updatePatch: boolean;
  }
): boolean {
  const changeType = getChangeType(currentVersion, latestVersion);
  
  if (changeType === "error" || changeType === "none") return false;
  
  const updateMap = {
    major: options.updateMajor,
    minor: options.updateMinor,
    patch: options.updatePatch,
  };
  
  return updateMap[changeType] || false;
}
