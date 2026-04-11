import { useNavigate } from 'react-router-dom';

const recruiters = [
  { id: 1, name: 'Google' },
  { id: 2, name: 'Microsoft' },
  { id: 3, name: 'TCS' },
  { id: 4, name: 'Infosys' },
  { id: 5, name: 'Amazon' },
  { id: 6, name: 'Wipro' },
];

function TopRecruiters() {
  const navigate = useNavigate();

  return (
    <div className="px-8 py-10 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Recruiters</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {recruiters.map(company => (
          <div
            key={company.id}
            onClick={() => navigate(`/companies/${company.id}`)}
            className="cursor-pointer border border-gray-200 bg-white rounded-xl p-4 text-center hover:shadow-md transition"
          >
            <p className="text-gray-700 font-medium text-sm">{company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopRecruiters;