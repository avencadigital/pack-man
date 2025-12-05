'use client';

import { useState, useEffect } from 'react';
import { githubService } from '@/lib/github-service';

interface TokenValidation {
  valid: boolean;
  user?: any;
  rateLimit?: any;
  error?: string;
}

interface UseGitHubTokenReturn {
  token: string | null;
  hasToken: boolean;
  isValidating: boolean;
  validation: TokenValidation | null;
  rateLimit: any;
  setToken: (token: string | null) => void;
  validateToken: (token?: string) => Promise<boolean>;
  clearToken: () => void;
  refreshRateLimit: () => Promise<void>;
}

export function useGitHubToken(): UseGitHubTokenReturn {
  const [token, setTokenState] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<TokenValidation | null>(null);
  const [rateLimit, setRateLimit] = useState<any>(null);

  const refreshRateLimit = async () => {
    try {
      console.log('Refreshing rate limit...');
      const limit = await githubService.getRateLimit();
      setRateLimit(limit);
      console.log('Rate limit updated:', limit);
    } catch (error) {
      console.error('Error refreshing rate limit:', error);
      setRateLimit(null);
    }
  };

  useEffect(() => {
    // Load token on mount
    const existingToken = githubService.getToken();
    setTokenState(existingToken);
    
    // Always fetch rate limit (will return default for unauthenticated)
    refreshRateLimit();
  }, []);

  const setToken = (newToken: string | null) => {
    githubService.setToken(newToken);
    setTokenState(newToken);
    
    // Always refresh rate limit (will show appropriate limits based on token presence)
    refreshRateLimit();
    
    if (!newToken) {
      setValidation(null);
    }
  };

  const validateToken = async (tokenToValidate?: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const result = await githubService.validateToken(tokenToValidate);
      setValidation(result);
      
      if (result.valid && result.rateLimit) {
        setRateLimit(result.rateLimit);
      }
      
      return result.valid;
    } catch (error) {
      setValidation({ valid: false, error: 'Validation failed' });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const clearToken = () => {
    githubService.clearToken();
    setTokenState(null);
    setValidation(null);
    setRateLimit(null);
  };



  return {
    token,
    hasToken: !!token,
    isValidating,
    validation,
    rateLimit,
    setToken,
    validateToken,
    clearToken,
    refreshRateLimit
  };
}