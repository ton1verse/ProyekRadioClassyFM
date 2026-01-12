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

    const program = await prisma.program.findUnique({
      where: { id: numericId }
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    return NextResponse.json(program)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 })
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

    const nama_program = formData.get('nama_program') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const jadwal = formData.get('jadwal') as string;
    const durasi = Number(formData.get('durasi')) || 0;
    const classierId = formData.get('classierId') as string || formData.get('classier_id') as string;

    let poster = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      poster = await saveFile(imageFile, 'programs');
    } else if (imageUrl) {
      poster = imageUrl;
    }

    const updateData: any = {
      nama_program,
      deskripsi,
      durasi,
    };

    if (classierId) {
      updateData.classierId = parseInt(classierId, 10);
    }

    if (jadwal) {
      updateData.jadwal = jadwal;
    }

    if (poster) {
      updateData.poster = poster;
    }

    const result = await prisma.program.update({
      where: { id: numericId },
      data: updateData
    })

    return NextResponse.json({ message: 'Program updated successfully', data: result })
  } catch (error) {
    console.error("Update Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
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

    const result = await prisma.program.delete({
      where: { id: numericId }
    })

    return NextResponse.json({ message: 'Program deleted successfully', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete program or program not found' }, { status: 500 })
  }
}