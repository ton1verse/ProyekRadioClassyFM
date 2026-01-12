import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIdParam = searchParams.get('categoryId');

    let whereClause = {};

    if (categoryIdParam) {
      const categoryId = parseInt(categoryIdParam);
      if (isNaN(categoryId)) {
        return NextResponse.json({ error: 'Invalid Category ID' }, { status: 400 });
      }
      whereClause = { categoryId };
    }

    const beritas = await prisma.berita.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(beritas);
  } catch (error) {
    console.error('GET beritas error:', error);
    return NextResponse.json({ error: 'Failed to fetch beritas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const isi = formData.get('isi') as string;
    const link = formData.get('link') as string;
    const penulis = formData.get('penulis') as string;
    const categoryIdStr = formData.get('categoryId') as string || formData.get('category_id') as string;

    let gambar = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      gambar = await saveFile(imageFile, 'beritas');
    } else if (imageUrl) {
      gambar = imageUrl;
    }

    console.log('[API] POST /api/beritas - Processing:', { judul, hasImage: !!gambar });

    if (!categoryIdStr) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const categoryId = parseInt(categoryIdStr, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
    }

    const tanggalStr = formData.get('tanggal') as string;
    const tanggal = tanggalStr ? new Date(tanggalStr) : new Date();

    const berita = await prisma.berita.create({
      data: {
        judul,
        isi,
        gambar,
        link,
        penulis,
        categoryId,
        tanggal
      }
    });

    return NextResponse.json(berita);
  } catch (error: any) {
    console.error('[API] POST /api/beritas - Error:', error);
    return NextResponse.json({
      error: 'Failed to create berita',
      details: error.message
    }, { status: 500 });
  }
}
