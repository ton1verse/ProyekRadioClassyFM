import { ObjectId } from 'mongodb'

export interface Event {
  _id?: ObjectId
  judul: string
  lokasi: string
  tanggal: Date
  deskripsi: string
  poster: string
  createdAt: Date
}

export type EventInput = Omit<Event, '_id' | 'createdAt'>