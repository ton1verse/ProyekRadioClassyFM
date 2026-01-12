'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Facebook, Instagram } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Panel - Image Background with Premium Glow Animation */}
            <div className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center bg-[#001A3A]">
                {/* Background Image with Zoom Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                    style={{ backgroundImage: "url('/classy.jpg')" }}
                />

                {/* Dark Blue Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#001A3A]/80 via-[#001A3A]/60 to-[#001A3A]/90 z-10" />

                {/* Mouse Tracking Spotlight / Glow */}
                <div
                    className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-20 transition-transform duration-300 cubic-bezier(0.2, 0.2, 0.2, 0.9)"
                    style={{
                        background: 'radial-gradient(circle, rgba(161, 34, 39, 0.15) 0%, rgba(161, 34, 39, 0.05) 40%, transparent 70%)',
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)`,
                        top: 0,
                        left: 0,
                        mixBlendMode: 'plus-lighter'
                    }}
                />

                {/* Secondary Floating "Mist" for Detail */}
                <div
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-20 blur-3xl opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
                        transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px) translate(-50%, -50%)`,
                        top: 0,
                        left: 0,
                        transition: 'transform 0.5s ease-out'
                    }}
                />
            </div>

            {/* Right Panel - White with Form */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-left mb-10">
                        <h2 className="text-4xl font-bold text-[#001A3A] tracking-tight mb-2">
                            Sign In
                        </h2>
                        <p className="text-gray-500">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-[#A12227] rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#001A3A]" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#001A3A]/20 focus:border-[#001A3A] transition-all"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#001A3A]" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#001A3A]/20 focus:border-[#001A3A] transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#A12227] hover:bg-[#8B1D22] text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-lg shadow-red-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Social Media Icons */}
                    <div className="mt-12 flex justify-center gap-6">
                        <a href="https://x.com/ClassyFM" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#001A3A] hover:bg-[#A12227] hover:scale-110 transition-all duration-300 text-white group" aria-label="X (Twitter)">
                            {/* Custom X SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="fill-current">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/ClassyfmPadang?locale=id_ID" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#001A3A] hover:bg-[#A12227] hover:scale-110 transition-all duration-300 text-white group" aria-label="Facebook">
                            <Facebook size={20} className="fill-current" />
                        </a>
                        <a href="https://www.instagram.com/classyfm/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#001A3A] hover:bg-[#A12227] hover:scale-110 transition-all duration-300 text-white group" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.youtube.com/@ClassyfmPadang" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#001A3A] hover:bg-[#A12227] hover:scale-110 transition-all duration-300 text-white group" aria-label="YouTube">
                            {/* Custom YouTube SVG to ensure 'arrow' visibility */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="fill-current">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                        <a href="https://open.spotify.com/show/5Mcc1Xick5jqoXu5kTBZAV?si=546a26313fd747bd" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#001A3A] hover:bg-[#A12227] hover:scale-110 transition-all duration-300 text-white group" aria-label="Spotify">
                            {/* Spotify SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="fill-current">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                        </a>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-400">
                        Classy FM - All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
