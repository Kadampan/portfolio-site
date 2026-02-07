# 3D Portfolio Website 🎨

A stunning, modern portfolio website built with Next.js, React Three Fiber, and MongoDB. Features an immersive 3D experience, comprehensive admin panel, and dynamic content management.

## ✨ Features

- 🎨 **Immersive 3D Experience** - Interactive 3D models with scroll-based animations
- 🎯 **Admin Panel** - Complete content management system
- 🗄️ **MongoDB Integration** - Scalable database storage
- 📧 **Contact Form** - Email integration with SMTP
- 🎨 **Custom Themes** - Dynamic theme customization
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Optimized for speed
- 🔒 **Secure Authentication** - JWT-based admin login

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd "e:\anti gravity\My portfolio\portfolio-site"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   
   Choose one option:
   
   **Option A: Local MongoDB**
   - Download and install from https://www.mongodb.com/try/download/community
   - Start MongoDB service: `net start MongoDB`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create account at https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster
   - Get your connection string

4. **Configure environment variables**
   
   Edit `.env.local` and update:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/portfolio
   # Or for Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   
   # Email (for contact form)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

5. **Test MongoDB connection**
   ```bash
   npm run test-db
   ```

6. **Migrate existing data to MongoDB**
   ```bash
   npm run migrate-db
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Portfolio: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - API: http://localhost:3000/api/portfolio

## 📚 Documentation

- **[MongoDB Setup Guide](MONGODB_SETUP.md)** - Detailed MongoDB installation and configuration
- **[MongoDB Quick Reference](MONGODB_QUICK_REF.md)** - Common commands and operations
- **[Migration Summary](MONGODB_MIGRATION_SUMMARY.md)** - Overview of MongoDB migration
- **[Admin Setup](ADMIN_SETUP.md)** - Admin panel configuration
- **[Contact Form Setup](CONTACT_FORM_IMPLEMENTATION.md)** - Email configuration
- **[3D Models Guide](CUSTOM_3D_MODELS_GUIDE.md)** - Working with 3D models

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test-db` | Test MongoDB connection |
| `npm run migrate-db` | Migrate data from JSON to MongoDB |
| `npm run set-admin` | Set up admin credentials |

## 🗄️ Database Structure

The application uses MongoDB with a single `portfolio` database containing:

- **Collection**: `portfolios`
- **Document Structure**:
  ```javascript
  {
    hero: { banner, title, subtitle, description, stats },
    about: { image, description },
    education: [...],
    tools: [...],
    experience: [...],
    works: [...],
    3dModels: [...],
    contact: { email, phone, location, social links }
  }
  ```

## 🏗️ Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Database**: MongoDB with Mongoose
- **Animations**: Framer Motion
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **File Upload**: Multer

## 📁 Project Structure

```
portfolio-site/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   │   ├── portfolio/       # Portfolio CRUD
│   │   ├── auth/           # Authentication
│   │   ├── contact/        # Contact form
│   │   └── upload/         # File uploads
│   └── page.js             # Main portfolio page
├── components/              # React components
│   ├── 3d/                 # 3D-related components
│   ├── admin/              # Admin panel components
│   └── sections/           # Portfolio sections
├── lib/                    # Utilities
│   └── mongodb.js          # MongoDB connection
├── models/                 # Mongoose schemas
│   └── Portfolio.js        # Portfolio model
├── scripts/                # Utility scripts
│   ├── migrate-to-mongodb.js
│   ├── test-mongodb-connection.js
│   └── set-admin.js
├── data/                   # Data files
│   └── portfolio.json      # Backup data
└── public/                 # Static files
    └── uploads/            # Uploaded images
```

## 🔒 Admin Panel

Access the admin panel at `/admin` to manage:

- Hero section content
- About section
- Education entries
- Skills and tools
- Experience timeline
- Portfolio works
- 3D models
- Contact information
- Theme customization

**First-time setup:**
```bash
npm run set-admin
```

## 📧 Contact Form Setup

The contact form requires SMTP configuration:

1. For Gmail, create an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate a new app password
   - Use this in `SMTP_PASS`

2. Update `.env.local` with your SMTP credentials

3. Configure recipient email in the admin panel

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGODB_URI` (use MongoDB Atlas for production)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
4. Deploy!

### Deploy to Other Platforms

1. Build the project: `npm run build`
2. Set environment variables
3. Run migration: `npm run migrate-db`
4. Start: `npm run start`

## 🐛 Troubleshooting

### MongoDB Connection Issues

Run the connection test:
```bash
npm run test-db
```

Common fixes:
- Ensure MongoDB is running: `net start MongoDB`
- Check `MONGODB_URI` in `.env.local`
- For Atlas: verify IP whitelist and credentials

### Migration Issues

If migration fails:
1. Check `data/portfolio.json` exists
2. Verify MongoDB connection
3. See detailed logs for specific errors

For more help, see [MONGODB_SETUP.md](MONGODB_SETUP.md)

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues and questions:
1. Check the documentation files in the project
2. Review the troubleshooting sections
3. Create an issue on GitHub

---

**Built with ❤️ using Next.js and MongoDB**
