'use client';

import { Music, Calendar, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PodcastProps {
    podcasts: any[];
    setPodcasts: (podcasts: any[]) => void;
}

export default function Podcast({ podcasts, setPodcasts }: PodcastProps) {
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [displayPodcast, setDisplayPodcast] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (podcasts.length > 0 && !activeCategory) {
            const initialCategory = podcasts[0].category?.nama || "Uncategorized";
            setActiveCategory(initialCategory);
            setDisplayPodcast(podcasts[0]);
        }
    }, [podcasts, activeCategory]);

    const handleCategoryClick = (categoryName: string) => {
        setActiveCategory(categoryName);
        const firstInCat = podcasts.find(p => (p.category?.nama || "Uncategorized") === categoryName);
        if (firstInCat) {
            setDisplayPodcast(firstInCat);
            setIsPlaying(false);
        }
    };

    const currentCategoryPodcasts = podcasts.filter(p => (p.category?.nama || "Uncategorized") === activeCategory);

    const recordListen = async (podcastId: number) => {
        try {
            await fetch('/api/analytics/listen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ podcastId })
            });
        } catch (error) {
            console.error('Failed to record listen:', error);
        }
    };

    const mainPodcast = (displayPodcast && (displayPodcast.category?.nama || "Uncategorized") === activeCategory)
        ? displayPodcast
        : currentCategoryPodcasts[0];

    return (
        <section id="podcast" className="py-20 container mx-auto px-6">
            <div className="text-center mb-12">
                <div className="inline-block relative">
                    <h2 className="text-7xl font-bold text-[#001A3A]">Podcast</h2>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-[#001A3A] rounded-full"></div>
                </div>
            </div>

            {/* Podcast Categories */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
                <a
                    href="https://open.spotify.com/show/5Mcc1Xick5jqoXu5kTBZAV?si=546a26313fd747bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1DB954] w-14 h-14 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg flex items-center justify-center group"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                        alt="Spotify"
                        className="w-8 h-8 filter brightness-0 invert"
                    />
                </a>

                {podcasts.length > 0 ? (
                    <>
                        {/* Categories List */}
                        {Array.from(new Set(podcasts.map(p => p.category?.nama || "Uncategorized"))).slice(0, 3).map((kategori: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleCategoryClick(kategori)}
                                className={`${activeCategory === kategori ? 'bg-[#1DB954] text-white scale-105' : 'bg-white border-2 border-gray-200 text-gray-700 hover:scale-105 hover:border-[#1DB954] hover:text-[#1DB954]'} px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 transform`}
                            >
                                {kategori}
                            </button>
                        ))}
                        {/* Custom View More Button */}
                        <Link href="/podcast" className="inline-flex items-center bg-black rounded-full pl-8 pr-2 py-2 gap-4 hover:scale-105 transition-transform duration-300 group">
                            <span className="text-[#1DB954] font-bold text-lg group-hover:text-white transition-colors duration-300">View More</span>
                            <div className="bg-[#1DB954] w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                                <ArrowRight className="text-black" size={20} strokeWidth={2.5} />
                            </div>
                        </Link>
                    </>
                ) : (
                    <>
                        <button className="bg-[#1DB954] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300">
                            Parliament Talk
                        </button>
                        <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:scale-105 hover:border-[#1DB954] hover:text-[#1DB954] transition-all duration-300">
                            Karta KaJe
                        </button>
                        <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:scale-105 hover:border-[#1DB954] hover:text-[#1DB954] transition-all duration-300">
                            Scale Up
                        </button>
                        <Link href="/podcast" className="inline-flex items-center bg-black rounded-full pl-8 pr-2 py-2 gap-4 hover:scale-105 transition-transform duration-300 group">
                            <span className="text-[#1DB954] font-bold text-lg group-hover:text-white transition-colors duration-300">View More</span>
                            <div className="bg-[#1DB954] w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                                <ArrowRight className="text-black" size={20} strokeWidth={2.5} />
                            </div>
                        </Link>
                    </>
                )}
            </div>

            {/* Main Podcast Display */}
            {mainPodcast ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* Left: Podcasts from Same Category (List view) */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#001A3A] rounded-3xl overflow-hidden shadow-2xl p-6 h-full">
                            <h3 className="text-white font-bold text-xl mb-6 pl-2">
                                More from {activeCategory || "Uncategorized"}
                            </h3>

                            <div className="space-y-4">
                                {currentCategoryPodcasts
                                    .slice(0, 4)
                                    .map((podcast) => (
                                        <div
                                            key={podcast.id}
                                            className={`flex items-center gap-4 p-4 rounded-xl transition cursor-pointer group ${mainPodcast.id === podcast.id ? 'bg-white/10' : 'hover:bg-white/5 hover:translate-x-2'}`}
                                            onClick={() => {
                                                setDisplayPodcast(podcast);
                                                setIsPlaying(false);
                                            }}
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                {podcast.poster ? (
                                                    <img
                                                        src={podcast.poster}
                                                        alt={podcast.judul}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-[#1DB954]/20 to-[#001A3A] flex items-center justify-center">
                                                        <Music className="text-white/50" size={20} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-bold truncate text-sm ${mainPodcast.id === podcast.id ? 'text-white' : 'text-white/80'} group-hover:text-white transition-colors`}>{podcast.judul}</h4>
                                                <p className="text-white/60 text-xs truncate mt-1">
                                                    {podcast.classier?.nama || "Unknown Host"}
                                                </p>
                                            </div>

                                            {mainPodcast.id === podcast.id && (
                                                <Play className="text-[#1DB954] fill-[#1DB954]" size={20} />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Main Podcast Player Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#001A3A] rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col p-8 md:p-10 relative">
                            {/* Header Info */}
                            <div className="mb-8">
                                <span className="bg-[#1DB954] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-4">
                                    {mainPodcast.category?.nama || "Podcast"}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                                    {mainPodcast.judul}
                                </h3>
                                <div className="flex items-center gap-3 text-white/60 text-sm">
                                    <Calendar size={14} />
                                    <span>
                                        {mainPodcast.tanggal
                                            ? new Date(mainPodcast.tanggal).toLocaleDateString('en-US', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric'
                                            })
                                            : mainPodcast.createdAt
                                                ? new Date(mainPodcast.createdAt).toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    year: 'numeric'
                                                })
                                                : 'Recent'}
                                    </span>
                                    <span>•</span>
                                    <span>{mainPodcast.classier?.nama || "Unknown Host"}</span>
                                </div>
                            </div>

                            {/* Main Player Card / Embed */}
                            <div className="mb-8 bg-[#0A2B5A] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative group">
                                {isPlaying ? (
                                    <>
                                        {mainPodcast.link ? (
                                            <>
                                                {/* Helper to determining embed type */}
                                                {(() => {
                                                    const link = mainPodcast.link;

                                                    if (link.includes('<iframe') || link.includes('<script')) {
                                                        return (
                                                            <div
                                                                dangerouslySetInnerHTML={{ __html: link }}
                                                                className="w-full [&>iframe]:w-full [&>iframe]:rounded-xl"
                                                            />
                                                        );
                                                    }

                                                    // Spotify URL
                                                    if (link.includes('spotify.com')) {
                                                        const spotifyId = link.match(/spotify\.com\/(?:episode|show)\/([a-zA-Z0-9]+)/)?.[1];
                                                        if (spotifyId) {
                                                            return (
                                                                <iframe
                                                                    src={`https://open.spotify.com/embed/episode/${spotifyId}?theme=0`}
                                                                    width="100%"
                                                                    height="232"
                                                                    frameBorder="0"
                                                                    allowTransparency={true}
                                                                    allow="encrypted-media"
                                                                    className="w-full bg-[#0A2B5A]"
                                                                />
                                                            );
                                                        }
                                                    }

                                                    return (
                                                        <iframe
                                                            src={link}
                                                            className="w-full h-[232px] border-0"
                                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                            loading="lazy"
                                                        />
                                                    );
                                                })()}
                                            </>
                                        ) : (
                                            <div className="p-8 flex items-center gap-6">
                                                <div className="w-32 h-32 bg-black/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                    <Music className="text-white/20" size={40} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-xl mb-2">{mainPodcast.judul}</h4>
                                                    <p className="text-[#1DB954] text-sm font-medium">Preview Mode</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Click to Play Overlay
                                    <div
                                        onClick={() => {
                                            setIsPlaying(true);
                                            recordListen(mainPodcast.id);
                                        }}
                                        className="w-full h-[232px] relative cursor-pointer group bg-cover bg-center"
                                        style={{ backgroundImage: `url(${mainPodcast.poster || '/images/default-podcast.jpg'})` }}
                                    >
                                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                <Play className="text-black ml-1" size={32} fill="black" />
                                            </div>
                                            <p className="text-white font-bold mt-4 text-lg">Putar Episode Ini</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="text-white font-bold text-lg mb-2">Description</h4>
                                <p className="text-white/80 leading-relaxed text-sm md:text-base">
                                    {mainPodcast.deskripsi || "No description available for this podcast."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-100 rounded-3xl">
                    <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Podcasts Available</h3>
                    <p className="text-gray-500">Check back later for new episodes!</p>
                </div>
            )}
        </section>
    );
}
