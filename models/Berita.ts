import { ObjectId } from 'mongodb'

export interface Berita {
  _id?: ObjectId
  judul: string
  isi: string
  gambar: string
  link: string
  penulis: string
  createdAt: Date
}

export type BeritaInput = Omit<Berita, '_id' | 'createdAt'>