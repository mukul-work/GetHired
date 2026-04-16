import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMonitor, FiMapPin, FiTrendingUp, FiAward, FiZap, FiTarget, FiArrowLeft } from "react-icons/fi";
import { companies, TIER_META } from "../data/companies";

function LogoImg({ src, domain, name, className }) {
  const srcs = [
    src,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=256&domain=${domain}`,
  ];
  const [idx, setIdx] = useState(0);

  if (idx >= srcs.length)
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-3xl font-extrabold text-gray-400 dark:text-gray-500`}>
        {name.charAt(0)}
      </div>
    );
  return (
    <img
      src={srcs[idx]}
      alt={name}
      onError={() => setIdx((i) => i + 1)}
      className={className}
    />
  );
}

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === Number(id));

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">Company not found</p>
          <button
            onClick={() => navigate("/recruiters")}
            className="text-yellow-600 dark:text-yellow-400 hover:underline text-sm"
          >
            ← Back to Recruiters
          </button>
        </div>
      </div>
    );
  }

  const tier = TIER_META[company.tier];

  const infoCards = [
    { label: "Domains", value: company.domains.join(", "), icon: <FiMonitor className="w-5 h-5" /> },
    { label: "Locations", value: company.locations.join(", "), icon: <FiMapPin className="w-5 h-5" /> },
    { label: "Avg Package", value: company.avgPackage, icon: <FiTrendingUp className="w-5 h-5" /> },
    { label: "Highest Package", value: company.highestPackage, icon: <FiAward className="w-5 h-5" /> },
    { label: "Difficulty", value: company.difficulty, icon: <FiZap className="w-5 h-5" /> },
    { label: "Tier", value: tier?.label ?? company.tier, icon: <FiTarget className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <button
            onClick={() => navigate("/recruiters")}
            className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 text-sm mb-6 hover:underline"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Recruiters
          </button>

          <div className="flex items-center gap-5">
            <LogoImg
              src={company.logo}
              domain={company.domain}
              name={company.name}
              className="w-20 h-20 object-contain"
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {company.name}
                </h1>
                {tier && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tier.color}`}>
                    {tier.label}
                  </span>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {company.domains.join(" · ")} · {company.locations.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {infoCards.map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-center shadow-sm"
            >
              <span className="mb-2 flex justify-center text-yellow-500 dark:text-yellow-400">{item.icon}</span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 break-words">
                {item.value}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Placement History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Year</th>
                  <th className="px-6 py-3 text-left">Students</th>
                  <th className="px-6 py-3 text-left">Avg Package</th>
                  <th className="px-6 py-3 text-left">Highest Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {company.history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3 font-semibold text-gray-800 dark:text-gray-200">{row.year}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.students}</td>
                    <td className="px-6 py-3 text-yellow-600 dark:text-yellow-400 font-medium">{row.avg}</td>
                    <td className="px-6 py-3 text-green-600 dark:text-green-400 font-medium">{row.highest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}