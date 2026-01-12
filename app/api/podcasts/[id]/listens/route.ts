import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const podcastId = parseInt(id);

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7d';
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        if (isNaN(podcastId)) {
            return NextResponse.json({ error: 'Invalid Podcast ID' }, { status: 400 });
        }

        let startDate = new Date();
        let endDate = new Date();

        if (month && year) {
            const m = parseInt(month);
            const y = parseInt(year);
            startDate = new Date(y, m - 1, 1);
            endDate = new Date(y, m, 0);
            endDate.setHours(23, 59, 59, 999);
        } else {
            endDate.setHours(23, 59, 59, 999);

            if (range === 'today') {
                startDate.setHours(0, 0, 0, 0);
            } else if (range === '7d') {
                startDate.setDate(endDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
            } else if (range === '30d') {
                startDate.setDate(endDate.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);
            } else if (range === '90d') {
                startDate.setDate(endDate.getDate() - 89);
                startDate.setHours(0, 0, 0, 0);
            } else {
                startDate.setDate(endDate.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);
            }
        }

        const listens = await prisma.podcastListen.findMany({
            where: {
                podcastId: podcastId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(listens);
    } catch (error) {
        console.error('Error fetching podcast listens:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
