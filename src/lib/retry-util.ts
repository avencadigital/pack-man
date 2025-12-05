/**
 * Retry utility with exponential backoff for handling transient failures.
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 10000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  backoffFactor?: number;
  /** Whether to add random jitter to delays (default: true) */
  useJitter?: boolean;
  /** Function to determine if error is retryable (default: retry all errors) */
  shouldRetry?: (error: any, attempt: number) => boolean;
  /** Callback for retry attempts */
  onRetry?: (error: any, attempt: number, delay: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  useJitter: true,
  shouldRetry: () => true,
  onRetry: () => {},
};

/**
 * Calculate delay with exponential backoff and optional jitter.
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  backoffFactor: number,
  maxDelay: number,
  useJitter: boolean
): number {
  // Exponential backoff: delay = initialDelay * (backoffFactor ^ attempt)
  let delay = initialDelay * Math.pow(backoffFactor, attempt - 1);
  
  // Cap at maximum delay
  delay = Math.min(delay, maxDelay);
  
  // Add jitter to prevent thundering herd
  if (useJitter) {
    // Random jitter between 0% and 25% of delay
    const jitter = Math.random() * delay * 0.25;
    delay += jitter;
  }
  
  return Math.floor(delay);
}

/**
 * Sleep for specified milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is a network/transient error that should be retried.
 */
export function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  // Network errors
  if (error.name === 'AbortError') return false; // Don't retry timeouts
  if (error.name === 'TypeError' && error.message.includes('fetch')) return true;
  
  // HTTP status codes that are retryable
  if (error.status) {
    const retryableStatuses = [
      408, // Request Timeout
      429, // Too Many Requests
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ];
    return retryableStatuses.includes(error.status);
  }
  
  // Check response object
  if (error.response?.status) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.response.status);
  }
  
  return false;
}

/**
 * Execute an async function with retry logic and exponential backoff.
 * 
 * @param fn - Async function to execute
 * @param options - Retry configuration options
 * @returns Promise resolving to the function result
 * @throws The last error if all retries fail
 * 
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   async () => fetch('https://api.example.com/data'),
 *   {
 *     maxAttempts: 3,
 *     initialDelay: 1000,
 *     shouldRetry: isRetryableError,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Retry ${attempt} after ${delay}ms:`, error.message);
 *     }
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      const isLastAttempt = attempt === opts.maxAttempts;
      const shouldRetry = opts.shouldRetry(error, attempt);
      
      if (isLastAttempt || !shouldRetry) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = calculateDelay(
        attempt,
        opts.initialDelay,
        opts.backoffFactor,
        opts.maxDelay,
        opts.useJitter
      );
      
      // Call retry callback
      opts.onRetry(error, attempt, delay);
      
      // Wait before retrying
      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError;
}

/**
 * Wrap a function to automatically retry on failure.
 * Useful for creating retryable versions of functions.
 * 
 * @param fn - Function to wrap
 * @param options - Retry configuration
 * @returns Wrapped function with retry logic
 * 
 * @example
 * ```typescript
 * const retryableFetch = withRetry(
 *   (url: string) => fetch(url),
 *   { maxAttempts: 3, shouldRetry: isRetryableError }
 * );
 * 
 * const response = await retryableFetch('https://api.example.com/data');
 * ```
 */
export function withRetry<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    return retryWithBackoff(() => fn(...args), options);
  };
}

/**
 * Retry configuration presets for common scenarios.
 */
export const RetryPresets = {
  /** Conservative retry: 2 attempts, 1s initial delay */
  conservative: {
    maxAttempts: 2,
    initialDelay: 1000,
    maxDelay: 5000,
    shouldRetry: isRetryableError,
  } as RetryOptions,
  
  /** Standard retry: 3 attempts, 1s initial delay */
  standard: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    shouldRetry: isRetryableError,
  } as RetryOptions,
  
  /** Aggressive retry: 5 attempts, 500ms initial delay */
  aggressive: {
    maxAttempts: 5,
    initialDelay: 500,
    maxDelay: 15000,
    shouldRetry: isRetryableError,
  } as RetryOptions,
  
  /** Network-focused: only retry network errors */
  networkOnly: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (error: any) => {
      return error.name === 'TypeError' && error.message.includes('fetch');
    },
  } as RetryOptions,
};
