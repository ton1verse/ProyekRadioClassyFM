import Link from 'next/link';
import { Phone, Mail, Twitter, Facebook, Instagram, Youtube, Music, Link2, MapPin } from 'lucide-react';

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
                                    <Twitter size={18} />
                                    <span>@ClassyFM</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Facebook size={18} />
                                    <span>Classyfm Padang</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Instagram size={18} />
                                    <span>@classyfm</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Youtube size={18} />
                                    <span>Classy 103.4 FM Padang</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Music size={18} />
                                    <span>Radio Classy FM-Padang</span>
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
