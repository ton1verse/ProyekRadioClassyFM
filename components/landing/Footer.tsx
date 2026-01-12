import Link from 'next/link';
import { Phone, Mail, Facebook, Instagram, Youtube, Link2, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#001A3A] text-white pt-16 pb-0">
            <div className="container mx-auto px-6 mb-12">
                {/* Grid Layout: 3 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Column 1: Map & Address */}
                    <div className="flex flex-col gap-6">
                        {/* Map Placeholder */}
                        <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative group">
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
                                    <a href="https://x.com/ClassyFM" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#A12227] transition-colors group">
                                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="fill-current group-hover:fill-[#A12227]">
                                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                            </svg>
                                        </div>
                                        <span>@ClassyFM</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <a href="https://www.facebook.com/ClassyfmPadang?locale=id_ID" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#A12227] transition-colors">
                                        <Facebook size={18} />
                                        <span>Classyfm Padang</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <a href="https://www.instagram.com/classyfm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#A12227] transition-colors">
                                        <Instagram size={18} />
                                        <span>@classyfm</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <a href="https://www.youtube.com/@ClassyfmPadang" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#A12227] transition-colors">
                                        <Youtube size={18} />
                                        <span>Classy 103.4 FM Padang</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <a href="https://open.spotify.com/show/5Mcc1Xick5jqoXu5kTBZAV?si=546a26313fd747bd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#A12227] transition-colors group">
                                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="fill-current group-hover:fill-[#A12227]">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                            </svg>
                                        </div>
                                        <span>Radio Classy FM-Padang</span>
                                    </a>
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
    );
}
