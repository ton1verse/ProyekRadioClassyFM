import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const podcasts = await prisma.podcast.findMany({
      include: {
        classier: true,
        category: true,
        _count: {
          select: { listens: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(podcasts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/podcasts - Started');
    const formData = await request.formData();
    console.log('[API] formData keys:', Array.from(formData.keys()));

    const judul = formData.get('judul') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const link = formData.get('link') as string;
    const durasi = Number(formData.get('durasi')) || 0;
    const tanggalStr = formData.get('tanggal') as string;
    const tanggal = tanggalStr ? new Date(tanggalStr) : new Date();

    const classierIdStr = formData.get('classierId') as string || formData.get('classier_id') as string;
    const categoryIdStr = formData.get('categoryId') as string || formData.get('category_id') as string;

    let poster = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      poster = await saveFile(imageFile, 'podcasts');
    } else if (imageUrl) {
      console.log('[API] Using existing imageUrl:', imageUrl);
      poster = imageUrl;
    }
    console.log('[API] Poster processed:', poster);

    if (!classierIdStr) {
      return NextResponse.json({ error: 'Classier is required' }, { status: 400 });
    }

    if (!categoryIdStr) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const classierId = parseInt(classierIdStr, 10);
    const categoryId = parseInt(categoryIdStr, 10);

    if (isNaN(classierId)) {
      return NextResponse.json({ error: 'Invalid Classier ID format' }, { status: 400 });
    }

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
    }

    const podcast = await prisma.podcast.create({
      data: {
        judul,
        deskripsi,
        poster,
        link,
        durasi,
        tanggal,
        classierId,
        categoryId
      }
    });

    return NextResponse.json(podcast);
  } catch (error: any) {
    console.error('POST podcasts error:', error);
    let errorMessage = 'Failed to create podcast';
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    if (error?.code) {
      errorMessage = `Database error: ${error.code} - ${error.message || 'Unknown'}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
