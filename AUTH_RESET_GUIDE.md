# Authentication Reset Guide

## 🔐 Current Admin Credentials

Based on the database, here is the existing admin account:

**Admin Account:**
- **Username**: `amangupta`
- **Email**: `amangupta@miaoda.com`
- **Role**: Admin
- **Created**: 2026-01-11

**Note**: If you've forgotten the password, see the "Reset Admin Password" section below.

## 🧹 How to Clear All Login Information

### Method 1: Use the Clear Auth Page (Recommended)

1. **Visit the Clear Auth page**:
   ```
   https://your-app-url.com/clear-auth
   ```
   Or locally:
   ```
   http://localhost:5173/clear-auth
   ```

2. **Click "Clear All Auth Data"** button

3. **Wait for confirmation** - You'll be automatically redirected to the home page

4. **Try logging in again** with your credentials

### Method 2: Manual Browser Clear

If the Clear Auth page doesn't work:

1. **Open Browser Developer Tools**:
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

2. **Go to Console tab**

3. **Run these commands one by one**:
   ```javascript
   // Clear localStorage
   localStorage.clear();
   
   // Clear sessionStorage
   sessionStorage.clear();
   
   // Clear cookies
   document.cookie.split(";").forEach((c) => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   
   // Reload page
   window.location.reload();
   ```

4. **Refresh the page** (F5 or Ctrl+R)

### Method 3: Browser Settings

1. **Chrome/Edge**:
   - Go to Settings → Privacy and security → Clear browsing data
   - Select "Cookies and other site data" and "Cached images and files"
   - Choose "All time" for time range
   - Click "Clear data"

2. **Firefox**:
   - Go to Settings → Privacy & Security → Cookies and Site Data
   - Click "Clear Data"
   - Select both checkboxes
   - Click "Clear"

3. **Safari**:
   - Go to Safari → Preferences → Privacy
   - Click "Manage Website Data"
   - Click "Remove All"

## 🔑 Reset Admin Password

If you've forgotten the admin password, you can reset it using the database:

### Option 1: Create a New Admin Account

Run this SQL in Supabase SQL Editor:

```sql
-- This will be done through Supabase Auth, but you can create a profile first
-- Then sign up through the app with these credentials

-- Example: Create a new admin user
-- 1. Go to your app and sign up with:
--    Username: admin
--    Password: Admin@123456 (or your preferred password)

-- 2. Then update the role to admin:
UPDATE profiles 
SET role = 'admin'
WHERE username = 'admin';
```

### Option 2: Reset Existing Admin Password via Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Users" tab

3. **Find the admin user**:
   - Look for email: `amangupta@miaoda.com`
   - Click on the user

4. **Reset Password**:
   - Click "Send password recovery email" OR
   - Click "Reset password" to set a new password directly

### Option 3: Use Supabase SQL to Reset Password

**Warning**: This requires access to Supabase dashboard and understanding of password hashing.

```sql
-- Get the user ID first
SELECT id, email 
FROM auth.users 
WHERE email = 'amangupta@miaoda.com';

-- You'll need to use Supabase Auth API to reset password
-- This cannot be done directly via SQL for security reasons
```

## 📝 Create a New Admin Account (Recommended)

If you want to start fresh with a new admin account:

### Step 1: Sign Up

1. Go to the login page: `/login`
2. Click "Sign Up" (if available) or use the sign-up form
3. Enter:
   - **Username**: `admin` (or any username you prefer)
   - **Password**: Choose a strong password (min 6 characters)

### Step 2: Promote to Admin

After signing up, run this SQL in Supabase:

```sql
-- Update the newly created user to admin role
UPDATE profiles 
SET role = 'admin'
WHERE username = 'admin';  -- Replace with your chosen username

-- Verify the change
SELECT id, username, email, role 
FROM profiles 
WHERE username = 'admin';
```

### Step 3: Verify Admin Access

1. Log out if logged in
2. Log in with your new admin credentials
3. Navigate to `/admin`
4. You should see the Admin Dashboard

## 🔍 Verify Current Users

To see all users in the system, run this SQL:

```sql
SELECT 
  p.id,
  p.username,
  p.email,
  p.role,
  p.created_at
FROM profiles p
ORDER BY p.created_at DESC;
```

## 🗑️ Delete Old Admin Account (Optional)

If you want to remove the old admin account:

```sql
-- First, get the user ID
SELECT id, username, email, role 
FROM profiles 
WHERE username = 'amangupta';

-- Delete from profiles (this will cascade to auth.users if configured)
DELETE FROM profiles 
WHERE username = 'amangupta';

-- If needed, also delete from auth.users
-- (Replace 'user-id-here' with actual ID from first query)
DELETE FROM auth.users 
WHERE id = 'da4483ad-648c-40f0-b9ee-3d0b91b1eb37';
```

## 🚀 Quick Start After Reset

1. **Clear all auth data** using Method 1 above
2. **Go to login page**: `/login`
3. **Try existing admin credentials**:
   - Username: `amangupta`
   - Password: (your password)
4. **If password forgotten**:
   - Create new admin account (see "Create a New Admin Account" section)
   - Or reset password via Supabase Dashboard

## 🛠️ Troubleshooting

### Issue: "Invalid credentials" error

**Solution**:
1. Clear all auth data using the Clear Auth page
2. Make sure you're using the correct username (not email)
3. The system converts username to email format: `username@miaoda.com`
4. Try resetting password via Supabase Dashboard

### Issue: "User not found" error

**Solution**:
1. Verify user exists in database:
   ```sql
   SELECT * FROM profiles WHERE username = 'your-username';
   ```
2. If not found, create a new account

### Issue: Logged in but can't access admin panel

**Solution**:
1. Check your role:
   ```sql
   SELECT username, role FROM profiles WHERE username = 'your-username';
   ```
2. If role is 'user', update to 'admin':
   ```sql
   UPDATE profiles SET role = 'admin' WHERE username = 'your-username';
   ```
3. Log out and log in again

### Issue: Clear Auth page not working

**Solution**:
1. Use Method 2 (Manual Browser Clear) from above
2. Or clear browser data completely from browser settings
3. Try in incognito/private browsing mode

## 📊 Current Database Users

As of the last check, these users exist:

| Username | Email | Role | Created |
|----------|-------|------|---------|
| amangupta | amangupta@miaoda.com | admin | 2026-01-11 |
| pratham666 | pratham666@miaoda.com | user | 2026-01-11 |
| vedi | vedi@miaoda.com | user | 2026-01-11 |
| gaurang | gaurang@miaoda.com | user | 2026-01-11 |
| ahan | ahan@miaoda.com | user | 2026-01-11 |
| pratham | pratham@miaoda.com | user | 2026-01-13 |

## 🔐 Security Best Practices

1. **Use strong passwords**: Minimum 8 characters with mix of letters, numbers, and symbols
2. **Don't share admin credentials**: Create separate admin accounts if needed
3. **Regular password changes**: Change admin password every 90 days
4. **Monitor admin access**: Check admin dashboard access logs regularly
5. **Backup admin account**: Always have at least 2 admin accounts

## 📞 Need More Help?

If you're still having issues:

1. Check browser console for errors (F12 → Console tab)
2. Check Supabase logs for authentication errors
3. Verify Supabase project is running and accessible
4. Try creating a completely new admin account
5. Contact technical support with error details

---

**Last Updated**: 2026-01-12
**Version**: 2.3.3
**Status**: ✅ Authentication System Operational
