import { useNavigate } from "react-router-dom"

export default function CompanyCard({ company}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/companies/${company.id}`)}
      className="cursor-pointer p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
    >
      <img src={company.logo} alt={company.name} className="h-10 mb-2" />
      <h2 className="text-lg font-semibold">{company.name}</h2>
      <p className="text-sm text-gray-500">
        {company.domains.join(", ")}
      </p>
    </div>
  )
}
