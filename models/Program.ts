import { ObjectId } from 'mongodb'

export interface Program {
  _id?: ObjectId
  classier_id: ObjectId
  nama_program: string
  deskripsi: string
  jadwal: Date
  poster: string
  durasi: number // dalam menit
  createdAt: Date
}

export type ProgramInput = Omit<Program, '_id' | 'createdAt'>