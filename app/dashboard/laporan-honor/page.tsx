'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Printer, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LaporanHonorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [month, setMonth] = useState(() => {
        const m = searchParams.get('month');
        return m ? parseInt(m) : new Date().getMonth();
    });
    const [year, setYear] = useState(() => {
        const y = searchParams.get('year');
        return y ? parseInt(y) : new Date().getFullYear();
    });
    const [classierId, setClassierId] = useState(searchParams.get('classierId') || '');

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    useEffect(() => {
        fetchReport();
    }, [month, year, classierId]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let url = `/api/reports/honor?month=${month}&year=${year}`;
            if (classierId) url += `&classier_id=${classierId}`;

            const res = await fetch(url);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error('Failed to fetch report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalPayout = data.reduce((sum, item) => sum + item.total_honor, 0);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar - Hidden on Print */}
            <div className="w-64 flex-shrink-0 print:hidden">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col">
                {/* Header - Hidden on Print */}
                <div className="print:hidden">
                    <Header />
                </div>

                <main className="flex-1 p-8 print:p-0 bg-gray-50 print:bg-white">
                    {/* Controls & Title - Hidden on Print */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:hidden">
                        <div>
                            <h1 className="text-2xl font-black text-[#001A3A] flex items-center gap-2">
                                <FileText className="text-[#A12227]" />
                                Laporan Honor Classier
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Kalkulasi gaji bulanan berdasarkan jam siaran & podcast.</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                    className="bg-transparent text-sm font-bold text-gray-700 p-2 outline-none cursor-pointer"
                                >
                                    {months.map((m, idx) => (
                                        <option key={idx} value={idx}>{m}</option>
                                    ))}
                                </select>
                                <div className="w-px h-6 bg-gray-300"></div>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="bg-transparent text-sm font-bold text-gray-700 p-2 outline-none cursor-pointer"
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-[#001A3A] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#A12227] transition-colors shadow-lg"
                            >
                                <Printer size={18} />
                                Cetak Laporan
                            </button>
                        </div>
                    </div>

                    {/* Report Content - Visible on Print */}
                    <div ref={componentRef} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">

                        {/* Report Header for Print */}
                        <div className="hidden print:block text-center mb-8 pt-4 border-b pb-6">
                            <img src="/classy.jpg" alt="Logo" className="h-16 mx-auto mb-2 object-contain" />
                            <h2 className="text-2xl font-black text-[#001A3A] uppercase tracking-wider">
                                {classierId ? 'SLIP HONOR CLASSIER' : 'LAPORAN HONOR CLASSIER'}
                            </h2>
                            <p className="text-gray-600 font-medium">Periode: {months[month]} {year}</p>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-500">
                                <span className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#A12227] rounded-full animate-spin mb-2"></span>
                                <p>Menghitung kalkulasi honor...</p>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Tidak ada data classier aktif untuk periode ini.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#001A3A] text-white print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
                                            <th className="py-4 px-6 text-left font-bold w-12 text-center">No</th>
                                            <th className="py-4 px-6 text-left font-bold">Nama Classier</th>
                                            <th className="py-4 px-6 text-right font-bold">Honor / Jam</th>
                                            <th className="py-4 px-6 text-center font-bold bg-white/5 print:bg-transparent">Jam Program</th>
                                            <th className="py-4 px-6 text-center font-bold bg-white/5 print:bg-transparent">Jam Podcast</th>
                                            <th className="py-4 px-6 text-center font-bold">Total Jam</th>
                                            <th className="py-4 px-6 text-right font-bold bg-[#A12227] print:bg-transparent">Total Honor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors print:hover:bg-transparent">
                                                <td className="py-4 px-6 text-center text-gray-500">{index + 1}</td>
                                                <td className="py-4 px-6 font-bold text-[#001A3A]">{item.nama}</td>
                                                <td className="py-4 px-6 text-right text-gray-600 tabular-nums">
                                                    {formatCurrency(item.honor_per_jam)}
                                                </td>
                                                <td className="py-4 px-6 text-center tabular-nums bg-gray-50/50 print:bg-transparent">
                                                    {item.program_hours} jam
                                                </td>
                                                <td className="py-4 px-6 text-center tabular-nums bg-gray-50/50 print:bg-transparent">
                                                    {item.podcast_hours} jam
                                                </td>
                                                <td className="py-4 px-6 text-center font-bold tabular-nums text-[#001A3A]">
                                                    {item.total_hours} jam
                                                </td>
                                                <td className="py-4 px-6 text-right font-black text-[#A12227] tabular-nums bg-red-50/30 print:bg-transparent">
                                                    {formatCurrency(item.total_honor)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 border-t-2 border-gray-200 print:border-black">
                                            <td colSpan={6} className="py-4 px-6 text-right font-bold text-[#001A3A] uppercase tracking-wider">
                                                Total Pengeluaran Bulan Ini
                                            </td>
                                            <td className="py-4 px-6 text-right font-black text-xl text-[#A12227]">
                                                {formatCurrency(totalPayout)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        {/* Print Footer / Signature Area */}
                        <div className="hidden print:flex justify-end mt-12 pr-12">
                            <div className="text-center">
                                <p className="mb-20">Padang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="font-bold border-b border-black pb-1 inline-block min-w-[200px]">Finance Manager</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        background: white;
                        margin: 1cm;
                    }
                    .print\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
