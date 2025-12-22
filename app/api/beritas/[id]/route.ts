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
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const berita = await prisma.berita.findUnique({
      where: { id: numericId }
    });

    if (!berita) {
      return NextResponse.json({ error: 'Berita not found' }, { status: 404 });
    }

    return NextResponse.json(berita);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch berita' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const formData = await request.formData();

    const judul = formData.get('judul') as string;
    const isi = formData.get('isi') as string;
    const link = formData.get('link') as string;
    const penulis = formData.get('penulis') as string;
    // Accept both camelCase and snake_case
    const categoryIdStr = formData.get('categoryId') as string || formData.get('category_id') as string;

    let gambar = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      gambar = await saveFile(imageFile, 'beritas');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      gambar = imageUrl;
    }

    const updateData: any = {
      judul,
      isi,
      link,
      penulis
    };

    if (gambar) {
      updateData.gambar = gambar;
    }

    if (categoryIdStr) {
      const categoryId = parseInt(categoryIdStr, 10);
      if (!isNaN(categoryId)) {
        updateData.categoryId = categoryId;
      }
    }

    const berita = await prisma.berita.update({
      where: { id: numericId },
      data: updateData
    });

    return NextResponse.json({ message: 'Berita updated successfully', berita });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update berita' },
      { status: 500 }
    );
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
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await prisma.berita.delete({
      where: { id: numericId }
    });

    return NextResponse.json({ message: 'Berita deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete berita' }, { status: 500 });
  }
}
