import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { PodcastInput } from '@/models/Podcast'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    const podcasts = await db.collection('podcasts').find().toArray()
    return NextResponse.json(podcasts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PodcastInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const podcast = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('podcasts').insertOne(podcast)
    return NextResponse.json({ _id: result.insertedId, ...podcast })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create podcast' }, { status: 500 })
  }
}