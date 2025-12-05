"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useGitHubToken } from "@/hooks/use-github-token";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GitHubTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GitHubTokenDialog({
  open,
  onOpenChange,
}: GitHubTokenDialogProps) {
  const [inputToken, setInputToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const {
    token: currentToken,
    hasToken,
    isValidating,
    validation,
    rateLimit,
    setToken,
    validateToken,
    clearToken,
  } = useGitHubToken();

  const handleSaveToken = async () => {
    if (!inputToken.trim()) {
      return;
    }

    const isValid = await validateToken(inputToken.trim());
    if (isValid) {
      setToken(inputToken.trim());
      setInputToken("");
      // Close the dialog after successful save
      onOpenChange(false);
    }
  };

  const handleRemoveToken = () => {
    clearToken();
  };

  const formatRateLimit = (limit: any) => {
    if (!limit?.core) return null;

    const resetTime = new Date(limit.core.reset * 1000);
    const now = new Date();
    const minutesUntilReset = Math.ceil(
      (resetTime.getTime() - now.getTime()) / (1000 * 60)
    );

    return {
      remaining: limit.core.remaining,
      limit: limit.core.limit,
      resetIn: minutesUntilReset > 0 ? minutesUntilReset : 0,
    };
  };

  const rateLimitInfo = formatRateLimit(rateLimit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            GitHub Token Configuration
            {hasToken && (
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Configured
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Configure your GitHub Personal Access Token to increase API rate
            limits and access private repositories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Token Status */}
          {currentToken ? (
            <div className="space-y-3">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  GitHub token is configured and active.
                </AlertDescription>
              </Alert>

              {rateLimitInfo && (
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {rateLimitInfo.remaining}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {rateLimitInfo.limit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Limit
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {rateLimitInfo.resetIn}m
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reset In
                    </div>
                  </div>
                </div>
              )}

              <Button variant="outline" onClick={handleRemoveToken}>
                Remove Token
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No GitHub token configured. You're limited to 60 requests per
                  hour.
                </AlertDescription>
              </Alert>

              {/* Token Input */}
              <div className="space-y-2">
                <Label htmlFor="github-token">
                  GitHub Personal Access Token
                </Label>
                <div className="relative">
                  <Input
                    id="github-token"
                    type={showToken ? "text" : "password"}
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Validation Result */}
              {validation && (
                <Alert variant={validation.valid ? "default" : "destructive"}>
                  {validation.valid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {validation.valid
                      ? `Token is valid! Welcome, ${
                          validation.user?.login || "User"
                        }`
                      : validation.error || "Token validation failed"}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSaveToken}
                disabled={!inputToken.trim() || isValidating}
                className="w-full"
              >
                {isValidating ? "Validating..." : "Save Token"}
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium">How to create a GitHub token:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                Go to GitHub Settings → Developer settings → Personal access
                tokens
              </li>
              <li>Click "Generate new token (classic)"</li>
              <li>
                Select scopes:{" "}
                <code className="bg-muted px-1 rounded">public_repo</code> (for
                public repositories)
              </li>
              <li>Copy the generated token and paste it above</li>
            </ol>
            <Button variant="link" size="sm" className="p-0 h-auto" asChild>
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                Create GitHub Token
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
