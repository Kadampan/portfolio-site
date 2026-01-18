import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || '';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name}`;
        const uploadDir = folder ? path.join(process.cwd(), 'public', folder) : path.join(process.cwd(), 'public');
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return the public path
        const publicPath = folder ? `/${folder}/${filename}` : `/${filename}`;

        return NextResponse.json({
            success: true,
            path: publicPath,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
