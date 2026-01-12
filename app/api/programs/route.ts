import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      include: { classier: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('GET programs error:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nama_program = formData.get('nama_program') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const jadwal = formData.get('jadwal') as string;
    const durasi = Number(formData.get('durasi')) || 0;
    const classierIdStr = formData.get('classierId') as string || formData.get('classier_id') as string;

    let poster = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      poster = await saveFile(imageFile, 'programs');
    } else if (imageUrl) {
      poster = imageUrl;
    }

    if (!classierIdStr) {
      return NextResponse.json({ error: 'Classier is required' }, { status: 400 });
    }

    const classierId = parseInt(classierIdStr, 10);
    if (isNaN(classierId)) {
      return NextResponse.json({ error: 'Invalid Classier ID format' }, { status: 400 });
    }

    const program = await prisma.program.create({
      data: {
        nama_program,
        deskripsi,
        jadwal,
        poster,
        durasi,
        classierId
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('POST programs error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create program' }, { status: 500 });
  }
}
