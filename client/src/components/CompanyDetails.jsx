import {
  FaUsers,
  FaBriefcase,
  FaBrain,
  FaMapMarkerAlt,
  FaChartLine,
  FaTrophy,
  FaBook,
} from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { companies } from "../data/companies";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find(c => c.id === Number(id));
  const stats = [
    {
      label: "Students Placed",
      value: company.studentsPlaced,
      icon: FaUsers,
    },
    {
      label: "Offers",
      value: company.offers,
      icon: FaBriefcase,
    },
    {
      label: "Domains",
      value: company.domains.join(", "),
      icon: FaBrain,
    },
    {
      label: "Locations",
      value: company.locations.join(", "),
      icon: FaMapMarkerAlt,
    },
    {
      label: "Avg Package",
      value: company.avgPackage,
      icon: FaChartLine,
    },
    {
      label: "Highest Package",
      value: company.highestPackage,
      icon: FaTrophy,
    },
    {
      label: "Topics Asked",
      value: company.topics.join(", "),
      icon: FaBook,
    },
  ]

  return (
    <div className="p-6">
      <button onClick={() => navigate('/companies')} className="mb-4 text-blue-500">
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={company.logo}
          alt={company.name}
          className="h-12"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/100?text=Logo"
          }}
        />
        {company.nameNeeded ? (
          <h1 className="text-3xl font-bold">{company.name}</h1>
        ) : null}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon

          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4"
            >
              <Icon size={28} className="text-blue-500" />

              <div>
                <p className="text-xl font-semibold">{item.value}</p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>


      {/* Difficulty */}
      <div className="mt-6">
        <span className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-medium">
          Difficulty: {company.difficulty}
        </span>
      </div>
      {/* Previous Years Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Previous Years Data</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Year</th>
                <th className="p-3">Students</th>
                <th className="p-3">Offers</th>
                <th className="p-3">Avg Package</th>
                <th className="p-3">Highest Package</th>
              </tr>
            </thead>

            <tbody>
              {company.history.map((row, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{row.year}</td>
                  <td className="p-3">{row.students}</td>
                  <td className="p-3">{row.offers}</td>
                  <td className="p-3">{row.avg}</td>
                  <td className="p-3">{row.highest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}