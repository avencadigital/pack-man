/**
 * In-memory cache service for package information.
 * Reduces redundant API calls and improves performance.
 */

import { PackageVersionInfo } from "./package-services";

interface CacheEntry {
  data: PackageVersionInfo;
  timestamp: number;
  expiresAt: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheEntry> = new Map();
  
  // Cache configuration
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes for success
  private readonly ERROR_TTL = 2 * 60 * 1000; // 2 minutes for errors
  private readonly MAX_CACHE_SIZE = 500; // Maximum cache entries
  private readonly CLEANUP_INTERVAL = 60 * 1000; // Clean every minute
  
  private cleanupTimer?: NodeJS.Timeout;

  private constructor() {
    this.startCleanupTimer();
  }

  /**
   * Get singleton instance of CacheService.
   */
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Generate cache key from package name and manager.
   */
  private generateKey(packageName: string, packageManager: string): string {
    return `${packageManager}:${packageName.toLowerCase()}`;
  }

  /**
   * Get cached package info if available and not expired.
   */
  get(packageName: string, packageManager: string): PackageVersionInfo | null {
    const key = this.generateKey(packageName, packageManager);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache entry with appropriate TTL based on success/error.
   */
  set(
    packageName: string,
    packageManager: string,
    data: PackageVersionInfo
  ): void {
    const key = this.generateKey(packageName, packageManager);
    const now = Date.now();
    
    // Use shorter TTL for errors
    const ttl = data.error ? this.ERROR_TTL : this.DEFAULT_TTL;
    
    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    this.cache.set(key, entry);

    // Enforce cache size limit
    this.enforceSizeLimit();
  }

  /**
   * Clear specific entry from cache.
   */
  delete(packageName: string, packageManager: string): boolean {
    const key = this.generateKey(packageName, packageManager);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics.
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let errorEntries = 0;
    let successEntries = 0;

    for (const [, entry] of this.cache) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
        if (entry.data.error) {
          errorEntries++;
        } else {
          successEntries++;
        }
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      errorEntries,
      successEntries,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }

  /**
   * Remove expired entries from cache.
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0 && process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Cleaned up ${removed} expired entries`);
    }
  }

  /**
   * Enforce maximum cache size by removing oldest entries.
   */
  private enforceSizeLimit(): void {
    if (this.cache.size <= this.MAX_CACHE_SIZE) {
      return;
    }

    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = this.cache.size - this.MAX_CACHE_SIZE;
    
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Removed ${toRemove} oldest entries to maintain size limit`);
    }
  }

  /**
   * Start periodic cleanup timer.
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);

    // Ensure timer doesn't prevent Node from exiting
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stop cleanup timer (useful for testing or shutdown).
   */
  stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Destroy cache instance (useful for testing).
   */
  static destroyInstance(): void {
    if (CacheService.instance) {
      CacheService.instance.stopCleanupTimer();
      CacheService.instance.clear();
      CacheService.instance = null as any;
    }
  }
}
