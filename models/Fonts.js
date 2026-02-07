import mongoose from 'mongoose';

const CustomFontSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    path: { type: String, required: true },
    format: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const FontsSchema = new mongoose.Schema({
    customFonts: [CustomFontSchema],
    systemFonts: [{ type: String }]
}, {
    timestamps: true,
    collection: 'fonts'
});

// Use a singleton instance
const Fonts = mongoose.models.Fonts || mongoose.model('Fonts', FontsSchema);

export default Fonts;
