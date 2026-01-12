'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [podRes, catRes] = await Promise.all([
          fetch('/api/podcasts'),
          fetch('/api/podcast-categories')
        ]);
        const pData = await podRes.json();
        const cData = await catRes.json();

        setPodcasts(Array.isArray(pData) ? pData : []);
        setCategories(Array.isArray(cData) ? [{ id: -1, nama: 'All' }, ...cData] : [{ id: -1, nama: 'All' }]);

        if (Array.isArray(pData) && pData.length > 0) {
          setSelectedPodcast(pData[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPodcasts = selectedCategory === 'All'
    ? podcasts
    : podcasts.filter(p => p.category?.nama === selectedCategory);

  const wheelRef = useRef<HTMLDivElement>(null);

  const selectedIndex = categories.findIndex(c => c.nama === selectedCategory);

  const safeIndex = selectedIndex === -1 ? 0 : selectedIndex;


  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar - Matching Landing Page */}
      <nav className="bg-[#001A3A] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <a href="/">
            <div className="bg-white p-1 rounded-md">
              <img src="/classy.jpg" alt="Classy FM Logo" className="h-8 md:h-10 w-auto" />
            </div>
          </a>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wider">
          <Link href="/" className="hover:text-[#A12227] transition">Home</Link>
          <Link href="/" className="hover:text-[#A12227] transition">Profile</Link>
          <Link href="/" className="hover:text-[#A12227] transition">Product</Link>
          <Link href="/" className="hover:text-[#A12227] transition">News</Link>
          <Link href="/podcasts" className="text-[#A12227] transition">Podcast</Link>
          <Link href="/" className="hover:text-[#A12227] transition">Chart</Link>
        </div>
        <button className="bg-[#A12227] text-white hover:bg-red-800 px-6 py-2 rounded-full font-bold flex items-center space-x-2 transition text-sm shadow-sm">
          <Play size={16} fill="currentColor" />
          <span>Listen Now</span>
        </button>
      </nav>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-80px)]">

        {/* Left Side: Vertical Wheel Filter */}
        <div className="md:w-1/4 bg-[#001A3A] text-white relative flex flex-col items-center justify-center p-4 border-r border-[#0a2345]">
          <h2 className="absolute top-8 left-0 w-full text-center text-gray-400 text-sm tracking-widest uppercase mb-4">Kategori</h2>

          <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
            {/* Central Selection Highlight Line */}
            <div className="absolute w-full h-16 bg-gradient-to-r from-transparent via-[#A12227]/20 to-transparent border-t border-b border-[#A12227]/30 z-0"></div>

            <div
              className="flex flex-col items-center transition-transform duration-500 ease-out"
              style={{ transform: `translateY(${-safeIndex * 60}px)` }}
            >
              {categories.map((cat, idx) => {
                const distanceFromCenter = Math.abs(idx - safeIndex);
                const isActive = idx === safeIndex;

                const scale = isActive ? 1.5 : Math.max(0.8, 1 - (distanceFromCenter * 0.1));
                const opacity = isActive ? 1 : Math.max(0.2, 0.8 - (distanceFromCenter * 0.2));
                const rotateX = (idx - safeIndex) * 10;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.nama)}
                    className={`h-[60px] flex items-center justify-center transition-all duration-300 transform w-full cursor-pointer z-10 ${isActive ? 'font-bold text-[#A12227]' : 'text-gray-400 hover:text-white'}`}
                    style={{
                      transform: `scale(${scale}) perspective(500px) rotateX(${rotateX}deg)`,
                      opacity: opacity,
                    }}
                  >
                    <span className="truncate max-w-[80%] text-lg">{cat.nama}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decorative Blur */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#001A3A] to-transparent pointer-events-none z-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#001A3A] to-transparent pointer-events-none z-20"></div>

        </div>

        {/* Right Side: Podcast Content */}
        <div className="md:w-3/4 overflow-y-auto p-6 md:p-12 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-[#001A3A] flex items-center gap-3">
              <span className="w-2 h-10 bg-[#A12227] rounded-full"></span>
              {selectedCategory} Podcasts
            </h1>

            {/* Selected Podcast Hero */}
            {selectedPodcast && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-12 flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl ring-1 ring-gray-100">
                <div className="md:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-[#001A3A] to-[#0a2345] text-white relative overflow-hidden">
                  {selectedPodcast.poster ? (
                    <img src={selectedPodcast.poster} alt={selectedPodcast.judul} className="w-48 h-48 object-cover rounded-full shadow-lg z-10 border-4 border-white/20" />
                  ) : (
                    <div className="w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 z-10">No Image</div>
                  )}
                  <div className="mt-6 text-center z-10">
                    <h3 className="text-xl font-bold line-clamp-2">{selectedPodcast.judul}</h3>
                    <p className="text-sm text-blue-200 mt-2">{selectedPodcast.classier?.nama || "Unknown Host"}</p>
                  </div>

                  {/* Background blob */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#A12227] rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="md:w-2/3 p-8 flex flex-col justify-center bg-white relative">
                  {selectedPodcast.link && selectedPodcast.link.includes('<iframe') ? (
                    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100" dangerouslySetInnerHTML={{ __html: selectedPodcast.link.replace(/height="\d+"/, 'height="152"') }} />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Now Playing</span>
                        {selectedPodcast.link && (
                          <a href={selectedPodcast.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-[#A12227] hover:underline">
                            Open Link <ArrowRightIcon size={14} />
                          </a>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedPodcast.judul}</h2>
                      <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">{selectedPodcast.deskripsi}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredPodcasts.map(podcast => (
                <div
                  key={podcast.id}
                  onClick={() => setSelectedPodcast(podcast)}
                  className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 group ${selectedPodcast?.id === podcast.id ? 'ring-2 ring-[#001A3A]' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                      {podcast.poster && <img src={podcast.poster} alt={podcast.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} className="text-white" fill="white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#001A3A] truncate group-hover:text-[#A12227] transition-colors">{podcast.judul}</h4>
                      <p className="text-xs text-gray-500 mb-1">{podcast.classier?.nama || "Unknown"}</p>
                      <p className="text-xs text-gray-400 truncate">{podcast.deskripsi}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPodcasts.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                  <p>No podcasts found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ArrowRightIcon({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}