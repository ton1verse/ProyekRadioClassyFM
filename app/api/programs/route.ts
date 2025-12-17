import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ProgramInput } from '@/models/Program'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    const programs = await db.collection('programs').find().toArray()
    return NextResponse.json(programs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProgramInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const program = {
      ...body,
      jadwal: new Date(body.jadwal),
      createdAt: new Date()
    }
    
    const result = await db.collection('programs').insertOne(program)
    return NextResponse.json({ _id: result.insertedId, ...program })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 })
  }
}