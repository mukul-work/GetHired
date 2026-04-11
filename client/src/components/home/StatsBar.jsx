const stats = [
  { label: 'Students Placed', value: '1,200+' },
  { label: 'Companies Visited', value: '80+' },
  { label: 'Highest Package', value: '42 LPA' },
  { label: 'Average Package', value: '8.5 LPA' },
];

function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-10 bg-gray-50">
      {stats.map(stat => (
        <div key={stat.label} className="text-center">
          <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
          <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;