import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json');
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

export async function PUT(request) {
    try {
        // Verify authentication
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const updatedData = await request.json();

        // Write updated portfolio data
        await fs.writeFile(
            PORTFOLIO_FILE,
            JSON.stringify(updatedData, null, 2),
            'utf-8'
        );

        return NextResponse.json({
            message: 'Portfolio updated successfully',
            data: updatedData
        });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { message: 'Failed to update portfolio' },
            { status: 500 }
        );
    }
}
