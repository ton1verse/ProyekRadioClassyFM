
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { podcastId } = body;

        if (!podcastId) {
            return NextResponse.json({ error: 'Podcast ID is required' }, { status: 400 });
        }

        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        await prisma.podcastListen.create({
            data: {
                podcastId: parseInt(podcastId),
                ipAddress: ip
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error recording listen:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
