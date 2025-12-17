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
    
    const gallery = await db.collection('galleries').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
    
    return NextResponse.json(gallery)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
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
    
    const result = await db.collection('galleries').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Gallery updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('galleries').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Gallery deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 })
  }
}