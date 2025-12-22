import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const musiks = await prisma.musik.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(musiks);
  } catch (error) {
    console.error('GET musiks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch musiks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const penyanyi = formData.get('penyanyi') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const lirik = formData.get('lirik') as string;

    let foto = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      foto = await saveFile(imageFile, 'musiks');
    } else if (imageUrl) {
      foto = imageUrl;
    }

    const musik = await prisma.musik.create({
      data: {
        judul,
        penyanyi: penyanyi || '',
        foto,
        deskripsi: deskripsi || '',
        lirik: lirik || ''
      }
    });

    return NextResponse.json(musik);
  } catch (error) {
    console.error('POST musiks error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create musik' },
      { status: 500 }
    );
  }
}

