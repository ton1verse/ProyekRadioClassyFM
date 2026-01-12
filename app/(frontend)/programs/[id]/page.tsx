'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/models/Program';
import { useParams, useRouter } from 'next/navigation';
import { Clock, User, ChevronLeft } from 'lucide-react';

const formatSchedule = (jadwal: string) => {
    if (!jadwal) return <span className="text-gray-400 italic">Belum ditentukan</span>;
    if (jadwal.includes(';')) {
        return (
            <ul className="space-y-1">
                {jadwal.split(';').map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#A12227] rounded-full mt-2.5 flex-shrink-0" />
                        <span>{s.trim()}</span>
                    </li>
                ))}
            </ul>
        );
    }
    return jadwal;
};

export default function ProgramDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [relatedPrograms, setRelatedPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const fetchProgramData = async () => {
            try {
                const [itemRes, allRes] = await Promise.all([
                    fetch(`/api/programs/${id}`),
                    fetch('/api/programs')
                ]);

                if (itemRes.ok) {
                    const data = await itemRes.json();
                    setProgram(data);
                } else {
                    console.error('Program not found');
                }

                if (allRes.ok) {
                    const allData: Program[] = await allRes.json();
                    // Filter out current program and take 3
                    // If we had categories, we could filter by category here
                    const related = allData
                        .filter(p => String(p.id) !== String(id))
                        .slice(0, 3);
                    setRelatedPrograms(related);
                }

            } catch (error) {
                console.error('Error fetching program data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProgramData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A12227]"></div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Program Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-[#001A3A] text-white rounded-full hover:bg-[#001A3A]/90 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#A12227] transition-colors mb-8 group font-medium"
                >
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/2 relative min-h-[400px] group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
                            <img
                                src={program.poster || '/images/default-card.jpg'}
                                alt={program.nama_program}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=No+Image'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10 transition-opacity group-hover:opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                    Click to expand
                                </div>
                            </div>
                        </div>

                        {/*Content Section*/}
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-6">
                                <span className="inline-block px-4 py-1.5 bg-[#001A3A] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                    Program
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                    {program.nama_program}
                                </h1>

                                {/* Meta Data */}
                                <div className="space-y-4 mb-8">
                                    {program.classier?.nama && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Broadcaster</p>
                                                <p className="font-medium text-lg">{program.classier.nama}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#A12227]">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Schedule</p>
                                            <p className="font-medium text-lg leading-relaxed">{formatSchedule(program.jadwal)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
                                <p>{program.deskripsi}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Programs Section */}
            {relatedPrograms.length > 0 && (
                <div className="container mx-auto px-6 mt-16">
                    <h2 className="text-3xl font-bold text-[#001A3A] mb-8">Another Programs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPrograms.map((item, idx) => (
                            <a
                                key={`related-${item.id}-${idx}`}
                                href={`/programs/${item.id}`}
                                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 block h-full flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.poster || '/images/default-card.jpg'}
                                        alt={item.nama_program}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'}
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#A12227] transition-colors line-clamp-1">
                                        {item.nama_program}
                                    </h3>
                                    <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed mb-4 flex-grow">
                                        {item.deskripsi}
                                    </p>
                                    <span className="text-[#001A3A] font-semibold text-sm group-hover:underline mt-auto">
                                        Read In Detail &rarr;
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setIsPreviewOpen(false)}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={program.poster || '/images/default-card.jpg'}
                        alt={program.nama_program}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
