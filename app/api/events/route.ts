import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { EventInput } from '@/models/Event'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    const events = await db.collection('events').find().toArray()
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EventInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const event = {
      ...body,
      tanggal: new Date(body.tanggal),
      createdAt: new Date()
    }
    
    const result = await db.collection('events').insertOne(event)
    return NextResponse.json({ _id: result.insertedId, ...event })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}