import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const stations = await prisma.radioStation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(stations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const station = await prisma.radioStation.create({
      data: {
        name: body.name,
        frequency: body.frequency,
        genre: body.genre,
        status: body.status || 'online',
        listeners: body.listeners || 0
      }
    });

    return NextResponse.json(station);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create station' }, { status: 500 });
  }
}
