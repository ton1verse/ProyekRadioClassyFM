'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/models/Program';
import { Event } from '@/models/Event';
import { EventCategory } from '@/models/EventCategory';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryColor } from '@/lib/utils';

type FilterType = 'all' | 'program' | 'event';

const formatSchedule = (jadwal: string) => {
    if (!jadwal) return "Belum ditentukan";
    if (jadwal.includes(';')) {
        return jadwal.split(';').map(s => s.trim()).join(' | ');
    }
    return jadwal;
};

export default function ProductPage() {
    const [filter, setFilter] = useState<FilterType>('program');
    const [programs, setPrograms] = useState<Program[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [currentProgramId, setCurrentProgramId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progRes, eventRes, catRes] = await Promise.all([
                    fetch('/api/programs'),
                    fetch('/api/events'),
                    fetch('/api/events/categories')
                ]);

                let fetchedPrograms: Program[] = [];

                if (progRes.ok) {
                    fetchedPrograms = await progRes.json();
                    setPrograms(fetchedPrograms);
                }

                if (eventRes.ok) {
                    const eventData = await eventRes.json();
                    setEvents(eventData);
                }

                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }

                findCurrentProgram(fetchedPrograms);

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        const interval = setInterval(() => {
            fetch('/api/programs').then(res => res.json()).then(data => {
                setPrograms(data);
                findCurrentProgram(data);
            });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const findCurrentProgram = (progList: Program[]) => {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const currentDay = days[now.getDay()];
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const active = progList.find((program) => {
            if (!program.jadwal) return false;
            const schedules = program.jadwal.split(';');

            return schedules.some((schedule) => {
                const parts = schedule.trim().split(' ');
                if (parts.length < 2) return false;

                const day = parts[0];
                const timeRange = parts[1];

                if (day.toLowerCase() !== currentDay.toLowerCase()) return false;

                const [start, end] = timeRange.split('-');
                if (!start || !end) return false;

                const [startHour, startMinute] = start.split(':').map(Number);
                const [endHour, endMinute] = end.split(':').map(Number);

                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;

                return currentTime >= startTime && currentTime < endTime;
            });
        });

        setCurrentProgramId(active ? active.id : null);
    };

    const items = filter === 'program'
        ? programs.map(p => ({ type: 'program' as const, data: p }))
        : events
            .filter(e => !selectedCategory || e.category?.nama === selectedCategory)
            .map(e => ({ type: 'event' as const, data: e }));

    items.sort((a, b) => {
        if (a.type === 'program' && b.type === 'program' && currentProgramId) {
            if (a.data.id === currentProgramId) return -1;
            if (b.data.id === currentProgramId) return 1;
        }
        const dateA = new Date(a.data.createdAt || 0).getTime();
        const dateB = new Date(b.data.createdAt || 0).getTime();
        return dateB - dateA;
    });

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const paginatedItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, selectedCategory]);

    return (
        <div className="py-16 container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001A3A] mb-8 text-center">
                Our content
            </h1>

            {/* Main Filter Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => { setFilter('program'); setSelectedCategory(''); }}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-md text-lg ${filter === 'program'
                        ? 'bg-[#001A3A] text-white ring-2 ring-[#001A3A] ring-offset-2 transform scale-105'
                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                >
                    Programs
                </button>
                <button
                    onClick={() => setFilter('event')}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-md text-lg ${filter === 'event'
                        ? 'bg-[#A12227] text-white ring-2 ring-[#A12227] ring-offset-2 transform scale-105'
                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                >
                    Events
                </button>
            </div>

            {/* Category Filter (Only for Events) */}
            {filter === 'event' && categories.length > 0 && (
                <div className="flex justify-start mb-10 animate-fade-in pl-4 md:pl-0">
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-6 pr-10 rounded-full font-medium shadow-sm hover:border-[#A12227] focus:outline-none focus:ring-2 focus:ring-[#A12227] focus:border-transparent cursor-pointer text-base min-w-[200px]"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.nama}>
                                    {cat.nama}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Content */}
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A12227]"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center text-gray-500 text-xl py-12">
                    Unfortunately, no {filter}s are available at the moment.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedItems.map((item, idx) => (
                            <a
                                key={`${item.type}-${item.data.id}-${idx}`}
                                href={`/${item.type}s/${item.data.id}`}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 block h-full flex flex-col relative
                                    ${item.type === 'program' && item.data.id === currentProgramId ? 'ring-4 ring-[#A12227] ring-offset-2' : ''}
                                `}
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.data.poster || '/images/default-card.jpg'}
                                        alt={item.type === 'program' ? item.data.nama_program : item.data.judul}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'}
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                                    {/* Event Category Badge */}
                                    {item.type === 'event' && item.data.category && (
                                        <div className="absolute top-4 left-4">
                                            {(() => {
                                                const color = getCategoryColor(item.data.category.nama);
                                                return (
                                                    <span className={`${color.solid} text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}>
                                                        {item.data.category.nama}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Program Live Badge */}
                                    {item.type === 'program' && item.data.id === currentProgramId && (
                                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#A12227] text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                                            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                            <span className="text-xs font-bold tracking-wider">ON AIR</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#A12227] transition-colors line-clamp-2">
                                        {item.type === 'program' ? item.data.nama_program : item.data.judul}
                                    </h3>

                                    {/* Condensed Info for Event only */}
                                    {item.type === 'event' && (
                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#A12227]" />
                                                <span>{new Date(item.data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-gray-500 line-clamp-3 text-sm leading-relaxed mb-4 flex-grow">
                                        {item.data.deskripsi}
                                    </p>

                                    <span className="text-[#001A3A] font-semibold text-sm group-hover:underline mt-auto">
                                        Read In Detail &rarr;
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-12">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, items.length)}</span> of <span className="font-bold">{items.length}</span> results
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#A12227] text-white hover:bg-[#A12227]/80'
                                        }`}
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#001A3A] text-white hover:bg-[#001A3A]/80'
                                        }`}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
