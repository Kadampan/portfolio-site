import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET - Fetch all portfolio data
export async function GET() {
    try {
        const dataPath = path.join(process.cwd(), 'data', 'portfolio.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

// POST - Update portfolio data
export async function POST(request) {
    try {
        const data = await request.json();
        const dataPath = path.join(process.cwd(), 'data', 'portfolio.json');

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}
