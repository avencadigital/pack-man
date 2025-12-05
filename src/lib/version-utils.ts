import * as semver from "semver";
import { cleanVersion } from "@/lib/formatters/index";
import { PACKAGE_STATUS, type PackageStatus } from "@/types/package-analysis";

/**
 * Compares two version strings using semver and determines if the current version
 * is up-to-date, outdated, or has an error.
 * 
 * Uses semver.coerce() to handle malformed versions and pre-releases correctly.
 * 
 * @param current - The current version string (may include prefixes like ^, ~)
 * @param latest - The latest available version string
 * @returns The comparison status: UP_TO_DATE, OUTDATED, or ERROR
 */
export function compareVersions(current: string, latest: string): PackageStatus {
  // Handle unknown versions
  if (latest === "unknown" || current === "unknown") {
    return PACKAGE_STATUS.ERROR;
  }

  // Handle "latest" tag
  if (latest === "latest" || current === "latest") {
    return PACKAGE_STATUS.UP_TO_DATE;
  }

  try {
    const cleanCurrent = cleanVersion(current);
    const cleanLatest = cleanVersion(latest);

    // Handle special wildcards
    if (cleanCurrent === "any" || cleanCurrent === "*" || cleanCurrent === "x") {
      return PACKAGE_STATUS.UP_TO_DATE;
    }

    // Quick equality check before parsing
    if (cleanCurrent === cleanLatest) {
      return PACKAGE_STATUS.UP_TO_DATE;
    }

    // Use semver.coerce to handle malformed versions (e.g., "1.0" -> "1.0.0")
    const currentSemver = semver.coerce(cleanCurrent);
    const latestSemver = semver.coerce(cleanLatest);

    // If coercion fails, versions are invalid
    if (!currentSemver || !latestSemver) {
      return PACKAGE_STATUS.ERROR;
    }

    // Compare using semver - handles pre-releases correctly
    if (semver.lt(currentSemver, latestSemver)) {
      return PACKAGE_STATUS.OUTDATED;
    }

    return PACKAGE_STATUS.UP_TO_DATE;
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error comparing versions:", { current, latest, error });
    }
    return PACKAGE_STATUS.ERROR;
  }
}
