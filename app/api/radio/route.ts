import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { RadioStation, RadioStationInput } from '@/models/RadioStation'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radiostream')
    const stations = await db.collection('radiostations').find().toArray()
    
    return NextResponse.json(stations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RadioStationInput = await request.json()
    const client = await clientPromise
    const db = client.db('radiostream')
    
    const station = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('radiostations').insertOne(station)
    
    return NextResponse.json({ 
      _id: result.insertedId,
      ...station 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create station' }, { status: 500 })
  }
}