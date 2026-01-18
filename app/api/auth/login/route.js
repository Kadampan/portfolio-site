import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const adminPath = path.join(process.cwd(), 'data', 'admin.json');
        const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

        if (username !== adminData.username) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, adminData.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create a simple token (in production, use JWT)
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

        return NextResponse.json({ success: true, token });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
