import { useState } from "react"
import { companies } from "../data/companies"
import CompanyGrid from "../components/CompanyGrid"
import CompanyDetails from "../components/CompanyDetails"

export default function CompanyHome() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="p-6">
      {!selected ? (
        <CompanyGrid companies={companies} onSelect={setSelected} />
      ) : (
        <CompanyDetails
          company={selected}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  )
}