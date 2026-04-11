const recent = {
  year: '2024',
  topCompany: 'Google',
  topBranch: 'CSE',
  totalOffers: 320,
};

function RecentSeason() {
  return (
    <div className="px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Placement Season ({recent.year})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">Top Company</p>
          <p className="text-xl font-semibold text-gray-800">{recent.topCompany}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">Top Branch</p>
          <p className="text-xl font-semibold text-gray-800">{recent.topBranch}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">Total Offers</p>
          <p className="text-xl font-semibold text-gray-800">{recent.totalOffers}</p>
        </div>
      </div>
    </div>
  );
}

export default RecentSeason;