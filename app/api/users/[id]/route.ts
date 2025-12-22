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
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: numericId }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET user by id error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
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
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    const formData = await request.formData();

    const nama = formData.get('nama') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let foto = undefined;
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const { saveFile } = await import('@/lib/upload');
      foto = await saveFile(imageFile, 'users');
    }
    const imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl) {
      foto = imageUrl;
    }

    const updateData: any = {
      nama,
      username,
      email
    };

    if (password) {
      updateData.password = password;
    }

    if (foto) {
      updateData.foto = foto;
    }

    const user = await prisma.user.update({
      where: { id: numericId },
      data: updateData
    });

    return NextResponse.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('PUT user error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update user' },
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
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: numericId }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
