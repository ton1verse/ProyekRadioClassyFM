interface StatsCardProps {
  title: string;
  value: string;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm font-medium px-2 py-1 rounded-full
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
        </p>
      </div>
    </div>
  );
}