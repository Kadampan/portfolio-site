# Architecture Overview 🏗️

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Portfolio Page  │              │   Admin Panel    │        │
│  │  (Frontend)      │              │   (Frontend)     │        │
│  │  localhost:3000  │              │  /admin          │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
│           │                                 │                   │
└───────────┼─────────────────────────────────┼───────────────────┘
            │                                 │
            │ HTTP Requests                   │
            │                                 │
┌───────────▼─────────────────────────────────▼───────────────────┐
│                     Next.js Server                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API Routes                                                      │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ /api/portfolio │  │  /api/auth   │  │  /api/contact    │   │
│  │                │  │              │  │                  │   │
│  │ GET  - Fetch   │  │ POST - Login │  │ POST - Send Email│   │
│  │ POST - Update  │  │              │  │                  │   │
│  └───────┬────────┘  └──────────────┘  └─────────┬────────┘   │
│          │                                        │             │
│          │                                        │             │
│  ┌───────▼──────────────────────┐         ┌──────▼──────────┐ │
│  │  MongoDB Connection Layer    │         │  Nodemailer     │ │
│  │  lib/mongodb.js              │         │  (SMTP)         │ │
│  │  - Connection caching        │         └─────────────────┘ │
│  │  - Error handling            │                             │
│  └───────┬──────────────────────┘                             │
│          │                                                     │
│  ┌───────▼──────────────────────┐                             │
│  │  Mongoose Models             │                             │
│  │  models/Portfolio.js         │                             │
│  │  - Schema validation         │                             │
│  │  - Data structure            │                             │
│  └───────┬──────────────────────┘                             │
│          │                                                     │
└──────────┼─────────────────────────────────────────────────────┘
           │
           │ MongoDB Protocol
           │
┌──────────▼──────────────────────────────────────────────────────┐
│                      MongoDB Database                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Database: portfolio                                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Collection: portfolios                                     │ │
│  │ ┌────────────────────────────────────────────────────────┐ │ │
│  │ │ Document:                                              │ │ │
│  │ │ {                                                      │ │ │
│  │ │   hero: { ... },                                       │ │ │
│  │ │   about: { ... },                                      │ │ │
│  │ │   education: [...],                                    │ │ │
│  │ │   tools: [...],                                        │ │ │
│  │ │   experience: [...],                                   │ │ │
│  │ │   works: [...],                                        │ │ │
│  │ │   3dModels: [...],                                     │ │ │
│  │ │   contact: { ... }                                     │ │ │
│  │ │ }                                                      │ │ │
│  │ └────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  (Local: localhost:27017 OR Cloud: MongoDB Atlas)               │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Reading Portfolio Data (GET Request)

```
User browses to /          →   Next.js renders page
      ↓
Frontend fetches from      →   /api/portfolio (GET)
      ↓
API connects to MongoDB    →   lib/mongodb.js
      ↓
Query using Mongoose       →   Portfolio.findOne()
      ↓
MongoDB returns data       →   Document object
      ↓
API processes & cleans     →   Remove _id, __v, timestamps
      ↓
Returns JSON response      →   Frontend receives data
      ↓
Frontend renders           →   User sees portfolio
```

### Updating Portfolio Data (Admin Panel)

```
Admin logs into /admin     →   Authentication via /api/auth
      ↓
Admin edits content        →   Form changes in admin panel
      ↓
Clicks Save                →   POST to /api/portfolio
      ↓
API validates token        →   JWT authentication
      ↓
API connects to MongoDB    →   lib/mongodb.js
      ↓
Find existing portfolio    →   Portfolio.findOne()
      ↓
Update document            →   Object.assign() + save()
      ↓
MongoDB saves changes      →   Data persisted
      ↓
API returns success        →   Admin panel shows confirmation
      ↓
Frontend refetches         →   Updated data displayed
```

### Contact Form Flow

```
User fills contact form    →   Enters name, email, message
      ↓
Clicks Send Message        →   POST to /api/contact
      ↓
API validates data         →   Check required fields
      ↓
Creates email              →   Using Nodemailer
      ↓
Connects to SMTP           →   Gmail/other SMTP server
      ↓
Sends email                →   To configured recipient
      ↓
Returns success/error      →   User sees confirmation
```

## File Organization

```
portfolio-site/
│
├── Frontend (React Components)
│   ├── app/page.js                    # Main portfolio page
│   ├── app/admin/page.js              # Admin panel
│   └── components/
│       ├── sections/                  # Portfolio sections
│       ├── admin/                     # Admin components
│       └── 3d/                        # 3D components
│
├── Backend (API Routes)
│   └── app/api/
│       ├── portfolio/route.js         # Portfolio CRUD
│       ├── auth/login/route.js        # Authentication
│       ├── contact/route.js           # Email sending
│       └── upload/route.js            # File uploads
│
├── Database Layer
│   ├── lib/mongodb.js                 # Connection utility
│   └── models/Portfolio.js            # Mongoose schema
│
├── Scripts & Tools
│   └── scripts/
│       ├── migrate-to-mongodb.js      # Data migration
│       ├── test-mongodb-connection.js # Connection test
│       └── set-admin.js               # Admin setup
│
└── Configuration
    ├── .env.local                     # Environment variables
    ├── package.json                   # Dependencies & scripts
    └── jsconfig.json                  # Path aliases
```

## Technology Stack Details

### Frontend
- **Next.js 16** - React framework with SSR/SSG
- **React 19** - UI library
- **React Three Fiber** - 3D graphics in React
- **Drei** - 3D helpers and abstractions
- **Framer Motion** - Smooth animations

### Backend
- **Next.js API Routes** - Serverless functions
- **Mongoose** - MongoDB ODM
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email sending

### Database
- **MongoDB** - NoSQL document database
- **Mongoose** - Schema & validation

## Key Features Implementation

### 1. Connection Caching
```javascript
// lib/mongodb.js
let cached = global.mongoose;
// Prevents creating multiple connections
// Especially important in Next.js dev mode
```

### 2. Schema Validation
```javascript
// models/Portfolio.js
const HeroSchema = new mongoose.Schema({
    banner: { type: String, default: '' },
    // Enforces data structure
    // Provides defaults
});
```

### 3. JWT Authentication
```javascript
// API routes check for valid token
// Admin panel sends token with requests
// Secure, stateless authentication
```

### 4. File Uploads
```javascript
// Multer middleware handles multipart/form-data
// Files saved to public/uploads/
// Paths stored in MongoDB
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/portfolio` |
| `SMTP_HOST` | Email server | `smtp.gmail.com` |
| `SMTP_PORT` | Email port | `587` |
| `SMTP_USER` | Email username | `user@gmail.com` |
| `SMTP_PASS` | Email password | `app-specific-password` |
| `JWT_SECRET` | Auth token secret | Auto-generated |

## Scalability Considerations

### Current Setup (Single Document)
✅ Perfect for portfolios (one user, one dataset)
✅ Simple queries (find one document)
✅ Easy to manage and understand
✅ Fast performance

### Future Expansion Options
- Multiple portfolios → Add user field, query by user
- Blog posts → New collection for posts
- Analytics → New collection for tracking
- Comments → Embedded or separate collection

## Security Features

1. **Authentication**: JWT-based, secure tokens
2. **Password Hashing**: bcryptjs with salt
3. **Input Validation**: Mongoose schemas
4. **File Upload Limits**: Size and type restrictions
5. **CORS**: Next.js default security
6. **Environment Secrets**: Never committed to git

## Performance Optimizations

1. **Connection Caching**: Reuse MongoDB connections
2. **Image Optimization**: Next.js automatic optimization
3. **Code Splitting**: Automatic with Next.js
4. **3D Model Loading**: Lazy loading, suspense
5. **Database Indexing**: Can add indexes if needed

## Backup & Recovery

### Automated Backups
- MongoDB Atlas: Automatic continuous backups
- Local: Use mongodump/mongorestore

### Manual Backup
```bash
# Export to JSON
mongodump --db portfolio --out ./backup

# Restore from JSON
mongorestore --db portfolio ./backup/portfolio
```

### Data Migration
```bash
# From JSON to MongoDB
npm run migrate-db

# Creates backup: data/portfolio.json.backup
```

---

This architecture provides a solid foundation that's:
- ✅ Scalable
- ✅ Maintainable
- ✅ Secure
- ✅ Performant
- ✅ Easy to deploy
