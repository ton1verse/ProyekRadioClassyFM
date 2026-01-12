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

        const song = await prisma.song.findUnique({
            where: { id: numericId }
        })

        if (!song) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 })
        }

        return NextResponse.json(song)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 })
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

        const body = await request.json()
        if (body.id) delete body.id
        if (body._id) delete body._id

        const result = await prisma.song.update({
            where: { id: numericId },
            data: body
        })

        return NextResponse.json({ message: 'Song updated successfully', data: result })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update song or song not found' }, { status: 500 })
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

        const result = await prisma.song.delete({
            where: { id: numericId }
        })

        return NextResponse.json({ message: 'Song deleted successfully', data: result })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete song or song not found' }, { status: 500 })
    }
}
