import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/radio_streaming';

async function testConnection() {
    console.log('Testing MongoDB connection...');
    console.log(`URI: ${uri}`);

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');

        const db = client.db('radio_streaming');
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

    } catch (error: any) {
        console.error('❌ Failed to connect to MongoDB.');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.cause) console.error('Cause:', error.cause);

        console.log('\n--- Troubleshooting Tips ---');
        console.log('1. Is MongoDB installed and running?');
        console.log('   - On Windows, check Services -> MongoDB Server');
        console.log('2. Is the URI correct?');
        console.log('   - Default is mongodb://127.0.0.1:27017/radio_streaming');
    } finally {
        await client.close();
    }
}

testConnection();
