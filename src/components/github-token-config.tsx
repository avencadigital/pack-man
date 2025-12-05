"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings } from "lucide-react";
import { useGitHubToken } from "@/hooks/use-github-token";
import { GitHubTokenDialog } from "./github-token-dialog";

export function GitHubTokenConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { hasToken } = useGitHubToken();

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            GitHub Token Configuration
            {hasToken && (
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Configured
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Configure your GitHub Personal Access Token to increase API rate
            limits and access private repositories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {hasToken
                ? "Your GitHub token is configured and active."
                : "No GitHub token configured. You're limited to 60 requests per hour."}
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {hasToken ? "Manage Token" : "Configure Token"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <GitHubTokenDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
