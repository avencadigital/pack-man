export interface RoadmapStats {
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
    research: number;
    totalUpvotes: number;
    majorFeatures: number;
    criticalPriority: number;
}

export interface StatusColors {
    completed: string;
    inProgress: string;
    planned: string;
    research: string;
}

export interface GridResponsive {
    stats: string;
    features: string;
}