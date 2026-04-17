import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companies } from "../../data/companies";

function LogoImg({ src, domain, name }) {
  const srcs = [
    src,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
  ];
  const [idx, setIdx] = useState(0);
  if (idx >= srcs.length)
    return (
      <span className="text-base font-bold text-gray-400">
        {name.charAt(0)}
      </span>
    );
  return (
    <img
      src={srcs[idx]}
      alt={name}
      onError={() => setIdx((i) => i + 1)}
      className="h-7 w-auto max-w-[72px] object-contain"
    />
  );
}

function TopRecruiters() {
  const navigate = useNavigate();

  return (
    <div className="px-6 sm:px-10 py-12 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Top Recruiters
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Companies that hire from KIET every year
            </p>
          </div>
          <button
            onClick={() => navigate("/recruiters")}
            className="text-yellow-600 dark:text-yellow-400 text-sm font-medium hover:underline hidden sm:block"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {companies.slice(0, 12).map((company) => (
            <button
              key={company.id}
              className="cursor-pointer rounded-xl p-3 text-center hover:shadow-md transition border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-yellow-200 dark:hover:border-yellow-800 flex flex-col items-center gap-2"
              onClick={() => navigate(`/recruiters/${company.id}`)}
            >
              <LogoImg
                src={company.logo}
                domain={company.domain}
                name={company.name}
              />
              <p className="font-semibold text-xs text-gray-700 dark:text-gray-300 leading-tight">
                {company.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopRecruiters;
