'use client';

import { ArrowRight, Play, User, Music, Mic, BarChart2, Phone, Mail, Facebook, Instagram, Youtube, Twitter, Globe, Link2, MapPin, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode, EffectCoverflow, EffectCards, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import { Calendar, Headphones } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Podcast from '../../components/landing/Podcast';

interface Classier {
    id: number;
    nama: string;
    foto?: string;
    deskripsi?: string;
}

interface PodcastType {
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
    const router = useRouter();
    const [podcasts, setPodcasts] = useState<PodcastType[]>([]);
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
    const [selectedPodcast, setSelectedPodcast] = useState<PodcastType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Bebas Pusing');
    const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);

    useEffect(() => {
        fetch('/api/podcasts')
            .then((res) => res.json())
            .then((data) => {
                setPodcasts(data);
                if (data.length > 0) {
                    const initialPodcast = data.find((p: PodcastType) => p.category?.nama.toLowerCase() === 'bebas pusing');
                    setSelectedPodcast(initialPodcast || data[0]);
                }
            })
            .catch((err) => console.error('Failed to fetch podcasts', err));

        fetch('/api/classiers')
            .then((res) => res.json())
            .then((data) => {
                const activeClassiers = Array.isArray(data)
                    ? data.filter((c: any) => c.status !== 'nonaktif' && c.status !== 'inactive')
                    : [];
                setClassiers(activeClassiers);
            })
            .catch((err) => console.error('Failed to fetch classiers', err));

        fetch('/api/podcast-categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Failed to fetch categories', err));

        fetch('/api/beritas')
            .then((res) => res.json())
            .then((data) => setNews(Array.isArray(data) ? data : []))
            .catch((err) => console.error('Failed to fetch news', err));

        fetch('/api/musiks')
            .then((res) => res.json())
            .then((data) => {
                const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => {
                    if (a.peringkat && b.peringkat) return a.peringkat - b.peringkat;
                    if (a.peringkat) return -1;
                    if (b.peringkat) return 1;
                    return 0;
                }) : [];
                setSongs(sorted);
            })
            .catch((err) => console.error('Failed to fetch songs', err));

    }, []);

    const [news, setNews] = useState<any[]>([]);
    const [songs, setSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const hotNews = news.filter((n: any) => (n.category?.nama || n.kategori || '').toLowerCase() === 'hot release');

    const filteredPodcasts = selectedCategory === 'All'
        ? podcasts.filter(p => ['bebas pusing', 'parliament talk', 'special talkshow'].includes(p.category?.nama.toLowerCase() || ''))
        : podcasts.filter(p => p.category?.nama?.toLowerCase() === selectedCategory.toLowerCase());

    const activePodcast = (selectedPodcast && (selectedCategory === 'All' || selectedPodcast.category?.nama?.toLowerCase() === selectedCategory.toLowerCase()))
        ? selectedPodcast
        : filteredPodcasts[0] || null;

    return (
        <>
            {/* Hero Section with Carousel */}
            <header className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-b from-[#001A3A] to-[#A12227] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        className="w-full h-full"
                    >
                        <SwiperSlide>
                            <img src="/images/banner-1.jpg" alt="Banner 1" className="w-full h-full object-cover" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/images/banner-2.jpg" alt="Banner 2" className="w-full h-full object-cover" />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </header>

            {/* About Us */}
            <section id="profile" className="py-20 bg-white container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-block relative">
                        <h2 className="text-7xl font-extrabold text-[#001A3A] tracking-tight">About Us</h2>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-[#001A3A] rounded-full"></div>
                    </div>
                </div>

                <div className="bg-[#001A3A] rounded-[40px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">

                    {/* Left: Image Space */}
                    <div className="md:w-5/12 w-full">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shadow-inner group">
                            {/* Replace with actual image */}
                            <img
                                src="/images/about-us-final.png"
                                alt="Classy FM Vision Mission"
                                className="w-full h-full"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x450/001A3A/FFF?text=Vision+Mission';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001A3A] to-transparent opacity-40"></div>
                        </div>
                    </div>

                    {/* Right: Text & Button */}
                    <div className="md:w-7/12 w-full flex flex-col items-start text-left">
                        <p className="text-white text-lg md:text-xl font-medium leading-relaxed mb-10 opacity-90">
                            Classy FM merupakan radio pertama di Sumatera Barat yang pada awalnya menyasar kelompok usia dewasa intelektual, yaitu usia 24 hingga 45 tahun, dengan fokus pada informasi, motivasi, dan inspirasi, serta memutar musik-musik hits dari era 90-an dan seterusnya. Bagi kami, radio bukan sekadar media suara, melainkan ruang bersama untuk berbagi cerita, memperluas wawasan, dan menyebarkan energi positif. Karena setiap suara yang terdengar, adalah inspirasi yang menggerakkan.
                        </p>

                        <Link href="/profile">
                            <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-gray-100 transition shadow-lg group">
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition" />
                                <span>More Information</span>
                            </button>
                        </Link>
                    </div>

                </div>
            </section>

            {/* Streaming Ad Banner Section */}
            <section className="pt-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className=" overflow-hidden shadow-2xl relative group">
                        <img
                            src="/images/audio.jpg"
                            alt="Audio Streaming 103.4 FM Classy FM"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                </div>
            </section>

            <section id="news" className="relative bg-white pt-12 pb-16">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-block relative">
                            <h2 className="text-6xl font-black text-[#A12227] tracking-tighter relative z-10">
                                Hot News
                            </h2>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-[#001A3A] rounded-full"></div>
                        </div>
                    </div>

                    {/* Magazine Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Main Feature (Hot Release) */}
                        {hotNews.slice(0, 1).map((item: any) => (
                            <div key={item.id} className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-xl group flex flex-col h-full border border-gray-100 relative">
                                <div className="relative h-[250px] md:h-[320px] overflow-hidden">
                                    {item.gambar ? (
                                        <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-[#A12227] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        {item.category?.nama || item.kategori || 'News'}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-center bg-white relative">
                                    <h3 className="font-black text-[#001A3A] text-2xl md:text-3xl mb-3 leading-tight z-10 line-clamp-2">
                                        {item.judul}
                                    </h3>
                                    <p className="text-gray-500 text-xs mb-5 flex items-center gap-2 font-medium z-10">
                                        <Calendar size={14} className="text-[#A12227]" />
                                        <span>{new Date(item.tanggal || item.createdAt).toLocaleDateString()}</span>
                                    </p>

                                    {!['about us'].includes((item.category?.nama || item.kategori || '').toLowerCase()) && (
                                        <Link href={`/news/${item.id}`}>
                                            <button className="self-start text-white bg-[#A12227] px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#001A3A] transition shadow-md z-10">
                                                Read Article
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}

                        {hotNews.length === 0 && (
                            <div className="lg:col-span-7 h-64 bg-white/50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 border-dashed">
                                No "Hot Release" news available.
                            </div>
                        )}

                        {/* Right: Side List / Secondary Items */}
                        <div className="lg:col-span-5 flex flex-col gap-5 h-full">
                            {hotNews.slice(1, 4).map((item: any) => (
                                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md group flex-1 flex border border-gray-100 relative items-center p-3 gap-4 hover:shadow-lg transition-shadow">
                                    <div className="h-24 w-32 flex-shrink-0 overflow-hidden relative rounded-xl">
                                        {item.gambar ? (
                                            <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between relative">
                                        <div>
                                            <div className="text-[#A12227] text-[10px] font-bold uppercase mb-1 tracking-wider">
                                                {item.category?.nama || item.kategori || 'News'}
                                            </div>
                                            <h4 className="font-bold text-[#001A3A] text-base leading-snug line-clamp-2 group-hover:text-[#A12227] transition-colors">
                                                {item.judul}
                                            </h4>
                                        </div>

                                        {!['about us'].includes((item.category?.nama || item.kategori || '').toLowerCase()) && (
                                            <Link href={`/news/${item.id}`} className="mt-2 flex items-center text-[10px] font-bold text-gray-400 group-hover:text-[#A12227] transition-colors gap-1">
                                                READ MORE <ArrowRight size={10} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="text-center mt-auto pt-2">
                                <Link href="/news">
                                    <button className="w-full bg-[#A12227] text-white text-base font-bold py-3 rounded-2xl shadow-lg hover:bg-[#001A3A] transition transform hover:scale-[1.02]">
                                        View All News
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Classiers - Updated 3D Carousel */}
            <section className="py-20 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block relative mb-4">
                        <h2 className="text-7xl font-bold text-black">Classiers</h2>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-[#001A3A] rounded-full"></div>
                    </div>
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
                                    <div className="bg-gradient-to-b from-[#051350]/90 via-[#051350]/70 to-[#863F93]/90 rounded-3xl shadow-2xl overflow-hidden h-[400px] flex flex-col relative group border border-white/20 backdrop-blur-sm transition-transform duration-300">

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
                                                <div
                                                    onClick={() => router.push(`/profile#classier-${person.id}`)}
                                                    className="bg-gradient-to-b from-[#051350] to-[#051350]/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300"
                                                >
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
                <div className="flex flex-col md:flex-row gap-8 items-stretch h-full">
                    <div className="md:w-1/2 flex flex-col">
                        <div className="h-full rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/ayodengar.jpeg"
                                alt="Ayo Dengar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col">
                        {/* Header Image Replacement */}
                        <div className="mb-0 group">
                            <img
                                src="/images/chart-header.jpg"
                                alt="The Ultimate Adult Contemporary Music Chart"
                                className="w-full rounded-t-2xl shadow-xl"
                            />
                        </div>

                        <div className="flex-1 space-y-2 bg-white rounded-b-2xl p-4 shadow-xl border border-t-0 border-gray-100">
                            {songs.slice(0, 5).map((song: any, idx: number) => (
                                <div key={song.id || idx} className="flex items-center rounded-lg p-2 transition cursor-pointer border hover:border-yellow-400 group overflow-hidden h-16 bg-gradient-to-r from-[#001A3A] to-[#A12227]">
                                    {/* Rank Number */}
                                    <div className="w-10 h-10 bg-black/20 text-white font-bold text-lg flex items-center justify-center rounded-full flex-shrink-0 ml-2 shadow-inner gap-0.5">
                                        {idx + 1}
                                        {/* Trend Indicator */}
                                        {song.trend === 'up' && <span className="text-green-400 text-xs">▲</span>}
                                        {song.trend === 'down' && <span className="text-red-400 text-xs">▼</span>}
                                        {(song.trend === 'same' || !song.trend) && <span className="text-white/70 text-xs">-</span>}
                                    </div>

                                    {/* Song Image */}
                                    {song.foto ? (
                                        <div className="h-12 w-12 flex-shrink-0 ml-4 rounded-md overflow-hidden relative">
                                            <img
                                                src={song.foto}
                                                alt={song.judul}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 ml-4 bg-gray-200 flex items-center justify-center rounded-md">
                                            <Music size={20} className="text-gray-400" />
                                        </div>
                                    )}

                                    {/* Text Content */}
                                    <div className="flex-1 px-4 flex flex-col justify-center overflow-hidden">
                                        <h4 className="font-bold text-white text-base truncate drop-shadow-md">
                                            {song.judul}
                                        </h4>
                                        <p className="text-xs text-white/90 font-medium truncate">
                                            {song.penyanyi}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {/* View All Button */}
                            <div className="pt-2">
                                <Link href="/chart" className="block w-full text-center bg-[#001A3A] text-white font-bold py-3 rounded-lg hover:bg-[#A12227] transition-colors text-sm uppercase tracking-wider">
                                    View Full Chart
                                </Link>
                            </div>
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
                    <Link href="/profile#collaboration">
                        <button className="bg-white text-[#001A3A] px-10 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition">
                            Let's Collaborate!
                        </button>
                    </Link>
                </div>
            </section>

            {/* Podcast Component */}
            <Podcast podcasts={podcasts} setPodcasts={setPodcasts} />
        </>
    );
}
