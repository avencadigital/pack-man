import { useState, useMemo, useCallback } from "react";
import { Feature, initialFeatures } from "@/components/roadmap/initialFeatures";
import { calculateRoadmapStats } from "@/utils/roadmapUtils";
import { RoadmapStats } from "@/types/roadmap";

interface UseRoadmapFeaturesReturn {
    features: Feature[];
    handleUpvote: (id: number) => void;
    stats: RoadmapStats;
    isLoading: boolean;
    error: string | null;
}

export const useRoadmapFeatures = (): UseRoadmapFeaturesReturn => {
    const [features, setFeatures] = useState<Feature[]>(initialFeatures);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpvote = useCallback((id: number) => {
        try {
            setFeatures((prevFeatures) =>
                prevFeatures.map((feature) =>
                    feature.id === id
                        ? { ...feature, upvotes: feature.upvotes + 1 }
                        : feature
                )
            );
        } catch (err) {
            setError("Failed to update vote. Please try again.");
            console.error("Error updating vote:", err);
        }
    }, []);

    const stats = useMemo(() => calculateRoadmapStats(features), [features]);

    return {
        features,
        handleUpvote,
        stats,
        isLoading,
        error,
    };
};