'use client';

import { Music, Calendar, Play, ArrowRight } from 'lucide-react';

interface PodcastProps {
    podcasts: any[];
    setPodcasts: (podcasts: any[]) => void;
}

export default function Podcast({ podcasts, setPodcasts }: PodcastProps) {
    return (
        <section id="podcast" className="py-20 container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 font-bold text-[#001A3A]">Podcast</h2>

            {/* Podcast Categories - Dinamis dari data */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {podcasts.length > 0 ? (
                    <>
                        {/* Ambil kategori unik dari podcast (dari relasi category) */}
                        {Array.from(new Set(podcasts.map(p => p.category?.nama || "Uncategorized"))).slice(0, 3).map((kategori: any, index: number) => (
                            <button
                                key={index}
                                className={`${index === 0 ? 'bg-[#1DB954] text-white' : 'bg-white border-2 border-gray-200 text-gray-700'} px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition`}
                            >
                                {kategori}
                            </button>
                        ))}
                        <button className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 hover:bg-gray-800 transition">
                            View More <ArrowRight size={18} />
                        </button>
                    </>
                ) : (
                    // Default buttons jika belum ada data
                    <>
                        <button className="bg-[#1DB954] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-600 transition">
                            Parliament Talk
                        </button>
                        <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition">
                            Karta KaJe
                        </button>
                        <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition">
                            Scale Up
                        </button>
                        <button className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 hover:bg-gray-800 transition">
                            View More <ArrowRight size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Main Podcast Display */}
            {podcasts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* Left: Podcasts from Same Category (3 thumbnails) */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-[#001A3A] to-[#0A2B5A] rounded-3xl overflow-hidden shadow-2xl p-6">
                            <h3 className="text-white font-bold text-xl mb-6">
                                More from {podcasts[0].category?.nama || "Uncategorized"}
                            </h3>

                            <div className="space-y-6">
                                {/* Ambil 3 podcast dari kategori yang sama (exclude yang sedang diputar) */}
                                {podcasts
                                    .filter(p =>
                                        p.category?.id === podcasts[0].category?.id &&
                                        p.id !== podcasts[0].id
                                    )
                                    .slice(0, 3)
                                    .map((podcast) => (
                                        <div
                                            key={podcast.id}
                                            className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition cursor-pointer group"
                                            onClick={() => {
                                                // Logic untuk ganti podcast yang diputar
                                                const updatedPodcasts = [podcast, ...podcasts.filter(p => p.id !== podcast.id)];
                                                setPodcasts(updatedPodcasts);
                                            }}
                                        >
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                {podcast.poster ? (
                                                    <img
                                                        src={podcast.poster}
                                                        alt={podcast.judul}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-[#1DB954]/20 to-[#001A3A] flex items-center justify-center">
                                                        <Music className="text-white/50" size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold truncate">{podcast.judul}</h4>
                                                <p className="text-white/70 text-sm truncate">
                                                    {podcast.classier?.nama || "Unknown Host"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar size={12} className="text-white/50" />
                                                    <span className="text-white/60 text-xs">
                                                        {podcast.createdAt ? new Date(podcast.createdAt).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        }) : "Date not set"}
                                                    </span>
                                                </div>
                                            </div>

                                            <Play className="text-white/60 group-hover:text-white" size={20} />
                                        </div>
                                    ))}

                                {/* Jika kurang dari 3 podcast dalam kategori ini */}
                                {podcasts.filter(p => p.category?.id === podcasts[0].category?.id).length <= 1 && (
                                    <div className="text-center text-white/50 py-4">
                                        <p>No other podcasts in this category yet</p>
                                    </div>
                                )}
                            </div>

                            {/* View All Button */}
                            <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
                                View All in {podcasts[0].category?.nama || "Uncategorized"}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Main Podcast Player */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-[#001A3A] to-[#0A2B5A] rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-8 md:p-10">
                                {/* Podcast Info */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="inline-block mb-4">
                                            <span className="bg-[#1DB954] text-white px-4 py-1 rounded-full text-sm font-bold">
                                                {/* Status bisa dari durasi atau field khusus */}
                                                {podcasts[0].durasi > 0 ? "ON AIR" : "COMING SOON"}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2">
                                            {podcasts[0].judul}
                                        </h3>
                                        <div className="flex items-center gap-4 text-white/80">
                                            <span className="font-medium">{podcasts[0].classier?.nama || "Unknown Host"}</span>
                                            <span>•</span>
                                            <span>{podcasts[0].category?.nama || "Uncategorized"}</span>
                                            <span>•</span>
                                            <span>
                                                {podcasts[0].durasi
                                                    ? `${Math.floor(podcasts[0].durasi / 60)}:${(podcasts[0].durasi % 60).toString().padStart(2, '0')}`
                                                    : "00:00"
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Save on Spotify Button - menggunakan link jika ada */}
                                    {podcasts[0].link && podcasts[0].link.includes('spotify') ? (
                                        <a
                                            href={podcasts[0].link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#1DB954] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-green-600 transition"
                                        >
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                                                alt="Spotify"
                                                className="w-6 h-6"
                                            />
                                            Listen on Spotify
                                        </a>
                                    ) : (
                                        <button className="bg-[#1DB954] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-green-600 transition">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                                                alt="Spotify"
                                                className="w-6 h-6"
                                            />
                                            Save
                                        </button>
                                    )}
                                </div>

                                {/* Embed Player dari link field */}
                                <div className="mb-8">
                                    {podcasts[0].link ? (
                                        <div className="bg-black/30 rounded-2xl p-4">
                                            {/* Cek jika link adalah embed iframe */}
                                            {podcasts[0].link.includes('<iframe') || podcasts[0].link.includes('<script') ? (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: podcasts[0].link }}
                                                    className="rounded-xl overflow-hidden"
                                                />
                                            ) : (
                                                // Jika URL biasa, coba embed berdasarkan platform
                                                (() => {
                                                    const link = podcasts[0].link;

                                                    // Spotify
                                                    if (link.includes('spotify.com')) {
                                                        const spotifyId = link.match(/spotify\.com\/(?:episode|show)\/([a-zA-Z0-9]+)/)?.[1];
                                                        if (spotifyId) {
                                                            return (
                                                                <iframe
                                                                    src={`https://open.spotify.com/embed/episode/${spotifyId}`}
                                                                    width="100%"
                                                                    height="152"
                                                                    frameBorder="0"
                                                                    allowTransparency={true}
                                                                    allow="encrypted-media"
                                                                    className="rounded-xl"
                                                                />
                                                            );
                                                        }
                                                    }

                                                    // YouTube
                                                    if (link.includes('youtube.com') || link.includes('youtu.be')) {
                                                        const videoId = link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                                                        if (videoId) {
                                                            return (
                                                                <iframe
                                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                                    className="w-full h-64 rounded-xl"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            );
                                                        }
                                                    }

                                                    // SoundCloud
                                                    if (link.includes('soundcloud.com')) {
                                                        return (
                                                            <iframe
                                                                width="100%"
                                                                height="166"
                                                                scrolling="no"
                                                                frameBorder="no"
                                                                allow="autoplay"
                                                                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                                                                className="rounded-xl"
                                                            />
                                                        );
                                                    }

                                                    // Default embed menggunakan iframe
                                                    return (
                                                        <iframe
                                                            src={link}
                                                            className="w-full h-64 rounded-xl border-0"
                                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                            loading="lazy"
                                                        />
                                                    );
                                                })()
                                            )}
                                        </div>
                                    ) : (
                                        // Fallback jika tidak ada link
                                        <div className="bg-black/30 rounded-2xl p-8 text-center">
                                            <div className="text-white/50 mb-4">
                                                <Music size={64} className="mx-auto" />
                                            </div>
                                            <p className="text-white/70">No player available</p>
                                            <p className="text-white/50 text-sm mt-2">Link not configured</p>
                                        </div>
                                    )}
                                </div>

                                {/* Podcast Description */}
                                <div className="mb-8">
                                    <h4 className="text-white font-bold text-lg mb-4">Description</h4>
                                    <p className="text-white/80 leading-relaxed">
                                        {podcasts[0].deskripsi || "No description available for this podcast."}
                                    </p>
                                </div>

                                {/* Podcast Metadata */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-white font-bold text-2xl">
                                            {/* Episode number bisa dari judul atau auto increment */}
                                            {podcasts[0].judul.match(/EP\s?(\d+)/i)?.[1] || "1"}
                                        </div>
                                        <div className="text-white/70 text-sm">Episode</div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-white font-bold text-2xl">
                                            {/* Durasi dalam menit */}
                                            {podcasts[0].durasi || "45"}
                                        </div>
                                        <div className="text-white/70 text-sm">Minutes</div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-white font-bold text-2xl">
                                            {/* Tanggal dibuat */}
                                            {podcasts[0].createdAt
                                                ? new Date(podcasts[0].createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })
                                                : "New"
                                            }
                                        </div>
                                        <div className="text-white/70 text-sm">Released</div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-white font-bold text-2xl">
                                            {/* Kategori */}
                                            {podcasts[0].category?.nama?.charAt(0) || "P"}
                                        </div>
                                        <div className="text-white/70 text-sm">Category</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Jika tidak ada podcast
                <div className="text-center py-20 bg-gray-100 rounded-3xl">
                    <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Podcasts Available</h3>
                    <p className="text-gray-500">Check back later for new episodes!</p>
                </div>
            )}

            {/* More Podcasts from Other Categories */}
            {podcasts.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-[#001A3A] mb-6">Explore Other Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Ambil podcast dari kategori berbeda (exclude kategori utama) */}
                        {podcasts
                            .filter(p => p.category?.id !== podcasts[0].category?.id)
                            .slice(0, 3)
                            .map((podcast) => (
                                <div key={podcast.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
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
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-[#001A3A] line-clamp-1">{podcast.judul}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{podcast.classier?.nama || "Unknown Host"}</p>
                                                    </div>
                                                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                                        {podcast.category?.nama || "Uncategorized"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                                    {podcast.deskripsi?.substring(0, 100) || "No description available."}...
                                                </p>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <span className="text-xs text-gray-500">
                                                        {podcast.durasi
                                                            ? `${Math.floor(podcast.durasi / 60)}:${(podcast.durasi % 60).toString().padStart(2, '0')}`
                                                            : "00:00"
                                                        }
                                                    </span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs text-gray-500">
                                                        {podcast.createdAt ? new Date(podcast.createdAt).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short'
                                                        }) : "New"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6 pt-0">
                                        <button
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                                            onClick={() => {
                                                // Logic untuk ganti podcast yang diputar
                                                const updatedPodcasts = [podcast, ...podcasts.filter(p => p.id !== podcast.id)];
                                                setPodcasts(updatedPodcasts);
                                            }}
                                        >
                                            <Play size={16} />
                                            Listen Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </section>
    );
}
