import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(galleries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const deskripsi = formData.get('deskripsi') as string;

    let gambar = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      gambar = await saveFile(imageFile, 'galleries');
    } else if (imageUrl) {
      gambar = imageUrl;
    }

    const gallery = await prisma.gallery.create({
      data: {
        judul,
        deskripsi,
        gambar
      }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('POST galleries error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create gallery' }, { status: 500 });
  }
}
