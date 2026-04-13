import { Link } from "react-router-dom";

export default function Recruiters() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-50 rounded-full mb-6 border border-yellow-100">
          <svg
            className="w-10 h-10 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <span className="inline-block bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-yellow-200">
          Coming Soon
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Recruiters</h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          We're building dedicated company profiles with past hiring stats,
          interview processes, and package trends.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-500 transition text-sm"
          >
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="bg-white text-gray-700 border border-gray-200 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
