import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/mongodb';
import Fonts from '@/models/Fonts';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('font');
        const fontName = formData.get('fontName');

        if (!file || !fontName) {
            return NextResponse.json({ error: 'Font file and name are required' }, { status: 400 });
        }

        // Create fonts directory if it doesn't exist
        const fontsDir = path.join(process.cwd(), 'public', 'fonts', 'custom');
        if (!fs.existsSync(fontsDir)) {
            await mkdir(fontsDir, { recursive: true });
        }

        // Get file extension
        const fileExtension = file.name.split('.').pop();
        const allowedExtensions = ['ttf', 'otf', 'woff', 'woff2'];

        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            return NextResponse.json({
                error: 'Invalid font format. Allowed: .ttf, .otf, .woff, .woff2'
            }, { status: 400 });
        }

        // Save font file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const sanitizedFontName = fontName.replace(/[^a-zA-Z0-9-_]/g, '');
        const fileName = `${sanitizedFontName}.${fileExtension}`;
        const filePath = path.join(fontsDir, fileName);

        await writeFile(filePath, buffer);

        // Connect to MongoDB and update fonts registry
        await connectDB();

        let fontsRegistry = await Fonts.findOne();

        if (!fontsRegistry) {
            fontsRegistry = new Fonts({ customFonts: [], systemFonts: [] });
        }

        // Check if font already exists
        const existingIndex = fontsRegistry.customFonts.findIndex(f => f.name === fontName);

        const fontData = {
            name: fontName,
            fileName: fileName,
            path: `/fonts/custom/${fileName}`,
            format: fileExtension,
            uploadedAt: new Date()
        };

        if (existingIndex >= 0) {
            // Update existing
            fontsRegistry.customFonts[existingIndex] = fontData;
        } else {
            // Add new
            fontsRegistry.customFonts.push(fontData);
        }

        // Save to MongoDB
        await fontsRegistry.save();

        return NextResponse.json({
            success: true,
            message: 'Font uploaded successfully',
            font: fontData
        });

    } catch (error) {
        console.error('Font upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload font'
        }, { status: 500 });
    }
}

// GET: List all custom fonts
export async function GET() {
    try {
        await connectDB();

        let fontsRegistry = await Fonts.findOne();

        if (!fontsRegistry) {
            return NextResponse.json({
                customFonts: [],
                systemFonts: []
            });
        }

        // Convert to plain object and remove MongoDB fields
        const fontsData = fontsRegistry.toObject();
        delete fontsData._id;
        delete fontsData.__v;
        delete fontsData.createdAt;
        delete fontsData.updatedAt;

        return NextResponse.json(fontsData);

    } catch (error) {
        console.error('Failed to read fonts:', error);
        return NextResponse.json({ error: 'Failed to load fonts' }, { status: 500 });
    }
}

// DELETE: Remove a custom font
export async function DELETE(request) {
    try {
        const { fontName } = await request.json();

        await connectDB();

        let fontsRegistry = await Fonts.findOne();

        if (!fontsRegistry) {
            return NextResponse.json({ error: 'No fonts found' }, { status: 404 });
        }

        const fontIndex = fontsRegistry.customFonts.findIndex(f => f.name === fontName);

        if (fontIndex === -1) {
            return NextResponse.json({ error: 'Font not found' }, { status: 404 });
        }

        // Delete font file
        const fontData = fontsRegistry.customFonts[fontIndex];
        const fontPath = path.join(process.cwd(), 'public', fontData.path);

        if (fs.existsSync(fontPath)) {
            fs.unlinkSync(fontPath);
        }

        // Remove from registry
        fontsRegistry.customFonts.splice(fontIndex, 1);
        await fontsRegistry.save();

        return NextResponse.json({
            success: true,
            message: 'Font deleted successfully'
        });

    } catch (error) {
        console.error('Font delete error:', error);
        return NextResponse.json({ error: 'Failed to delete font' }, { status: 500 });
    }
}
