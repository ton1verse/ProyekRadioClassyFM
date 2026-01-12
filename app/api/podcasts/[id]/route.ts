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

    const podcast = await prisma.podcast.findUnique({
      where: { id: numericId }
    })

    if (!podcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }

    return NextResponse.json(podcast)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch podcast' }, { status: 500 })
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
    const link = formData.get('link') as string;
    const durasi = Number(formData.get('durasi')) || 0;
    const tanggalStr = formData.get('tanggal') as string;

    const classierIdStr = formData.get('classierId') as string || formData.get('classier_id') as string;
    const categoryIdStr = formData.get('categoryId') as string || formData.get('category_id') as string;

    let poster = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      poster = await saveFile(imageFile, 'podcasts');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      poster = imageUrl;
    }

    const updateData: any = {
      judul,
      deskripsi,
      link,
      durasi,
    };

    if (tanggalStr) {
      updateData.tanggal = new Date(tanggalStr);
    }

    if (classierIdStr) {
      const classierId = parseInt(classierIdStr, 10);
      if (!isNaN(classierId)) {
        updateData.classierId = classierId;
      }
    }

    if (categoryIdStr) {
      const categoryId = parseInt(categoryIdStr, 10);
      if (!isNaN(categoryId)) {
        updateData.categoryId = categoryId;
      }
    }

    if (poster) {
      updateData.poster = poster;
    }

    const result = await prisma.podcast.update({
      where: { id: numericId },
      data: updateData
    })

    return NextResponse.json({ message: 'Podcast updated successfully', data: result })
  } catch (error: any) {
    console.error("Update Error:", error);
    let errorMessage = 'Failed to update podcast';
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    if (error?.code) {
      errorMessage = `Database error: ${error.code} - ${error.message || 'Unknown'}`;
    }
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

    const podcast = await prisma.podcast.findUnique({
      where: { id: numericId }
    })

    if (!podcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }

    const result = await prisma.podcast.delete({
      where: { id: numericId }
    })

    if (podcast.categoryId) {
      const remainingPodcasts = await prisma.podcast.count({
        where: { categoryId: podcast.categoryId }
      })

      if (remainingPodcasts === 0) {
        await prisma.podcastCategory.delete({
          where: { id: podcast.categoryId }
        })
      }
    }

    return NextResponse.json({ message: 'Podcast deleted successfully', data: result })
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: 'Failed to delete podcast' }, { status: 500 })
  }
}