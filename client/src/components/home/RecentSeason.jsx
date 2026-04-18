import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPlacementStats,
  getTopPerformers,
  getBranchChart,
} from "../../services/api";
import { formatPkg } from "../../utils/formatPkg";

function RecentSeason() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    highestPackage: 42,
    totalPlacements: 350,
  });
  const [topCompany, setTopCompany] = useState("Google");
  const [topBranch, setTopBranch] = useState("CSE");
  const [topPerformer, setTopPerformer] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      getPlacementStats(),
      getTopPerformers(),
      getBranchChart(),
    ]).then(([s, p, b]) => {
      if (s.status === "fulfilled") setStats(s.value.data);
      if (p.status === "fulfilled" && p.value.data.length > 0) {
        const perf = p.value.data[0];
        setTopPerformer(perf);
        setTopCompany(perf.company);
      }
      if (b.status === "fulfilled" && b.value.data.length > 0)
        setTopBranch(b.value.data[0].branch);
    });
  }, []);

  const cards = [
    { label: "Top Company", value: topCompany, icon: "🏢" },
    { label: "Top Branch", value: topBranch, icon: "🎓" },
    {
      label: "Total Offers (2024)",
      value: `${stats.totalPlacements}+`,
      icon: "📋",
    },
    {
      label: "Highest Package",
      value: formatPkg(stats.highestPackage),
      icon: "💰",
    },
  ];

  return (
    <div className="px-6 sm:px-10 py-12 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recent Placement Season
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Highlights from the 2024 placement drive
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-yellow-600 dark:text-yellow-400 text-sm font-medium hover:underline hidden sm:block"
          >
            Full Stats →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-center shadow-sm"
            >
              <span className="text-2xl mb-2 block">{card.icon}</span>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {card.value}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {topPerformer && (
          <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Top Performer — {topPerformer.studentName}
              </p>
              <p className="text-xs text-gray-500">
                {topPerformer.branch} · {topPerformer.company} ·{" "}
                <span className="text-green-600 font-semibold">
                  {(topPerformer.package >= 100)?(`${topPerformer.package/100} Cr`):(`${topPerformer.package} LPA`)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentSeason;
