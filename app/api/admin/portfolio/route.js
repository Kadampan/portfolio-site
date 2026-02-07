import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Verify JWT token
function verifyToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function PUT(request) {
    try {
        // Verify authentication
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const updatedData = await request.json();

        // Connect to MongoDB
        await connectDB();

        // Update portfolio in MongoDB
        let portfolio = await Portfolio.findOne();

        if (portfolio) {
            // Update existing portfolio
            Object.assign(portfolio, updatedData);
            await portfolio.save();
        } else {
            // Create new portfolio if doesn't exist
            portfolio = new Portfolio(updatedData);
            await portfolio.save();
        }

        // Return clean data without MongoDB fields
        const responseData = portfolio.toObject();
        delete responseData._id;
        delete responseData.__v;
        delete responseData.createdAt;
        delete responseData.updatedAt;

        return NextResponse.json({
            message: 'Portfolio updated successfully',
            data: responseData
        });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { message: 'Failed to update portfolio', error: error.message },
            { status: 500 }
        );
    }
}
