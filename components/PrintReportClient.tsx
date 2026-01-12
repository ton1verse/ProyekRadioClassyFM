
'use client';

import { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import ListenerChart from '@/components/ListenerChart';

export default function PrintReportClient({ podcast, initialListens }: { podcast: any, initialListens: any[] }) {
    const [listens, setListens] = useState(initialListens);
    const [filter, setFilter] = useState({
        range: '7d',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });
    const [isCustom, setIsCustom] = useState(false);

    useState(() => {
    });

    useEffect(() => {
        const fetchFilteredListens = async () => {
            try {
                const params = new URLSearchParams();
                if (isCustom) {
                    params.append('month', filter.month.toString());
                    params.append('year', filter.year.toString());
                } else {
                    params.append('range', filter.range);
                }

                const res = await fetch(`/api/podcasts/${podcast.id}/listens?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setListens(data);
                }
            } catch (error) {
                console.error("Failed to fetch filtered listens", error);
            }
        };

        fetchFilteredListens();
    }, [filter, isCustom, podcast.id]);

    const handleRangeChange = (range: string) => {
        setIsCustom(false);
        setFilter(prev => ({ ...prev, range }));
    };

    const handleCustomDateChange = (type: 'month' | 'year', value: number) => {
        setIsCustom(true);
        setFilter(prev => ({ ...prev, [type]: value }));
    };

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <h1 className="text-xl font-bold">Preview Laporan Podcast</h1>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => handleRangeChange('7d')}
                            className={`px-3 py-1 text-sm rounded-md transition ${!isCustom && filter.range === '7d' ? 'bg-[#001A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            7 Hari
                        </button>
                        <button
                            onClick={() => handleRangeChange('30d')}
                            className={`px-3 py-1 text-sm rounded-md transition ${!isCustom && filter.range === '30d' ? 'bg-[#001A3A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            30 Hari
                        </button>

                        <div className="w-px h-4 bg-gray-300 mx-1"></div>

                        <div className="flex items-center gap-2">
                            <select
                                value={filter.month}
                                onChange={(e) => handleCustomDateChange('month', parseInt(e.target.value))}
                                className={`text-sm px-2 py-1 rounded border-none focus:ring-0 cursor-pointer ${isCustom ? 'font-bold text-[#001A3A]' : 'text-gray-600'}`}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('id-ID', { month: 'short' })}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filter.year}
                                onChange={(e) => handleCustomDateChange('year', parseInt(e.target.value))}
                                className={`text-sm px-2 py-1 rounded border-none focus:ring-0 cursor-pointer ${isCustom ? 'font-bold text-[#001A3A]' : 'text-gray-600'}`}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-[#001A3A] text-white rounded-lg hover:bg-[#001A3A]/80 transition"
                    >
                        <Printer size={16} />
                        Cetak Laporan
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { 
                        margin: 10mm; 
                        zoom: 0.9; 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                    }
                }
            `}</style>

            <div className="max-w-4xl mx-auto print:w-full print:max-w-none">
                <div className="border-b-2 border-gray-800 pb-4 mb-8 print:mb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 text-[#001A3A]">{podcast.judul}</h1>
                        <p className="text-gray-600">Classier: {podcast.classier?.nama} | Kategori: {podcast.category?.nama}</p>
                        <p className="text-sm mt-1 text-gray-500 italic">
                            Periode: {isCustom ? `${new Date(0, filter.month - 1).toLocaleString('id-ID', { month: 'long' })} ${filter.year}` : (filter.range === '7d' ? '7 Hari Terakhir' : '30 Hari Terakhir')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Pendengar (Periode Ini)</p>
                        <p className="text-4xl font-bold text-[#A12227]">{listens.length}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="bg-white rounded-lg">
                        <ListenerChart
                            podcastId={podcast.id}
                            externalFilter={isCustom ? { range: '', month: filter.month.toString(), year: filter.year.toString() } : { range: filter.range }}
                        />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-right text-gray-400 italic print:mt-4">
                    Dicetak pada: {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                </div>
            </div>
        </div>
    );
}
