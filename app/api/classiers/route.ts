import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const classiers = await prisma.classier.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(classiers);
  } catch (error: any) {
    console.error('❌ Error in GET /api/classiers:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nama = formData.get('nama') as string;
    const motto = (formData.get('motto') || formData.get('deskripsi')) as string;
    const status = formData.get('status') as string || 'active';
    const honor_per_jam = Number(formData.get('honor_per_jam')) || 0;

    const instagram = formData.get('instagram') as string || '';
    const facebook = formData.get('facebook') as string || '';
    const twitter = formData.get('twitter') as string || '';

    let foto = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      foto = await saveFile(imageFile, 'classiers');
    } else if (imageUrl) {
      foto = imageUrl;
    }

    if (!nama) {
      return NextResponse.json({
        error: 'Missing required field: nama'
      }, { status: 400 });
    }

    const newClassier = await prisma.classier.create({
      data: {
        nama,
        motto: motto || '',
        foto,
        status,
        honor_per_jam,
        instagram,
        facebook,
        twitter
      }
    });

    return NextResponse.json(newClassier, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error in POST /api/classiers:', error);
    return NextResponse.json({
      error: 'Failed to create classier',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
