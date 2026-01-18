const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function createDefaultAdmin() {
    console.log('\n=== Creating Default Admin Credentials ===\n');

    const username = 'admin';
    const password = 'admin123';

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare admin data
    const adminData = {
        username,
        password: hashedPassword
    };

    // Save to admin.json
    const adminFilePath = path.join(__dirname, '..', 'data', 'admin.json');
    await fs.writeFile(adminFilePath, JSON.stringify(adminData, null, 2), 'utf-8');

    console.log('✓ Default admin credentials created successfully!\n');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('You can login at: http://localhost:3000/admin/login\n');
}

createDefaultAdmin().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
