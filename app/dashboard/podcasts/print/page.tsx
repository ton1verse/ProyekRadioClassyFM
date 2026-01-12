
import PrintReportClient from '@/components/PrintReportClient';
import { notFound } from 'next/navigation';
// Since the user wants a "General Report" that also shows a chart (Category/Growth), 
// and potentially "Picker sesuai hari/bulan".
// I can reuse PrintReportClient but maybe adapt it for "General" context if I pass a dummy "All Podcasts" object or handle null podcast.
// However, the PrintReportClient currently expects a single podcast object. 
// I should refactor it or create a new client component for General Report.
// Given strict instructions, I will create a dedicated `GeneralReportClient` to avoid breaking the specific one.

import GeneralReportClient from '@/components/GeneralReportClient';

export const dynamic = 'force-dynamic';

export default async function GeneralPrintPage() {
    // We don't need to fetch specific podcast.
    // We just need the client component which will fetch the aggregate stats.
    return <GeneralReportClient />;
}
