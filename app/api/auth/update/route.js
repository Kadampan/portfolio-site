import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { currentPassword, newUsername, newPassword } = await request.json();

        const adminPath = path.join(process.cwd(), 'data', 'admin.json');
        const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, adminData.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update credentials
        const newAdminData = {
            username: newUsername,
            password: hashedPassword
        };

        fs.writeFileSync(adminPath, JSON.stringify(newAdminData, null, 2));

        return NextResponse.json({ success: true, message: 'Credentials updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
