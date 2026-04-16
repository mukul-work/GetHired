import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { companies, TIER_META } from "../data/companies";

const TIERS = ["all", ...Object.keys(TIER_META)];
const DIFF_ORDER = { Easy: 1, "Easy-Medium": 2, Medium: 3, "Medium-Hard": 4, Hard: 5 };

function LogoImg({ src, domain, name }) {
  const srcs = [
    src,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?sz=256&domain=${domain}`,
  ];
  const [idx, setIdx] = useState(0);

  if (idx >= srcs.length)
    return (
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-extrabold text-gray-400 dark:text-gray-500 select-none">
        {name.charAt(0)}
      </div>
    );
  return (
    <img
      src={srcs[idx]}
      alt={name}
      onError={() => setIdx((i) => i + 1)}
      className="w-14 h-14 object-contain"
    />
  );
}

export default function Recruiters() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return companies.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.domains.some((d) => d.toLowerCase().includes(q));
      const matchTier = tier === "all" || c.tier === tier;
      return matchSearch && matchTier;
    });
  }, [search, tier]);

  // Group by tier in a fixed order
  const tierOrder = ["top-product", "unicorn", "finance", "consulting", "indian-saas", "it-services"];
  const grouped = tierOrder
    .map((t) => ({ tier: t, items: filtered.filter((c) => c.tier === t) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-2">
            KIET Placement Cell
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Our Recruiters
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl">
            {companies.length} companies that actively recruit from KIET across
            all branches and programmes.
          </p>

          {/* Stats strip */}
          <div className="mt-6 flex flex-wrap gap-4">
            {[
              { label: "Companies", value: companies.length },
              { label: "Top Product", value: companies.filter((c) => c.tier === "top-product").length },
              { label: "Unicorns", value: companies.filter((c) => c.tier === "unicorn").length },
              { label: "IT Services", value: companies.filter((c) => c.tier === "it-services").length },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2"
              >
                <span className="text-xl font-bold text-yellow-500">{value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* ── Search + Filter row ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Tier filter pills */}
          <div className="flex gap-2 flex-wrap">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  tier === t
                    ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-700"
                }`}
              >
                {t === "all" ? "All" : TIER_META[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count ── */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Showing {filtered.length} of {companies.length} companies
        </p>

        {/* ── Grouped grid ── */}
        {grouped.length === 0 ? (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No companies match your search</p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ tier: t, items }) => (
              <section key={t}>
                {/* Section heading */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${TIER_META[t].color}`}>
                    {TIER_META[t].label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{items.length} companies</span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                </div>

                {/* Company cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => navigate(`/recruiters/${company.id}`)}
                      className="group text-left bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-200 flex flex-col gap-3"
                    >
                      {/* Logo */}
                      <div className="flex items-center justify-center h-14">
                        <LogoImg src={company.logo} domain={company.domain} name={company.name} />
                      </div>

                      {/* Name */}
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {company.name}
                      </p>

                      {/* Domain tags */}
                      <div className="flex gap-1 flex-wrap">
                        {company.domains.slice(0, 2).map((d) => (
                          <span
                            key={d}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium"
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Package */}
                      <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 dark:text-gray-500">Avg</span>
                        <span className="font-bold text-yellow-600 dark:text-yellow-400">{company.avgPackage}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}