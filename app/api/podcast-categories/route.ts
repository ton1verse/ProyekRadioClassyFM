import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const categories = await prisma.podcastCategory.findMany({
            orderBy: { nama: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('GET podcast-categories error:', error);
        return NextResponse.json({ error: error?.message || 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nama } = body;

        if (!nama || nama.trim() === '') {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const existing = await prisma.podcastCategory.findUnique({
            where: { nama: nama.trim() }
        });

        if (existing) {
            return NextResponse.json(existing);
        }

        const category = await prisma.podcastCategory.create({
            data: { nama: nama.trim() }
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('POST podcast-categories error:', error);
        return NextResponse.json({ error: error?.message || 'Failed to create category' }, { status: 500 });
    }
}
