import { NextRequest } from "next/server";
import { PackageManagerService } from "@/lib/package-services";
import { detectFileType, getAllDependencies } from "@/lib/parsers";
import { compareVersions } from "@/lib/version-utils";
import { createCorsResponse } from "@/lib/cors-utils";
import {
  PACKAGE_STATUS,
  type PackageInfo
} from "@/types/package-analysis";

// Input validation constants
const MAX_CONTENT_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILENAME_LENGTH = 255;
const ALLOWED_EXTENSIONS = [".json", ".txt", ".yaml", ".yml"];

/**
 * Sanitizes filename by removing path traversal characters.
 * @param fileName - The filename to sanitize
 * @returns Sanitized filename
 */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[\/\\]/g, "").trim();
}

/**
 * Validates if the filename has an allowed extension.
 * @param fileName - The filename to validate
 * @returns True if extension is allowed
 */
function hasValidExtension(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some(ext => lowerFileName.endsWith(ext));
}

export async function OPTIONS() {
  return createCorsResponse(null, { status: 200 });
}

export async function GET() {
  return createCorsResponse({
    name: "PackMan - Package Analyzer API",
    version: "0.1.1",
    status: "operational",
    description: "Analyze package dependencies and check for outdated packages across multiple package managers.",
    documentation: "https://docs.pack-man.tech/",
    endpoints: {
      "POST /api/analyze-packages": {
        description: "Analyze package file content for outdated dependencies",
        contentType: "application/json",
        body: {
          content: "string (required) - Package file content (package.json, requirements.txt, etc.)",
          fileName: "string (optional) - Original filename to help detect package manager"
        },
        supportedFormats: [
          "package.json (npm/yarn/pnpm)",
          "requirements.txt (pip)",
          "pubspec.yaml (Dart/Flutter)"
        ]
      }
    },
    links: {
      website: "https://pack-man.tech",
      github: "https://github.com/avencadigital/pack-man",
      chromeExtension: "COMING SOON"
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate Content-Length before parsing body
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_SIZE) {
      return createCorsResponse(
        { error: "Payload too large (max 5MB)" },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { content, fileName } = body;

    // Validate content is provided and is a string
    if (!content || typeof content !== "string") {
      return createCorsResponse(
        { error: "Valid content is required" },
        { status: 400 }
      );
    }

    // Validate content size
    if (content.length > MAX_CONTENT_SIZE) {
      return createCorsResponse(
        { error: "Content too large (max 5MB)" },
        { status: 413 }
      );
    }

    // Validate fileName if provided
    let sanitizedFileName: string | undefined;
    if (fileName) {
      if (typeof fileName !== "string" || fileName.length > MAX_FILENAME_LENGTH) {
        return createCorsResponse(
          { error: "Invalid filename" },
          { status: 400 }
        );
      }

      sanitizedFileName = sanitizeFileName(fileName);

      // Validate file extension
      if (sanitizedFileName && !hasValidExtension(sanitizedFileName)) {
        return createCorsResponse(
          { error: "Invalid file type. Allowed: .json, .txt, .yaml, .yml" },
          { status: 400 }
        );
      }
    }

    // Parse the content based on file type (use sanitized filename)
    let packageData: ReturnType<typeof detectFileType>;
    try {
      packageData = detectFileType(content, sanitizedFileName);
    } catch (error) {
      return createCorsResponse(
        { error: "Failed to parse file content" },
        { status: 400 }
      );
    }

    // Get all dependencies (including dev dependencies)
    const allDependencies = getAllDependencies(packageData);
    const packageNames = Object.keys(allDependencies);

    if (packageNames.length === 0) {
      return createCorsResponse({
        packages: [],
        summary: {
          total: 0,
          upToDate: 0,
          outdated: 0,
          errors: 0
        }
      });
    }

    // Prepare packages for batch processing
    const packagesToCheck = packageNames.map(name => ({
      name,
      manager: packageData.packageManager
    }));

    // Get package information from native APIs
    const packageInfos = await PackageManagerService.getMultiplePackagesInfo(packagesToCheck);

    // Process results - preserve error information from failed fetches
    const packages: PackageInfo[] = packageInfos.map((info, index) => {
      const packageName = packageNames[index];
      const currentVersion = allDependencies[packageName];

      // If there was an error fetching package info, mark as ERROR and preserve message
      if (info.error) {
        return {
          name: packageName,
          currentVersion,
          latestVersion: info.latestVersion,
          status: PACKAGE_STATUS.ERROR,
          packageManager: packageData.packageManager,
          error: info.error,
        };
      }

      const status = compareVersions(currentVersion, info.latestVersion);

      return {
        name: packageName,
        currentVersion,
        latestVersion: info.latestVersion,
        status,
        packageManager: packageData.packageManager,
        description: info.description,
        homepage: info.homepage,
      };
    });

    const summary = {
      total: packages.length,
      upToDate: packages.filter(p => p.status === PACKAGE_STATUS.UP_TO_DATE).length,
      outdated: packages.filter(p => p.status === PACKAGE_STATUS.OUTDATED).length,
      errors: packages.filter(p => p.status === PACKAGE_STATUS.ERROR).length
    };

    return createCorsResponse({
      packages,
      summary
    });

  } catch (error) {
    // Log error in development only to avoid exposing sensitive info
    if (process.env.NODE_ENV === "development") {
      console.error("Error in analyze-packages API:", error);
    }

    // Return generic error message to client
    const errorMessage = process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "Internal server error";

    return createCorsResponse(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
