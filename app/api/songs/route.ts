import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const song = await prisma.song.create({
      data: {
        title: body.title,
        artist: body.artist,
        album: body.album,
        duration: body.duration,
        genre: body.genre,
        fileUrl: body.fileUrl
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}
