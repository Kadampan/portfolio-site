import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

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

        // Connect to MongoDB
        await connectDB();

        // Find admin user (assuming username is 'admin')
        const admin = await Admin.findOne({ username: 'admin' });

        if (!admin) {
            return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, admin.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        admin.password = hashedPassword;
        await admin.save();

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
