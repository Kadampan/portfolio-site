/**
 * Migration script to transfer data from portfolio.json to MongoDB
 * 
 * Usage: node scripts/migrate-to-mongodb.js
 * 
 * This script will:
 * 1. Read the existing portfolio.json file
 * 2. Connect to MongoDB
 * 3. Create or update the portfolio document
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Define the same schema as in the model
const HeroSchema = new mongoose.Schema({
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

const AboutSchema = new mongoose.Schema({
    image: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

const EducationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
    specialization: { type: String, default: '' }
}, { _id: false });

const ToolCategorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    category: { type: String, default: '' },
    items: [{ type: String }]
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    year: { type: String, default: '' },
    works: { type: String, default: '' }
}, { _id: false });

const WorkSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    tools: { type: String, default: '' }
}, { _id: false });

const Model3DSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, default: '' },
    path: { type: String, default: '' },
    type: { type: String, default: 'obj' }
}, { _id: false });

const ContactSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    artstation: { type: String, default: '' },
    github: { type: String, default: '' },
    recipientEmail: { type: String, default: '' }
}, { _id: false });

const PortfolioSchema = new mongoose.Schema({
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
    collection: 'portfolio'
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

async function migrate() {
    try {
        console.log('🚀 Starting migration from portfolio.json to MongoDB...\n');

        // Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            throw new Error('❌ MONGODB_URI is not defined in .env.local file');
        }

        // Read the JSON file
        const jsonPath = path.join(process.cwd(), 'data', 'portfolio.json');

        if (!fs.existsSync(jsonPath)) {
            throw new Error(`❌ portfolio.json not found at ${jsonPath}`);
        }

        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log('✅ Successfully read portfolio.json');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if portfolio already exists
        const existingPortfolio = await Portfolio.findOne();

        if (existingPortfolio) {
            console.log('\n⚠️  Portfolio data already exists in database');
            console.log('Do you want to overwrite it? This will replace all existing data.');
            console.log('If you want to proceed, delete the existing document first or modify this script.');

            // Update the existing document
            Object.assign(existingPortfolio, jsonData);
            await existingPortfolio.save();
            console.log('✅ Updated existing portfolio data');
        } else {
            // Create new document
            const portfolio = new Portfolio(jsonData);
            await portfolio.save();
            console.log('✅ Created new portfolio document');
        }

        console.log('\n✨ Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Hero section: ${jsonData.hero ? '✓' : '✗'}`);
        console.log(`   - About section: ${jsonData.about ? '✓' : '✗'}`);
        console.log(`   - Education entries: ${jsonData.education?.length || 0}`);
        console.log(`   - Tool categories: ${jsonData.tools?.length || 0}`);
        console.log(`   - Experience entries: ${jsonData.experience?.length || 0}`);
        console.log(`   - Work items: ${jsonData.works?.length || 0}`);
        console.log(`   - 3D Models: ${jsonData['3dModels']?.length || 0}`);
        console.log(`   - Contact info: ${jsonData.contact ? '✓' : '✗'}`);

        // Create backup of JSON file
        const backupPath = path.join(process.cwd(), 'data', 'portfolio.json.backup');
        fs.copyFileSync(jsonPath, backupPath);
        console.log(`\n💾 Backup created at: ${backupPath}`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run the migration
migrate();
