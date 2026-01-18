import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Read admin credentials
        const adminData = JSON.parse(await fs.readFile(ADMIN_FILE, 'utf-8'));

        // Check username
        if (username !== adminData.username) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, adminData.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: adminData.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
