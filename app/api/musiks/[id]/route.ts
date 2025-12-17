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
    
    const musik = await db.collection('musiks').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!musik) {
      return NextResponse.json({ error: 'Musik not found' }, { status: 404 })
    }
    
    return NextResponse.json(musik)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch musik' }, { status: 500 })
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
    
    const result = await db.collection('musiks').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Musik not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Musik updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update musik' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('musiks').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Musik not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Musik deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete musik' }, { status: 500 })
  }
}