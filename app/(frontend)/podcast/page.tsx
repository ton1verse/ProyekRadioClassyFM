'use client';

import { ArrowRight, Play, Music, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Classier {
    id: number;
    nama: string;
    foto?: string;
    deskripsi?: string;
}

interface Podcast {
    id: number;
    judul: string;
    poster: string;
    link: string;
    durasi: number;
    deskripsi: string;
    classierId: number;
    classier?: Classier;
    categoryId?: number;
    category?: {
        id: number;
        nama: string;
    };
    createdAt?: string;
    tanggal?: string;
}

export default function PodcastPage() {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [playingPodcastId, setPlayingPodcastId] = useState<number | null>(null);

    const handlePlay = async (id: number) => {
        setIsPlaying(true);
        setPlayingPodcastId(id);

        try {
            await fetch('/api/analytics/listen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ podcastId: id })
            });
        } catch (error) {
            console.error('Failed to record listen:', error);
        }
    };


    useEffect(() => {
        fetch('/api/podcasts')
            .then((res) => res.json())
            .then((data) => {
                setPodcasts(data);
                if (data.length > 0) {
                    setSelectedPodcast(data[0]);
                }
            })
            .catch((err) => console.error('Failed to fetch podcasts', err));

        fetch('/api/podcast-categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Failed to fetch categories', err));

    }, []);

    const filteredPodcasts = selectedCategory === 'All'
        ? podcasts
        : podcasts.filter(p => p.category?.nama?.toLowerCase() === selectedCategory.toLowerCase());

    const activePodcast = (selectedPodcast && (selectedCategory === 'All' || selectedPodcast.category?.nama?.toLowerCase() === selectedCategory.toLowerCase()))
        ? selectedPodcast
        : filteredPodcasts[0] || null;

    return (
        <section className="py-20 container mx-auto px-6">
            <div className="text-center mb-12">
                <div className="inline-block relative">
                    <h1 className="text-5xl font-bold text-[#001A3A]">Podcast</h1>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-[#001A3A] rounded-full"></div>
                </div>
            </div>

            {/* Podcast Categories */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`${selectedCategory === 'All' ? 'bg-[#1DB954] text-white' : 'bg-white border-2 border-gray-200 text-gray-700'} px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition`}
                >
                    All
                </button>
                {categories
                    .map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.nama);
                                const first = podcasts.find(p => p.category?.nama === cat.nama);
                                if (first) setSelectedPodcast(first);
                            }}
                            className={`${selectedCategory === cat.nama ? 'bg-[#1DB954] text-white' : 'bg-white border-2 border-gray-200 text-gray-700'} px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition`}
                        >
                            {cat.nama}
                        </button>
                    ))}
            </div>

            {/* Main Podcast Display */}
            {activePodcast ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* Left: Podcasts List */}
                    <div className="lg:col-span-1 relative">
                        <div className="lg:absolute lg:inset-0">
                            <div className="bg-[#001A3A] rounded-3xl overflow-hidden shadow-2xl p-6 h-full flex flex-col">
                                <h3 className="text-white font-bold text-xl mb-6 flex-shrink-0">
                                    {selectedCategory === 'All' ? 'All Episodes' : `More from ${selectedCategory}`}
                                </h3>

                                <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredPodcasts
                                        .map((podcast) => (
                                            <div
                                                key={podcast.id}
                                                className={`flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition cursor-pointer group ${activePodcast.id === podcast.id ? 'bg-white/10' : ''}`}
                                                onClick={() => setSelectedPodcast(podcast)}
                                            >
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
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
                                                    <h4 className={`font-bold truncate text-sm ${activePodcast.id === podcast.id ? 'text-white' : 'text-white/80'} group-hover:text-white transition-colors`}>{podcast.judul}</h4>
                                                    <p className="text-white/60 text-xs truncate">
                                                        {podcast.classier?.nama || "Unknown Host"}
                                                    </p>
                                                </div>
                                                {activePodcast.id === podcast.id && <Play className="text-[#1DB954]" size={16} fill="currentColor" />}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Main Podcast Player */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#001A3A] rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col min-h-[500px]">
                            <div className="p-8 md:p-10 flex-grow flex flex-col justify-center">
                                {/* Podcast Info */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="inline-block mb-4">
                                            <span className="bg-[#1DB954] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {activePodcast.category?.nama || "Podcast"}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2">
                                            {activePodcast.judul}
                                        </h3>
                                        <div className="flex items-center gap-4 text-white/60 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {activePodcast.tanggal
                                                    ? new Date(activePodcast.tanggal).toLocaleDateString()
                                                    : activePodcast.createdAt
                                                        ? new Date(activePodcast.createdAt).toLocaleDateString()
                                                        : 'Recent'}
                                            </span>
                                            <span>•</span>
                                            <span>{activePodcast.classier?.nama}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Embed Player dari link field */}
                                <div className="mb-8">
                                    {activePodcast.link ? (
                                        <div className="bg-[#0A2B5A] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative group">
                                            {isPlaying && playingPodcastId === activePodcast.id ? (

                                                activePodcast.link.includes('<iframe') || activePodcast.link.includes('<script') ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: activePodcast.link.includes('creators.spotify.com')
                                                                ? activePodcast.link
                                                                    .replace(/width="[^"]*"/g, 'width="100%"')
                                                                    .replace(/height="[^"]*"/g, 'height="152"')
                                                                    .replace(/style="[^"]*"/g, 'style="border-radius:12px"')
                                                                : activePodcast.link
                                                        }}
                                                        className="rounded-xl overflow-hidden [&>iframe]:w-full [&>iframe]:rounded-xl"
                                                    />
                                                ) : (
                                                    (() => {
                                                        const link = activePodcast.link;
                                                        if (link.includes('spotify.com')) {
                                                            const spotifyId = link.match(/spotify\.com\/(?:episode|show)\/([a-zA-Z0-9]+)/)?.[1];
                                                            if (spotifyId) {
                                                                return (
                                                                    <iframe
                                                                        src={`https://open.spotify.com/embed/episode/${spotifyId}?theme=0`}
                                                                        width="100%"
                                                                        height="152"
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
                                                                className="w-full h-64 rounded-xl border-0"
                                                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                                loading="lazy"
                                                            />
                                                        );
                                                    })()
                                                )
                                            ) : (
                                                <div
                                                    onClick={() => handlePlay(activePodcast.id)}
                                                    className="w-full h-[200px] relative cursor-pointer group bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${activePodcast.poster || '/images/default-podcast.jpg'})` }}
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
                                    ) : (
                                        <div className="bg-black/30 rounded-2xl p-8 text-center">
                                            <p className="text-white/70">No player available for this episode.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Podcast Description */}
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-2">Description</h4>
                                    <p className="text-white/80 leading-relaxed text-sm md:text-base">
                                        {activePodcast.deskripsi || "No description available for this podcast."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-100 rounded-3xl">
                    <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Podcasts Found</h3>
                    <p className="text-gray-500">Try selecting a different category.</p>
                </div>
            )}
        </section>
    );
}
