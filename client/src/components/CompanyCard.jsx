import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TIER_META } from "../data/companies";

function LogoImg({ src, name }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-extrabold text-gray-400 dark:text-gray-500">
        {name.charAt(0)}
      </div>
    );
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErr(true)}
      className="w-12 h-12 object-contain"
    />
  );
}

export default function CompanyCard({ company }) {
  const navigate = useNavigate();
  const tier = TIER_META[company.tier];
  return (
    <div
      onClick={() => navigate(`/recruiters/${company.id}`)}
      className="cursor-pointer group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-700 transition-all flex flex-col gap-2"
    >
      <div className="flex items-center justify-between mb-1">
        <LogoImg src={company.logo} name={company.name} />
        {tier && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tier.color}`}
          >
            {tier.label}
          </span>
        )}
      </div>
      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
        {company.name}
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {company.domains.join(", ")}
      </p>
      <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-[11px]">
        <span className="text-gray-400 dark:text-gray-500">Avg</span>
        <span className="font-bold text-yellow-600 dark:text-yellow-400">
          {company.avgPackage}
        </span>
      </div>
    </div>
  );
}
