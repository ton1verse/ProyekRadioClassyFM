import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

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

    const body = await request.json()

    // Remove id fields from body if present to avoid prisma error
    if (body.id) delete body.id
    if (body._id) delete body._id

    const result = await prisma.radioStation.update({
      where: { id: numericId },
      data: body
    })

    return NextResponse.json({ message: 'Station updated', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update station or station not found' }, { status: 500 })
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

    const result = await prisma.radioStation.delete({
      where: { id: numericId }
    })

    return NextResponse.json({ message: 'Station deleted', data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete station or station not found' }, { status: 500 })
  }
}