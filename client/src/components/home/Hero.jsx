import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto text-center px-6 py-16 sm:py-24">
        <div className="inline-block bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase border border-yellow-200 dark:border-yellow-800">
          KIET Deemed to be University
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
          Your Career Starts
          <span className="text-yellow-400"> Here</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          Explore placement records, company data, interview experiences, and
          career insights — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-500 transition shadow-sm"
          >
            View Dashboard
          </button>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
          >
            Read Blogs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
