"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface AnalysisStatusIndicatorProps {
    analysisProgress: number;
}

export function AnalysisStatusIndicator({
    analysisProgress,
}: AnalysisStatusIndicatorProps) {
    return (
        <div className="space-y-4 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 text-sm sm:text-base">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                        Analyzing packages...
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        This may take a few moments depending on the number of dependencies
                    </p>
                </div>
                <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                    {Math.round(analysisProgress)}%
                </Badge>
            </div>
            <Progress
                value={analysisProgress}
                className="h-2 bg-blue-100 dark:bg-blue-900"
            />
        </div>
    );
}
