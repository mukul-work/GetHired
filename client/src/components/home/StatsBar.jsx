import { useState, useEffect } from "react";
import { getPlacementStats } from "../../services/api";
import { formatPkg } from "../../utils/formatPkg";

const defaultStats = [
  { label: "Students Placed", value: "1,200+", key: "totalPlacements" },
  { label: "Companies Visited", value: "80+", key: "totalCompanies" },
  { label: "Highest Package", value: "42 LPA", key: "highestPackage" },
  { label: "Average Package", value: "8.5 LPA", key: "avgPackage" },
];

function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPlacementStats()
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  const display = [
    {
      label: "Students Placed",
      value: stats ? stats.totalPlacements?.toLocaleString() + "+" : "1,200+",
    },
    {
      label: "Companies Visited",
      value: stats ? stats.totalCompanies + "+" : "80+",
    },
    {
      label: "Highest Package",
      value: stats ? formatPkg(stats.highestPackage) : "1.78 Cr",
    },
    {
      label: "Average Package",
      value: stats ? formatPkg(stats.avgPackage) : "8.5 LPA",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 transition-colors">
      {display.map((stat, i) => (
        <div
          key={stat.label}
          className={`text-center py-8 px-4 ${i < 3 ? "border-r border-gray-100 dark:border-gray-800" : ""}`}
        >
          <p className="text-3xl font-bold text-yellow-500">{stat.value}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
