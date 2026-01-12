'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, Calendar, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function getRelativeTime(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, catsRes] = await Promise.all([
                    fetch('/api/beritas'),
                    fetch('/api/news-categories')
                ]);

                const newsData = await newsRes.json();
                let catsData = await catsRes.json();

                setNews(Array.isArray(newsData) ? newsData : []);

                catsData = Array.isArray(catsData) ? catsData : [];
                if (!catsData.some((c: any) => c.nama.toLowerCase() === 'hot release')) {
                    catsData.push({ id: 999, nama: 'Hot Release' });
                }
                setCategories(catsData);

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch data', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const featuredNews = news.slice(0, 3);
    const remainingNews = news;

    const filteredNews = selectedCategory === 'All'
        ? remainingNews
        : remainingNews.filter((item: any) =>
            (item.category?.nama || item.kategori || '').toLowerCase() === selectedCategory.toLowerCase()
        );

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const currentItems = filteredNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const topNewsSidebar = news.slice(3, 8);

    const getNewsLink = (item: any) => {
        const category = (item.category?.nama || item.kategori || '').toLowerCase();
        if (category === 'about us' || category === 'hot release') {
            return `/news/${item.id}`;
        }
        return item.link || '#';
    };

    if (loading) {
        return <div className="min-h-screen bg-[#001A3A] flex items-center justify-center text-white">Loading News...</div>;
    }

    return (
        <section className="bg-[#f8f9fa] relative min-h-screen font-sans">
            {/* Full Width Featured Slider */}
            {featuredNews.length > 0 && (
                <div className="w-full h-[70vh] relative group">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 6000 }}
                        loop={true}
                        className="w-full h-full"
                    >
                        {featuredNews.map((item: any) => (
                            <SwiperSlide key={item.id}>
                                <div className="relative w-full h-full">
                                    {item.gambar ? (
                                        <img
                                            src={item.gambar}
                                            alt={item.judul}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#001A3A] flex items-center justify-center text-white/50">
                                            No Image Available
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 z-10 container mx-auto">
                                        <div className="max-w-4xl">
                                            <span className="bg-[#A12227] text-white px-4 py-1.5 text-sm font-bold uppercase rounded-sm mb-4 inline-block tracking-wider shadow-sm">
                                                {item.category?.nama || item.kategori || 'News'}
                                            </span>
                                            <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                                                {item.judul}
                                            </h3>
                                            <div className="flex items-center gap-6 text-white text-base md:text-lg font-medium drop-shadow-md">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={20} className="text-[#A12227]" />
                                                    <span className="font-bold">{new Date(item.tanggal || item.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 border-l-2 border-white/30 pl-6">
                                                    <User size={20} className="text-[#A12227]" />
                                                    <span className="font-bold">{item.penulis || 'Admin'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <Link href={getNewsLink(item)} target={['about us', 'hot release'].includes((item.category?.nama || '').toLowerCase()) ? '_self' : '_blank'}>
                                                    <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#001A3A] transition-all duration-300">
                                                        Read Full Story
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            <div className="container mx-auto px-6 py-16">
                {/* Category Filter */}
                <div className="flex flex-wrap items-center gap-4 mb-12 border-b-2 border-gray-200 pb-4">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`text-lg font-bold pb-4 -mb-4.5 px-2 border-b-4 transition-all ${selectedCategory === 'All'
                            ? 'border-[#A12227] text-[#001A3A]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        All News
                    </button>
                    {categories.map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.nama)}
                            className={`text-lg font-bold pb-4 -mb-4.5 px-2 border-b-4 transition-all ${selectedCategory === cat.nama
                                ? 'border-[#A12227] text-[#001A3A]'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {cat.nama}
                        </button>
                    ))}
                </div>

                {/* Dynamic Category Banner */}
                {selectedCategory !== 'All' && (
                    <div className="mb-12 w-full rounded-xl overflow-hidden shadow-sm">
                        {(() => {
                            let bannerSrc = '';
                            const lowerCat = selectedCategory.toLowerCase();

                            if (lowerCat.includes('bbc')) bannerSrc = '/images/banners/bbc_banner.jpg';
                            else if (lowerCat.includes('klikpositif')) bannerSrc = '/images/banners/klikpositif_banner.jpg';
                            else if (lowerCat.includes('classy') || lowerCat.includes('about') || lowerCat.includes('hot')) bannerSrc = '/images/banners/classy_banner.jpg';
                            else if (lowerCat.includes('kata') || lowerCat.includes('sumbar')) bannerSrc = '/images/banners/katasumbar_banner.png';

                            if (bannerSrc) {
                                return (
                                    <img
                                        src={bannerSrc}
                                        alt={`${selectedCategory} Banner`}
                                        className="w-full h-auto object-cover max-h-32 md:max-h-48 lg:max-h-60 w-full"
                                    />
                                );
                            }
                            return null;
                        })()}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Area (70%) - List Styling */}
                    <div className="lg:w-8/12 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentItems.map((item: any, index: number) => {
                                // Pattern: 0 (Featured), 1, 2, 3, 4 (Standard), 5 (Featured), ...
                                const isFeatured = index % 5 === 0;
                                const linkUrl = getNewsLink(item);
                                const isExternal = !['about us', 'hot release'].includes((item.category?.nama || '').toLowerCase());

                                if (isFeatured) {
                                    // Featured Horizontal Card (Full Width)
                                    return (
                                        <div key={item.id} className="md:col-span-2 bg-white flex flex-col md:flex-row shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden border border-gray-100 h-auto md:min-h-80 group">
                                            {/* Text Left */}
                                            <div className="p-8 md:w-1/2 flex flex-col order-2 md:order-1 relative">
                                                <h3 className="font-sans text-[#001A3A] text-2xl md:text-xl font-bold mb-4 leading-tight group-hover:text-[#A12227] transition-colors">
                                                    <Link href={linkUrl} target={isExternal ? '_blank' : '_self'}>
                                                        {item.judul}
                                                    </Link>
                                                </h3>
                                                <p className="text-gray-500 text-sm mb-6 line-clamp-4 font-normal">
                                                    {item.isi ? item.isi.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').substring(0, 500) : 'No content preview.'}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <Link href={linkUrl} target={isExternal ? '_blank' : '_self'} className="inline-flex items-center gap-2 text-[#A12227] font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
                                                        Read More <ArrowRight size={14} />
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wide">
                                                        <span className="font-bold text-[#001A3A]">{item.penulis || 'Admin'}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span>{new Date(item.tanggal || item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Image Right */}
                                            <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden order-1 md:order-2">
                                                {item.gambar ? (
                                                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur-sm text-[#001A3A] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-gray-100 shadow-sm">
                                                        {item.category?.nama || item.kategori || 'News'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // Standard Vertical Card
                                    return (
                                        <div key={item.id} className="bg-white flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden border border-gray-100 group h-full">
                                            <div className="relative h-56 overflow-hidden">
                                                {item.gambar ? (
                                                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur-sm text-[#001A3A] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-gray-100 shadow-sm">
                                                        {item.category?.nama || item.kategori || 'News'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="font-bold text-[#001A3A] text-xl mb-3 leading-snug group-hover:text-[#A12227] transition-colors line-clamp-2 font-sans">
                                                    <Link href={linkUrl} target={isExternal ? '_blank' : '_self'}>
                                                        {item.judul}
                                                    </Link>
                                                </h3>
                                                <div className="text-gray-500 text-sm mb-4 line-clamp-2 prose prose-sm max-w-none flex-grow font-normal">
                                                    {item.isi ? item.isi.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').substring(0, 200) : ''}
                                                </div>
                                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {/* User Avatar Placeholder if we had author image */}
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold">
                                                            {(item.penulis || 'A').charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">{item.penulis || 'Admin'}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{getRelativeTime(new Date(item.tanggal || item.createdAt))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        {filteredNews.length === 0 && (
                            <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">No news found for category "{selectedCategory}".</p>
                                <button onClick={() => setSelectedCategory('All')} className="mt-4 text-[#A12227] font-bold hover:underline">Show All News</button>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#001A3A] text-white border border-gray-200 hover:bg-[#A12227] hover:text-white hover:border-[#A12227] shadow-sm'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <span className="mx-4 font-bold text-[#001A3A]">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#001A3A] text-white border border-gray-200 hover:bg-[#A12227] hover:text-white hover:border-[#A12227] shadow-sm'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area (30%) */}
                    <div className="lg:w-4/12 w-full">
                        <div className="sticky top-24">
                            <h3 className="text-2xl font-bold text-[#001A3A] mb-6 pb-2 border-b-2 border-gray-200">
                                Top News
                            </h3>
                            <div className="flex flex-col gap-6">
                                {topNewsSidebar.map((item: any) => {
                                    const linkUrl = getNewsLink(item);
                                    const isExternal = !['about us', 'hot release'].includes((item.category?.nama || '').toLowerCase());
                                    return (
                                        <Link href={linkUrl} target={isExternal ? '_blank' : '_self'} key={item.id}>
                                            <div className="flex gap-4 group cursor-pointer bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md relative">
                                                    {item.gambar ? (
                                                        <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[#A12227] text-[10px] font-bold uppercase mb-1 tracking-wider">
                                                        {item.category?.nama || item.kategori || 'News'}
                                                    </div>
                                                    <h4 className="font-bold text-[#001A3A] text-sm leading-snug line-clamp-2 group-hover:text-[#A12227] transition-colors mb-2">
                                                        {item.judul}
                                                    </h4>
                                                    <span className="text-gray-400 text-[10px] flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(item.tanggal || item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
