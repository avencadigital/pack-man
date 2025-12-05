import { PackageInfo } from "@/types/package";
import * as semver from "semver";

export function getPackageUrl(pkg: PackageInfo): string {
  switch (pkg.packageManager) {
    case "npm":
      return `https://www.npmjs.com/package/${pkg.name}`;
    case "pip":
      return `https://pypi.org/project/${pkg.name}/`;
    case "pub":
      return `https://pub.dev/packages/${pkg.name}`;
    default:
      return pkg.homepage || "#";
  }
}

export function getStatusColor(status: PackageInfo["status"]): string {
  switch (status) {
    case "up-to-date":
      return "bg-green-100 text-green-800 border-green-200";
    case "outdated":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "error":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function cleanVersion(version: string): string {
  return version
    .replace(/[\^~>=<]/g, "")
    .replace(/v/gi, "")
    .trim();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Helper function to get normalized change type between versions
export function getChangeType(currentVersion: string, latestVersion: string): "major" | "minor" | "patch" | "none" | "error" {
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

export function generateUpdatedPackageFile(
  originalContent: string,
  packages: PackageInfo[],
  options: { updateMajor: boolean; updateMinor: boolean; updatePatch: boolean },
  fileName: string
): string {
  console.log("[generateUpdatedPackageFile] Called with:", {
    packagesCount: packages.length,
    options,
    fileName,
    contentLength: originalContent.length
  });
  
  // Use content-based detection to correctly identify file type
  const detected = detectFileType(originalContent, fileName);
  const fileType = detected.kind;
  
  console.log("[generateUpdatedPackageFile] File detection:", {
    detectedKind: fileType,
    originalFileName: fileName
  });

  // Helper function to extract version prefix
  const getVersionPrefix = (versionString: string): string => {
    const match = versionString.match(/^([\^~>=<]+)/);
    return match ? match[1] : "";
  };

  // Helper function to determine if should update based on change type
  const shouldUpdate = (pkg: PackageInfo): boolean => {
    const changeType = getChangeType(pkg.currentVersion, pkg.latestVersion);
    
    if (changeType === "error" || changeType === "none") return false;
    
    // Check if should update based on options using mapping table
    const allow = {
      major: options.updateMajor,
      minor: options.updateMinor,
      patch: options.updatePatch,
    };
    
    return allow[changeType] || false;
  };

  // Filter packages that should be updated
  const packagesToUpdate = packages.filter((pkg) => {
    if (!pkg.latestVersion || pkg.status !== "outdated") {
      console.log(`[generateUpdatedPackageFile] Skipping ${pkg.name}: status=${pkg.status}, hasLatest=${!!pkg.latestVersion}`);
      return false;
    }
    const willUpdate = shouldUpdate(pkg);
    console.log(`[generateUpdatedPackageFile] Package ${pkg.name}: willUpdate=${willUpdate}, changeType=${getChangeType(pkg.currentVersion, pkg.latestVersion)}`);
    return willUpdate;
  });

  console.log(`Packages to update: ${packagesToUpdate.length}`, packagesToUpdate.map(p => `${p.name}: ${p.currentVersion} -> ${p.latestVersion}`));
  console.log(`Detected file type: ${fileType}`);

  if (fileType === "package.json") {
    try {
      const content = JSON.parse(originalContent);
      const EOL = originalContent.includes("\r\n") ? "\r\n" : "\n";

      packagesToUpdate.forEach((pkg) => {
        const prefix = getVersionPrefix(pkg.currentVersion);
        const newVersion = prefix + pkg.latestVersion;

        if (content.dependencies && content.dependencies[pkg.name]) {
          content.dependencies[pkg.name] = newVersion;
          console.log(`Updated dependency ${pkg.name}: ${pkg.currentVersion} -> ${newVersion}`);
        }
        if (content.devDependencies && content.devDependencies[pkg.name]) {
          content.devDependencies[pkg.name] = newVersion;
          console.log(`Updated devDependency ${pkg.name}: ${pkg.currentVersion} -> ${newVersion}`);
        }
      });

      return JSON.stringify(content, null, 2).replace(/\n/g, EOL) + EOL;
    } catch (e) {
      console.error("Error parsing package.json:", e);
      return originalContent;
    }
  } else if (fileType === "requirements.txt") {
    let newContent = originalContent;
    packagesToUpdate.forEach((pkg) => {
      // More robust regex to capture different version formats
      const regex = new RegExp(`^(${pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(==|>=|<=|>|<|~=|!=)?(.*)$`, "gm");
      newContent = newContent.replace(regex, (match, name, operator, rest) => {
        const newLine = `${name}==${pkg.latestVersion}`;
        console.log(`Updated requirement ${pkg.name}: ${match.trim()} -> ${newLine}`);
        return newLine;
      });
    });
    return newContent;
  } else if (fileType === "pubspec.yaml") {
    let newContent = originalContent;
    packagesToUpdate.forEach((pkg) => {
      // More precise regex for YAML
      const regex = new RegExp(`^(\\s+${pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*)(.*)$`, "gm");
      newContent = newContent.replace(regex, (match, prefix, version) => {
        // Preserve original prefix (^, etc.) if exists, otherwise use ^
        const originalPrefix = version.match(/^[\^~]/)?.[0] || "^";
        const newLine = `${prefix}${originalPrefix}${pkg.latestVersion}`;
        console.log(`Updated pubspec dependency ${pkg.name}: ${match.trim()} -> ${newLine.trim()}`);
        return newLine;
      });
    });
    return newContent;
  }

  return originalContent;
}

// File type detection types
export type FileKind = "package.json" | "requirements.txt" | "pubspec.yaml";

export interface DetectedFileType {
  kind: FileKind;
  dependencies: Record<string, string>;
  packageManager: "npm" | "pip" | "pub";
}

// Parse package.json content
function parsePackageJson(content: string): DetectedFileType {
  try {
    const parsed = JSON.parse(content);
    const dependencies = parsed.dependencies || {};
    const devDependencies = parsed.devDependencies || {};

    return {
      kind: "package.json",
      dependencies: { ...dependencies, ...devDependencies },
      packageManager: "npm"
    };
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}

/**
 * Parse requirements.txt content with enhanced support for:
 * - Comments (inline and full-line)
 * - Environment markers
 * - URL-based dependencies (ignored)
 * - Editable installs (ignored)
 * - Requirements file references (ignored)
 * - Hashes (stripped)
 */
function parseRequirementsTxt(content: string): DetectedFileType {
  const dependencies: Record<string, string> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    let trimmed = line.trim();
    
    // Skip empty lines and full-line comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Skip references to other requirements files
    if (trimmed.startsWith('-r ') || trimmed.startsWith('--requirement')) {
      continue;
    }

    // Skip editable installs
    if (trimmed.startsWith('-e ') || trimmed.startsWith('--editable')) {
      continue;
    }

    // Skip URL-based dependencies (git+, http://, https://, file://)
    if (/^(git\+|hg\+|svn\+|bzr\+|https?:\/\/|file:\/\/)/.test(trimmed)) {
      continue;
    }

    // Remove inline comments
    const commentIndex = trimmed.indexOf('#');
    if (commentIndex > 0) {
      // Only remove comment if it's not part of a URL
      if (!trimmed.substring(0, commentIndex).includes('://')) {
        trimmed = trimmed.substring(0, commentIndex).trim();
      }
    }

    // Remove hashes (--hash=...)
    trimmed = trimmed.replace(/\s+--hash=[^\s]+/g, '');

    // Parse environment markers and extract base requirement
    // Example: package==1.0; python_version >= '3.8'
    const markerIndex = trimmed.indexOf(';');
    if (markerIndex > 0) {
      trimmed = trimmed.substring(0, markerIndex).trim();
    }

    if (!trimmed) continue;

    let name = trimmed;
    let version = "latest";

    // Handle different version specifiers in order of specificity
    // Regex to match version specifiers: ==, >=, <=, ~=, !=, >, <
    const versionMatch = trimmed.match(/^([a-zA-Z0-9._-]+)(\[.+\])?(==|>=|<=|~=|!=|>|<)(.+)$/);
    
    if (versionMatch) {
      name = versionMatch[1].trim();
      // versionMatch[2] is extras like [dev]
      const operator = versionMatch[3];
      version = versionMatch[4].trim();
      
      // For ranges like >=1.0,<2.0, take the first version
      if (version.includes(',')) {
        version = version.split(',')[0].trim();
      }
    } else {
      // No version specifier - just package name (possibly with extras)
      const extrasMatch = trimmed.match(/^([a-zA-Z0-9._-]+)(\[.+\])?$/);
      if (extrasMatch) {
        name = extrasMatch[1].trim();
      }
    }

    if (name) {
      dependencies[name] = version;
    }
  }

  return {
    kind: "requirements.txt",
    dependencies,
    packageManager: "pip"
  };
}

// Parse pubspec.yaml content
function parsePubspecYaml(content: string): DetectedFileType {
  const dependencies: Record<string, string> = {};
  const lines = content.split('\n');
  let inDependencies = false;
  let inDevDependencies = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === 'dependencies:') {
      inDependencies = true;
      inDevDependencies = false;
      continue;
    } else if (trimmed === 'dev_dependencies:') {
      inDependencies = false;
      inDevDependencies = true;
      continue;
    } else if (trimmed && !line.startsWith(' ') && trimmed.endsWith(':')) {
      // Only exit dependencies section if the line doesn't start with whitespace in the original
      inDependencies = false;
      inDevDependencies = false;
      continue;
    }

    if ((inDependencies || inDevDependencies) && trimmed && line.startsWith('  ')) {
      // Only process lines that start with exactly 2 spaces (direct dependencies)
      const match = trimmed.match(/^([^:]+):\s*(.+)?$/);
      if (match) {
        const name = match[1].trim();
        const version = match[2] ? match[2].trim() : "any";

        // Skip nested properties like "sdk: flutter"
        if (name && version !== 'flutter' && !version.startsWith('sdk:')) {
          dependencies[name] = version;
        }
      }
    }
  }

  return {
    kind: "pubspec.yaml",
    dependencies,
    packageManager: "pub"
  };
}

// Detect file type from content and filename
export function detectFileType(content: string, fileName?: string): DetectedFileType {
  const lowerFileName = fileName?.toLowerCase() || "";

  // First check filename-based detection if provided
  if (fileName && fileName !== "unknown") {
    if (lowerFileName.includes('package.json')) {
      return parsePackageJson(content);
    } else if (lowerFileName.includes('requirements.txt') || lowerFileName.endsWith('.txt')) {
      return parseRequirementsTxt(content);
    } else if (lowerFileName.includes('pubspec.yaml') || lowerFileName.includes('pubspec.yml') || 
               lowerFileName.endsWith('.yaml') || lowerFileName.endsWith('.yml')) {
      return parsePubspecYaml(content);
    }
  }

  // Content-based detection
  const trimmedContent = content.trim();

  // Check for JSON format
  if (trimmedContent.startsWith('{')) {
    try {
      return parsePackageJson(content);
    } catch {
      // Not valid JSON, continue to other checks
    }
  }

  // Check for YAML format (common YAML indicators)
  if (trimmedContent.includes('dependencies:') ||
    trimmedContent.includes('dev_dependencies:') ||
    (trimmedContent.includes('name:') && trimmedContent.includes('version:'))) {
    return parsePubspecYaml(content);
  }

  // Default to requirements.txt for simple line-based format
  return parseRequirementsTxt(content);
}

// Get file extension from file kind
export function getExtensionFromKind(kind: FileKind): string {
  switch (kind) {
    case "package.json":
      return ".json";
    case "requirements.txt":
      return ".txt";
    case "pubspec.yaml":
      return ".yaml";
    default:
      return ".txt";
  }
}

// Get MIME type from file kind
export function getMimeFromKind(kind: FileKind): string {
  switch (kind) {
    case "package.json":
      return "application/json";
    case "pubspec.yaml":
      return "application/x-yaml";
    case "requirements.txt":
    default:
      return "text/plain";
  }
}

// Helper function to get the correct file extension based on file type
export function getFileExtension(fileName: string): string {
  const detected = detectFileType("", fileName);
  return getExtensionFromKind(detected.kind);
}

// Helper function to get the correct MIME type based on file type
export function getFileMimeType(fileName: string): string {
  const detected = detectFileType("", fileName);
  return getMimeFromKind(detected.kind);
}
