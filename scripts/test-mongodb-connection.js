/**
 * Test MongoDB Connection
 * 
 * Usage: node scripts/test-mongodb-connection.js
 * 
 * This script will test your MongoDB connection and verify the setup
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');

    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
        console.error('❌ ERROR: MONGODB_URI is not defined in .env.local');
        console.log('\n📝 Please add the following to your .env.local file:');
        console.log('   For local MongoDB:');
        console.log('   MONGODB_URI=mongodb://localhost:27017/portfolio\n');
        console.log('   For MongoDB Atlas:');
        console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio\n');
        process.exit(1);
    }

    console.log('✅ MONGODB_URI found in environment variables');
    console.log(`📍 Connecting to: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

    try {
        // Attempt to connect
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });

        console.log('✅ Successfully connected to MongoDB!\n');

        // Get database info
        const db = mongoose.connection.db;
        const admin = db.admin();

        try {
            const serverInfo = await admin.serverInfo();
            console.log('📊 Server Information:');
            console.log(`   - Version: ${serverInfo.version}`);
            console.log(`   - Database: ${db.databaseName}`);
        } catch (err) {
            console.log('📊 Connected to database:', db.databaseName);
        }

        // Check if portfolio collection exists
        const collections = await db.listCollections().toArray();
        const portfolioCollection = collections.find(c => c.name === 'portfolios');

        if (portfolioCollection) {
            console.log('✅ Portfolio collection found');

            // Count documents
            const count = await db.collection('portfolios').countDocuments();
            console.log(`   - Documents in collection: ${count}`);

            if (count > 0) {
                console.log('\n✨ Your portfolio data is already in MongoDB!');
            } else {
                console.log('\n⚠️  Portfolio collection exists but is empty');
                console.log('   Run migration: npm run migrate-db');
            }
        } else {
            console.log('\n📝 Portfolio collection not found');
            console.log('   This is normal for first-time setup');
            console.log('   Run migration to create it: npm run migrate-db');
        }

        console.log('\n🎉 Connection test successful!');
        console.log('\n📋 Next steps:');
        if (!portfolioCollection || (portfolioCollection && await db.collection('portfolios').countDocuments() === 0)) {
            console.log('   1. Run: npm run migrate-db');
            console.log('   2. Then: npm run dev');
        } else {
            console.log('   - Start your app: npm run dev');
            console.log('   - Your portfolio: http://localhost:3000');
            console.log('   - API endpoint: http://localhost:3000/api/portfolio');
        }

    } catch (error) {
        console.error('\n❌ Connection failed!\n');

        if (error.name === 'MongooseServerSelectionError') {
            console.error('📛 Cannot connect to MongoDB server\n');

            if (process.env.MONGODB_URI.includes('localhost') || process.env.MONGODB_URI.includes('127.0.0.1')) {
                console.log('💡 Local MongoDB Troubleshooting:');
                console.log('   1. Check if MongoDB is installed');
                console.log('   2. Start MongoDB service:');
                console.log('      Windows: net start MongoDB');
                console.log('      macOS: brew services start mongodb-community');
                console.log('      Linux: sudo systemctl start mongod');
                console.log('   3. Verify MongoDB is running on port 27017\n');
            } else {
                console.log('💡 MongoDB Atlas Troubleshooting:');
                console.log('   1. Check your internet connection');
                console.log('   2. Verify the connection string is correct');
                console.log('   3. Check IP whitelist in Atlas Network Access');
                console.log('   4. Ensure database user has correct permissions\n');
            }
        } else if (error.name === 'MongoParseError') {
            console.error('📛 Invalid connection string format\n');
            console.log('💡 Check your MONGODB_URI in .env.local');
            console.log('   Format should be:');
            console.log('   mongodb://localhost:27017/portfolio');
            console.log('   OR');
            console.log('   mongodb+srv://user:pass@cluster.mongodb.net/portfolio\n');
        } else if (error.message.includes('Authentication failed')) {
            console.error('📛 Authentication failed\n');
            console.log('💡 MongoDB Atlas Troubleshooting:');
            console.log('   1. Check username and password in connection string');
            console.log('   2. Verify database user exists in Atlas');
            console.log('   3. Ensure user has "Read and write" permissions');
            console.log('   4. Make sure password special characters are URL-encoded\n');
        } else {
            console.error('Error details:', error.message);
        }

        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run the test
testConnection();
