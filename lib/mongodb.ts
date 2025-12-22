import { MongoClient, MongoServerError } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/radio_streaming'

const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message)
      throw err
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise!
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise