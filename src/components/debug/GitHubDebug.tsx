'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { githubService } from '@/lib/github-service';
import axios from 'axios';

export function GitHubDebug() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      console.log('Starting connection test...');
      
      const result = await githubService.testConnection();
      
      console.log('Connection test result:', result);
      
      setTestResult(result);
    } catch (error) {
      console.error('Connection test error caught:', error);
      
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorDetails: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRepository = async () => {
    setIsLoading(true);
    try {
      console.log('Starting repository validation test...');
      
      // Test with a known public repository
      const isValid = await githubService.validateRepository('octocat', 'Hello-World');
      
      console.log('Repository validation result:', isValid);
      
      setTestResult({
        success: isValid,
        message: isValid ? 'Repository validation successful' : 'Repository not found',
        type: 'repository'
      });
    } catch (error: any) {
      console.error('Repository validation error caught:', error);
      
      setTestResult({
        success: false,
        error: error.message || 'Repository validation failed',
        errorDetails: {
          name: error.name,
          message: error.message,
          status: error.status,
          originalError: error.originalError,
          stack: error.stack
        },
        type: 'repository'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectHTTP = async () => {
    setIsLoading(true);
    try {
      console.log('Testing direct HTTP request to GitHub...');
      
      const response = await axios.get('https://api.github.com/zen', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Pack-Man-Test'
        }
      });
      
      console.log('Direct HTTP test successful:', response.data);
      
      setTestResult({
        success: true,
        message: 'Direct HTTP request successful',
        data: response.data,
        status: response.status,
        type: 'direct-http'
      });
    } catch (error: any) {
      console.error('Direct HTTP test failed:', error);
      
      setTestResult({
        success: false,
        error: error.message || 'Direct HTTP request failed',
        errorDetails: {
          name: error.name,
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        },
        type: 'direct-http'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>GitHub API Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={testDirectHTTP} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : 'Direct HTTP'}
          </Button>
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            onClick={testRepository} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : 'Test Repository'}
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">
              {testResult.success ? '✅ Success' : '❌ Failed'}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}