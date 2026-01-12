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

    const classier = await prisma.classier.findUnique({
      where: { id: numericId },
      include: { programs: true, podcasts: true }
    })

    if (!classier) {
      return NextResponse.json({ error: 'Classier not found' }, { status: 404 })
    }

    return NextResponse.json(classier)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classier' }, { status: 500 })
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

    const nama = formData.get('nama') as string;
    const motto = (formData.get('motto') || formData.get('deskripsi')) as string;
    const status = formData.get('status') as string;
    const honor_per_jam = Number(formData.get('honor_per_jam')) || 0;

    const instagram = formData.get('instagram') as string;
    const facebook = formData.get('facebook') as string;
    const twitter = formData.get('twitter') as string;

    let foto = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      foto = await saveFile(imageFile, 'classiers');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      foto = imageUrl;
    }

    const updateData: any = {
      nama,
      motto: motto || '',
      status,
      honor_per_jam,
      instagram: instagram || null,
      facebook: facebook || null,
      twitter: twitter || null
    };

    if (foto) {
      updateData.foto = foto;
    }

    if (status && (status === 'nonaktif' || status === 'inactive')) {
      const activeClassiers = await prisma.classier.findMany({
        where: {
          status: 'active',
          id: { not: numericId }
        }
      });

      if (activeClassiers.length > 0) {
        const programsToReassign = await prisma.program.findMany({
          where: { classierId: numericId }
        });
        for (const program of programsToReassign) {
          const randomClassier = activeClassiers[Math.floor(Math.random() * activeClassiers.length)];
          await prisma.program.update({
            where: { id: program.id },
            data: { classierId: randomClassier.id }
          });
        }

        const podcastsToReassign = await prisma.podcast.findMany({
          where: { classierId: numericId }
        });
        for (const podcast of podcastsToReassign) {
          const randomClassier = activeClassiers[Math.floor(Math.random() * activeClassiers.length)];
          await prisma.podcast.update({
            where: { id: podcast.id },
            data: { classierId: randomClassier.id }
          });
        }
      }
    }

    const result = await prisma.classier.update({
      where: { id: numericId },
      data: updateData
    })

    return NextResponse.json({ message: 'Classier updated successfully', data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update classier or classier not found' },
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

    const result = await prisma.classier.delete({
      where: { id: numericId }
    })

    return NextResponse.json({ message: 'Classier deleted successfully', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete classier or classier not found' }, { status: 500 })
  }
}