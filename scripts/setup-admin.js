// Script to set initial admin password
// Run this once with: node scripts/setup-admin.js

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setupAdmin() {
    rl.question('Enter admin username: ', (username) => {
        rl.question('Enter admin password: ', async (password) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const adminData = {
                    username: username,
                    password: hashedPassword
                };

                const adminPath = path.join(__dirname, '..', 'data', 'admin.json');
                fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));

                console.log('\n✓ Admin credentials set successfully!');
                console.log(`Username: ${username}`);
                console.log('You can now login to /admin');
            } catch (error) {
                console.error('Error:', error);
            }
            rl.close();
        });
    });
}

setupAdmin();
