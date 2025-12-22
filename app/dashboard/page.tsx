'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import RevenueChart from '@/components/RevenueChart';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { ArrowRight, Radio } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        podcastCount: 0,
        programCount: 0,
        musikCount: 0,
        classierCount: 0
    });

    const [recentPrograms, setRecentPrograms] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                if (response.ok) {
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        const fetchRecentPrograms = async () => {
            try {
                const response = await fetch('/api/programs');
                const data = await response.json();
                if (response.ok && Array.isArray(data)) {
                    setRecentPrograms(data.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching recent programs:', error);
            }
        };

        fetchStats();
        fetchRecentPrograms();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Jumlah Episode Podcast"
                            value={stats.podcastCount.toString()}
                        />
                        <StatsCard
                            title="Jumlah Classier"
                            value={stats.classierCount.toString()}
                        />
                        <StatsCard
                            title="Jumlah Program"
                            value={stats.programCount.toString()}
                        />
                        <StatsCard
                            title="Jumlah Musik"
                            value={stats.musikCount.toString()}
                        />
                    </div>

                    {/* Charts & Quick Access Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <RevenueChart />
                        </div>

                        {/* Quick Access Programs (Replacing Recent Activity) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Program Terbaru</h2>
                                <Link href="/programs" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                    Lihat Semua <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentPrograms.map((program) => (
                                    <div key={program.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 shrink-0">
                                            {program.poster ? (
                                                <img src={program.poster} alt={program.nama_program} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <Radio size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{program.nama_program}</h3>
                                            <p className="text-sm text-gray-500 truncate">{program.deskripsi}</p>
                                        </div>
                                        <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(program.jadwal).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {recentPrograms.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">Belum ada program.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
