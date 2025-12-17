import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { BeritaInput } from '@/models/Berita'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    const beritas = await db.collection('beritas').find().toArray()
    return NextResponse.json(beritas)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch beritas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BeritaInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const berita = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('beritas').insertOne(berita)
    return NextResponse.json({ _id: result.insertedId, ...berita })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create berita' }, { status: 500 })
  }
}