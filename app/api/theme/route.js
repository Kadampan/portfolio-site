import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Theme from '@/models/Theme';

// GET theme settings
export async function GET() {
    try {
        await connectDB();

        let theme = await Theme.findOne();

        if (!theme) {
            // Return default theme if none exists
            return NextResponse.json({
                logo: {},
                headings: {},
                sectionTitles: {},
                buttons: {},
                navLinks: {},
                hyperlinks: {},
                globalColors: {}
            });
        }

        // Convert to plain object and remove MongoDB fields
        const themeData = theme.toObject();
        delete themeData._id;
        delete themeData.__v;
        delete themeData.createdAt;
        delete themeData.updatedAt;

        return NextResponse.json(themeData);
    } catch (error) {
        console.error('Failed to read theme:', error);
        return NextResponse.json({ error: 'Failed to load theme' }, { status: 500 });
    }
}

// POST/PUT update theme settings
export async function POST(request) {
    try {
        await connectDB();

        const themeData = await request.json();

        let theme = await Theme.findOne();

        if (theme) {
            // Update existing theme
            Object.assign(theme, themeData);
            await theme.save();
        } else {
            // Create new theme
            theme = new Theme(themeData);
            await theme.save();
        }

        return NextResponse.json({ success: true, message: 'Theme updated successfully' });
    } catch (error) {
        console.error('Failed to save theme:', error);
        return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
    }
}
