# Admin Password Management Guide

## Overview
You can now change your admin dashboard password directly through the admin panel interface. This guide will walk you through the process.

## How to Change Your Password

### Step 1: Access the Dashboard
1. Navigate to `http://localhost:3000/admin/login`
2. Log in with your current credentials

### Step 2: Open Settings
1. Once logged in, look at the left sidebar
2. Click on the **⚙️ Settings** tab (it's the last option in the navigation)

### Step 3: Change Password
1. Fill in the form with the following information:
   - **Current Password**: Your existing password
   - **New Password**: Your desired new password
   - **Confirm New Password**: Re-enter the new password

2. Password Requirements:
   - Minimum 6 characters
   - Should include uppercase and lowercase letters (recommended)
   - Should include at least one number (recommended)
   - Can include special characters for extra security (recommended)

3. The password strength meter will show you how strong your password is:
   - 🔴 **Weak**: Not recommended
   - 🟡 **Fair**: Acceptable
   - 🔵 **Good**: Good choice
   - 🟢 **Strong**: Great!
   - 💚 **Very Strong**: Excellent!

4. Click **Change Password** button

### Step 4: Confirmation
- You'll see a success message if the password was changed
- After 2 seconds, you'll be prompted to logout
- Click **OK** to logout and login again with your new password

## Security Features

✅ **Password Visibility Toggle**: Click the eye icon to show/hide passwords

✅ **Real-time Validation**: The form validates your input as you type

✅ **Password Strength Indicator**: Visual feedback on password strength

✅ **Match Confirmation**: Checks if new password and confirmation match

✅ **Secure Hashing**: Passwords are hashed with bcrypt before storage

## Troubleshooting

### "Current password is incorrect"
- Double-check your current password
- Make sure Caps Lock is off
- Try toggling password visibility to verify

### "New passwords do not match"
- Ensure both new password fields are identical
- Check for extra spaces or typos

### "New password must be at least 6 characters"
- Choose a longer password
- Consider using a passphrase (e.g., "MyP0rtf0l!o2026")

### Session Issues
- If you're logged out unexpectedly, just login again
- Clear browser cache if you experience persistent issues

## Best Practices

1. **Use a Strong Password**: 
   - Mix of uppercase, lowercase, numbers, and symbols
   - Avoid common words or patterns
   - Don't use personal information

2. **Change Regularly**: 
   - Update your password every 3-6 months

3. **Keep It Safe**:
   - Don't share your admin credentials
   - Use a password manager to remember complex passwords
   - Don't use the same password on multiple sites

4. **Always Logout**:
   - Click the **Logout** button when you're done
   - Especially important on shared computers

## Technical Details

### API Endpoint
- **URL**: `/api/admin/change-password`
- **Method**: POST
- **Authentication**: Bearer token (from localStorage)

### Password Hashing
- Uses bcrypt with salt rounds: 10
- Passwords are never stored in plain text
- Current password is verified before allowing change

### Data Storage
- Admin credentials stored in: `data/admin.json`
- File is git-ignored for security
- Automatic backup recommended

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages (F12)
2. Verify the development server is running
3. Ensure `data/admin.json` file exists and has proper permissions
4. Check that bcryptjs is installed: `npm list bcryptjs`

## Default Setup

If you need to reset to default credentials (use with caution):

1. Stop the development server
2. Navigate to `data/admin.json`
3. You can create a new password hash using this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'your-new-password';
const hash = bcrypt.hashSync(newPassword, 10);
console.log(hash);
```

4. Update the `password` field in `admin.json` with the new hash
5. Restart the development server

---

**Last Updated**: January 2026
**Next.js Version**: 16.1.1
