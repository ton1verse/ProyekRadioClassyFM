import { ObjectId } from 'mongodb'

export interface Classier {
  _id?: ObjectId
  nama: string
  deskripsi: string
  foto?: string
  status: 'active' | 'inactive'
  honor_per_jam: number
  createdAt: Date
}

export type ClassierInput = Omit<Classier, '_id' | 'createdAt'>