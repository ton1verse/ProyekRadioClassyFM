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
      where: { id: numericId }
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

    let gambar = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      gambar = await saveFile(imageFile, 'galleries');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      gambar = imageUrl;
    }

    const updateData: any = {
      judul,
      deskripsi
    };

    if (gambar) {
      updateData.gambar = gambar;
    }

    const result = await prisma.gallery.update({
      where: { id: numericId },
      data: updateData
    })

    return NextResponse.json({ message: 'Gallery updated successfully', data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update gallery or gallery not found' },
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