"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ThemeImage } from "@/components/ui/theme-image";

interface AnalyzeButtonProps {
    onClick: () => void;
    disabled: boolean;
    isAnalyzing: boolean;
}

export function AnalyzeButton({
    onClick,
    disabled,
    isAnalyzing,
}: AnalyzeButtonProps) {
    const canAnalyze = !disabled;

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={`w-full h-12 sm:h-14 text-base sm:text-lg font-medium transition-all duration-200 rounded-2xl ${canAnalyze
                ? "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
        >
            {isAnalyzing ? (
                <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    Analyze Packages
                    <div className="relative w-6 h-6 ml-1">
                        <ThemeImage
                            srcLight="/logos/pacmonster.svg"
                            srcDark="/logos/pacman_white.svg"
                            alt="Pack-Man Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </>
            )}
        </Button>
    );
}
