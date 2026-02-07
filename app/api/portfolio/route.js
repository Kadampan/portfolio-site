import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

// GET - Fetch all portfolio data
export async function GET() {
    try {
        await connectDB();

        // Get the portfolio data (there should be only one document)
        let portfolio = await Portfolio.findOne();

        if (!portfolio) {
            // If no portfolio exists, return empty structure
            return NextResponse.json({
                error: 'No portfolio data found. Please run the migration script.'
            }, { status: 404 });
        }

        // Convert to plain object and remove MongoDB-specific fields
        const data = portfolio.toObject();
        delete data._id;
        delete data.__v;
        delete data.createdAt;
        delete data.updatedAt;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        return NextResponse.json({
            error: 'Failed to fetch data',
            details: error.message
        }, { status: 500 });
    }
}

// POST - Update portfolio data
export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();

        // Update or create the portfolio document (there should be only one)
        let portfolio = await Portfolio.findOne();

        if (portfolio) {
            // Update existing document
            Object.assign(portfolio, data);
            await portfolio.save();
        } else {
            // Create new document
            portfolio = new Portfolio(data);
            await portfolio.save();
        }

        return NextResponse.json({
            success: true,
            message: 'Data updated successfully'
        });
    } catch (error) {
        console.error('Error updating portfolio data:', error);
        return NextResponse.json({
            error: 'Failed to update data',
            details: error.message
        }, { status: 500 });
    }
}
