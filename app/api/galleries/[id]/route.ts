import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const gallery = await prisma.gallery.findUnique({
      where: { id: numericId },
      include: { images: true }
    })

    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }

    return NextResponse.json(gallery)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const formData = await request.formData();

    const judul = formData.get('judul') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const tanggalStr = formData.get('tanggal') as string;

    const uploadedImageUrls: string[] = [];
    const imageFiles = formData.getAll('imageFiles') as File[];

    if (imageFiles && imageFiles.length > 0) {
      const { saveFile } = await import('@/lib/upload');
      for (const file of imageFiles) {
        if (file.size > 0) {
          const url = await saveFile(file, 'galleries');
          uploadedImageUrls.push(url);
        }
      }
    }

    const updateData: any = {
      judul,
      deskripsi,
    };

    if (tanggalStr) {
      updateData.tanggal = new Date(tanggalStr);
    }

    if (uploadedImageUrls.length > 0) {
      updateData.images = {
        create: uploadedImageUrls.map(url => ({ url }))
      };
    }

    const result = await prisma.gallery.update({
      where: { id: numericId },
      data: updateData,
      include: { images: true }
    })

    return NextResponse.json({ message: 'Gallery updated successfully', data: result })
  } catch (error) {
    console.error('[Gallery API Error] PUT /api/galleries/[id] failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update gallery',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const result = await prisma.gallery.delete({
      where: { id: numericId }
    })

    return NextResponse.json({ message: 'Gallery deleted successfully', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery or gallery not found' }, { status: 500 })
  }
}