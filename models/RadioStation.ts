import { ObjectId } from 'mongodb'

export interface RadioStation {
  _id?: ObjectId
  name: string
  frequency: string
  genre: string
  status: 'online' | 'offline'
  listeners: number
  createdAt: Date
}

export type RadioStationInput = Omit<RadioStation, '_id' | 'createdAt'>