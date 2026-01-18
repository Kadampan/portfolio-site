# Email Configuration Setup

## Overview
The contact form now sends emails! To enable this functionality, you need to configure SMTP settings.

## Environment Variables Required

Create a `.env.local` file in the root of your project with the following variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Setup Instructions for Gmail

1. **Enable 2-Step Verification**
   - Go to your Google Account settings (https://myaccount.google.com/)
   - Navigate to Security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - Go to Security > App passwords (https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "Portfolio Contact Form"
   - Click Generate
   - Copy the 16-character password

3. **Configure Environment Variables**
   - Create `.env.local` file in your project root
   - Add the credentials:
     ```env
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=the-16-character-password-from-step-2
     ```

4. **Restart Development Server**
   - Stop your development server (Ctrl+C)
   - Run `npm run dev` again
   - The contact form will now send emails!

## Alternative SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key-id
SMTP_PASS=your-aws-secret-access-key
```

## Admin Panel Configuration

1. Go to your admin panel: `http://localhost:3000/admin`
2. Navigate to the "Contact" tab
3. Set the **Recipient Email** - this is where contact form submissions will be sent
4. Optionally set a different **Display Email** - this is shown publicly on your contact page
5. Click "Save Changes"

## Testing

1. Ensure your `.env.local` file is set up correctly
2. Restart the dev server if needed
3. Go to your portfolio's contact page
4. Fill out and submit the contact form
5. Check the recipient email inbox for the message

## Troubleshooting

**Error: "Recipient email not configured"**
- Go to Admin Panel > Contact tab
- Set the Recipient Email field
- Save changes

**Error: "Authentication failed"**
- Check that your SMTP credentials are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled for Gmail

**Email not received**
- Check spam/junk folder
- Verify SMTP_USER email is correct
- Test with a different email provider
- Check server logs for detailed error messages

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env*` pattern is already in `.gitignore`
- Keep your SMTP credentials secure
- Use App Passwords instead of main account passwords
