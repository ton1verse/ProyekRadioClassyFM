'use client';

import { useState, useEffect } from 'react';

interface ProgramData {
  name: string;
  listeners: number;
  duration: number;
  classier: string;
}

export default function ProgramChart() {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const mockPrograms: ProgramData[] = [
      { name: 'Morning Show', listeners: 1245, duration: 120, classier: 'John Doe' },
      { name: 'Jazz Night', listeners: 987, duration: 90, classier: 'Sarah Wilson' },
      { name: 'Rock Revolution', listeners: 856, duration: 60, classier: 'Mike Chen' },
      { name: 'News Update', listeners: 723, duration: 30, classier: 'Emma Brown' },
      { name: 'Chill Lounge', listeners: 654, duration: 180, classier: 'Alex Taylor' },
    ];
    setPrograms(mockPrograms);
  }, []);

  const maxListeners = Math.max(...programs.map(p => p.listeners));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Program Performance</h2>
          <p className="text-gray-600 text-sm">Top programs by listener count</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
          className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="space-y-4">
        {programs.map((program, index) => (
          <div key={program.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{program.name}</p>
                <p className="text-sm text-gray-500 truncate">{program.classier}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-32">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{program.listeners.toLocaleString()}</span>
                  <span className="text-gray-400">listeners</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(program.listeners / maxListeners) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{program.duration}min</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Programs: {programs.length}</span>
          <span>Avg Listeners: {Math.round(programs.reduce((sum, p) => sum + p.listeners, 0) / programs.length).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}