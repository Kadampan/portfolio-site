import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET theme settings
export async function GET() {
    try {
        const themePath = path.join(process.cwd(), 'data', 'theme.json');
        const themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
        return NextResponse.json(themeData);
    } catch (error) {
        console.error('Failed to read theme:', error);
        return NextResponse.json({ error: 'Failed to load theme' }, { status: 500 });
    }
}

// POST/PUT update theme settings
export async function POST(request) {
    try {
        const themeData = await request.json();
        const themePath = path.join(process.cwd(), 'data', 'theme.json');

        fs.writeFileSync(themePath, JSON.stringify(themeData, null, 2));

        return NextResponse.json({ success: true, message: 'Theme updated successfully' });
    } catch (error) {
        console.error('Failed to save theme:', error);
        return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
    }
}
