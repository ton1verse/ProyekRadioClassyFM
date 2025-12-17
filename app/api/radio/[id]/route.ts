import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('radiostream')
    
    const result = await db.collection('radiostations').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Station updated' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update station' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radiostream')
    
    const result = await db.collection('radiostations').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Station deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete station' }, { status: 500 })
  }
}