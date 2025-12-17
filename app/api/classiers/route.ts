import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ClassierInput } from '@/models/Classier'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    // Pastikan collection ada
    const collections = await db.listCollections().toArray()
    const classiersCollection = collections.find(col => col.name === 'classiers')
    
    if (!classiersCollection) {
      // Jika collection belum ada, buat collection kosong
      await db.createCollection('classiers')
      return NextResponse.json([])
    }
    
    const classiers = await db.collection('classiers').find().toArray()
    
    // Convert ObjectId ke string untuk serialization
    const serializedClassiers = classiers.map(classier => ({
      ...classier,
      _id: classier._id.toString(),
      createdAt: classier.createdAt.toISOString()
    }))
    
    return NextResponse.json(serializedClassiers)
  } catch (error) {
    console.error('Error fetching classiers:', error)
    return NextResponse.json({ error: 'Failed to fetch classiers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ClassierInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const classier = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('classiers').insertOne(classier)
    
    const insertedClassier = {
      _id: result.insertedId.toString(),
      ...classier,
      createdAt: classier.createdAt.toISOString()
    }
    
    return NextResponse.json(insertedClassier)
  } catch (error) {
    console.error('Error creating classier:', error)
    return NextResponse.json({ error: 'Failed to create classier' }, { status: 500 })
  }
}