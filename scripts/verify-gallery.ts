
import prisma from '../lib/db';
import { saveFile } from '../lib/upload';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('--- Starting Gallery Verification ---');

    // 1. Mock File
    const content = 'Test image content';
    const buffer = Buffer.from(content);
    // Create a mock File-like object (since Node.js doesn't have File global by default in older versions, but Next.js environment might. 
    // However, saveFile expects a File. We can construct a simple object that satisfies the interface or use a polyfill if needed.
    // Actually, let's just create a real file and use fs to mimic the behavior if saveFile uses arrayBuffer.

    // Polyfill File for Node.js environment if needed, or just mock the Blob/File behavior
    // Since saveFile uses `file.arrayBuffer()`, we need to mock that.

    const mockFile = {
        name: 'test-image.txt',
        lastModified: Date.now(),
        size: buffer.length,
        arrayBuffer: async () => buffer.buffer
    } as unknown as File;

    try {
        // 2. Test Upload
        console.log('Testing saveFile...');
        const savedPath = await saveFile(mockFile, 'galleries');
        console.log('File saved to:', savedPath);

        // Verify file exists on disk
        const absolutePath = path.join(process.cwd(), 'public', savedPath);
        if (fs.existsSync(absolutePath)) {
            console.log('File successfully written to disk.');
        } else {
            console.error('File NOT found on disk at:', absolutePath);
        }

        // 3. Test DB Create
        console.log('Testing DB Create...');
        const gallery = await prisma.gallery.create({
            data: {
                judul: 'Test Gallery Item',
                deskripsi: 'Created by verification script',
                gambar: savedPath
            }
        });
        console.log('Gallery item created:', gallery);

        // 4. Cleanup (Optional)
        // await prisma.gallery.delete({ where: { id: gallery.id } });
        // fs.unlinkSync(absolutePath);

    } catch (error) {
        console.error('Verification FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
