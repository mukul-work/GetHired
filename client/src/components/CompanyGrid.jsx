import CompanyCard from "./CompanyCard"

export default function CompanyGrid({ companies, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {companies.map((c) => (
        <CompanyCard key={c.id} company={c} onClick={onSelect} />
      ))}
    </div>
  )
}