import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
    try {
        const { currentPassword, newUsername, newPassword } = await request.json();

        // Connect to MongoDB
        await connectDB();

        // Find the admin user (assuming there's only one, or find by username)
        const admin = await Admin.findOne();

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

        // Update credentials
        admin.username = newUsername;
        admin.password = hashedPassword;
        await admin.save();

        return NextResponse.json({ success: true, message: 'Credentials updated successfully' });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
