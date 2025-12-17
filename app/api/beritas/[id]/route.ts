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
    
    const berita = await db.collection('beritas').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!berita) {
      return NextResponse.json({ error: 'Berita not found' }, { status: 404 })
    }
    
    return NextResponse.json(berita)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch berita' }, { status: 500 })
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
    
    const result = await db.collection('beritas').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Berita not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Berita updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update berita' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('beritas').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Berita not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Berita deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete berita' }, { status: 500 })
  }
}