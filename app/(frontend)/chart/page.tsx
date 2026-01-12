'use client';

import { useState, useEffect } from 'react';
import { Headphones } from 'lucide-react';
import Link from 'next/link';

export default function ChartPage() {
    const [songs, setSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/musiks')
            .then((res) => res.json())
            .then((data) => {
                const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => {
                    if (a.peringkat && b.peringkat) return a.peringkat - b.peringkat;
                    if (a.peringkat) return -1;
                    if (b.peringkat) return 1;
                    return a.id - b.id;
                }) : [];
                setSongs(sorted);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch songs', err);
                setLoading(false);
            });
    }, []);

    const topThree = songs.slice(0, 3);
    const restSongs = songs.slice(3);

    const podiumOrder = [];
    if (topThree.length > 0) {
        if (topThree[1]) podiumOrder.push(topThree[1]);
        podiumOrder.push(topThree[0]);
        if (topThree[2]) podiumOrder.push(topThree[2]);
    }

    return (
        <section className="py-20 container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
                <div className="w-full md:w-full">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">
                        <img
                            src="/images/chart-header.jpg"
                            alt="TOP 40 CHARTS"
                            className="w-full h-[200px] md:h-[300px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001A3A] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-12">
                        </div>
                    </div>

                    {/* Top 3 Podium Layout */}
                    {topThree.length > 0 && (
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end justify-center mb-16 max-w-5xl mx-auto">
                            {topThree.map((song, idx) => {
                                const rank = idx + 1;
                                const isRank1 = rank === 1;
                                const desktopOrderClass = isRank1 ? 'md:order-2' : rank === 2 ? 'md:order-1' : 'md:order-3';

                                return (
                                    <div
                                        key={song.id}
                                        className={`relative group ${isRank1 ? 'md:-mt-12 z-10' : ''} ${desktopOrderClass}`}
                                    >
                                        <div className={`rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 
                                            ${isRank1 ? 'bg-gradient-to-b from-[#001A3A] to-[#A12227]' : 'bg-gradient-to-b from-[#A12227] to-[#001A3A]'}`}>
                                            {/* Rank Badge */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className={`w-auto px-3 h-10 md:h-12 rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-lg gap-1
                                                    ${rank === 1 ? 'bg-yellow-400 text-black' :
                                                        rank === 2 ? 'bg-gray-300 text-black' :
                                                            'bg-orange-700 text-white'}`}>
                                                    #{rank}
                                                    {song.trend === 'up' && <span className="text-sm">▲</span>}
                                                    {song.trend === 'down' && <span className="text-sm">▼</span>}
                                                    {(song.trend === 'same' || !song.trend) && <span className="text-sm">-</span>}
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className={`relative rounded-2xl overflow-hidden shadow-lg mb-6 mx-auto ${isRank1 ? 'aspect-square w-full' : 'aspect-square w-4/5'}`}>
                                                {song.foto ? (
                                                    <img src={song.foto} alt={song.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/20">
                                                        <span className="text-4xl font-bold">#{rank}</span>
                                                    </div>
                                                )}
                                                {/* Play Button Overlay */}
                                                <Link href={`/play/${song.id}`} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-[#A12227] border-b-[8px] border-b-transparent ml-1"></div>
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Details */}
                                            <div className="text-center">
                                                <h3 className={`font-bold text-white mb-1 truncate px-2 ${isRank1 ? 'text-2xl' : 'text-lg'}`}>
                                                    {song.judul}
                                                </h3>
                                                <p className="text-white/60 text-sm font-medium truncate px-2">
                                                    {song.penyanyi}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Recent List (4-40) Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {restSongs.map((song: any, idx: number) => (
                            <div key={song.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col relative overflow-hidden">
                                {/* Rank Badge - Top Left */}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="bg-[#001A3A]/90 backdrop-blur-sm group-hover:bg-[#A12227] transition-colors duration-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/10 flex items-center gap-1">
                                        #{idx + 4}
                                        {song.trend === 'up' && <span className="text-green-400">▲</span>}
                                        {song.trend === 'down' && <span className="text-red-400">▼</span>}
                                        {(song.trend === 'same' || !song.trend) && <span className="text-gray-400">-</span>}
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="aspect-square rounded-xl overflow-hidden mb-4 relative bg-gray-100">
                                    {song.foto ? (
                                        <img
                                            src={song.foto}
                                            alt={song.judul}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                            </svg>
                                        </div>
                                    )}


                                </div>

                                {/* Content Section */}
                                <div className="flex-1 flex flex-col">
                                    <h4 className="font-bold text-[#001A3A] text-base leading-tight mb-1 line-clamp-2 group-hover:text-[#A12227] transition-colors">
                                        {song.judul}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium mb-2 line-clamp-1">
                                        {song.penyanyi}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
                                        <div className="flex items-center gap-2">
                                        </div>
                                        <Link href={`/play/${song.id}`}>
                                            <button className="text-[10px] font-bold bg-[#001A3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#A12227] transition-colors">
                                                Play Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading && (
                        <div className="text-center py-20 text-gray-500">Loading charts...</div>
                    )}
                </div>
            </div>
        </section>
    );
}
