import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const podcastCount = await prisma.podcast.count();
        const programCount = await prisma.program.count();
        const musikCount = await prisma.musik.count();
        const classierCount = await prisma.classier.count();

        return NextResponse.json({
            podcastCount,
            programCount,
            musikCount,
            classierCount
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
