import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { currentPassword, newPassword } = await request.json();

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        // Read current admin data
        const adminPath = path.join(process.cwd(), 'data', 'admin.json');
        const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, adminData.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin data
        adminData.password = hashedPassword;

        // Save to file
        fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({
            error: 'Failed to change password'
        }, { status: 500 });
    }
}
