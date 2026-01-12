
'use client';

import { useEffect, useState } from 'react';
import { Music, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function MusicRankingWidget() {
    const [musiks, setMusiks] = useState<any[]>([]);

    useEffect(() => {
        const fetchMusiks = async () => {
            try {
                const res = await fetch('/api/musiks');
                if (res.ok) {
                    const data = await res.json();
                    const ranked = data
                        .filter((m: any) => m.peringkat !== null && m.peringkat !== undefined)
                        .sort((a: any, b: any) => a.peringkat - b.peringkat)
                        .slice(0, 5);
                    setMusiks(ranked);
                }
            } catch (error) {
                console.error('Failed to fetch music ranking', error);
            }
        };
        fetchMusiks();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Peringkat Musik</h2>
                <Music size={20} className="text-[#000000]" />
            </div>

            <div className="space-y-4 flex-1">
                {musiks.map((musik) => (
                    <div key={musik.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                        <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 mr-4 bg-gray-200 rounded-full shrink-0">
                            {musik.peringkat}
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                            {musik.foto ? (
                                <img src={musik.foto} alt={musik.judul} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                    <Music size={16} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate text-sm">{musik.judul}</h3>
                            <p className="text-xs text-gray-500 truncate">{musik.penyanyi}</p>
                        </div>
                        <div className="ml-2">
                            {musik.trend === 'up' && <ArrowUp size={16} className="text-green-500" />}
                            {musik.trend === 'down' && <ArrowDown size={16} className="text-red-500" />}
                            {(!musik.trend || musik.trend === 'same') && <Minus size={16} className="text-gray-400" />}
                        </div>
                    </div>
                ))}
                {musiks.length === 0 && (
                    <p className="text-gray-500 text-center py-4 text-sm">Belum ada ranking musik.</p>
                )}
            </div>
        </div>
    );
}
