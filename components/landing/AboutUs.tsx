import { ArrowRight } from 'lucide-react';

export default function AboutUs() {
    return (
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
    );
}
