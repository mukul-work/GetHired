import { useNavigate } from "react-router-dom";

import { companies } from "../../data/companies"

function TopRecruiters() {
  const navigate = useNavigate();

  return (
    <div className="px-6 sm:px-10 py-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Top Recruiters</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Companies that hire from KIET every year
            </p>
          </div>
          <button
            onClick={() => navigate("/recruiters")}
            className="text-yellow-600 text-sm font-medium hover:underline hidden sm:block"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {companies.map((company) => (
            <div
              key={company.name}
              className={`cursor-pointer rounded-xl p-3 text-center hover:shadow-md transition border border-transparent hover:border-gray-100 ${company.color}`}
              onClick={() => navigate(`/recruiters/${company.id}`)}
            >
              <p className="font-semibold text-sm">{company.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopRecruiters;
