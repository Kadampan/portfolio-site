/**
 * Complete Data Migration Script
 * 
 * Usage: node scripts/migrate-all-data.js
 * 
 * This script will migrate ALL data from the data folder to MongoDB:
 * - portfolio.json → portfolios collection
 * - admin.json → admin collection
 * - fonts.json → fonts collection
 * - theme.json → theme collection
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Import all schemas (CommonJS style for script)
const { Schema } = mongoose;

// Portfolio Schema
const HeroSchema = new Schema({
    banner: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    stats: {
        experience: { type: String, default: '0+' },
        projects: { type: String, default: '0+' },
        clients: { type: String, default: '0+' }
    }
}, { _id: false });

const AboutSchema = new Schema({
    image: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

const EducationSchema = new Schema({
    id: { type: String, required: true },
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
    specialization: { type: String, default: '' }
}, { _id: false });

const ToolCategorySchema = new Schema({
    id: { type: String, required: true },
    category: { type: String, default: '' },
    items: [{ type: String }]
}, { _id: false });

const ExperienceSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    year: { type: String, default: '' },
    works: { type: String, default: '' }
}, { _id: false });

const WorkSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    tools: { type: String, default: '' }
}, { _id: false });

const Model3DSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, default: '' },
    path: { type: String, default: '' },
    type: { type: String, default: 'obj' }
}, { _id: false });

const ContactSchema = new Schema({
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    artstation: { type: String, default: '' },
    github: { type: String, default: '' },
    recipientEmail: { type: String, default: '' }
}, { _id: false });

const PortfolioSchema = new Schema({
    hero: { type: HeroSchema, default: () => ({}) },
    about: { type: AboutSchema, default: () => ({}) },
    education: [EducationSchema],
    tools: [ToolCategorySchema],
    experience: [ExperienceSchema],
    works: [WorkSchema],
    '3dModels': [Model3DSchema],
    contact: { type: ContactSchema, default: () => ({}) }
}, {
    timestamps: true,
    collection: 'portfolios'
});

// Admin Schema
const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
    collection: 'admin'
});

// Fonts Schema
const CustomFontSchema = new Schema({
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    path: { type: String, required: true },
    format: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const FontsSchema = new Schema({
    customFonts: [CustomFontSchema],
    systemFonts: [{ type: String }]
}, {
    timestamps: true,
    collection: 'fonts'
});

// Theme Schema (simplified for script)
const ThemeSchema = new Schema({
    logo: { type: Schema.Types.Mixed },
    headings: { type: Schema.Types.Mixed },
    sectionTitles: { type: Schema.Types.Mixed },
    buttons: { type: Schema.Types.Mixed },
    navLinks: { type: Schema.Types.Mixed },
    hyperlinks: { type: Schema.Types.Mixed },
    globalColors: { type: Schema.Types.Mixed }
}, {
    timestamps: true,
    collection: 'theme'
});

// Create models
const Portfolio = mongoose.model('Portfolio', PortfolioSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Fonts = mongoose.model('Fonts', FontsSchema);
const Theme = mongoose.model('Theme', ThemeSchema);

async function migrateAllData() {
    const dataDir = path.join(process.cwd(), 'data');
    const results = {
        success: [],
        failed: [],
        skipped: []
    };

    try {
        console.log('🚀 Starting complete data migration to MongoDB...\n');

        // Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            throw new Error('❌ MONGODB_URI is not defined in .env.local file');
        }

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Migrate portfolio.json
        await migrateFile({
            fileName: 'portfolio.json',
            Model: Portfolio,
            dataDir,
            results,
            collectionName: 'Portfolio'
        });

        // Migrate admin.json
        await migrateFile({
            fileName: 'admin.json',
            Model: Admin,
            dataDir,
            results,
            collectionName: 'Admin',
            isSingleDocument: false // Admin can have multiple users
        });

        // Migrate fonts.json
        await migrateFile({
            fileName: 'fonts.json',
            Model: Fonts,
            dataDir,
            results,
            collectionName: 'Fonts'
        });

        // Migrate theme.json
        await migrateFile({
            fileName: 'theme.json',
            Model: Theme,
            dataDir,
            results,
            collectionName: 'Theme'
        });

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('✨ MIGRATION SUMMARY');
        console.log('='.repeat(60) + '\n');

        if (results.success.length > 0) {
            console.log('✅ Successfully migrated:');
            results.success.forEach(item => console.log(`   - ${item}`));
            console.log('');
        }

        if (results.skipped.length > 0) {
            console.log('⚠️  Skipped (file not found):');
            results.skipped.forEach(item => console.log(`   - ${item}`));
            console.log('');
        }

        if (results.failed.length > 0) {
            console.log('❌ Failed:');
            results.failed.forEach(item => console.log(`   - ${item}`));
            console.log('');
        }

        console.log('📊 Statistics:');
        console.log(`   Total files processed: ${results.success.length + results.failed.length + results.skipped.length}`);
        console.log(`   Successful: ${results.success.length}`);
        console.log(`   Failed: ${results.failed.length}`);
        console.log(`   Skipped: ${results.skipped.length}`);

        console.log('\n✨ Migration completed!\n');

        // Create backups
        console.log('💾 Creating backups of original files...');
        const backupDir = path.join(dataDir, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        ['portfolio.json', 'admin.json', 'fonts.json', 'theme.json'].forEach(file => {
            const sourcePath = path.join(dataDir, file);
            if (fs.existsSync(sourcePath)) {
                const backupPath = path.join(backupDir, `${file}.${timestamp}.backup`);
                fs.copyFileSync(sourcePath, backupPath);
                console.log(`   ✓ ${file} → ${path.relative(process.cwd(), backupPath)}`);
            }
        });

        console.log('\n🎉 All data successfully migrated to MongoDB!');
        console.log('\n📋 Next steps:');
        console.log('   1. Start your app: npm run dev');
        console.log('   2. Test all features work correctly');
        console.log('   3. Original files are backed up in data/backups/\n');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB\n');
    }
}

async function migrateFile({ fileName, Model, dataDir, results, collectionName, isSingleDocument = true }) {
    const filePath = path.join(dataDir, fileName);

    console.log(`\n📄 Processing ${fileName}...`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found, skipping`);
        results.skipped.push(fileName);
        return;
    }

    try {
        // Read JSON file
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`   ✓ Read ${fileName}`);

        // Check if document already exists
        const existing = await Model.findOne();

        if (existing && isSingleDocument) {
            console.log(`   ℹ️  ${collectionName} document already exists`);
            console.log(`   🔄 Updating existing document...`);
            Object.assign(existing, jsonData);
            await existing.save();
            console.log(`   ✅ Updated ${collectionName}`);
        } else if (!existing && isSingleDocument) {
            const doc = new Model(jsonData);
            await doc.save();
            console.log(`   ✅ Created new ${collectionName} document`);
        } else {
            // For collections that can have multiple documents (like admin users)
            if (collectionName === 'Admin') {
                const existingAdmin = await Model.findOne({ username: jsonData.username });
                if (existingAdmin) {
                    console.log(`   ℹ️  Admin user "${jsonData.username}" already exists`);
                    existingAdmin.password = jsonData.password;
                    await existingAdmin.save();
                    console.log(`   ✅ Updated admin credentials`);
                } else {
                    const doc = new Model(jsonData);
                    await doc.save();
                    console.log(`   ✅ Created new admin user`);
                }
            }
        }

        results.success.push(fileName);

    } catch (error) {
        console.error(`   ❌ Failed to migrate ${fileName}:`, error.message);
        results.failed.push(`${fileName} - ${error.message}`);
    }
}

// Run the migration
migrateAllData();
