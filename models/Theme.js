import mongoose from 'mongoose';

const LogoSchema = new mongoose.Schema({
    text: { type: String, default: '' },
    fontFamily: { type: String, default: 'inherit' },
    fontSize: { type: String, default: '2rem' },
    fontWeight: { type: String, default: '400' },
    letterSpacing: { type: String, default: '0.05em' },
    textTransform: { type: String, default: 'none' },
    gradientColors: [{ type: String }],
    animation: {
        enabled: { type: Boolean, default: false },
        type: { type: String, default: 'none' },
        speed: { type: String, default: '3s' },
        pulseEnabled: { type: Boolean, default: false },
        pulseSpeed: { type: String, default: '2s' }
    },
    glow: {
        enabled: { type: Boolean, default: false },
        color: { type: String, default: '#ffffff' },
        intensity: { type: String, default: 'medium' },
        layers: { type: Number, default: 1 }
    }
}, { _id: false });

const HeadingsSchema = new mongoose.Schema({
    fontFamily: { type: String, default: 'inherit' },
    fontWeight: { type: String, default: '700' },
    letterSpacing: { type: String, default: '0.05em' },
    textTransform: { type: String, default: 'none' },
    h1Size: { type: String, default: '4rem' },
    h2Size: { type: String, default: '3rem' },
    h3Size: { type: String, default: '2.5rem' },
    h4Size: { type: String, default: '2rem' },
    color: { type: String, default: '#ffffff' }
}, { _id: false });

const SectionTitlesSchema = new mongoose.Schema({
    fontFamily: { type: String, default: 'inherit' },
    fontSize: { type: String, default: '3rem' },
    fontWeight: { type: String, default: '800' },
    letterSpacing: { type: String, default: '0.08em' },
    textTransform: { type: String, default: 'uppercase' },
    color: { type: String, default: '#ffffff' },
    gradientEnabled: { type: Boolean, default: false },
    gradientColors: [{ type: String }]
}, { _id: false });

const ButtonsSchema = new mongoose.Schema({
    fontFamily: { type: String, default: 'inherit' },
    fontSize: { type: String, default: '1rem' },
    fontWeight: { type: String, default: '600' },
    letterSpacing: { type: String, default: '0.08em' },
    textTransform: { type: String, default: 'uppercase' },
    borderRadius: { type: String, default: '1rem' },
    animation: {
        hoverLift: { type: Boolean, default: true },
        hoverGlow: { type: Boolean, default: true }
    },
    primary: {
        bgGradient: [{ type: String }],
        textColor: { type: String, default: '#ffffff' }
    },
    outline: {
        borderColor: { type: String, default: '#8b5cf6' },
        textColor: { type: String, default: '#8b5cf6' },
        hoverBg: { type: String, default: '#8b5cf6' },
        hoverTextColor: { type: String, default: '#ffffff' }
    }
}, { _id: false });

const NavLinksSchema = new mongoose.Schema({
    fontFamily: { type: String, default: 'inherit' },
    fontSize: { type: String, default: '1rem' },
    fontWeight: { type: String, default: '500' },
    letterSpacing: { type: String, default: '0.05em' },
    color: { type: String, default: '#a0a0b0' },
    hoverColor: { type: String, default: '#ffffff' },
    activeColor: { type: String, default: '#8b5cf6' }
}, { _id: false });

const HyperlinksSchema = new mongoose.Schema({
    fontFamily: { type: String, default: 'inherit' },
    fontWeight: { type: String, default: '500' },
    color: { type: String, default: '#17141f' },
    hoverColor: { type: String, default: '#06b6d4' },
    underline: { type: Boolean, default: false },
    hoverUnderline: { type: Boolean, default: true },
    animation: {
        enabled: { type: Boolean, default: true },
        transitionSpeed: { type: String, default: '0.3s' }
    }
}, { _id: false });

const GlobalColorsSchema = new mongoose.Schema({
    primary: { type: String, default: '#8b5cf6' },
    secondary: { type: String, default: '#06b6d4' },
    background: { type: String, default: '#0a0a0f' },
    cardBackground: { type: String, default: '#121218' },
    textPrimary: { type: String, default: '#ffffff' },
    textSecondary: { type: String, default: '#a0a0b0' }
}, { _id: false });

const ThemeSchema = new mongoose.Schema({
    logo: { type: LogoSchema, default: () => ({}) },
    headings: { type: HeadingsSchema, default: () => ({}) },
    sectionTitles: { type: SectionTitlesSchema, default: () => ({}) },
    buttons: { type: ButtonsSchema, default: () => ({}) },
    navLinks: { type: NavLinksSchema, default: () => ({}) },
    hyperlinks: { type: HyperlinksSchema, default: () => ({}) },
    globalColors: { type: GlobalColorsSchema, default: () => ({}) }
}, {
    timestamps: true,
    collection: 'theme'
});

// Use a singleton instance
const Theme = mongoose.models.Theme || mongoose.model('Theme', ThemeSchema);

export default Theme;
