const bcrypt = require('bcryptjs');
const readline = require('readline');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Admin Schema
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
    collection: 'admin'
});

const Admin = mongoose.model('Admin', AdminSchema);

async function setAdminCredentials() {
    console.log('\n=== Set Admin Credentials (MongoDB) ===\n');

    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI not found in .env.local');
        console.log('\nPlease add MONGODB_URI to your .env.local file');
        rl.close();
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const username = await question('Enter admin username: ');
        const password = await question('Enter admin password: ');

        if (!username || !password) {
            console.log('❌ Username and password are required!');
            rl.close();
            await mongoose.connection.close();
            return;
        }

        // Hash the password
        console.log('\n🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if admin already exists
        let admin = await Admin.findOne({ username });

        if (admin) {
            console.log(`\n⚠️  Admin user "${username}" already exists. Updating password...`);
            admin.password = hashedPassword;
            await admin.save();
            console.log('✅ Password updated successfully!');
        } else {
            // Create new admin
            admin = new Admin({
                username,
                password: hashedPassword
            });
            await admin.save();
            console.log('✅ Admin user created successfully!');
        }

        console.log(`\n📊 Admin Details:`);
        console.log(`   Username: ${username}`);
        console.log(`   Password: ********`);
        console.log('\n🌐 You can now login at: http://localhost:3000/admin/login\n');

        rl.close();
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
        await mongoose.connection.close();
        process.exit(1);
    }
}

setAdminCredentials();
