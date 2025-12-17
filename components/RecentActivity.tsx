const activities = [
  { action: '3 Episode baru rilis!', time: 'Hari ini', icon: '✅' },
  { action: 'AOWKAOWKOAK', time: 'Kemarin', icon: '✅' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Aktivitas Podcast terbaru</h2>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
            <div className="text-sm mr-3 flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 text-center text-primary-600 hover:text-primary-700 text-sm font-semibold py-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200">
        View All Activity
      </button>
    </div>
  );
}