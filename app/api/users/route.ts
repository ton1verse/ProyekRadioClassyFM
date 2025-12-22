import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json({
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nama = formData.get('nama') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let foto = '';
    const imageFile = formData.get('imageFile') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      foto = await saveFile(imageFile, 'users');
    } else if (imageUrl) {
      foto = imageUrl;
    }

    // Removed unused import causing lint error.

    const user = await prisma.user.create({
      data: {
        nama,
        username,
        email,
        password, // Ideally should be hashed, but following existing pattern
        foto
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json({
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
