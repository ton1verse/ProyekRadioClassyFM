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

    const event = await prisma.event.findUnique({
      where: { id: numericId },
      include: { category: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
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

    const currentEvent = await prisma.event.findUnique({
      where: { id: numericId },
      select: { categoryId: true }
    });

    const formData = await request.formData();

    const judul = formData.get('judul') as string;
    const lokasi = formData.get('lokasi') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const tanggalStr = formData.get('tanggal') as string;

    let poster = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      poster = await saveFile(imageFile, 'events');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      poster = imageUrl;
    }

    const categoryId = formData.get('categoryId') as string || formData.get('category_id') as string;

    const updateData: any = {
      judul,
      lokasi,
      deskripsi
    };

    if (categoryId) {
      updateData.categoryId = parseInt(categoryId, 10);
    }

    if (tanggalStr) {
      updateData.tanggal = new Date(tanggalStr);
    }

    if (poster) {
      updateData.poster = poster;
    }

    const result = await prisma.event.update({
      where: { id: numericId },
      data: updateData
    })

    if (currentEvent?.categoryId && updateData.categoryId && currentEvent.categoryId !== updateData.categoryId) {
      const count = await prisma.event.count({
        where: { categoryId: currentEvent.categoryId }
      });
      if (count === 0) {
        await prisma.eventCategory.delete({
          where: { id: currentEvent.categoryId }
        }).catch(err => console.error("Error auto-deleting empty category:", err));
      }
    }

    return NextResponse.json({ message: 'Event updated successfully', data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update event or event not found' },
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

    const event = await prisma.event.findUnique({
      where: { id: numericId },
      select: { categoryId: true }
    });

    const result = await prisma.event.delete({
      where: { id: numericId }
    })

    if (event?.categoryId) {
      const count = await prisma.event.count({
        where: { categoryId: event.categoryId }
      });

      if (count === 0) {
        await prisma.eventCategory.delete({
          where: { id: event.categoryId }
        }).catch(err => console.error("Error auto-deleting empty category:", err));
      }
    }

    return NextResponse.json({ message: 'Event deleted successfully', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event or event not found' }, { status: 500 })
  }
}