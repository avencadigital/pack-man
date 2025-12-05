import { Feature } from "@/components/roadmap/initialFeatures";
import { RoadmapStats } from "@/types/roadmap";

export const calculateRoadmapStats = (features: Feature[]): RoadmapStats => {
    return {
        total: features.length,
        completed: features.filter((f) => f.status === "Completed").length,
        inProgress: features.filter((f) => f.status === "In Progress").length,
        planned: features.filter((f) => f.status === "Planned").length,
        research: features.filter((f) => f.status === "Research").length,
        totalUpvotes: features.reduce((sum, f) => sum + f.upvotes, 0),
        majorFeatures: features.filter((f) => f.impact === "Major").length,
        criticalPriority: features.filter((f) => f.priority === "Critical").length,
    };
};