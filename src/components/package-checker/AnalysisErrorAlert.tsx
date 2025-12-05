"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AnalysisErrorAlertProps {
    error: string;
}

export function AnalysisErrorAlert({ error }: AnalysisErrorAlertProps) {
    return (
        <Alert
            variant="destructive"
            className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
        >
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <AlertDescription className="text-sm sm:text-base">
                <strong>Error:</strong> {error}
            </AlertDescription>
        </Alert>
    );
}
