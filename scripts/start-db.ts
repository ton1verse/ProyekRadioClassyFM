import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';

async function startDB() {
    const dbPath = path.resolve('./db-data');

    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }

    console.log('Starting local MongoDB instance...');
    console.log(`Data directory: ${dbPath}`);

    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 27017, // Force port 27017 to match default config
            ip: '127.0.0.1',
            dbPath: dbPath,
            storageEngine: 'wiredTiger' // Persist data
        }
    });

    const uri = mongod.getUri();
    console.log(`\n✅ Local MongoDB started successfully!`);
    console.log(`📡 URI: ${uri}`);
    console.log(`📂 Database is persistent in: ${dbPath}`);
    console.log(`\n[IMPORTANT] Keep this terminal open while using the app.`);
    console.log(`Press Ctrl+C to stop the database.`);

    // Handle shutdown
    process.on('SIGINT', async () => {
        console.log('\nStopping database...');
        await mongod.stop();
        process.exit(0);
    });
}

startDB().catch(console.error);
