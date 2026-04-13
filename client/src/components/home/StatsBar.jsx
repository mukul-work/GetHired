import { useState, useEffect } from "react";
import { getPlacementStats } from "../../services/api";

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
      value: stats ? stats.highestPackage + " LPA" : "42 LPA",
    },
    {
      label: "Average Package",
      value: stats ? stats.avgPackage + " LPA" : "8.5 LPA",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white border-y border-gray-100">
      {display.map((stat, i) => (
        <div
          key={stat.label}
          className={`text-center py-8 px-4 ${i < 3 ? "border-r border-gray-100" : ""}`}
        >
          <p className="text-3xl font-bold text-yellow-500">{stat.value}</p>
          <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
