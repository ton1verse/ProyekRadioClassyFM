'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Music, Info, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { getEmbedInfo } from '@/lib/youtube';

export default function PlayPage() {
    const params = useParams();
    const router = useRouter();
    const [song, setSong] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            fetch(`/api/musiks/${params.id}`)
                .then(async (res) => {
                    if (!res.ok) throw new Error('Failed to fetch song');
                    return res.json();
                })
                .then((data) => {
                    setSong(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Song not found');
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#001A3A] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#A12227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading Music...</p>
                </div>
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className="min-h-screen bg-[#001A3A] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{error || 'Song Not Found'}</h2>
                    <Link href="/chart" className="text-[#A12227] hover:underline hover:text-white transition-colors">
                        &larr; Back to Charts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-white text-gray-900 py-12 relative font-sans">
            <div className="container mx-auto px-6 relative z-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#A12227] transition-colors mb-8 group font-medium"
                >
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="relative flex flex-col lg:block">
                    {/* Left Column: Header, Player, info (Drive Height) */}
                    <div className="lg:w-[58%] space-y-8 mb-12 lg:mb-0">
                        {/* Header & Cover Image */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {song.foto && (
                                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                                    <img
                                        src={song.foto}
                                        alt={song.judul}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <span className="inline-block bg-[#A12227] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase shadow-sm">
                                    Now Playing
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight text-[#001A3A]">{song.judul}</h1>
                                <p className="text-xl text-[#001A3A] font-medium">{song.penyanyi}</p>
                            </div>
                        </div>

                        {/* Embed Player */}
                        {(() => {
                            if (!song.link) {
                                return (
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                                        <Music size={48} className="mb-4 opacity-50" />
                                        <p>Song content not available</p>
                                    </div>
                                );
                            }

                            const { url: embedUrl, type } = getEmbedInfo(song.link);
                            const isSpotify = type === 'spotify';

                            if (type === 'unknown' && !embedUrl) {
                                return (
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                                        <Music size={48} className="mb-4 opacity-50" />
                                        <p>Invalid link format</p>
                                    </div>
                                );
                            }

                            return (
                                <div className={`w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 ${isSpotify ? 'h-[352px] bg-transparent border-0 shadow-none' : 'aspect-video bg-black'}`}>
                                    <iframe
                                        src={embedUrl}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        className="w-full h-full"
                                        style={{ borderRadius: isSpotify ? '12px' : '0' }}
                                    />
                                </div>
                            );
                        })()}

                        {/* Description */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4 text-[#A12227] font-bold uppercase tracking-wider text-sm">
                                <Info size={18} /> About this Song
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                {song.deskripsi || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Rank/Trend & Lyrics */}
                    {/* Absolute on Desktop to match Left Column Height */}
                    <div className="lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-[38%] space-y-6 flex flex-col">
                        {/* Rank & Trend Cards */}
                        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Current Rank</p>
                                <div className="text-4xl md:text-5xl font-black text-gray-900">#{song.peringkat || '-'}</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Trend</p>
                                <div className="text-4xl md:text-5xl font-black text-gray-900 flex justify-center items-center gap-2">
                                    {song.trend === 'up' && <span className="text-green-600">▲</span>}
                                    {song.trend === 'down' && <span className="text-red-500">▼</span>}
                                    {(song.trend === 'same' || !song.trend) && <span className="text-gray-400 text-4xl">=</span>}
                                </div>
                            </div>
                        </div>

                        {/* Lyrics Card */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col flex-grow overflow-hidden">
                            <div className="flex items-center gap-2 mb-6 text-[#A12227] font-bold uppercase tracking-wider text-sm border-b border-gray-200 pb-4 w-full justify-center flex-shrink-0">
                                <Mic2 size={18} /> Lyrics
                            </div>
                            <div className="text-center overflow-y-auto pr-2 custom-scrollbar flex-grow">
                                {song.lirik ? (
                                    <pre className="font-sans text-gray-700 leading-loose text-lg whitespace-pre-wrap">
                                        {song.lirik}
                                    </pre>
                                ) : (
                                    <div className="flex items-center justify-center text-gray-400 italic h-full">
                                        Lyrics not available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
