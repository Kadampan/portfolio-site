# MongoDB Setup Guide 🗄️

Your portfolio website has been migrated from file-based storage (portfolio.json) to MongoDB database. This guide will help you complete the setup.

## Prerequisites

You need to have MongoDB installed and running. Choose one of the following options:

### Option 1: Local MongoDB (Recommended for Development)

1. **Download and Install MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the installer for Windows
   - Run the installer and follow the installation wizard
   - Install MongoDB as a service (recommended)

2. **Verify Installation**
   ```powershell
   mongod --version
   ```

3. **Start MongoDB Service** (if not running)
   ```powershell
   net start MongoDB
   ```

### Option 2: MongoDB Atlas (Cloud-based, Free Tier Available)

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Cluster**
   - Choose the FREE tier (M0)
   - Select a cloud provider and region closest to you
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set permissions to "Read and write to any database"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add your specific IP addresses

5. **Get Connection String**
   - Go to "Database" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

## Configuration

### 1. Update .env.local

Open `e:\anti gravity\My portfolio\portfolio-site\.env.local` and update the `MONGODB_URI`:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/portfolio
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

Replace:
- `your-username` with your MongoDB Atlas username
- `your-password` with your MongoDB Atlas password
- `cluster0.xxxxx.mongodb.net` with your actual cluster address

### 2. Run Migration Script

After configuring MongoDB, migrate your existing data from `portfolio.json` to MongoDB:

```powershell
npm run migrate-db
```

This script will:
- ✅ Read your existing `portfolio.json` file
- ✅ Connect to MongoDB
- ✅ Create/update the portfolio document in the database
- ✅ Create a backup of your JSON file (`portfolio.json.backup`)
- ✅ Show a summary of migrated data

## Testing the Setup

### 1. Start the Development Server

```powershell
npm run dev
```

### 2. Test the Portfolio API

Open your browser and visit:
- Frontend: http://localhost:3000
- API endpoint: http://localhost:3000/api/portfolio

You should see your portfolio data being served from MongoDB.

### 3. Test the Admin Panel

1. Go to http://localhost:3000/admin
2. Log in with your admin credentials
3. Try updating any content section
4. Changes should now be saved to MongoDB instead of the JSON file

## Database Structure

Your MongoDB database has a single collection called `portfolio` with one document containing all your portfolio data:

```javascript
{
  hero: { banner, title, subtitle, description, stats },
  about: { image, description },
  education: [ { id, degree, institution, year, specialization } ],
  tools: [ { id, category, items[] } ],
  experience: [ { id, title, company, year, works } ],
  works: [ { id, title, description, image, tools } ],
  3dModels: [ { id, name, path, type } ],
  contact: { email, phone, location, linkedin, artstation, github, recipientEmail }
}
```

## Troubleshooting

### Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check your username and password in the connection string
- Ensure the user has proper permissions in MongoDB Atlas

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- For local MongoDB: Make sure MongoDB service is running
  ```powershell
  net start MongoDB
  ```
- For MongoDB Atlas: Check your network access settings and IP whitelist

**Error: "MONGODB_URI is not defined"**
- Make sure `.env.local` file exists and contains `MONGODB_URI`
- Restart your development server after updating `.env.local`

### Migration Issues

**Error: "portfolio.json not found"**
- Ensure you're running the migration script from the project root
- Check that `data/portfolio.json` exists

**Warning: "Portfolio data already exists in database"**
- The migration script will update the existing data
- This is safe and expected if you run the migration multiple times

## Files Changed

The following files were modified/created for MongoDB integration:

### Created Files:
- ✅ `lib/mongodb.js` - MongoDB connection utility
- ✅ `models/Portfolio.js` - Mongoose schema and model
- ✅ `scripts/migrate-to-mongodb.js` - Migration script
- ✅ `MONGODB_SETUP.md` - This guide

### Modified Files:
- ✅ `app/api/portfolio/route.js` - Updated to use MongoDB
- ✅ `.env.local` - Added MONGODB_URI
- ✅ `package.json` - Added migrate-db script

### Original Files (Unchanged):
- 📋 `data/portfolio.json` - Original data (kept as backup)
- 📋 `data/portfolio.json.backup` - Created by migration script

## Benefits of MongoDB

✨ **Scalability**: Handle growing amounts of data efficiently
✨ **Performance**: Faster queries and better indexing
✨ **Reliability**: Data persistence and ACID transactions
✨ **Flexibility**: Easy to add new fields and modify structure
✨ **Security**: Better access control and encryption options
✨ **Backup**: Automatic backups with MongoDB Atlas

## Next Steps

1. ✅ Install MongoDB (local or Atlas)
2. ✅ Update `.env.local` with your MongoDB connection string
3. ✅ Run `npm run migrate-db` to migrate your data
4. ✅ Test your application with `npm run dev`
5. ✅ Verify admin panel is working correctly

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify MongoDB is running and accessible
3. Check the server console for detailed error messages
4. Ensure all environment variables are set correctly

---

**Note**: The original `portfolio.json` file is kept as a backup. You can safely keep it or remove it after confirming everything works with MongoDB.
