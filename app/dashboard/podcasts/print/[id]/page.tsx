
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import PrintReportClient from '@/components/PrintReportClient';

export const dynamic = 'force-dynamic';

export default async function PodcastPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const podcastId = parseInt(id);
    if (isNaN(podcastId)) return notFound();

    const podcast = await prisma.podcast.findUnique({
        where: { id: podcastId },
        include: {
            classier: true,
            category: true,
            _count: {
                select: { listens: true }
            }
        }
    });

    if (!podcast) return notFound();

    const recentListens = await prisma.podcastListen.findMany({
        where: { podcastId: podcastId },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    // Pass data to Client Component
    return <PrintReportClient podcast={podcast} initialListens={recentListens} />;
}
