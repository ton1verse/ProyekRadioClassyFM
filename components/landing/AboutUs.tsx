import { ArrowRight, Instagram, Twitter, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Classier {
    id: number;
    nama: string;
    foto?: string;
    deskripsi?: string;
    motto?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
}

interface GalleryImage {
    id: number;
    url: string;
}

interface Gallery {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal?: string | Date;
    images: GalleryImage[];
}

export default function AboutUs({ compact = false }: { compact?: boolean }) {
    const router = useRouter();
    const [classiers, setClassiers] = useState<Classier[]>([]);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchClassiers = async () => {
            try {
                const response = await fetch('/api/classiers');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        const activeClassiers = data.filter((c: any) => c.status !== 'nonaktif' && c.status !== 'inactive');
                        setClassiers(activeClassiers);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch classiers', error);
            }
        };

        const fetchGalleries = async () => {
            try {
                const response = await fetch('/api/galleries');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setGalleries(data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch galleries', error);
            }
        };

        fetchClassiers();
        fetchGalleries();
    }, []);

    useEffect(() => {
        if (classiers.length > 0 && window.location.hash) {
            const hash = window.location.hash;
            let retries = 0;

            const attemptScroll = () => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);

                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('ring', 'ring-[#A12227]', 'ring-offset-4');
                    setTimeout(() => {
                        element.classList.remove('ring', 'ring-[#A12227]', 'ring-offset-4');
                    }, 2000);
                    return true;
                }
                return false;
            };

            if (!attemptScroll()) {
                const interval = setInterval(() => {
                    if (attemptScroll() || retries > 20) {
                        clearInterval(interval);
                    }
                    retries++;
                }, 100);

                return () => clearInterval(interval);
            }
        }
    }, [classiers]);

    const gradients = [
        'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
        'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500',
        'bg-gradient-to-r from-green-400 via-teal-500 to-blue-500',
        'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
    ];

    return (
        <section id="profile" className={`${compact ? 'pt-8 pb-20' : 'py-20'} bg-white container mx-auto px-6`}>
            {/* Unified Company Profile Container */}
            <div className="bg-[#001A3A] text-white p-6 md:p-8 rounded-[20px] shadow-2xl relative overflow-hidden max-w-5xl mx-auto mb-20">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#A12227] rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>

                <div className="flex flex-col gap-8">
                    {/* Images Section - Integrated & Vertical */}
                    <div className="flex flex-col gap-0 w-full md:w-2/3 mx-auto">
                        <img
                            src="/images/Profile_2.jpg"
                            alt="Vision, Mission, and Meaning"
                            className="w-full shadow-none"
                        />
                        <img
                            src="/images/Profile.jpg"
                            alt="Listeners Profile and Broadcast Format"
                            className="w-full shadow-none"
                        />
                    </div>

                    {/* Text Details Section */}
                    <div className="space-y-4 text-sm relative z-10">
                        {/* Company Name */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Nama Perusahaan</span>
                            <span className="md:col-span-2 font-bold text-white">PT Radio Gema Karang Putih || Classy FM</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Pemegang Saham</span>
                            <span className="md:col-span-2 text-white">Forum Komunikasi Karyawan Semen Padang</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Station Call</span>
                            <span className="md:col-span-2 font-semibold text-white">103.4 Classy FM</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Frequency</span>
                            <span className="md:col-span-2 font-mono text-white font-bold">103.4 MHz</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Slogan</span>
                            <span className="md:col-span-2 italic text-white">"The Actual Radio - More Than Just Talk"</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Transmitter</span>
                            <span className="md:col-span-2 text-white">RVR PJ6KPS-CA Hot Plug 6Kw</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Antenna</span>
                            <span className="md:col-span-2 text-white">OMB SGP-6</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Audio Processor</span>
                            <div className="md:col-span-2 space-y-1 text-white">
                                <div className="flex gap-2"><span className="opacity-80 w-24">Digital :</span> <span>Orban 8600HD</span></div>
                                <div className="flex gap-2"><span className="opacity-80 w-24">Voice :</span> <span>Symetrix 528E</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Console</span>
                            <span className="md:col-span-2 text-white">D&R Airmate-12 USB</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Call Sign</span>
                            <span className="md:col-span-2 text-white">PM5QO</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Coverage Area</span>
                            <span className="md:col-span-2 leading-relaxed text-white">Kota Padang, Kota Pariaman, Kabupaten Solok, Kabupaten Padang Pariaman</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Kantor/Studio</span>
                            <span className="md:col-span-2 leading-relaxed text-white">GSG Lt. II Semen Padang Indarung, Padang 25237<br />Sumatera Barat - Indonesia</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/10 pb-3">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Contact</span>
                            <div className="md:col-span-2 space-y-1 text-white">
                                <div><span className="opacity-80">Phone:</span> +62 (0751) 74999 / +62 811 660 4090</div>
                                <div><span className="opacity-80">Email:</span> classyfm@classyfm.co.id</div>
                                <div><span className="opacity-80">Web:</span> www.classyfm.co.id</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                            <span className="text-white font-bold uppercase tracking-wider opacity-80">Live Streaming</span>
                            <span className="md:col-span-2 font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                On 7x18 Hours
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CLASSIER SECTION - Compact Dark Vertical Stack */}
            <div id="classiers" className="max-w-5xl mx-auto mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-[#001A3A] tracking-tighter">Meet The Classiers</h2>
                    <div className="w-24 h-1 bg-[#A12227] mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="flex flex-col w-full rounded-[30px] overflow-hidden shadow-2xl border border-white/10">
                    {classiers.map((classier, index) => (
                        <div
                            key={classier.id}
                            id={`classier-${classier.id}`}
                            onClick={() => router.push(`/profile#classier-${classier.id}`)}
                            className="group relative w-full h-[180px] md:h-[240px] bg-[#001A3A] hover:bg-[#00204a] transition-colors duration-500 overflow-hidden border-b border-white/5 last:border-b-0 flex items-center justify-between px-6 md:px-16 cursor-pointer"
                        >
                            {/* Left Content Area: Name, Line, Motto, Socmed */}
                            <div className="flex flex-col justify-between h-full py-6 md:py-8 z-20 relative max-w-lg">
                                {/* Top Content: Name & Motto */}
                                <div>
                                    <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-3 group-hover:text-[#A12227] transition-colors duration-300">
                                        {classier.nama}
                                    </h3>
                                    <div className="w-16 h-1 bg-white/20 mb-3 group-hover:w-32 group-hover:bg-[#A12227] transition-all duration-500"></div>
                                    <p className="text-gray-400 text-base md:text-lg italic font-light tracking-wide">
                                        "{classier.motto || classier.deskripsi || "The Voice of Classy FM"}"
                                    </p>
                                </div>

                                {/* Bottom Content: Social Media */}
                                <div
                                    className="flex gap-4 items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {classier.instagram && (
                                        <a href={classier.instagram} target="_blank" rel="noopener noreferrer">
                                            <Instagram className="text-white hover:text-[#A12227] cursor-pointer transition-colors" size={20} />
                                        </a>
                                    )}
                                    {classier.twitter && (
                                        <a href={classier.twitter} target="_blank" rel="noopener noreferrer">
                                            <Twitter className="text-white hover:text-[#A12227] cursor-pointer transition-colors" size={20} />
                                        </a>
                                    )}
                                    {classier.facebook && (
                                        <a href={classier.facebook} target="_blank" rel="noopener noreferrer">
                                            <Facebook className="text-white hover:text-[#A12227] cursor-pointer transition-colors" size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Right Content: Image */}
                            <div className="absolute right-0 bottom-0 top-0 w-1/2 md:w-1/3 flex items-end justify-end pointer-events-none">
                                <div className="relative h-full w-full flex items-end justify-end">
                                    {/* Gradient Overlay for Image Blending - improved blending */}
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#001A3A]/20 to-[#001A3A] z-10"></div>

                                    {classier.foto ? (
                                        <img
                                            src={classier.foto}
                                            alt={classier.nama}
                                            className="h-[95%] w-auto object-contain transition-all duration-700 drop-shadow-2xl translate-y-2 group-hover:translate-y-0 z-0 opacity-80 group-hover:opacity-100"
                                            style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-end pr-8 pb-8">
                                            <span className="text-8xl opacity-10">🎙️</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Active/Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#A12227]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* GALLERY SECTION */}
            <div className="max-w-7xl mx-auto mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black text-[#001A3A] tracking-tighter">Gallery</h2>
                    <div className="w-24 h-1 bg-[#A12227] mx-auto mt-4 rounded-full"></div>
                </div>

                {galleries.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p>No gallery albums available at the moment.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {galleries.slice((currentPage - 1) * 6, currentPage * 6).map((gallery) => (
                                <div
                                    key={gallery.id}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedGallery(gallery)}
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-4">
                                        {/* Image */}
                                        {gallery.images && gallery.images.length > 0 ? (
                                            <img
                                                src={gallery.images[0].url}
                                                alt={gallery.judul}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                                        {/* Count Badge */}
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                            {gallery.images?.length || 0} Photos
                                        </div>
                                    </div>

                                    <div className="text-xs text-[#A12227] font-bold mb-1 uppercase tracking-wider">
                                        {gallery.tanggal ? new Date(gallery.tanggal).toLocaleDateString() : ''}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#001A3A] group-hover:text-[#A12227] transition-colors line-clamp-1 mb-1">
                                        {gallery.judul}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {gallery.deskripsi}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {galleries.length > 6 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-3 rounded-full font-bold transition-all ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#001A3A] border-2 border-[#001A3A] hover:bg-[#001A3A] hover:text-white'
                                        }`}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="text-[#001A3A] font-bold">
                                    Page {currentPage} of {Math.ceil(galleries.length / 6)}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(galleries.length / 6)))}
                                    disabled={currentPage === Math.ceil(galleries.length / 6)}
                                    className={`p-3 rounded-full font-bold transition-all ${currentPage === Math.ceil(galleries.length / 6)
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#001A3A] border-2 border-[#001A3A] hover:bg-[#001A3A] hover:text-white'
                                        }`}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* COLLABORATION SECTION */}
            <div id="collaboration" className="max-w-2xl mx-auto mb-20 px-3">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black text-[#001A3A]  tracking-tighter">Collaboration</h2>
                    <div className="w-24 h-1 bg-[#A12227] mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-gray-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <img
                        src="/images/ratecard.jpg"
                        alt="Collaboration Rate Card 2023"
                        className="w-full h-auto"
                        onClick={() => setPreviewImage('/images/RateCard2023.jpg')}
                    />
                </div>
            </div>

            {/* Gallery Modal */}
            {selectedGallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGallery(null)}>
                    <div
                        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="text-3xl font-black text-[#001A3A] mb-2">{selectedGallery.judul}</h3>
                                <p className="text-gray-600">{selectedGallery.deskripsi}</p>
                            </div>
                            <button
                                onClick={() => setSelectedGallery(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <span className="text-2xl font-bold text-gray-500">×</span>
                            </button>
                        </div>

                        {/* Content - Scrollable Grid */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedGallery.images?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md group">
                                        <img
                                            src={img.url}
                                            alt={`${selectedGallery.judul} - ${idx + 1}`}
                                            onClick={() => setPreviewImage(img.url)}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Image Preview Overlay */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[70]"
                        onClick={() => setPreviewImage(null)}
                    >
                        <span className="text-4xl">×</span>
                    </button>
                    <img
                        src={previewImage}
                        alt="Full View"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    />
                </div>
            )}
        </section>
    );
}
