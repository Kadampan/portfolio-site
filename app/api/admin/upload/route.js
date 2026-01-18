import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Verify JWT token
function verifyToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function POST(request) {
    try {
        // Verify authentication
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const image = formData.get('image');
        const type = formData.get('type') || 'general';

        if (!image) {
            return NextResponse.json(
                { message: 'No image provided' },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = image.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${type}_${timestamp}_${originalName}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Save file
        const bytes = await image.arrayBuffer();
        await fs.writeFile(filepath, Buffer.from(bytes));

        // Return the URL path (relative to public directory)
        const urlPath = `/uploads/${filename}`;

        return NextResponse.json({
            message: 'Image uploaded successfully',
            path: urlPath,
            filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { message: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
