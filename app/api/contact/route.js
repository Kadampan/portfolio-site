import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { name, email, message, to } = await req.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Read portfolio data to get recipient email if not provided
        const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
        const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));
        const recipientEmail = to || portfolioData.contact?.recipientEmail || portfolioData.contact?.email;

        if (!recipientEmail) {
            return NextResponse.json(
                { error: 'Recipient email not configured' },
                { status: 500 }
            );
        }

        // Create transporter using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: recipientEmail,
            subject: `Portfolio Contact Form: Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="margin: 20px 0;">
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    </div>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Message:</h3>
                        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <p style="color: #777; font-size: 12px;">
                        This message was sent from your portfolio contact form.
                    </p>
                </div>
            `,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: 'Email sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email', details: error.message },
            { status: 500 }
        );
    }
}
