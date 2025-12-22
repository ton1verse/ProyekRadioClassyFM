'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Play, ArrowRight } from 'lucide-react';

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [classiers, setClassiers] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [podRes, classRes] = await Promise.all([
          fetch('/api/podcasts'),
          fetch('/api/classiers')
        ]);
        const pData = await podRes.json();
        const cData = await classRes.json();

        setPodcasts(Array.isArray(pData) ? pData : []);
        setClassiers(Array.isArray(cData) ? cData : []);

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
    : podcasts.filter(p => p.classier?.nama === selectedCategory);

  return (
    <div className="min-h-screen bg-white font-sans">
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

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center mb-12 text-[#001A3A]">Podcast</h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'All' ? 'bg-[#22c55e] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          {classiers.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.nama)}
              className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === c.nama ? 'bg-[#22c55e] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >
              {c.nama}
            </button>
          ))}
        </div>

        {/* Selected Podcast Card */}
        {selectedPodcast ? (
          <div className="bg-[#061a35] rounded-3xl overflow-hidden shadow-2xl text-white md:flex w-full min-h-[400px]">
            {/* Left Side: Detail Info */}
            <div className="md:w-1/3 p-10 bg-[#0a2345] flex flex-col items-center justify-center text-center border-r border-white/5 relative">
              {selectedPodcast.poster ? (
                <img src={selectedPodcast.poster} alt={selectedPodcast.judul} className="w-56 h-56 rounded-full shadow-2xl mb-6 object-cover border-4 border-white/10" />
              ) : (
                <div className="w-56 h-56 bg-gray-700 rounded-full mb-6 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <h3 className="text-2xl font-bold mb-2 z-10">{selectedPodcast.judul}</h3>
              <p className="text-blue-200 text-lg z-10">{selectedPodcast.classier?.nama || "Unknown Host"}</p>

              {/* Decoration Circles */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-10 -translate-y-10 blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full translate-x-10 translate-y-10 blur-2xl"></div>
            </div>

            {/* Right Side: Player Content */}
            <div className="md:w-2/3 p-10 relative flex flex-col justify-center">
              {/* Spotify Iframe Logic */}
              {selectedPodcast.link && selectedPodcast.link.includes('<iframe') ? (
                <div className="w-full">
                  <div
                    className="rounded-xl overflow-hidden shadow-lg bg-black/50"
                    dangerouslySetInnerHTML={{ __html: selectedPodcast.link.replace('height="152"', 'height="250"').replace('height="352"', 'height="250"') }}
                  />
                  <p className="mt-6 text-gray-300 leading-relaxed text-sm opacity-80 line-clamp-3">
                    {selectedPodcast.deskripsi}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedPodcast.judul}</h2>
                      <p className="text-gray-400">{selectedPodcast.classier?.nama}</p>
                    </div>
                    <div className="bg-white rounded-full p-4 cursor-pointer hover:scale-105 transition shadow-lg group">
                      <a href={selectedPodcast.link} target="_blank" rel="noopener noreferrer">
                        <Play fill="black" className="text-black ml-1 group-hover:text-[#A12227] transition" size={24} />
                      </a>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-10 text-lg border-l-4 border-green-500 pl-4">
                    {selectedPodcast.deskripsi}
                  </p>

                  {/* Mock Progress Bar for aesthetics if no iframe */}
                  <div className="w-full">
                    <div className="bg-white/10 rounded-full h-1.5 w-full mb-2 overflow-hidden">
                      <div className="bg-green-500 h-full w-[35%] shadow-[0_0_10px_rgba(34,197,94,0.7)] relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-green-400 tracking-wider">
                      <span>00:00</span>
                      <span>{selectedPodcast.durasi} mins</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No podcasts selected.</p>
          </div>
        )}

        {/* List of other podcasts below */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPodcasts.map(podcast => (
            <div
              key={podcast.id}
              onClick={() => setSelectedPodcast(podcast)}
              className={`cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-xl transition flex items-center gap-4 ${selectedPodcast?.id === podcast.id ? 'ring-2 ring-[#001A3A]' : ''}`}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                {podcast.poster && <img src={podcast.poster} alt={podcast.judul} className="w-full h-full object-cover" />}
              </div>
              <div>
                <h4 className="font-bold text-[#001A3A] line-clamp-1">{podcast.judul}</h4>
                <p className="text-xs text-gray-500">{podcast.classier?.nama}</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#001A3A]">
                  <Play size={12} fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}