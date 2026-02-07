import mongoose from 'mongoose';

// Define sub-schemas
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

// Main Portfolio Schema
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

// Use a singleton instance
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

export default Portfolio;
