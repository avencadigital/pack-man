import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface RoadmapErrorProps {
  error: string;
  onRetry?: () => void;
}

const RoadmapError = ({ error, onRetry }: RoadmapErrorProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 my-16 relative z-30 mt-60">
      <Card className="border-0 shadow-lg sm:shadow-xl relative z-30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
            Error Loading Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-sm sm:text-base">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { RoadmapError };
