import { useState } from "react"
import { companies } from "../data/companies"
import CompanyGrid from "../components/CompanyGrid"
import CompanyDetails from "../components/CompanyDetails"
import CompanyCard from "../components/CompanyCard"

export default function CompanyHome() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {companies.map((c) => (
          <CompanyCard key={c.id} company={c} />
        ))}
      </div>
    </div>
  )
}