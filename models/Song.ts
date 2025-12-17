import { ObjectId } from 'mongodb'

export interface Song {
  _id?: ObjectId
  title: string
  artist: string
  album: string
  duration: string
  genre: string
  fileUrl?: string
  createdAt: Date
}

export type SongInput = Omit<Song, '_id' | 'createdAt'>