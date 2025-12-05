import { StatusColors, GridResponsive } from "@/types/roadmap";

export const ROADMAP_CONFIG = {
    requestFeatureUrl: "https://github.com/gzpaitch/pack-man/issues/new?q=state%3Aopen+label%3Aenhancement",

    statusColors: {
        completed: "bg-green-500",
        inProgress: "bg-blue-500",
        planned: "bg-orange-500",
        research: "bg-purple-500"
    } as StatusColors,

    iconColors: {
        total: "text-blue-500",
        votes: "text-green-500",
        inProgress: "text-orange-500",
        major: "text-purple-500"
    },

    gridResponsive: {
        stats: "grid-cols-2 md:grid-cols-4",
        features: "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    } as GridResponsive
};