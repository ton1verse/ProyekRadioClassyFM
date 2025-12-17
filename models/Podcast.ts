import { ObjectId } from 'mongodb'

export interface Podcast {
  _id?: ObjectId
  classier_id: ObjectId
  judul: string
  deskripsi: string
  poster: string
  link: string
  durasi: number // dalam menit
  createdAt: Date
}

export type PodcastInput = Omit<Podcast, '_id' | 'createdAt'>