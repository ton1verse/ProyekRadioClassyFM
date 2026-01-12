'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/models/Event';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, X, Info } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { getCategoryColor } from '@/lib/utils';

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        const fetchEventAndRelated = async () => {
            try {

                const resEvent = await fetch(`/api/events/${id}`);
                if (!resEvent.ok) {
                    console.error('Event not found');
                    setIsLoading(false);
                    return;
                }
                const eventData = await resEvent.json();
                setEvent(eventData);

                const resAll = await fetch('/api/events');
                if (resAll.ok) {
                    const allEvents: Event[] = await resAll.json();

                    const related = allEvents
                        .filter(e =>
                            e.id !== eventData.id &&
                            ((eventData.categoryId && e.categoryId === eventData.categoryId) ||
                                (eventData.category?.id && e.category?.id === eventData.category.id))
                        )
                        .slice(0, 3);

                    setRelatedEvents(related);
                }

            } catch (error) {
                console.error('Error fetching event data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchEventAndRelated();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E5B300]"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-[#001A3A] text-white rounded-full hover:bg-[#001A3A]/90 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const eventDate = new Date(event.tanggal);

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#A12227] transition-colors mb-8 group font-medium"
                >
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
                    <div
                        className="w-full h-[400px] md:h-[500px] relative cursor-zoom-in group"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        <img
                            src={event.poster || '/images/default-card.jpg'}
                            alt={event.judul}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=No+Image'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full text-white pointer-events-none">
                            {event.category && (
                                (() => {
                                    const color = getCategoryColor(event.category.nama);
                                    return (
                                        <span className={`inline-block px-4 py-1.5 ${color.solid} text-xs font-bold uppercase tracking-wider rounded-full mb-4`}>
                                            {event.category.nama}
                                        </span>
                                    );
                                })()
                            )}
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight shadow-sm">
                                {event.judul}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 p-8 md:p-12">
                        <div className="lg:w-2/3">
                            <h3 className="text-2xl font-bold text-[#001A3A] mb-6">About this Event</h3>
                            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {event.deskripsi}
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
                                <h4 className="text-xl font-bold text-gray-900 mb-6">Event Details</h4>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Date</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Time</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Location</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {event.lokasi}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedEvents.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-8 bg-[#E5B300] rounded-full"></div>
                            <h2 className="text-3xl font-bold text-[#001A3A]">Related Events</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedEvents.map((relEvent) => (
                                <a
                                    key={relEvent.id}
                                    href={`/events/${relEvent.id}`}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={relEvent.poster || '/images/default-card.jpg'}
                                            alt={relEvent.judul}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#001A3A] shadow-sm">
                                            {new Date(relEvent.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-[#E5B300] transition-colors">{relEvent.judul}</h3>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MapPin size={14} className="mr-1" />
                                            <span className="truncate">{relEvent.lokasi}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isLightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={40} />
                    </button>
                    <img
                        src={event.poster || '/images/default-card.jpg'}
                        alt={event.judul}
                        className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
