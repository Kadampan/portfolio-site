const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setAdminCredentials() {
    console.log('\n=== Set Admin Credentials ===\n');

    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');

    if (!username || !password) {
        console.log('Username and password are required!');
        rl.close();
        return;
    }

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

    console.log('\n✓ Admin credentials saved successfully!');
    console.log(`Username: ${username}`);
    console.log('\nYou can now login at: http://localhost:3000/admin/login\n');

    rl.close();
}

setAdminCredentials().catch(error => {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
});
