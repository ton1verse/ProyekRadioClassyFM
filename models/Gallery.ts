import { ObjectId } from 'mongodb'

export interface Gallery {
  _id?: ObjectId
  judul: string
  deskripsi: string
  gambar: string
  createdAt: Date
}

export type GalleryInput = Omit<Gallery, '_id' | 'createdAt'>