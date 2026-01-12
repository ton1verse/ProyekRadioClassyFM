'use client';

import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

interface ListenerChartProps {
    podcastId?: number;
    externalFilter?: {
        range: string;
        month?: string;
        year?: string;
    };
}

export default function ListenerChart({ podcastId, externalFilter }: ListenerChartProps) {
    const [data, setData] = useState<{ date: string; listens: number }[]>([]);
    const [entityData, setEntityData] = useState<{ id: number; label: string; category: string; count: number }[]>([]);
    const [categoryData, setCategoryData] = useState<{ label: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const [internalRange, setInternalRange] = useState<'today' | '7d' | '30d'>('7d');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);

    const [viewMode, setViewMode] = useState<'growth' | 'entity' | 'category'>('growth');
    const activeRange = externalFilter?.range || internalRange;

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch('/api/podcast-categories');
                if (!res.ok) throw new Error(`Categories API Error: ${res.status}`);
                const data = await res.json();
                setCategories(data);
            } catch (e) {
                console.error("Failed to load categories", e);
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();

                if (externalFilter?.month && externalFilter?.year) {
                    params.append('month', externalFilter.month);
                    params.append('year', externalFilter.year);
                } else {
                    params.append('range', activeRange);
                }

                if (podcastId) {
                    params.append('podcastId', podcastId.toString());
                } else if (selectedCategory) {
                    params.append('categoryId', selectedCategory);
                }

                const res = await fetch(`/api/analytics/stats?${params.toString()}`);

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Stats API Error: ${res.status} ${res.statusText} - ${errText}`);
                }

                const result = await res.json();
                setData(result.chartData);
                setEntityData(result.entityStats || []);
                setCategoryData(result.categoryStats || []);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeRange, selectedCategory, podcastId, externalFilter]);

    const maxListens = Math.max(...data.map(d => d.listens), 1);
    const maxEntityListens = Math.max(...entityData.map(d => d.count), 1);
    const maxCategoryListens = Math.max(...categoryData.map(d => d.count), 1);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full">
            {/* Header & Controls */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#001A3A]">Pertumbuhan Pendengar</h2>
                        <p className="text-gray-500 text-sm">
                            {selectedCategory
                                ? `Statistik Kategori: ${categories.find(c => c.id.toString() === selectedCategory)?.nama || 'Terpilih'}`
                                : 'Analisis statistik pendengar'}
                        </p>
                    </div>
                </div>

                {/* Filters Row - Only show if NO external filter is provided */}
                {!externalFilter && (
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Filter size={16} />
                            <span className="font-semibold">Filter:</span>
                        </div>

                        {/* Range Filter Buttons */}
                        <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                            <button
                                onClick={() => { setInternalRange('today'); setViewMode('category'); }}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${internalRange === 'today' ? 'bg-[#001A3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Hari Ini
                            </button>
                            <button
                                onClick={() => { setInternalRange('7d'); setViewMode('growth'); }}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${internalRange === '7d' ? 'bg-[#001A3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                7 Hari Terakhir
                            </button>
                            <button
                                onClick={() => { setInternalRange('30d'); setViewMode('growth'); }}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${internalRange === '30d' ? 'bg-[#001A3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                30 Hari Terakhir
                            </button>
                        </div>

                        {/* Category Dropdown */}
                        <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#001A3A] focus:outline-none focus:ring-2 focus:ring-[#001A3A]/20 min-w-[150px]"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nama}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="h-80 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Loading data...</span>
                </div>
            ) : (
                <div className="relative h-96 pl-12 pb-8 w-full">
                    {/* Y-Axis Label */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium tracking-wide">
                        Jumlah Pendengar
                    </div>

                    {/* Grid Lines */}
                    <div className="absolute inset-0 pl-12 pb-8 flex flex-col justify-between pointer-events-none w-full">
                        {[100, 50, 0].map((percent) => {
                            let maxVal = maxListens;
                            if (viewMode === 'entity') maxVal = maxEntityListens;
                            if (viewMode === 'category') maxVal = maxCategoryListens;

                            const val = Math.round(maxVal * (percent / 100));
                            return (
                                <div key={percent} className="w-full border-t border-dashed border-gray-200 relative">
                                    <span className="absolute -left-10 -top-2.5 text-xs text-gray-400 w-8 text-right font-medium">
                                        {val}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="overflow-x-auto h-full pb-4 scrollbar-thin scrollbar-thumb-gray-300 ml-4 relative z-10 w-full">
                        <div className="min-w-full h-full flex items-end px-4 pt-8">

                            {/* Time Series Chart */}
                            {viewMode === 'growth' && (
                                <div className="flex items-end justify-between w-full h-full gap-1">
                                    {data.map((item) => (
                                        <div key={item.date} className="flex flex-col items-center flex-1 group relative min-w-[20px] h-full justify-end">
                                            {/* Value on Top (#A12227) - Permanent (removed opacity-0) */}
                                            <div className="text-[#A12227] font-bold text-[10px] mb-1">
                                                {item.listens > 0 ? item.listens : ''}
                                            </div>

                                            <div
                                                className={`w-full max-w-[40px] rounded-t-sm transition-all duration-300 ${item.listens > 0 ? 'bg-[#001A3A] hover:bg-[#001A3A]/80' : 'bg-gray-100'}`}
                                                style={{ height: `${Math.max((item.listens / maxListens) * 85, 2)}%` }}
                                            />
                                            {/* Show date for every odd day to prevent crowding */}
                                            <span className="text-[9px] text-gray-500 mt-2 text-center w-full truncate">
                                                {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                    {data.length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Tidak ada data.</div>
                                    )}
                                </div>
                            )}

                            {/* Category Chart */}
                            {viewMode === 'category' && (
                                <div className="flex items-end justify-start w-full h-full gap-6">
                                    {categoryData.map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center w-24 group relative h-full justify-end">
                                            <div className="text-[#A12227] font-bold text-xs mb-1">
                                                {item.count}
                                            </div>

                                            <div
                                                className="w-full max-w-[60px] rounded-t-sm bg-[#001A3A] hover:bg-[#001A3A]/80 transition-all duration-300"
                                                style={{ height: `${Math.max((item.count / maxCategoryListens) * 85, 2)}%` }}
                                            />
                                            {/* Fixed height container for labels to align bars */}
                                            <div className="h-10 flex items-start justify-center w-full mt-2">
                                                <span className="text-xs text-gray-600 w-full text-center leading-tight px-1 break-words line-clamp-2" title={item.label}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {categoryData.length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data kategori.</div>
                                    )}
                                </div>
                            )}

                            {/* Entity (Episode) Comparison Chart */}
                            {viewMode === 'entity' && (
                                <div className="flex items-end justify-start w-full h-full gap-4">
                                    {entityData.map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center w-20 group relative h-full justify-end">
                                            <div className="text-[#A12227] font-bold text-xs mb-1">
                                                {item.count}
                                            </div>

                                            <div
                                                className="w-full max-w-[50px] rounded-t-sm bg-[#001A3A] hover:bg-[#001A3A]/80 transition-all duration-300"
                                                style={{ height: `${Math.max((item.count / maxEntityListens) * 85, 2)}%` }}
                                            />
                                            <span className="text-[10px] text-gray-500 mt-2 w-full text-center truncate px-1" title={item.label}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                    {entityData.length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data episode.</div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Date Label for Today/Category View */}
                    {viewMode === 'category' && (
                        <div className="w-full text-center mt-4 text-xs font-medium text-gray-500">
                            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
