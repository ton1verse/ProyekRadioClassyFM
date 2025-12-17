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
    
    // Validasi ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    
    const classier = await db.collection('classiers').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!classier) {
      return NextResponse.json({ error: 'Classier not found' }, { status: 404 })
    }
    
    // Convert ObjectId ke string
    const serializedClassier = {
      ...classier,
      _id: classier._id.toString(),
      createdAt: classier.createdAt.toISOString()
    }
    
    return NextResponse.json(serializedClassier)
  } catch (error) {
    console.error('Error fetching classier:', error)
    return NextResponse.json({ error: 'Failed to fetch classier' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validasi ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('classiers').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Classier not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Classier updated successfully' })
  } catch (error) {
    console.error('Error updating classier:', error)
    return NextResponse.json({ error: 'Failed to update classier' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validasi ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const result = await db.collection('classiers').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Classier not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Classier deleted successfully' })
  } catch (error) {
    console.error('Error deleting classier:', error)
    return NextResponse.json({ error: 'Failed to delete classier' }, { status: 500 })
  }
}