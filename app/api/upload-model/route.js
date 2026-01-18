import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const allowedExtensions = ['.obj', '.fbx', '.gltf', '.glb'];
        const fileExtension = path.extname(file.name).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return NextResponse.json({
                error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`
            }, { status: 400 });
        }

        // Create models directory if it doesn't exist
        const modelsDir = path.join(process.cwd(), 'public', 'models');
        if (!existsSync(modelsDir)) {
            await mkdir(modelsDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `model_${timestamp}_${sanitizedName}`;
        const filePath = path.join(modelsDir, fileName);

        // Convert file to buffer and write
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/models/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: fileName,
            size: buffer.length
        });

    } catch (error) {
        console.error('3D Model upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload 3D model',
            details: error.message
        }, { status: 500 });
    }
}

// Handle DELETE requests to remove 3D models
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public', 'models', filename);

        if (existsSync(filePath)) {
            const { unlink } = await import('fs/promises');
            await unlink(filePath);
            return NextResponse.json({ success: true, message: 'Model deleted' });
        } else {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

    } catch (error) {
        console.error('3D Model deletion error:', error);
        return NextResponse.json({
            error: 'Failed to delete 3D model',
            details: error.message
        }, { status: 500 });
    }
}
