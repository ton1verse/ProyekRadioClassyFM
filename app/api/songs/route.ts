import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { Song, SongInput } from '@/models/Song'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radiostream')
    const songs = await db.collection('songs').find().toArray()
    
    return NextResponse.json(songs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SongInput = await request.json()
    const client = await clientPromise
    const db = client.db('radiostream')
    
    const song = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('songs').insertOne(song)
    
    return NextResponse.json({ 
      _id: result.insertedId,
      ...song 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 })
  }
}