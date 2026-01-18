# Portfolio Admin Panel - Setup Guide

## 🎯 Overview

Your portfolio now has a complete admin panel that allows you to manage all content, including images, without touching any code!

## 🚀 Initial Setup

### 1. Install Dependencies

First, install the required packages:

```bash
npm install
```

This will install:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For secure authentication
- All other dependencies

### 2. Set Your Admin Credentials

Run the setup script to create your admin username and password:

```bash
npm run set-admin
```

You'll be prompted to enter:
- Your desired admin username
- Your desired admin password

The password will be securely hashed and stored in `data/admin.json`.

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

Open your browser and navigate to:
```
http://localhost:3000/admin/login
```

Log in with the credentials you just created!

## 🎨 Admin Panel Features

### Home Section
- **Banner Image**: Upload, replace, or remove banner images
- **Title & Subtitle**: Edit your main headline
- **Description**: Update your hero description
- **Statistics**: Modify experience, projects, and clients count

### About Section
- **Profile Image**: Upload your photo (replaces the "3D" placeholder)
- **Description**: Write or edit your about me text
- Support for multi-paragraph formatting

### Education Section
- **Add Education**: Add new degrees, certificates, or courses
- **Remove**: Delete education entries
- **Editable Fields**:
  - Degree/Certificate name
  - University/Institution
  - Year (e.g., "2016 - 2020" or "2019")
  - Specialization details

### Tools Section
- **Add Tool Category**: Create new tool categories
- **Remove**: Delete tool categories
- **Editable Fields**:
  - Category title (e.g., "3D Software", "Programming")
  - Tools list (comma-separated)

### Experience Section
- **Add Experience**: Add new work experience
- **Remove**: Delete experience entries
- **Editable Fields**:
  - Job title
  - Company name
  - Year/Period (e.g., "2022 - Present")
  - Work description

### Works Section
- **Add Work**: Showcase your projects
- **Remove**: Delete projects
- **Editable Fields**:
  - Work image (upload your project screenshots)
  - Title
  - Description
  - Tools used

### Contact Section
- **Contact Info**: Email, phone, location
- **Social Links**: LinkedIn, ArtStation, GitHub URLs

## 💡 Usage Tips

### Image Upload Guidelines
- **Banner**: Recommended size 1920x1080px (landscape)
- **Profile**: Recommended size 800x800px (square)
- **Work Images**: Any size, will be automatically optimized

### Formatting Text
- Use `\n\n` for paragraph breaks in descriptions
- Use `\n` for line breaks in experience descriptions
- Separate tools with commas in the Tools section

### Security
- **Change Default Password**: Immediately after first setup
- **Keep Credentials Safe**: Never share your admin password
- **JWT Token**: Expires after 24 hours (you'll need to log in again)

## 📁 File Structure

```
portfolio-site/
├── app/
│   ├── admin/
│   │   ├── login/              # Login page
│   │   └── dashboard/          # Main dashboard
│   └── api/
│       └── admin/              # Admin API routes
│           ├── login/          # Authentication
│           ├── portfolio/      # Update data
│           └── upload/         # Image uploads
├── components/
│   └── admin/                  # Admin UI components
│       ├── HeroSection.jsx
│       ├── AboutSection.jsx
│       ├── EducationSection.jsx
│       ├── ToolsSection.jsx
│       ├── ExperienceSection.jsx
│       ├── WorksSection.jsx
│       └── ContactSection.jsx
├── data/
│   ├── admin.json             # Admin credentials (hashed)
│   └── portfolio.json         # Portfolio content
├── public/
│   └── uploads/               # Uploaded images
└── scripts/
    └── set-admin.js           # Setup script
```

## 🔐 Security Notes

1. **Environment Variable**: For production, set a secure JWT_SECRET:
   ```
   JWT_SECRET=your-very-secure-random-string
   ```

2. **HTTPS**: Always use HTTPS in production for secure authentication

3. **Password Requirements**: Use a strong password with:
   - At least 12 characters
   - Mix of letters, numbers, and symbols
   - Avoid common words or patterns

## 🆘 Troubleshooting

### Can't Login?
1. Verify you're using the correct credentials
2. Run `npm run set-admin` again to reset password
3. Check browser console for errors

### Images Not Uploading?
1. Ensure the `/public/uploads` directory exists
2. Check file size (should be under 10MB)
3. Verify image format (JPG, PNG, GIF, WebP)

### Changes Not Saving?
1. Check if you're still logged in (token may have expired)
2. Verify `data/portfolio.json` has write permissions
3. Check browser console for API errors

## 🎉 Next Steps

1. **Set Your Credentials** using `npm run set-admin`
2. **Login** at `/admin/login`
3. **Customize Your Portfolio** with your actual content
4. **Upload Your Images** to make it truly yours!

---

**Need Help?** Check the browser console for detailed error messages.
