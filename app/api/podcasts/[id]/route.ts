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
    
    const podcast = await db.collection('podcasts').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!podcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }
    
    return NextResponse.json(podcast)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch podcast' }, { status: 500 })
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
    
    const result = await db.collection('podcasts').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Podcast updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update podcast' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('podcasts').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Podcast deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete podcast' }, { status: 500 })
  }
}