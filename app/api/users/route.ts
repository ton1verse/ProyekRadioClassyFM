import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { UserInput } from '@/models/User'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('radio_streaming')
    const users = await db.collection('users').find().toArray()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: UserInput = await request.json()
    const client = await clientPromise
    const db = client.db('radio_streaming')
    
    const user = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(user)
    return NextResponse.json({ _id: result.insertedId, ...user })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}