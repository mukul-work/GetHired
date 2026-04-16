// client/src/pages/TrendingSkills.jsx
// NEW FEATURE: Trending Skills — what students should learn for placements
import { useState } from "react";

const SKILLS = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    category: "Core CS",
    demand: 98,
    trend: "up",
    companies: ["Google", "Amazon", "Microsoft", "Flipkart", "Adobe"],
    avgPackage: "18–44 LPA",
    difficulty: "Hard",
    timeToLearn: "3–6 months",
    resources: [
      { name: "Striver's A2Z DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course" },
      { name: "LeetCode", url: "https://leetcode.com" },
      { name: "GeeksForGeeks", url: "https://geeksforgeeks.org" },
    ],
    description: "The #1 skill for cracking top product companies. Master arrays, trees, graphs, DP and recursion.",
    tags: ["Must Have", "Interview Critical"],
  },
  {
    id: 2,
    name: "React.js",
    category: "Frontend",
    demand: 91,
    trend: "up",
    companies: ["Flipkart", "Swiggy", "Razorpay", "Adobe", "Freshworks"],
    avgPackage: "10–32 LPA",
    difficulty: "Medium",
    timeToLearn: "1–2 months",
    resources: [
      { name: "React Docs (Official)", url: "https://react.dev" },
      { name: "Namaste React by Akshay Saini", url: "https://namastedev.com" },
    ],
    description: "Most in-demand frontend framework. Used in almost every startup and product company.",
    tags: ["Trending", "High Demand"],
  },
  {
    id: 3,
    name: "System Design",
    category: "Core CS",
    demand: 88,
    trend: "up",
    companies: ["Amazon", "Microsoft", "Uber", "LinkedIn", "PayPal"],
    avgPackage: "20–50 LPA",
    difficulty: "Hard",
    timeToLearn: "2–4 months",
    resources: [
      { name: "Grokking System Design", url: "https://designgurus.io" },
      { name: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" },
    ],
    description: "Critical for SDE-2+ and dream company rounds. Learn scalability, databases, caching, load balancing.",
    tags: ["Senior Roles", "Dream Companies"],
  },
  {
    id: 4,
    name: "SQL & Databases",
    category: "Backend",
    demand: 85,
    trend: "stable",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Deloitte"],
    avgPackage: "6–18 LPA",
    difficulty: "Medium",
    timeToLearn: "3–4 weeks",
    resources: [
      { name: "SQLZoo", url: "https://sqlzoo.net" },
      { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial" },
    ],
    description: "Asked in almost every service-based company interview. Strong SQL skills set you apart.",
    tags: ["Must Have", "Mass Hiring"],
  },
  {
    id: 5,
    name: "Python",
    category: "Programming",
    demand: 83,
    trend: "up",
    companies: ["Google", "Amazon", "Deloitte", "EY", "Goldman Sachs"],
    avgPackage: "8–30 LPA",
    difficulty: "Easy",
    timeToLearn: "3–4 weeks",
    resources: [
      { name: "CS50P (Harvard Free)", url: "https://cs50.harvard.edu/python" },
      { name: "Python.org Docs", url: "https://docs.python.org/3/tutorial" },
    ],
    description: "Versatile language for scripting, automation, data science and backend. Easy to learn and powerful.",
    tags: ["Beginner Friendly", "Versatile"],
  },
  {
    id: 6,
    name: "Node.js & Express",
    category: "Backend",
    demand: 80,
    trend: "up",
    companies: ["Swiggy", "Razorpay", "Freshworks", "Postman", "Atlassian"],
    avgPackage: "10–28 LPA",
    difficulty: "Medium",
    timeToLearn: "1–2 months",
    resources: [
      { name: "Node.js Official Docs", url: "https://nodejs.org/docs" },
      { name: "The Odin Project", url: "https://theodinproject.com" },
    ],
    description: "Build REST APIs and server-side apps. Pairs perfectly with React for full-stack roles.",
    tags: ["Full Stack", "Startups"],
  },
  {
    id: 7,
    name: "Git & GitHub",
    category: "Tools",
    demand: 95,
    trend: "stable",
    companies: ["Every Company"],
    avgPackage: "Prerequisite",
    difficulty: "Easy",
    timeToLearn: "1–2 weeks",
    resources: [
      { name: "Pro Git Book (Free)", url: "https://git-scm.com/book/en/v2" },
      { name: "GitHub Skills", url: "https://skills.github.com" },
    ],
    description: "Non-negotiable for any developer role. Every interviewer checks your GitHub. Build projects and push them.",
    tags: ["Must Have", "Beginner Friendly"],
  },
  {
    id: 8,
    name: "Operating Systems",
    category: "Core CS",
    demand: 76,
    trend: "stable",
    companies: ["Microsoft", "Google", "Qualcomm", "Samsung", "Intel"],
    avgPackage: "15–40 LPA",
    difficulty: "Hard",
    timeToLearn: "1–2 months",
    resources: [
      { name: "GATE Overflow (OS Notes)", url: "https://gateoverflow.in" },
      { name: "Galvin Book PDF", url: "https://www.os-book.com" },
    ],
    description: "Core subject for interviews. Processes, threads, scheduling, memory management — all asked frequently.",
    tags: ["Core Subject", "Interview Critical"],
  },
  {
    id: 9,
    name: "Computer Networks",
    category: "Core CS",
    demand: 72,
    trend: "stable",
    companies: ["Cisco", "Infosys", "Wipro", "TCS", "HCL"],
    avgPackage: "6–15 LPA",
    difficulty: "Medium",
    timeToLearn: "3–4 weeks",
    resources: [
      { name: "Kurose & Ross Book", url: "https://gaia.cs.umass.edu/kurose_ross" },
      { name: "GeeksForGeeks CN", url: "https://geeksforgeeks.org/computer-network-tutorials" },
    ],
    description: "TCP/IP, OSI model, HTTP, DNS — essential for service-based and network-focused companies.",
    tags: ["Core Subject", "Service Based"],
  },
  {
    id: 10,
    name: "Machine Learning Basics",
    category: "AI/ML",
    demand: 70,
    trend: "up",
    companies: ["Google", "Amazon", "Fractal", "Tiger Analytics", "Mu Sigma"],
    avgPackage: "12–35 LPA",
    difficulty: "Hard",
    timeToLearn: "3–5 months",
    resources: [
      { name: "Andrew Ng ML Course (Coursera)", url: "https://coursera.org/specializations/machine-learning-introduction" },
      { name: "fast.ai", url: "https://fast.ai" },
    ],
    description: "Growing demand in product companies. Learn regression, classification, and model evaluation basics.",
    tags: ["High Growth", "Future Skill"],
  },
  {
    id: 11,
    name: "Docker & Basics of DevOps",
    category: "DevOps",
    demand: 65,
    trend: "up",
    companies: ["Amazon", "Atlassian", "Razorpay", "PhonePe", "Zomato"],
    avgPackage: "14–30 LPA",
    difficulty: "Medium",
    timeToLearn: "3–5 weeks",
    resources: [
      { name: "Docker Official Docs", url: "https://docs.docker.com/get-started" },
      { name: "TechWorld with Nana (YouTube)", url: "https://youtube.com/@TechWorldwithNana" },
    ],
    description: "Containerization is now expected even for dev roles. Learn Docker and basic CI/CD pipelines.",
    tags: ["Growing", "Mid-Level Roles"],
  },
  {
    id: 12,
    name: "Aptitude & Reasoning",
    category: "Soft Skills",
    demand: 92,
    trend: "stable",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "HCL"],
    avgPackage: "6–12 LPA",
    difficulty: "Easy",
    timeToLearn: "2–4 weeks",
    resources: [
      { name: "IndiaBix", url: "https://indiabix.com" },
      { name: "RS Aggarwal Book", url: "https://amazon.in" },
    ],
    description: "First filter in mass hiring drives. You must clear aptitude to get to the tech round.",
    tags: ["Must Have", "Mass Hiring"],
  },
];

const CATEGORIES = ["All", "Core CS", "Frontend", "Backend", "Programming", "Tools", "AI/ML", "DevOps", "Soft Skills"];
const DIFFICULTY_COLORS = {
  Easy: "bg-green-50 text-green-700 border border-green-200",
  Medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Hard: "bg-red-50 text-red-700 border border-red-200",
};
const TAG_COLORS = [
  "bg-blue-50 text-blue-700 border border-blue-200",
  "bg-purple-50 text-purple-700 border border-purple-200",
  "bg-gray-50 text-gray-700 border border-gray-200",
];

export default function TrendingSkills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("demand");
  const [selected, setSelected] = useState(null);

  const filtered = SKILLS
    .filter((s) => activeCategory === "All" || s.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "demand") return b.demand - a.demand;
      if (sortBy === "difficulty") {
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-white transition-colors duration-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Trending Skills
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            What top companies are hiring for — and what you should learn right now
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top 3 Quick Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { rank: "🥇", skill: "DSA", note: "Asked at every product company", color: "bg-yellow-50 border-yellow-200" },
            { rank: "🥈", skill: "Git & GitHub", note: "Non-negotiable prerequisite", color: "bg-gray-50 border-gray-200" },
            { rank: "🥉", skill: "Aptitude", note: "First filter in mass drives", color: "bg-orange-50 border-orange-200" },
          ].map((b) => (
            <div key={b.skill} className={`rounded-2xl border p-4 ${b.color}`}>
              <p className="text-2xl mb-1">{b.rank}</p>
              <p className="font-bold text-gray-900">{b.skill}</p>
              <p className="text-xs text-gray-500 mt-0.5">{b.note}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    activeCategory === c
                      ? "bg-yellow-400 text-gray-900 border border-transparent"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
              >
                <option value="demand">By Demand</option>
                <option value="difficulty">By Difficulty</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              onClick={() => setSelected(skill)}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-yellow-400 transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base truncate">{skill.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{skill.category}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {skill.trend === "up" && <span className="text-green-500 text-xs font-bold">▲</span>}
                  {skill.trend === "stable" && <span className="text-gray-400 text-xs font-bold">→</span>}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[skill.difficulty]}`}>
                    {skill.difficulty}
                  </span>
                </div>
              </div>

              {/* Demand bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-medium">Demand</span>
                  <span className="font-bold text-gray-900">{skill.demand}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.tags.map((tag, i) => (
                  <span key={tag} className={`text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom info */}
              <div className="border-t border-gray-100 pt-4 flex justify-between text-xs text-gray-500">
                <span className="font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {skill.timeToLearn}
                </span>
                <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{skill.avgPackage}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium text-gray-500">No skills found in this category</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">{selected.category}</p>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p className="text-base text-gray-600 mb-6 leading-relaxed">{selected.description}</p>

            <div className="space-y-6">
              <div>
                <p className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">🏢 Hiring Companies</p>
                <div className="flex flex-wrap gap-2">
                  {selected.companies.map((c) => (
                    <span key={c} className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Avg Package</p>
                  <p className="font-bold text-gray-900 text-lg mt-1">{selected.avgPackage}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time to Learn</p>
                  <p className="font-bold text-gray-900 text-lg mt-1">{selected.timeToLearn}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">📚 Learning Resources</p>
                <div className="space-y-3">
                  {selected.resources.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-white border border-gray-200 hover:border-yellow-400 hover:shadow-sm text-gray-700 hover:text-yellow-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all group"
                    >
                      <span>{r.name}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}