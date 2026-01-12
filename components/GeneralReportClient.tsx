
'use client';

import { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import ListenerChart from '@/components/ListenerChart';

export default function GeneralReportClient() {
    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            {/* Print Header */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <h1 className="text-xl font-bold">Preview Laporan Statistik</h1>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#001A3A] text-white rounded-lg hover:bg-[#001A3A]/80 transition"
                >
                    <Printer size={16} />
                    Cetak Laporan
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: auto;
                        margin: 0mm; /* Hides browser header/footer (URL, Date) */
                    }
                    body {
                        margin: 10mm; /* Minimal margin */
                        zoom: 0.9; /* Scale down slightly to ensure single page */
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Ensure background colors in charts are printed */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Report Content */}
            <div className="max-w-4xl mx-auto print:w-full print:max-w-none">
                <div className="border-b-2 border-gray-800 pb-4 mb-8 print:mb-4 flex items-center gap-4">
                    <img src="/classy.jpg" alt="Logo" className="h-16 print:h-12 object-contain" />
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-wide text-[#001A3A]">Laporan Statistik Podcast</h1>
                        <p className="text-gray-600 font-medium">Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mb-10 page-break-inside-avoid print:mb-2">
                    <h2 className="text-lg font-bold text-[#001A3A] mb-4 print:mb-2 border-l-4 border-[#A12227] pl-3">Statistik Podcast</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <ListenerChart />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-right text-gray-400 italic print:mt-4">
                    Dicetak pada: {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                </div>
            </div>
        </div>
    );
}
