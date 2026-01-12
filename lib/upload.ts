import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}_${filename}`;

    const uploadDir = path.join(process.cwd(), 'public', 'images', folder);
    const filePath = path.join(uploadDir, uniqueFilename);

    try {
        const { mkdir } = await import('fs/promises');
        await mkdir(uploadDir, { recursive: true });

        console.log(`[Upload] Saving file to: ${filePath}`);
        await writeFile(filePath, buffer);
        console.log(`[Upload] File saved successfully. Size: ${buffer.length}`);

        return `/images/${folder}/${uniqueFilename}`;
    } catch (error) {
        console.error('[Upload] Error saving file:', error);
        throw new Error('Failed to save file');
    }
}
