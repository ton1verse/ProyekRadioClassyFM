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
    
    const program = await db.collection('programs').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }
    
    return NextResponse.json(program)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 })
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
      ...(body.jadwal && { jadwal: new Date(body.jadwal) })
    }
    
    const result = await db.collection('programs').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Program updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('programs').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Program deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}