import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true }
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error('[Gallery API Error] GET /api/galleries failed:', error);
    return NextResponse.json({
      error: 'Failed to fetch galleries',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const tanggalStr = formData.get('tanggal') as string;
    const tanggal = tanggalStr ? new Date(tanggalStr) : new Date();

    console.log('[Gallery API] POST received. Data:', { judul, deskripsi, tanggal });
    const imageFiles = formData.getAll('imageFiles') as File[];
    const singleImageFile = formData.get('imageFile') as File | null;

    const filesToUpload: File[] = [];
    if (imageFiles.length > 0) {
      imageFiles.forEach(f => {
        if (f instanceof File && f.size > 0) filesToUpload.push(f);
      });
    }
    if (singleImageFile && singleImageFile.size > 0) {
      filesToUpload.push(singleImageFile);
    }

    const uploadedUrls: string[] = [];

    if (filesToUpload.length > 0) {
      const { saveFile } = await import('@/lib/upload');

      for (const file of filesToUpload) {
        try {
          const url = await saveFile(file, 'galleries');
          uploadedUrls.push(url);
        } catch (err) {
          console.error(`Failed to upload file ${file.name}`, err);
        }
      }
    }

    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) uploadedUrls.push(imageUrl);


    const gallery = await prisma.gallery.create({
      data: {
        judul,
        deskripsi,
        tanggal,
        images: {
          create: uploadedUrls.map(url => ({ url }))
        }
      },
      include: { images: true }
    });

    console.log('[Gallery API] Gallery created with images:', gallery);

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('[Gallery API Error] POST /api/galleries failed:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create gallery',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
