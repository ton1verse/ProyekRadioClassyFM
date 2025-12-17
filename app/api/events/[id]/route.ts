import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const event = await db.collection('events').findOne({
      _id: new ObjectId(params.id)
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const updateData = {
      ...body,
      ...(body.tanggal && { tanggal: new Date(body.tanggal) })
    }
    
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Event updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('events').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}