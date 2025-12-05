import React, { memo } from "react";
import { RoadmapStats } from "@/types/roadmap";
import { ROADMAP_CONFIG } from "@/constants/roadmap";

interface StatusLegendProps {
  stats: RoadmapStats;
}

const StatusLegend = memo(({ stats }: StatusLegendProps) => {
  const { statusColors } = ROADMAP_CONFIG;

  const statusItems = [
    {
      label: "Completed",
      count: stats.completed,
      colorClass: statusColors.completed,
    },
    {
      label: "In Progress",
      count: stats.inProgress,
      colorClass: statusColors.inProgress,
    },
    {
      label: "Planned",
      count: stats.planned,
      colorClass: statusColors.planned,
    },
    {
      label: "Research",
      count: stats.research,
      colorClass: statusColors.research,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {statusItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1 text-sm">
          <div className={`w-3 h-3 ${item.colorClass} rounded-full`}></div>
          <span>
            {item.label} ({item.count})
          </span>
        </div>
      ))}
    </div>
  );
});

StatusLegend.displayName = "StatusLegend";

export { StatusLegend };
