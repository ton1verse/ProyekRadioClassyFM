'use client';

import Link from 'next/link';
import { ArrowRight, Play, User, Music, Mic, BarChart2, Phone, Mail, Facebook, Instagram, Youtube, Twitter, Globe, Link2, MapPin, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode, EffectCoverflow, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import { Calendar, Headphones } from 'lucide-react';

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
}

export default function LandingPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [classiers, setClassiers] = useState<Classier[]>([
    {
      id: 1,
      nama: 'Lia Priyanka',
      deskripsi: 'Integralist'
    },
    {
      id: 2,
      nama: 'Gasmina Andrea',
      deskripsi: 'Integralist'
    },
    {
      id: 3,
      nama: 'Andahayani',
      deskripsi: 'Integralist'
    },
    {
      id: 4,
      nama: 'Edo Prussiano',
      deskripsi: 'Integralist'
    },
    {
      id: 5,
      nama: 'Dara Binjani',
      deskripsi: 'Integralist'
    },
    {
      id: 6,
      nama: 'Raja Zak',
      deskripsi: 'Integralist'
    }
  ]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/podcasts')
      .then((res) => res.json())
      .then((data) => {
        setPodcasts(data);
        if (data.length > 0) setSelectedPodcast(data[0]);
      })
      .catch((err) => console.error('Failed to fetch podcasts', err));

    fetch('/api/classiers')
      .then((res) => res.json())
      .then((data) => setClassiers(data))
      .catch((err) => console.error('Failed to fetch classiers', err));

    fetch('/api/beritas')
      .then((res) => res.json())
      .then((data) => setNews(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to fetch news', err));

    fetch('/api/musiks')
      .then((res) => res.json())
      .then((data) => {
        setSongs(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to fetch songs', err));

  }, []);

  const [news, setNews] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Navbar - BLUE #001A3A */}
      <nav className="bg-[#001A3A] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-1 rounded-md">
            <img src="/classy.jpg" alt="Classy FM Logo" className="h-8 md:h-10 w-auto" />
          </div>
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wider">
          <Link href="/" className="hover:text-[#A12227] transition">Home</Link>
          <Link href="#profile" className="hover:text-[#A12227] transition">Profile</Link>
          <Link href="#product" className="hover:text-[#A12227] transition">Product</Link>
          <Link href="#news" className="hover:text-[#A12227] transition">News</Link>
          <Link href="#podcast" className="hover:text-[#A12227] transition">Podcast</Link>
          <Link href="#chart" className="hover:text-[#A12227] transition">Chart</Link>
        </div>

        {/* Listen Now - RED #A12227 */}
        <button className="bg-[#A12227] text-white hover:bg-red-800 px-6 py-2 rounded-full font-bold flex items-center space-x-2 transition text-sm shadow-sm">
          <Play size={16} fill="currentColor" />
          <span>Listen Now</span>
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-b from-[#001A3A] to-[#A12227] flex items-center justify-center overflow-hidden">
        <div className="text-white/50 text-2xl font-light italic">
          {/* Content Kosongkan Saja */}
        </div>
      </header>

      {/* About Us */}
      <section id="profile" className="py-20 bg-white container mx-auto px-6">
        <div className="bg-[#001A3A] rounded-[30px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
          <div className="md:w-1/2 relative z-10">
            <h2 className="text-4xl font-bold mb-6">About Us</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              Classy FM merupakan radio pertama di Sumatera Barat yang memposisikan diri sebagai radio news (berita) dan hits (musik) terbaik. Mengudara sejak tahun 2000, kami terus berinovasi untuk memberikan informasi terpercaya dan hiburan berkualitas bagi pendengar setia kami. Kami hadir tidak hanya sebagai media, tetapi sebagai teman yang menginspirasi.
            </p>
            <button className="bg-white text-[#001A3A] px-8 py-3 rounded-full font-bold flex items-center space-x-2 hover:bg-gray-100 transition">
              <span>More Information</span>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center z-10">
            <div className="grid grid-cols-2 gap-4 opacity-80">
              <div className="bg-[#A12227] p-4 rounded-lg text-center">
                <span className="font-bold">NEWS</span>
              </div>
              <div className="bg-yellow-500 p-4 rounded-lg text-center">
                <span className="font-bold text-black">HITS</span>
              </div>
              <div className="bg-blue-600 p-4 rounded-lg text-center col-span-2">
                <span className="font-bold">INSPIRATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot News Section */}
      <section id="news" className="bg-[#001A3A]">
        <div className="bg-white rounded-br-[5rem] pr-10 overflow-hidden">
          <div className="container mx-auto flex items-center h-full">
            <div className="bg-[#A12227] text-white font-extrabold text-2xl px-12 py-6 shadow-lg rounded-r-full relative z-10 -ml-12">
              <span className="block tracking-wide">HOT NEWS</span>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group cursor-pointer h-full flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-200">
                  {item.gambar ? (
                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-[#001A3A]">{item.judul}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {new Date(item.createdAt).toLocaleDateString()} | {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#001A3A] text-sm font-bold flex items-center group-hover:translate-x-2 transition">
                      Read More <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {news.length === 0 && !loading && (
              <p className="col-span-3 text-center text-white">No news available.</p>
            )}
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#A12227] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-red-800 transition">See More</button>
          </div>
        </div>
      </section>

      {/* Classiers - Updated 3D Carousel */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-black">Classiers</h2>
          <p className="text-black/80 max-w-2xl mx-auto mb-12">
            <span className="block text-lg mb-2 text-black">Meet our broadcasters.</span>
            Tim penyiar berbakat Classy FM adalah profesional penuh semangat yang siap menghibur, menginformasikan, dan berinteraksi dengan Anda setiap hari.
          </p>
        </div>

        {/* Enhanced 3D Carousel */}
        <div className="rounded-3xl">
          <div className="relative max-w-6xl mx-auto bg-gradient-to-b from-[#051350] via-[#051350] to-[#863F93] rounded-3xl overflow-hidden">
            <style jsx global>{`
      .swiper-slide {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      .swiper-slide-active,
      .swiper-slide-prev,
      .swiper-slide-next {
        opacity: 1;
      }
    `}</style>
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 25,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              modules={[EffectCoverflow, Autoplay, Navigation]}
              className="classiers-swiper !overflow-visible !py-12"
              breakpoints={{
                640: {
                  coverflowEffect: {
                    rotate: 15,
                    stretch: -50,
                    depth: 150,
                    modifier: 1.5,
                  }
                },
                1024: {
                  coverflowEffect: {
                    rotate: 20,
                    stretch: -80,
                    depth: 200,
                    modifier: 2,
                  }
                }
              }}
            >
              {classiers.map((person: any) => (
                <SwiperSlide key={person.id} className="!w-64 md:!w-72 transition-all duration-300">
                  <div className="bg-gradient-to-b from-[#051350]/90 via-[#051350]/70 to-[#863F93]/90 rounded-3xl shadow-2xl overflow-hidden h-[400px] flex flex-col relative group border border-white/20 backdrop-blur-sm">

                    {/* Geometric Decoration Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                      <svg className="w-full h-full opacity-30" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
                        <defs>
                          <linearGradient id="bluePurpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#051350" />
                            <stop offset="80%" stopColor="#051350" />
                            <stop offset="100%" stopColor="#863F93" />
                          </linearGradient>
                        </defs>
                        {/* Abstract Wireframe Lines */}
                        <path d="M150 20 L280 100 L280 300 L150 380 L20 300 L20 100 Z"
                          fill="none"
                          stroke="url(#bluePurpleGrad)"
                          strokeWidth="1.5"
                          className="opacity-60" />
                        <path d="M150 50 L250 110 L250 290 L150 350 L50 290 L50 110 Z"
                          fill="none"
                          stroke="url(#bluePurpleGrad)"
                          strokeWidth="0.8"
                          opacity="0.4" />
                        {/* Floating elements - dominan biru */}
                        <path d="M260 80 L270 90 L260 100 Z" fill="#051350" opacity="0.7" />
                        <path d="M40 310 L30 320 L40 330 Z" fill="#863F93" opacity="0.5" />
                      </svg>
                    </div>

                    <div className="h-full relative overflow-hidden z-0 bg-gradient-to-b from-[#051350]/40 via-[#051350]/20 to-[#863F93]/30">
                      {person.foto ? (
                        <img
                          src={person.foto}
                          alt={person.nama}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#051350] via-[#051350] to-[#863F93] text-white/30 text-6xl font-bold">
                          {person.nama.charAt(0)}
                        </div>
                      )}

                      {/* Bottom Gradient Overlay - 80% biru, 20% ungu */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#051350] via-[#051350]/90 to-transparent h-48 z-20"></div>

                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 flex flex-col items-center text-center">
                        <div className="bg-gradient-to-b from-[#051350] to-[#051350]/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg">
                          <h3 className="text-white font-extrabold text-xl tracking-wider drop-shadow-lg">
                            {person.nama}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows - juga 80% biru, 20% ungu */}
            <button className="swiper-button-prev-custom absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-b from-[#051350] via-[#051350] to-[#863F93] hover:opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-xl border border-white/20 transition-all duration-300">
              <ChevronLeft size={24} />
            </button>
            <button className="swiper-button-next-custom absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-b from-[#051350] via-[#051350] to-[#863F93] hover:opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-xl border border-white/20 transition-all duration-300">
              <ChevronRight size={24} />
            </button>

          </div>
        </div>
      </section>

      {/* Charts / Promo */}
      <section id="chart" className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2 bg-gray-50 rounded-3xl p-10 flex items-center justify-center min-h-[400px]">
            <div className="p-10 bg-white rounded-full shadow-inner">
              <img src="/classy.jpg" alt="Classy 103.4 FM" className="w-48 opacity-80" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold bg-[#001A3A] text-white p-4 inline-block mb-8 transform -skew-x-6">
              <span className="skew-x-6 inline-block">THE ULTIMATE MUSIC CHART</span>
            </h3>
            <div className="space-y-4">
              {songs.slice(0, 5).map((song: any, idx: number) => (
                <div key={song.id || idx} className="flex items-center bg-yellow-400 p-2 rounded-lg shadow-md hover:bg-yellow-300 transition cursor-pointer border-l-4 border-black">
                  <div className="w-12 h-12 bg-black text-white font-bold text-xl flex items-center justify-center rounded-md mr-4">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{song.title}</h4>
                    <p className="text-xs text-gray-800">{song.artist}</p>
                  </div>
                </div>
              ))}
              {songs.length === 0 && !loading && (
                <p className="text-gray-500">No chart data available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Call to Action */}
      <section className="bg-[#001A3A] py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 max-w-2xl mx-auto">
            Together, we can create inspiring ideas and reach more people.
          </h2>
          <button className="bg-white text-[#001A3A] px-10 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition">
            Let's Collaborate!
          </button>
        </div>
      </section>

      {/* Podcast */}
      <section id="podcast" className="py-20 container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 font-bold text-[#001A3A]">Podcast</h2>

        {/* Podcast Categories - Dinamis dari data */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {podcasts.length > 0 ? (
            <>
              {/* Ambil kategori unik dari podcast (dari relasi category) */}
              {Array.from(new Set(podcasts.map(p => p.category?.nama || "Uncategorized"))).slice(0, 3).map((kategori, index) => (
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
      {/* Footer - Final Version */}
      <footer className="bg-[#001A3A] text-white pt-16 pb-0">
        <div className="container mx-auto px-6 mb-12">
          {/* Grid Layout: 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Column 1: Map & Address */}
            <div className="flex flex-col gap-6">
              {/* Map Placeholder - Using a div to simulate the map area from the design */}
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative group">
                {/* Replace this src with your actual map image if available */}
                <img src="https://placehold.co/600x400/png?text=Map+Location" alt="Map Location" className="w-full h-full object-cover" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="text-red-600 fill-current w-10 h-10 drop-shadow-lg animate-bounce" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-2xl mb-2 text-white ">
                  PT. Radio Gema Karang Putih
                </h4>
                <p className="text-lg leading-relaxed text-white/90">
                  Gedung Serba Guna<br />
                  Semen Padang Lt. 2<br />
                  Indarung - Padang 25237<br />
                  Sumatera Barat - Indonesia
                </p>
              </div>
            </div>

            {/* Column 2: Get in Touch & Quick Access */}
            <div className="flex flex-col gap-y-16">

              {/* Get in touch */}
              <div>
                <div className="inline-block relative mb-6">
                  <h4 className="font-bold text-2xl">Get in touch</h4>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#A12227]"></div>
                </div>

                <ul className="space-y-1 text-lg text-white/90">
                  <li className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>+62 (0751) 74999</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>+62 811 660 4090</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-[18px] h-[18px]" />
                    <span>+62 812 660 1034</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={18} />
                    <a href="mailto:classyfm@classyfm.co.id" className="hover:text-[#A12227] transition">classyfm@classyfm.co.id</a>
                  </li>
                </ul>
              </div>

              {/* Quick Access */}
              <div>
                <div className="inline-block relative mb-6">
                  <h4 className="font-bold text-2xl">Quick Access</h4>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#A12227]"></div>
                </div>

                <div className="grid grid-cols-2 gap-y-1 text-lg text-white/90">
                  <Link href="/" className="hover:text-[#A12227] transition-colors">Home</Link>
                  <Link href="#podcast" className="hover:text-[#A12227] transition-colors">Podcast</Link>
                  <Link href="#profile" className="hover:text-[#A12227] transition-colors">Profile</Link>
                  <Link href="#chart" className="hover:text-[#A12227] transition-colors">Chart</Link>
                  <Link href="#product" className="hover:text-[#A12227] transition-colors">Product</Link>
                  <span></span>
                  <Link href="#news" className="hover:text-[#A12227] transition-colors">News</Link>
                </div>
              </div>
            </div>

            {/* Column 3: Social Media & More Info */}
            <div className="flex flex-col gap-8">

              {/* Social Media */}
              <div>
                <div className="inline-block relative mb-6">
                  <h4 className="font-bold text-2xl">Social Media</h4>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#A12227]"></div>
                </div>

                <ul className="space-y-1 text-lg text-white/90">
                  <li className="flex items-center gap-3">
                    <Twitter size={18} />
                    <span>@ClassyFM</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Facebook size={18} />
                    <span>Classyfm Padang</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Instagram size={18} />
                    <span>@classyfm</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Youtube size={18} />
                    <span>Classy 103.4 FM Padang</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Music size={18} />
                    <span>Radio Classy FM-Padang</span>
                  </li>
                </ul>
              </div>

              {/* More Information */}
              <div>
                <div className="inline-block relative mb-6">
                  <h4 className="font-bold text-2xl">More Information</h4>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#A12227]"></div>
                </div>

                <ul className="space-y-1 text-lg text-white/90 break-all">
                  <li className="flex items-center gap-3">
                    <Link2 size={18} className="flex-shrink-0" />
                    <a href="https://www.semenpadang.co.id" target="_blank" className="hover:text-[#A12227] transition underline">www.semenpadang.co.id</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Link2 size={18} className="flex-shrink-0" />
                    <a href="https://www.klikpositif.com" target="_blank" className="hover:text-[#A12227] transition underline">www.klikpositif.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Link2 size={18} className="flex-shrink-0" />
                    <a href="https://www.katasumbar.com" target="_blank" className="hover:text-[#A12227] transition underline">www.katasumbar.com</a>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>

        {/* Copyright Section */}
        <div className="bg-[#A12227] py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="text-white font-bold text-lg tracking-wide">
              Copyright © 2025 Classy FM - All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}