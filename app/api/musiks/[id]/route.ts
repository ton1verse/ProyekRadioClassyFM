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

    const musik = await prisma.musik.findUnique({
      where: { id: numericId }
    })

    if (!musik) {
      return NextResponse.json({ error: 'Musik not found' }, { status: 404 })
    }

    return NextResponse.json(musik)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch musik' }, { status: 500 })
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
    const penyanyi = formData.get('penyanyi') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const lirik = formData.get('lirik') as string;

    let foto = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      foto = await saveFile(imageFile, 'musiks');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      foto = imageUrl;
    }

    const updateData: any = {
      judul,
      penyanyi,
      deskripsi,
      lirik
    };

    if (foto) {
      updateData.foto = foto;
    }

    const result = await prisma.musik.update({
      where: { id: numericId },
      data: updateData
    })

    return NextResponse.json({ message: 'Musik updated successfully', data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update musik or musik not found' },
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

    const result = await prisma.musik.delete({
      where: { id: numericId }
    })

    return NextResponse.json({ message: 'Musik deleted successfully', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete musik or musik not found' }, { status: 500 })
  }
}