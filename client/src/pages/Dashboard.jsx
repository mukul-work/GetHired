import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  getPlacementStats,
  getYearlyChart,
  getBranchChart,
  getCompaniesChart,
  getPackageDistChart,
  getTopPerformers,
  getPlacements,
  getFilterOptions,
} from "../services/api";
import { formatPkg } from "../utils/formatPkg";

// ── Fallback data for when API is unavailable ──
const FALLBACK_STATS = {
  totalPlacements: 350,
  highestPackage: 1.78,
  avgPackage: 8.4,
  totalCompanies: 38,
};
const FALLBACK_YEARLY = [
  { year: 2021, count: 65, avgPkg: 7.2 },
  { year: 2022, count: 80, avgPkg: 8.1 },
  { year: 2023, count: 95, avgPkg: 9.4 },
  { year: 2024, count: 110, avgPkg: 11.2 },
];
const FALLBACK_BRANCH = [
  { branch: "CSE", count: 145, avgPkg: 14.2 },
  { branch: "IT", count: 95, avgPkg: 12.8 },
  { branch: "ECE", count: 55, avgPkg: 8.6 },
  { branch: "ME", count: 28, avgPkg: 5.8 },
  { branch: "CE", count: 17, avgPkg: 5.2 },
  { branch: "EEE", count: 10, avgPkg: 5.5 },
];
const FALLBACK_COMPANIES = [
  { company: "TCS", count: 48 },
  { company: "Infosys", count: 36 },
  { company: "Wipro", count: 30 },
  { company: "Cognizant", count: 24 },
  { company: "Accenture", count: 22 },
  { company: "Amazon", count: 14 },
  { company: "Microsoft", count: 10 },
  { company: "Google", count: 7 },
  { company: "Flipkart", count: 9 },
  { company: "HCL Technologies", count: 18 },
];
const FALLBACK_PKGDIST = [
  { label: "0-5 LPA", count: 95 },
  { label: "5-10 LPA", count: 130 },
  { label: "10-15 LPA", count: 65 },
  { label: "15-20 LPA", count: 32 },
  { label: "20-25 LPA", count: 16 },
  { label: "25-30 LPA", count: 8 },
  { label: "30+ LPA", count: 4 },
];
const FALLBACK_PLACEMENTS = [
  {
    _id: "f1",
    studentName: "Aarav Sharma",
    branch: "CSE",
    company: "Google",
    role: "Software Engineer",
    package: 44,
    year: 2024,
  },
  {
    _id: "f2",
    studentName: "Priya Singh",
    branch: "CSE",
    company: "Microsoft",
    role: "SDE-I",
    package: 38,
    year: 2024,
  },
  {
    _id: "f3",
    studentName: "Rohan Gupta",
    branch: "IT",
    company: "Amazon",
    role: "Software Development Engineer",
    package: 32,
    year: 2024,
  },
  {
    _id: "f4",
    studentName: "Neha Verma",
    branch: "CSE",
    company: "Flipkart",
    role: "SDE-I",
    package: 28,
    year: 2024,
  },
  {
    _id: "f5",
    studentName: "Arjun Mehta",
    branch: "ECE",
    company: "Goldman Sachs",
    role: "Technology Analyst",
    package: 24,
    year: 2024,
  },
  {
    _id: "f6",
    studentName: "Anjali Yadav",
    branch: "CSE",
    company: "Adobe",
    role: "Member of Technical Staff",
    package: 22,
    year: 2024,
  },
  {
    _id: "f7",
    studentName: "Vikram Patel",
    branch: "IT",
    company: "Deloitte",
    role: "Analyst",
    package: 12,
    year: 2024,
  },
  {
    _id: "f8",
    studentName: "Sneha Joshi",
    branch: "CSE",
    company: "TCS",
    role: "System Engineer",
    package: 7,
    year: 2024,
  },
  {
    _id: "f9",
    studentName: "Karan Malhotra",
    branch: "ME",
    company: "Mahindra",
    role: "Graduate Engineer Trainee",
    package: 5,
    year: 2024,
  },
  {
    _id: "f10",
    studentName: "Divya Saxena",
    branch: "CE",
    company: "L&T",
    role: "Site Engineer",
    package: 5.2,
    year: 2024,
  },
  {
    _id: "f11",
    studentName: "Rahul Dubey",
    branch: "CSE",
    company: "Infosys",
    role: "Systems Engineer",
    package: 6.5,
    year: 2023,
  },
  {
    _id: "f12",
    studentName: "Pooja Agarwal",
    branch: "IT",
    company: "Wipro",
    role: "Project Engineer",
    package: 6.5,
    year: 2023,
  },
  {
    _id: "f13",
    studentName: "Manish Kumar",
    branch: "ECE",
    company: "Cognizant",
    role: "Programmer Analyst",
    package: 7.5,
    year: 2023,
  },
  {
    _id: "f14",
    studentName: "Ritika Bose",
    branch: "CSE",
    company: "Accenture",
    role: "Associate Software Engineer",
    package: 8,
    year: 2023,
  },
  {
    _id: "f15",
    studentName: "Sumit Tiwari",
    branch: "CSE",
    company: "Amazon",
    role: "SDE-I",
    package: 30,
    year: 2023,
  },
  {
    _id: "f16",
    studentName: "Harsh Agarwal",
    branch: "CSE",
    company: "Microsoft",
    role: "SDE-I",
    package: 35,
    year: 2022,
  },
  {
    _id: "f17",
    studentName: "Swati Mishra",
    branch: "IT",
    company: "TCS",
    role: "System Engineer",
    package: 7,
    year: 2022,
  },
  {
    _id: "f18",
    studentName: "Gaurav Srivastava",
    branch: "EEE",
    company: "Siemens",
    role: "Electrical Engineer",
    package: 6.8,
    year: 2022,
  },
  {
    _id: "f19",
    studentName: "Isha Pandey",
    branch: "CSE",
    company: "Google",
    role: "Software Engineer",
    package: 40,
    year: 2021,
  },
  {
    _id: "f20",
    studentName: "Deepak Rana",
    branch: "ME",
    company: "Bosch",
    role: "Mechanical Engineer",
    package: 5.5,
    year: 2021,
  },
];
const FALLBACK_FILTERS = {
  years: [2024, 2023, 2022, 2021],
  branches: ["CE", "CSE", "ECE", "EEE", "IT", "ME"],
  companies: [
    "TCS",
    "Infosys",
    "Wipro",
    "Amazon",
    "Microsoft",
    "Google",
    "Flipkart",
  ],
  roles: ["Software Engineer", "System Engineer", "Data Analyst", "SDE-I"],
};

const BRANCH_COLORS = {
  CSE: "#3b82f6",
  IT: "#8b5cf6",
  ECE: "#f59e0b",
  ME: "#10b981",
  CE: "#ef4444",
  EEE: "#f97316",
};
const BAR_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
];

// ── Collapsible Section (must be at module level — never inside another component) ──
function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
      >
        {title}
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && children}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, sub, color = "blue" }) {
  const clr = {
    blue: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${clr[color].split(" ")[1]}`}>
        {value}
      </p>
      {sub && (
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{sub}</p>
      )}
    </div>
  );
}

// ── Filter Sidebar ──────────────────────────────────────────
function FilterSidebar({ filters, options, onChange }) {
  const toggle = (key, val) => {
    const cur = filters[key] || [];
    const next = cur.includes(val)
      ? cur.filter((v) => v !== val)
      : [...cur, val];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-800 dark:text-white">Filters</h3>
        <button
          onClick={() =>
            onChange({
              years: [],
              branches: [],
              companies: [],
              minPkg: "",
              maxPkg: "",
              search: "",
            })
          }
          className="text-xs text-yellow-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <Section title="Year">
        {options.years.map((y) => (
          <label
            key={y}
            className="flex items-center gap-2 mb-1.5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={(filters.years || []).includes(y)}
              onChange={() => toggle("years", y)}
              className="rounded accent-blue-600"
            />
            <span className="text-sm text-gray-600">{y}</span>
          </label>
        ))}
      </Section>

      <Section title="Branch">
        {options.branches.map((b) => (
          <label
            key={b}
            className="flex items-center gap-2 mb-1.5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={(filters.branches || []).includes(b)}
              onChange={() => toggle("branches", b)}
              className="rounded accent-blue-600"
            />
            <span className="text-sm text-gray-600">{b}</span>
          </label>
        ))}
      </Section>

      <Section title="Package Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPkg || ""}
            onChange={(e) => onChange({ ...filters, minPkg: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPkg || ""}
            onChange={(e) => onChange({ ...filters, maxPkg: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">in LPA</p>
      </Section>

      <Section title="Search Company">
        <input
          type="text"
          placeholder="e.g. Google, TCS…"
          value={filters.company || ""}
          onChange={(e) => onChange({ ...filters, company: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
      </Section>

      <Section title="Search Role">
        <input
          type="text"
          placeholder="e.g. Software Engineer…"
          value={filters.role || ""}
          onChange={(e) => onChange({ ...filters, role: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
      </Section>
    </div>
  );
}

// ── Placement Table ────────────────────────────────────────
function PlacementTable({ placements, loading, page, pages, onPageChange }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(6)
                      .fill(0)
                      .map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded w-3/4" />
                        </td>
                      ))}
                  </tr>
                ))
            ) : placements.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              placements.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {p.studentName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: `${BRANCH_COLORS[p.branch]}20`,
                        color: BRANCH_COLORS[p.branch],
                      }}
                    >
                      {p.branch}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {p.company}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {p.role}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${p.package >= 20 ? "text-green-600" : p.package >= 10 ? "text-yellow-600" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {formatPkg(p.package)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {p.year}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1.5 rounded-lg text-sm border ${page === p ? "bg-yellow-400 text-gray-900 border-yellow-400" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
              >
                {p}
              </button>
            );
          })}
          {pages > 7 && <span className="px-2 py-1.5 text-gray-400">...</span>}
          {pages > 7 && (
            <button
              onClick={() => onPageChange(pages)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${page === pages ? "bg-yellow-400 text-gray-900 border-yellow-400" : "hover:bg-gray-50"}`}
            >
              {pages}
            </button>
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 hover:bg-gray-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

// ── Top Performers ─────────────────────────────────────────
function TopPerformers({ performers }) {
  const getRankStyle = (i) => {
    if (i === 0) return { bg: "#FEF9C3", color: "#A16207", decoration: "#FDE68A" };
    if (i === 1) return { bg: "#F1F5F9", color: "#475569", decoration: "#CBD5E1" };
    if (i === 2) return { bg: "#FFF7ED", color: "#C2410C", decoration: "#FED7AA" };
    return { bg: "#F8FAFC", color: "#94A3B8", decoration: "#E2E8F0" };
  };

  return (
    <div className="w-full p-5">
      <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>🏆</span> Top Performers
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {performers.map((p, i) => {
          const rank = getRankStyle(i);
          const initials = p.studentName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={p._id}
              className="relative flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 overflow-hidden shadow-sm"
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-30"
                style={{ background: rank.decoration }}
              />
              <div
                className="absolute -bottom-3 -right-8 w-20 h-20 rounded-full opacity-20"
                style={{ background: rank.decoration }}
              />
              <div
                className="absolute top-1/2 -right-2 w-8 h-8 rounded-full opacity-20"
                style={{ background: rank.decoration }}
              />

              {/* Avatar */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                {initials}
              </div>

              {/* Details */}
              <div className="relative z-10 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: rank.bg, color: rank.color }}
                  >
                    #{i + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {p.studentName}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {p.branch} · {p.company}
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">
                  {formatPkg(p.package)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [yearlyData, setYearlyData] = useState(FALLBACK_YEARLY);
  const [branchData, setBranchData] = useState(FALLBACK_BRANCH);
  const [companiesData, setCompaniesData] = useState(FALLBACK_COMPANIES);
  const [pkgDistData, setPkgDistData] = useState(FALLBACK_PKGDIST);
  const [performers, setPerformers] = useState(
    FALLBACK_PLACEMENTS.slice(0, 10).sort((a, b) => b.package - a.package),
  );
  const [placements, setPlacements] = useState([]);
  const [filterOptions, setFilterOptions] = useState(FALLBACK_FILTERS);
  const [filters, setFilters] = useState({
    years: [],
    branches: [],
    company: "",
    role: "",
    minPkg: "",
    maxPkg: "",
  });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Load charts & stats — use fallback when DB is empty
  useEffect(() => {
    Promise.allSettled([
      getPlacementStats(),
      getYearlyChart(),
      getBranchChart(),
      getCompaniesChart(),
      getPackageDistChart(),
      getTopPerformers(),
      getFilterOptions(),
    ]).then(([statsR, yearR, branchR, compR, pkgR, perfR, filtersR]) => {
      if (
        statsR.status === "fulfilled" &&
        statsR.value.data?.totalPlacements > 0
      )
        setStats(statsR.value.data);
      if (yearR.status === "fulfilled" && yearR.value.data?.length > 0)
        setYearlyData(yearR.value.data);
      if (branchR.status === "fulfilled" && branchR.value.data?.length > 0)
        setBranchData(branchR.value.data);
      if (compR.status === "fulfilled" && compR.value.data?.length > 0)
        setCompaniesData(compR.value.data);
      if (
        pkgR.status === "fulfilled" &&
        pkgR.value.data?.some((d) => d.count > 0)
      )
        setPkgDistData(pkgR.value.data);
      if (perfR.status === "fulfilled" && perfR.value.data?.length > 0)
        setPerformers(perfR.value.data);
      if (
        filtersR.status === "fulfilled" &&
        filtersR.value.data?.years?.length > 0
      )
        setFilterOptions(filtersR.value.data);
      setChartsLoading(false);
    });
  }, []);

  // Load placement table
  const loadPlacements = useCallback(() => {
    setTableLoading(true);
    const params = { page, limit: 20 };
    if (filters.years?.length === 1) params.year = filters.years[0];
    if (filters.branches?.length === 1) params.branch = filters.branches[0];
    if (filters.company) params.company = filters.company;
    if (filters.role) params.role = filters.role;
    if (filters.minPkg) params.minPkg = filters.minPkg;
    if (filters.maxPkg) params.maxPkg = filters.maxPkg;
    getPlacements(params)
      .then(({ data }) => {
        if (data.total > 0) {
          setPlacements(data.data);
          setPages(data.pages);
          setTotal(data.total);
        } else {
          // DB is empty — use fallback data
          throw new Error("empty");
        }
      })
      .catch(() => {
        // API unavailable — filter fallback data client-side
        let fb = FALLBACK_PLACEMENTS;
        if (filters.years?.length)
          fb = fb.filter((p) => filters.years.includes(p.year));
        if (filters.branches?.length)
          fb = fb.filter((p) => filters.branches.includes(p.branch));
        if (filters.company)
          fb = fb.filter((p) =>
            p.company.toLowerCase().includes(filters.company.toLowerCase()),
          );
        if (filters.role)
          fb = fb.filter((p) =>
            p.role.toLowerCase().includes(filters.role.toLowerCase()),
          );
        if (filters.minPkg)
          fb = fb.filter((p) => p.package >= Number(filters.minPkg));
        if (filters.maxPkg)
          fb = fb.filter((p) => p.package <= Number(filters.maxPkg));
        const limit = 20;
        const start = (page - 1) * limit;
        setTotal(fb.length);
        setPages(Math.max(1, Math.ceil(fb.length / limit)));
        setPlacements(fb.slice(start, start + limit));
      })
      .finally(() => setTableLoading(false));
  }, [filters, page]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPlacements();
  }, [JSON.stringify(filters), page]);

  const handleFilterChange = (f) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Placement Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Comprehensive placement analytics across all years and branches
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Placements"
            value={stats.totalPlacements?.toLocaleString()}
            color="blue"
          />
          <StatCard
            label="Companies Visited"
            value={stats.totalCompanies}
            color="purple"
          />
          <StatCard
            label="Highest Package"
            value={formatPkg(stats.highestPackage)}
            color="green"
          />
          <StatCard
            label="Avg Package"
            value={formatPkg(stats.avgPackage)}
            color="amber"
          />
        </div>

        {/* Charts Row 1 — Year + Branch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Year-wise Line Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
              Year-wise Placements
            </h3>
            {chartsLoading ? (
              <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(val, name) => [
                      val,
                      name === "count" ? "Placements" : "Avg Pkg (LPA)",
                    ]}
                  />
                  <Legend
                    formatter={(val) =>
                      val === "count" ? "Total Placements" : "Avg Package (LPA)"
                    }
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgPkg"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Branch-wise Bar Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
              Branch-wise Placements
            </h3>
            {chartsLoading ? (
              <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(val, name) => [
                      val,
                      name === "count" ? "Placements" : "Avg Pkg (LPA)",
                    ]}
                  />
                  <Legend
                    formatter={(val) =>
                      val === "count" ? "Total Placements" : "Avg Package (LPA)"
                    }
                  />
                  <Bar dataKey="count" name="count" radius={[4, 4, 0, 0]}>
                    {branchData.map((entry) => (
                      <Cell
                        key={entry.branch}
                        fill={BRANCH_COLORS[entry.branch] || "#3b82f6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts Row 2 — Companies + Package Dist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Companies Horizontal Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
              Top Companies by Offers
            </h3>
            {chartsLoading ? (
              <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={companiesData}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="company"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip formatter={(val) => [val, "Offers"]} />
                  <Bar dataKey="count" name="Offers" radius={[0, 4, 4, 0]}>
                    {companiesData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Package Distribution Histogram */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
              Package Distribution
            </h3>
            {chartsLoading ? (
              <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pkgDistData} margin={{ bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    angle={-20}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val) => [val, "Students"]} />
                  <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                    {pkgDistData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={`hsl(${210 + i * 20}, 70%, ${60 - i * 3}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Placement Table + Filters + Top Performers */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Placement Records
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar
                filters={filters}
                options={filterOptions}
                onChange={handleFilterChange}
              />
            </div>

            {/* Table + results */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {tableLoading
                    ? "Loading…"
                    : `Showing ${placements.length} of ${total} records`}
                </p>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">Active filters:</span>
                  {filters.years?.map((y) => (
                    <span
                      key={y}
                      className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full"
                    >
                      {y}
                    </span>
                  ))}
                  {filters.branches?.map((b) => (
                    <span
                      key={b}
                      className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                  {filters.company && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      {filters.company}
                    </span>
                  )}
                  {(filters.minPkg || filters.maxPkg) && (
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                      {filters.minPkg || "0"}–{filters.maxPkg || "∞"} LPA
                    </span>
                  )}
                </div>
              </div>
              <PlacementTable
                placements={placements}
                loading={tableLoading}
                page={page}
                pages={pages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {performers.length > 0 && (
          <div>
            <TopPerformers performers={performers} />
          </div>
        )}
      </div>
    </div>
  );
}
