// client/src/pages/PlacementCalendar.jsx
// NEW FEATURE: Placement Calendar — upcoming drives, deadlines, PPTs
import { useState } from "react";

const EVENTS = [
  {
    id: 1,
    company: "Google",
    type: "Drive",
    date: "2025-04-22",
    time: "10:00 AM",
    venue: "Seminar Hall A",
    branches: ["CSE", "IT"],
    minCGPA: 8.0,
    description: "Full-time SWE roles. Bring updated resume and ID card.",
    tag: "dream",
  },
  {
    id: 2,
    company: "Amazon",
    type: "Online Test",
    date: "2025-04-25",
    time: "2:00 PM",
    venue: "Computer Lab 3",
    branches: ["CSE", "IT", "ECE"],
    minCGPA: 7.5,
    description: "Aptitude + DSA. 90 minutes. No calculator allowed.",
    tag: "dream",
  },
  {
    id: 3,
    company: "TCS",
    type: "PPT",
    date: "2025-04-28",
    time: "11:00 AM",
    venue: "Auditorium",
    branches: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
    minCGPA: 6.0,
    description: "Pre-placement talk. Attendance mandatory for applicants.",
    tag: "mass",
  },
  {
    id: 4,
    company: "Microsoft",
    type: "Drive",
    date: "2025-05-02",
    time: "9:00 AM",
    venue: "Seminar Hall B",
    branches: ["CSE", "IT"],
    minCGPA: 8.5,
    description: "SDE-I roles. 3 rounds: DSA, Design, HR.",
    tag: "dream",
  },
  {
    id: 5,
    company: "Infosys",
    type: "Drive",
    date: "2025-05-05",
    time: "10:00 AM",
    venue: "Placement Cell",
    branches: ["CSE", "IT", "ECE", "ME"],
    minCGPA: 6.5,
    description: "Systems Engineer role. Written + HR rounds.",
    tag: "mass",
  },
  {
    id: 6,
    company: "Adobe",
    type: "Online Test",
    date: "2025-05-08",
    time: "3:00 PM",
    venue: "Computer Lab 1",
    branches: ["CSE", "IT"],
    minCGPA: 8.0,
    description: "Problem solving + aptitude. Duration: 2 hours.",
    tag: "dream",
  },
  {
    id: 7,
    company: "Wipro",
    type: "PPT",
    date: "2025-05-10",
    time: "12:00 PM",
    venue: "Auditorium",
    branches: ["CSE", "IT", "ECE", "ME", "CE"],
    minCGPA: 6.0,
    description: "Company overview + role details. Q&A session included.",
    tag: "mass",
  },
  {
    id: 8,
    company: "Flipkart",
    type: "Drive",
    date: "2025-05-14",
    time: "9:30 AM",
    venue: "Seminar Hall A",
    branches: ["CSE", "IT"],
    minCGPA: 7.5,
    description: "SDE roles. Focus on DSA and system design.",
    tag: "dream",
  },
  {
    id: 9,
    company: "Deloitte",
    type: "Drive",
    date: "2025-05-18",
    time: "10:00 AM",
    venue: "Placement Cell",
    branches: ["CSE", "IT", "ECE", "ME"],
    minCGPA: 6.5,
    description: "Analyst + tech roles. Group discussion round included.",
    tag: "normal",
  },
  {
    id: 10,
    company: "Goldman Sachs",
    type: "Online Test",
    date: "2025-05-20",
    time: "2:00 PM",
    venue: "Computer Lab 2",
    branches: ["CSE", "IT"],
    minCGPA: 8.0,
    description: "Quant + coding test. 3 sections. 120 mins total.",
    tag: "dream",
  },
  {
    id: 11,
    company: "Accenture",
    type: "Drive",
    date: "2025-05-23",
    time: "9:00 AM",
    venue: "Auditorium",
    branches: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
    minCGPA: 6.0,
    description: "Mass hiring drive. Associate Software Engineer role.",
    tag: "mass",
  },
  {
    id: 12,
    company: "Cognizant",
    type: "PPT",
    date: "2025-05-26",
    time: "11:00 AM",
    venue: "Seminar Hall B",
    branches: ["CSE", "IT", "ECE"],
    minCGPA: 6.5,
    description: "Programmer Analyst role. Off-campus details shared.",
    tag: "normal",
  },
];

const TYPE_COLORS = {
  Drive: "bg-green-50 text-green-700 border border-green-200",
  "Online Test": "bg-blue-50 text-blue-700 border border-blue-200",
  PPT: "bg-purple-50 text-purple-700 border border-purple-200",
};

const TAG_STYLES = {
  dream:
    "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/40",
  mass: "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700",
  normal: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
};

const TAG_BADGE = {
  dream:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
  mass: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
  normal:
    "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(dateStr);
  const diff = Math.ceil((event - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function PlacementCalendar() {
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [selected, setSelected] = useState(null);

  const branches = ["All", "CSE", "IT", "ECE", "ME", "CE", "EEE"];
  const types = ["All", "Drive", "Online Test", "PPT"];
  const tags = ["All", "dream", "mass", "normal"];

  const filtered = EVENTS.filter((e) => {
    if (filterBranch !== "All" && !e.branches.includes(filterBranch))
      return false;
    if (filterType !== "All" && e.type !== filterType) return false;
    if (filterTag !== "All" && e.tag !== filterTag) return false;
    return true;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = filtered.filter((e) => daysLeft(e.date) >= 0);
  const past = filtered.filter((e) => daysLeft(e.date) < 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Placement Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Upcoming company drives, online tests & pre-placement talks
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Events",
              value: EVENTS.length,
              color: "text-gray-900",
              icon: "🗓️",
            },
            {
              label: "Drives",
              value: EVENTS.filter((e) => e.type === "Drive").length,
              color: "text-green-600",
              icon: "🚀",
            },
            {
              label: "Online Tests",
              value: EVENTS.filter((e) => e.type === "Online Test").length,
              color: "text-blue-600",
              icon: "💻",
            },
            {
              label: "PPTs",
              value: EVENTS.filter((e) => e.type === "PPT").length,
              color: "text-purple-600",
              icon: "🎤",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {s.label}
                </p>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Branch
              </p>
              <div className="flex flex-wrap gap-2">
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilterBranch(b)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      filterBranch === b
                        ? "bg-yellow-400 text-gray-900 border border-transparent"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Type
              </p>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      filterType === t
                        ? "bg-yellow-400 text-gray-900 border border-transparent"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTag(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors capitalize ${
                      filterTag === t
                        ? "bg-yellow-400 text-gray-900 border border-transparent"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t === "dream"
                      ? "⭐ Dream"
                      : t === "mass"
                        ? "👥 Mass"
                        : t === "normal"
                          ? "🏢 Normal"
                          : "All"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📅 Upcoming ({upcoming.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcoming.map((event) => {
                const days = daysLeft(event.date);
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelected(event)}
                    className={`rounded-2xl border p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-200 ${TAG_STYLES[event.tag]}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {event.company}
                        </p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.venue}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full ${TAG_BADGE[event.tag]}`}
                      >
                        {event.tag === "dream"
                          ? "⭐ Dream"
                          : event.tag === "mass"
                            ? "👥 Mass"
                            : "🏢 Normal"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[event.type]}`}
                      >
                        {event.type}
                      </span>
                      {event.branches.map((b) => (
                        <span
                          key={b}
                          className="text-[10px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full uppercase font-bold tracking-wide"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          {formatDate(event.date)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-0.5">
                          {event.time}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                          days <= 3
                            ? "bg-red-50 text-red-700 border-red-200"
                            : days <= 7
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {days === 0 ? "Today!" : `${days}d left`}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Min CGPA
                      </p>
                      <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-md">
                        {event.minCGPA}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
              ✅ Past Events ({past.length})
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Branches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {past.map((e) => (
                      <tr
                        key={e.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          {e.company}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[e.type]}`}
                          >
                            {e.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                          {formatDate(e.date)}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                          {e.branches.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium text-gray-500 dark:text-gray-400">
              No events match your filters
            </p>
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
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selected.company}
                </h3>
                <span
                  className={`text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full mt-2 inline-block ${TYPE_COLORS[selected.type]}`}
                >
                  {selected.type}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-5">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Date & Time
                </span>
                <div className="text-right">
                  <span className="block font-bold text-gray-900 dark:text-white">
                    {formatDate(selected.date)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selected.time}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Venue
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selected.venue}
                </span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Min CGPA
                </span>
                <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-md">
                  {selected.minCGPA}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
                Eligible Branches
              </span>
              <div className="flex flex-wrap gap-2">
                {selected.branches.map((b) => (
                  <span
                    key={b}
                    className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold px-3 py-1.5 rounded-lg"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
                Description
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {selected.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
