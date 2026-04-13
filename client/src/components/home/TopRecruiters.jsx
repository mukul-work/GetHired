import { useNavigate } from "react-router-dom";

const recruiters = [
  { name: "Google", color: "bg-yellow-50 text-yellow-700" },
  { name: "Microsoft", color: "bg-indigo-50 text-indigo-700" },
  { name: "Amazon", color: "bg-yellow-50 text-yellow-700" },
  { name: "TCS", color: "bg-green-50 text-green-700" },
  { name: "Infosys", color: "bg-purple-50 text-purple-700" },
  { name: "Wipro", color: "bg-teal-50 text-teal-700" },
  { name: "Flipkart", color: "bg-orange-50 text-orange-700" },
  { name: "Accenture", color: "bg-pink-50 text-pink-700" },
  { name: "Goldman Sachs", color: "bg-sky-50 text-sky-700" },
  { name: "Deloitte", color: "bg-lime-50 text-lime-700" },
  { name: "Cognizant", color: "bg-rose-50 text-rose-700" },
  { name: "Adobe", color: "bg-red-50 text-red-700" },
];

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
          {recruiters.map((company) => (
            <div
              key={company.name}
              className={`cursor-pointer rounded-xl p-3 text-center hover:shadow-md transition border border-transparent hover:border-gray-100 ${company.color}`}
              onClick={() => navigate("/recruiters")}
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
