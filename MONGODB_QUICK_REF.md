# MongoDB Quick Reference 📝

## Quick Start Commands

```powershell
# Install dependencies (already done)
npm install mongoose

# Update .env.local with MongoDB connection string
# Edit: e:\anti gravity\My portfolio\portfolio-site\.env.local

# Run migration to transfer data from JSON to MongoDB
npm run migrate-db

# Start development server
npm run dev
```

## MongoDB Connection Strings

### Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/portfolio
```

### MongoDB Atlas (Cloud)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

## Common MongoDB Commands (for local MongoDB)

### Start/Stop MongoDB Service (Windows)
```powershell
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Check MongoDB status
sc query MongoDB
```

### MongoDB Shell Commands
```powershell
# Connect to MongoDB shell
mongosh

# In mongosh:
use portfolio                    # Switch to portfolio database
db.portfolios.find().pretty()    # View all portfolio data
db.portfolios.countDocuments()   # Count documents
db.portfolios.deleteMany({})     # Delete all documents (careful!)
```

## Viewing Your Data

### Using MongoDB Compass (GUI Tool)
1. Download: https://www.mongodb.com/try/download/compass
2. Install and open MongoDB Compass
3. Connect using: `mongodb://localhost:27017`
4. Navigate to `portfolio` database → `portfolios` collection

### Using MongoDB Atlas (Cloud)
1. Log in to https://cloud.mongodb.com
2. Click "Browse Collections" on your cluster
3. Navigate to `portfolio` database → `portfolios` collection

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portfolio` | GET | Fetch all portfolio data |
| `/api/portfolio` | POST | Update portfolio data |

## File Structure

```
portfolio-site/
├── lib/
│   └── mongodb.js              # MongoDB connection
├── models/
│   └── Portfolio.js            # Mongoose schema
├── scripts/
│   └── migrate-to-mongodb.js   # Migration script
├── app/api/portfolio/
│   └── route.js                # Updated to use MongoDB
└── .env.local                  # MongoDB connection string
```

## Testing Checklist

- [ ] MongoDB is installed and running
- [ ] `.env.local` has correct MONGODB_URI
- [ ] Migration script ran successfully (`npm run migrate-db`)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Portfolio data loads on frontend (http://localhost:3000)
- [ ] API endpoint works (http://localhost:3000/api/portfolio)
- [ ] Admin panel can update data
- [ ] Changes persist after server restart

## Backup & Restore

### Create Backup
```powershell
# Using mongodump (for local MongoDB)
mongodump --db portfolio --out ./backup

# Manual backup (already done by migration script)
# File: data/portfolio.json.backup
```

### Restore from Backup
```powershell
# Using mongorestore
mongorestore --db portfolio ./backup/portfolio

# Or re-run migration script
npm run migrate-db
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/portfolio` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | Email password/app password | `your-app-password` |

## Troubleshooting Quick Fixes

### Can't connect to MongoDB
```powershell
# Check if MongoDB is running
net start MongoDB

# Or restart it
net stop MongoDB
net start MongoDB
```

### "MONGODB_URI not defined" error
1. Check `.env.local` file exists
2. Verify MONGODB_URI is set
3. Restart dev server (`Ctrl+C` then `npm run dev`)

### Migration fails
1. Ensure `data/portfolio.json` exists
2. Check MongoDB is running
3. Verify MONGODB_URI is correct

## Important Notes

⚠️ **After setting up MongoDB**:
- The original `portfolio.json` is kept as backup
- All changes via admin panel now go to MongoDB
- Data persists even after server restart
- You can safely delete `portfolio.json` after confirming everything works

🎯 **For Production Deployment**:
- Use MongoDB Atlas (cloud) for production
- Update MONGODB_URI in your hosting platform's environment variables
- Run migration script on production only once
- Ensure IP whitelist includes your hosting platform

---

**Need more help?** See `MONGODB_SETUP.md` for detailed documentation.
