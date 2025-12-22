import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const lokasi = formData.get('lokasi') as string;
    const tanggal = formData.get('tanggal') as string;
    const deskripsi = formData.get('deskripsi') as string;

    let poster = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      poster = await saveFile(imageFile, 'events');
    } else if (imageUrl) {
      poster = imageUrl;
    }

    const event = await prisma.event.create({
      data: {
        judul,
        lokasi,
        tanggal: new Date(tanggal),
        deskripsi,
        poster
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('POST events error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create event' }, { status: 500 });
  }
}
