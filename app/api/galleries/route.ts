import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { GalleryInput } from '@/models/Gallery'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    const galleries = await db.collection('galleries').find().toArray()
    return NextResponse.json(galleries)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GalleryInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const gallery = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('galleries').insertOne(gallery)
    return NextResponse.json({ _id: result.insertedId, ...gallery })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 })
  }
}