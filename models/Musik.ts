import { ObjectId } from 'mongodb'

export interface Musik {
  _id?: ObjectId
  judul: string
  penyanyi: string
  foto: string
  deskripsi: string
  lirik: string
  createdAt: Date
}

export type MusikInput = Omit<Musik, '_id' | 'createdAt'>