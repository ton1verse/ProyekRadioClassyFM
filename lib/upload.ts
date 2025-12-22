import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    // Sanitize filename to avoid issues
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}_${filename}`;

    // Construct the absolute path
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder);
    const filePath = path.join(uploadDir, uniqueFilename);

    try {
        // Ensure directory exists
        const { mkdir } = await import('fs/promises');
        await mkdir(uploadDir, { recursive: true });

        await writeFile(filePath, buffer);
        // Return the relative path to be stored in the database
        return `/images/${folder}/${uniqueFilename}`;
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save file');
    }
}
