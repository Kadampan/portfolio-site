import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Connect to MongoDB
        await connectDB();

        // Find admin user
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create a simple token (in production, use JWT)
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

        return NextResponse.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
