import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const categories = await prisma.eventCategory.findMany({
            orderBy: { nama: 'asc' },
            include: { _count: { select: { events: true } } }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('GET event categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { nama } = await request.json();

        if (!nama) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const category = await prisma.eventCategory.create({
            data: { nama }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('POST event category error:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
