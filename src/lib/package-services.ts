// Services for native package manager APIs
import pLimit from "p-limit";
import { CacheService } from "./cache-service";
import { retryWithBackoff, RetryPresets, isRetryableError } from "./retry-util";

/** Default timeout for HTTP requests in milliseconds */
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/** Maximum concurrent requests to avoid rate limiting from APIs */
const MAX_CONCURRENT_REQUESTS = 10;

/** Singleton cache instance */
const cache = CacheService.getInstance();

export interface PackageVersionInfo {
  name: string;
  latestVersion: string;
  description?: string;
  homepage?: string;
  error?: string;
}

/**
 * Fetch with timeout support using AbortController.
 * Prevents requests from hanging indefinitely.
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @returns Promise<Response>
 * @throws Error if request times out or fails
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// NPM API Service
export class NPMService {
  private static readonly BASE_URL = 'https://registry.npmjs.org';

  static async getPackageInfo(packageName: string): Promise<PackageVersionInfo> {
    // Check cache first
    const cached = cache.get(packageName, 'npm');
    if (cached) {
      return cached;
    }

    try {
      // Fetch with retry logic
      const response = await retryWithBackoff(
        () => fetchWithTimeout(`${this.BASE_URL}/${packageName}`, {
          headers: {
            'Accept': 'application/json',
          },
        }),
        {
          ...RetryPresets.standard,
          onRetry: (error, attempt, delay) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[NPM] Retry ${attempt} for ${packageName} after ${delay}ms`);
            }
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            name: packageName,
            latestVersion: 'unknown',
            error: 'Package not found'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const result = {
        name: packageName,
        latestVersion: data['dist-tags']?.latest || 'unknown',
        description: data.description,
        homepage: data.homepage || data.repository?.url
      };

      // Cache successful result
      cache.set(packageName, 'npm', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? (error.name === 'AbortError' ? 'Request timeout' : error.message)
        : 'Unknown error';
      
      const result = {
        name: packageName,
        latestVersion: 'unknown',
        error: errorMessage
      };

      // Cache error result (with shorter TTL)
      cache.set(packageName, 'npm', result);
      return result;
    }
  }
}

// PyPI API Service
export class PyPIService {
  private static readonly BASE_URL = 'https://pypi.org/pypi';

  static async getPackageInfo(packageName: string): Promise<PackageVersionInfo> {
    // Check cache first
    const cached = cache.get(packageName, 'pip');
    if (cached) {
      return cached;
    }

    try {
      // Fetch with retry logic
      const response = await retryWithBackoff(
        () => fetchWithTimeout(`${this.BASE_URL}/${packageName}/json`, {
          headers: {
            'Accept': 'application/json',
          },
        }),
        {
          ...RetryPresets.standard,
          onRetry: (error, attempt, delay) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[PyPI] Retry ${attempt} for ${packageName} after ${delay}ms`);
            }
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            name: packageName,
            latestVersion: 'unknown',
            error: 'Package not found'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const info = data.info;

      const result = {
        name: packageName,
        latestVersion: info.version || 'unknown',
        description: info.summary,
        homepage: info.home_page || info.project_urls?.Homepage
      };

      // Cache successful result
      cache.set(packageName, 'pip', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? (error.name === 'AbortError' ? 'Request timeout' : error.message)
        : 'Unknown error';
      
      const result = {
        name: packageName,
        latestVersion: 'unknown',
        error: errorMessage
      };

      // Cache error result (with shorter TTL)
      cache.set(packageName, 'pip', result);
      return result;
    }
  }
}

// Pub.dev API Service
export class PubDevService {
  private static readonly BASE_URL = 'https://pub.dev/api';

  static async getPackageInfo(packageName: string): Promise<PackageVersionInfo> {
    // Check cache first
    const cached = cache.get(packageName, 'pub');
    if (cached) {
      return cached;
    }

    try {
      // Fetch with retry logic
      const response = await retryWithBackoff(
        () => fetchWithTimeout(`${this.BASE_URL}/packages/${packageName}`, {
          headers: {
            'Accept': 'application/json',
          },
        }),
        {
          ...RetryPresets.standard,
          onRetry: (error, attempt, delay) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[PubDev] Retry ${attempt} for ${packageName} after ${delay}ms`);
            }
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            name: packageName,
            latestVersion: 'unknown',
            error: 'Package not found'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const result = {
        name: packageName,
        latestVersion: data.latest?.version || 'unknown',
        description: data.latest?.pubspec?.description,
        homepage: data.latest?.pubspec?.homepage || data.latest?.pubspec?.repository
      };

      // Cache successful result
      cache.set(packageName, 'pub', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? (error.name === 'AbortError' ? 'Request timeout' : error.message)
        : 'Unknown error';
      
      const result = {
        name: packageName,
        latestVersion: 'unknown',
        error: errorMessage
      };

      // Cache error result (with shorter TTL)
      cache.set(packageName, 'pub', result);
      return result;
    }
  }
}

// Package Manager Factory
export class PackageManagerService {
  /** Rate limiter to control concurrent requests */
  private static readonly limit = pLimit(MAX_CONCURRENT_REQUESTS);

  static async getPackageInfo(
    packageName: string,
    packageManager: "npm" | "pip" | "pub"
  ): Promise<PackageVersionInfo> {
    switch (packageManager) {
      case "npm":
        return NPMService.getPackageInfo(packageName);
      case "pip":
        return PyPIService.getPackageInfo(packageName);
      case "pub":
        return PubDevService.getPackageInfo(packageName);
      default:
        return {
          name: packageName,
          latestVersion: 'unknown',
          error: 'Unsupported package manager'
        };
    }
  }

  /**
   * Fetch information for multiple packages with rate limiting.
   * Limits concurrent requests to MAX_CONCURRENT_REQUESTS to avoid rate limiting.
   * 
   * @param packages - Array of packages to check
   * @returns Promise resolving to array of package version info
   */
  static async getMultiplePackagesInfo(
    packages: Array<{ name: string; manager: "npm" | "pip" | "pub" }>
  ): Promise<PackageVersionInfo[]> {
    // Use rate limiter to control concurrency
    const promises = packages.map(pkg =>
      this.limit(() => this.getPackageInfo(pkg.name, pkg.manager))
    );

    return Promise.all(promises);
  }
}
