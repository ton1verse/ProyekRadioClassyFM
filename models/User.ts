import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  nama: string
  username: string
  email: string
  password: string
  foto?: string
  createdAt: Date
}

export type UserInput = Omit<User, '_id' | 'createdAt'>