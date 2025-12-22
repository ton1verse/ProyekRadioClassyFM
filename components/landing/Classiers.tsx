'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

interface ClassiersProps {
    classiers: any[];
}

export default function Classiers({ classiers }: ClassiersProps) {
    return (
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
    );
}
