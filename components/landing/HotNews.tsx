import { ArrowRight } from 'lucide-react';

interface HotNewsProps {
    news: any[];
    loading: boolean;
}

export default function HotNews({ news, loading }: HotNewsProps) {
    return (
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
    );
}
