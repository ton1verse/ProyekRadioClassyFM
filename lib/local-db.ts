import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb'; // Keep for type compatibility if needed, or we can mock it

const DB_PATH = path.join(process.cwd(), 'data.json');

interface DatabaseSchema {
    beritas: any[];
    users: any[];
    classiers: any[];
    galleries: any[];
    programs: any[];
    events: any[];
    musiks: any[];
    podcasts: any[];
}

const INITIAL_DB: DatabaseSchema = {
    beritas: [],
    users: [],
    classiers: [],
    galleries: [],
    programs: [],
    events: [],
    musiks: [],
    podcasts: []
};

class LocalDB {
    private data: DatabaseSchema;

    constructor() {
        this.data = this.readDB();
    }

    private readDB(): DatabaseSchema {
        if (!fs.existsSync(DB_PATH)) {
            this.writeDB(INITIAL_DB);
            return INITIAL_DB;
        }
        try {
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        } catch (error) {
            return INITIAL_DB;
        }
    }

    private writeDB(data: DatabaseSchema) {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    }

    public collection(name: keyof DatabaseSchema) {
        return {
            find: () => ({
                toArray: async () => {
                    this.data = this.readDB(); // Refresh data
                    return this.data[name] || [];
                }
            }),
            insertOne: async (doc: any) => {
                this.data = this.readDB(); // Refresh data
                const newDoc = {
                    _id: new ObjectId(), // Simulate MongoDB ObjectId
                    ...doc,
                    createdAt: new Date()
                };

                if (!this.data[name]) {
                    this.data[name] = [];
                }

                this.data[name].push(newDoc);
                this.writeDB(this.data);
                return { insertedId: newDoc._id, acknowledged: true };
            },
            // Add other methods as needed
            deleteOne: async (query: { _id: string | ObjectId }) => {
                this.data = this.readDB();
                const id = query._id.toString();
                const initialLength = this.data[name].length;
                this.data[name] = this.data[name].filter((item: any) => item._id.toString() !== id);
                this.writeDB(this.data);
                return { deletedCount: initialLength - this.data[name].length };
            },
            updateOne: async (query: { _id: string | ObjectId }, update: any) => {
                this.data = this.readDB();
                const id = query._id.toString();
                const index = this.data[name].findIndex((item: any) => item._id.toString() === id);

                if (index !== -1) {
                    const updatedDoc = { ...this.data[name][index], ...update.$set };
                    this.data[name][index] = updatedDoc;
                    this.writeDB(this.data);
                    return { modifiedCount: 1 };
                }
                return { modifiedCount: 0 };
            }
        };
    }
}

// Singleton instance
export const db = new LocalDB();
