'use client';

export default function RevenueChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const revenueData = [65, 78, 82, 79, 86, 94, 105];
  
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Listener Growth</h2>
        <p className="text-gray-600 text-sm mt-1">Monthly listener statistics across all stations</p>
      </div>
      
      <div className="flex items-end justify-between h-48 px-4">
        {revenueData.map((revenue, index) => (
          <div key={months[index]} className="flex flex-col items-center flex-1 mx-1">
            <div
              className="bg-gradient-to-t from-primary-500 to-primary-600 rounded-t-lg w-full max-w-12 transition-all duration-300 hover:from-primary-600 hover:to-primary-700 cursor-pointer"
              style={{ height: `${(revenue / maxRevenue) * 100}%` }}
            />
            <span className="text-xs text-gray-600 mt-3 font-medium">{months[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}