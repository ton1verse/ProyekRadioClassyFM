'use client';

import { useState, useEffect, useRef } from 'react';
import { Program } from '@/models/Program';
import { Play, Pause, Volume2, VolumeX, Calendar, ChevronDown } from 'lucide-react';

export default function ListenPage() {
    const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [allPrograms, setAllPrograms] = useState<Program[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const audioRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        setSelectedDay(days[new Date().getDay()]);

        const fetchPrograms = async () => {
            try {
                const response = await fetch('/api/programs');
                if (response.ok) {
                    const programs: Program[] = await response.json();
                    setAllPrograms(programs);
                    findCurrentProgram(programs);
                }
            } catch (error) {
                console.error('Error fetching programs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();

        const interval = setInterval(() => {
            fetchPrograms();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Unified robust parser that handles "Day Time; Time" format
    const parseSchedules = (jadwalString: string) => {
        if (!jadwalString) return [];
        const rawItems = jadwalString.split(/[;,\n]+/);
        const parsed: { day: string, timeRange: string }[] = [];

        let lastDay = '';

        rawItems.forEach(item => {
            const clean = item.trim();
            if (!clean) return;

            // Check if it starts with a Day Name
            const firstSpace = clean.indexOf(' ');
            if (firstSpace !== -1) {
                const dayPart = clean.substring(0, firstSpace).trim();
                const possibleDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

                // Case insensitive check
                const matchDay = possibleDays.find(d => d.toLowerCase() === dayPart.toLowerCase());

                if (matchDay) {
                    lastDay = matchDay;
                    const timePart = clean.substring(firstSpace).trim();
                    parsed.push({ day: lastDay, timeRange: timePart });
                    return;
                }
            }

            // If no day found, assume it is just a TimeRange belonging to lastDay
            if (lastDay) {
                parsed.push({ day: lastDay, timeRange: clean });
            }
        });

        return parsed;
    };

    const findCurrentProgram = (programs: Program[]) => {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const currentDay = days[now.getDay()];
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        console.log(`Checking Programs for ${currentDay} ${currentHour}:${currentMinute} (${currentTime})`);

        const active = programs.find((program) => {
            if (!program.jadwal) return false;

            const schedules = parseSchedules(program.jadwal);

            return schedules.some(({ day, timeRange }) => {
                if (day.toLowerCase() !== currentDay.toLowerCase()) return false;

                const [start, end] = timeRange.split(/\s*(?:[-–—]|sampai|to)\s*/i);
                if (!start || !end) return false;

                const [startHour, startMinute] = start.split(/[:.]/).map(Number);
                const [endHour, endMinute] = end.split(/[:.]/).map(Number);

                if (isNaN(startHour) || isNaN(endHour)) return false;

                const startTime = startHour * 60 + (startMinute || 0);
                const endTime = endHour * 60 + (endMinute || 0);

                const isActive = currentTime >= startTime && currentTime < endTime;
                if (isActive) console.log(`Found Active Program: ${program.nama_program} (${startTime}-${endTime})`);
                return isActive;
            });
        });

        setCurrentProgram(active || null);
    };

    // Helper to get programs for a specific day
    const getProgramsForDay = (day: string) => {
        return allPrograms.flatMap(p => {
            if (!p.jadwal) return [];

            const schedules = parseSchedules(p.jadwal);

            return schedules
                .filter(s => s.day.toLowerCase() === day.toLowerCase())
                .map(s => {
                    return { ...p, timeForDay: s.timeRange } as Program & { timeForDay: string };
                });
        }).sort((a, b) => {
            return a.timeForDay.localeCompare(b.timeForDay);
        });
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            const nextMuteState = !isMuted;
            audioRef.current.muted = nextMuteState;
            setIsMuted(nextMuteState);
            if (nextMuteState) {
                setVolume(0);
            } else {
                setVolume(1);
                audioRef.current.volume = 1;
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            if (newVolume === 0) {
                setIsMuted(true);
                audioRef.current.muted = true;
            } else {
                setIsMuted(false);
                audioRef.current.muted = false;
            }
        }
    };

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="container mx-auto px-6 pt-10 text-center">
                <h1 className="text-5xl font-extrabold text-[#001A3A] mb-4">Live Streaming</h1>
                <p className="text-gray-600 mb-12 text-lg">Listen to Classy FM live from anywhere.</p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: LIVE PLAYER (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">

                        {/* Live Player Card */}
                        <div className="bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-[4/5] md:aspect-[4/3] lg:aspect-[3/4] group border-8 border-white">

                            {/* Background Image (Current Program Poster or Offline Gradient) */}
                            <div className="absolute inset-0">
                                {currentProgram?.poster ? (
                                    <img
                                        src={currentProgram.poster}
                                        alt={currentProgram.nama_program}
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 text-left z-10">
                                <div className="mb-auto flex justify-between items-start">
                                    {currentProgram ? (
                                        <span className="bg-[#A12227] text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                            LIVE ON AIR
                                        </span>
                                    ) : (
                                        <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            OFFLINE
                                        </span>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                        {currentProgram ? currentProgram.nama_program : "Streaming Offline"}
                                    </h2>
                                    <p className="text-gray-300 text-lg font-medium">
                                        {currentProgram?.classier?.nama
                                            ? `with ${currentProgram.classier.nama}`
                                            : "Saat ini tidak ada siaran berlangsung."}
                                    </p>
                                </div>

                                {/* Custom Controls */}
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={currentProgram ? togglePlay : undefined}
                                        disabled={!currentProgram}
                                        className={`w-16 h-16 flex items-center justify-center rounded-full transition-transform shadow-lg shadow-red-900/20 ${currentProgram ? 'bg-white text-[#A12227] hover:scale-110 cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                    </button>

                                    <div className="flex-1">
                                        {/* Fake Waveform Visualizer */}
                                        <div className="flex gap-1 items-end h-8">
                                            {[...Array(20)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1 bg-white/50 rounded-full transition-all duration-300 ${isPlaying && currentProgram ? 'animate-music-bar' : 'h-1'}`}
                                                    style={{
                                                        height: isPlaying && currentProgram ? `${Math.max(20, Math.random() * 100)}%` : '4px',
                                                        animationDelay: `${i * 0.05}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {currentProgram && (
                                        <div
                                            className="relative group flex flex-col items-center"
                                            onMouseEnter={() => setShowVolumeSlider(true)}
                                            onMouseLeave={() => setShowVolumeSlider(false)}
                                        >
                                            {showVolumeSlider && (
                                                <div className="absolute bottom-full pb-4 flex flex-col items-center animate-fade-in z-20">
                                                    <div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={volume}
                                                            onChange={handleVolumeChange}
                                                            className="w-24 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer -rotate-90 origin-center translate-y-8"
                                                            style={{ width: '100px' }}
                                                        />
                                                        <div className="h-24"></div>
                                                    </div>
                                                </div>
                                            )}
                                            <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors relative z-10 p-2">
                                                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hidden Audio Element - Only render if program exists? Or keep but don't auto-play */}
                            <video
                                ref={audioRef}
                                className="hidden"
                                disableRemotePlayback
                                webkit-playsinline="true"
                                playsInline
                                src="https://c4.siar.us:10340/stream.mp3"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            ></video>
                        </div>

                        {/* Frequency Card (Small) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">Frequency</p>
                                <p className="text-2xl font-black text-[#001A3A]">103.4 FM</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-50 text-[#001A3A] rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-[#A12227] rounded-full animate-ping" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: WEEKLY SCHEDULE */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden min-h-[600px] border border-gray-100">

                            {/* Header & Dropdown */}
                            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-2xl font-bold text-[#001A3A] flex items-center gap-2">
                                    <Calendar className="text-[#A12227]" />
                                    Weekly Schedule
                                </h3>

                                <div className="relative group">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        className="appearance-none bg-gray-50 border-2 border-gray-200 text-[#001A3A] font-bold py-3 pl-6 pr-12 rounded-xl focus:outline-none focus:border-[#A12227] focus:ring-4 focus:ring-red-500/10 transition-all cursor-pointer w-full md:w-auto text-lg"
                                    >
                                        {days.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#A12227] transition-colors" size={20} />
                                </div>
                            </div>

                            {/* Timeline List */}
                            <div className="p-8 bg-white">
                                {getProgramsForDay(selectedDay).length > 0 ? (
                                    <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[2rem] before:w-0.5 before:-translate-x-1/2 before:bg-gray-100">
                                        {getProgramsForDay(selectedDay).map((program, idx) => {
                                            const todayName = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
                                            // Check day first
                                            const isToday = selectedDay.toLowerCase() === todayName.toLowerCase();

                                            // Parse time range for this specific slot
                                            let isTimeActive = false;
                                            if (isToday && program.timeForDay) {
                                                const [start, end] = program.timeForDay.split(/\s*(?:[-–—]|sampai|to)\s*/i);
                                                if (start && end) {
                                                    const now = new Date();
                                                    const currentMin = now.getHours() * 60 + now.getMinutes();

                                                    // Support HH:MM or HH.MM
                                                    const [sh, sm] = start.split(/[:.]/).map(Number);
                                                    const [eh, em] = end.split(/[:.]/).map(Number);

                                                    if (!isNaN(sh) && !isNaN(eh)) {
                                                        const startMin = sh * 60 + (sm || 0);
                                                        const endMin = eh * 60 + (em || 0);

                                                        isTimeActive = currentMin >= startMin && currentMin < endMin;
                                                    }
                                                }
                                            }

                                            const isLive = isToday && isTimeActive;

                                            return (
                                                <div key={idx} className={`relative flex items-start gap-6 group pl-8 ${isLive ? 'z-10' : ''}`}>

                                                    {/* Dot on Timeline */}
                                                    <div className={`absolute left-[1.5rem] mt-[1.6rem] w-4 h-4 rounded-full border-4 border-white transition-all shadow-sm z-10 
                                                        ${isLive ? 'bg-[#A12227] scale-150 shadow-[0_0_0_4px_rgba(161,34,39,0.2)] animate-pulse' : 'bg-gray-300 group-hover:bg-[#A12227] group-hover:scale-125'}`}
                                                    />

                                                    {/* Line connector fix for highlighted item */}
                                                    {isLive && <div className="absolute left-[2rem] top-[2.2rem] bottom-[-2rem] w-0.5 bg-[#A12227]/20 -z-10 -translate-x-1/2"></div>}

                                                    {/* Time */}
                                                    <div className="w-24 pt-4 flex-shrink-0 text-right">
                                                        <span className={`block font-bold text-lg leading-none ${isLive ? 'text-[#A12227]' : 'text-[#001A3A]'}`}>{program.timeForDay.split('-')[0]}</span>
                                                        <span className={`text-xs font-medium ${isLive ? 'text-[#A12227]/80' : 'text-gray-400'}`}>{program.timeForDay.split('-')[1] || ''}</span>
                                                    </div>

                                                    {/* Content Card (Clickable) */}
                                                    <a href={`/programs/${program.id}`} className={`flex-1 block p-5 rounded-2xl transition-all duration-300 border text-left 
                                                        ${isLive ? 'bg-red-50 border-[#A12227]/30 shadow-lg' : 'bg-gray-50 border-transparent hover:bg-white hover:shadow-lg hover:border-[#A12227]/20 cursor-pointer'}`}>
                                                        <div className="flex gap-4 items-start">
                                                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                                                {program.poster ? (
                                                                    <img src={program.poster} alt={program.nama_program} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#001A3A] font-bold text-xl">
                                                                        {program.nama_program.charAt(0)}
                                                                    </div>
                                                                )}
                                                                {isLive && (
                                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                                        <div className="bg-[#A12227] w-2 h-2 rounded-full animate-ping"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="w-full text-left">
                                                                {isLive && (
                                                                    <div className="mb-2">
                                                                        <span className="inline-block bg-[#A12227] text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                                                            ON AIR NOW
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <h4 className={`font-bold text-xl mb-1 leading-tight transition-colors ${isLive ? 'text-[#A12227]' : 'text-[#001A3A] group-hover:text-[#A12227]'}`}>
                                                                    {program.nama_program}
                                                                </h4>
                                                                <p className="text-sm font-bold text-gray-600 mb-2">
                                                                    With {program.classier?.nama || 'Classy FM'}
                                                                </p>
                                                                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed text-justify">
                                                                    {program.deskripsi}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                                        <Calendar size={48} className="text-gray-300 mb-4" />
                                        <p className="text-xl font-bold text-gray-800">No Schedule</p>
                                        <p className="text-gray-500">There are no programs scheduled for {selectedDay}.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CSS for custom animations */}
            <style jsx global>{`
                @keyframes music-bar {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .animate-music-bar {
                    animation: music-bar 0.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
