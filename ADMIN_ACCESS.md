# 🔐 Quick Admin Access Guide

## Current Admin Credentials

**Username**: `amangupta`  
**Password**: (Your password - if forgotten, see below)

## 🚀 Quick Actions

### Clear All Login Data
Visit: `/clear-auth` page in your browser

Or run in browser console (F12):
```javascript
localStorage.clear(); sessionStorage.clear(); window.location.reload();
```

### Login to Admin Panel
1. Go to `/login`
2. Enter username: `amangupta`
3. Enter your password
4. After login, go to `/admin`

## 🆘 Forgot Password?

### Option 1: Create New Admin Account
1. Sign up with new username (e.g., `admin`)
2. Run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE username = 'admin';
```

### Option 2: Reset via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Find user: `amangupta@miaoda.com`
3. Click "Reset password"

## 📚 Full Documentation

See `AUTH_RESET_GUIDE.md` for complete instructions.

---

**Quick Links:**
- Clear Auth: `/clear-auth`
- Login: `/login`
- Admin Panel: `/admin`
- User Dashboard: `/dashboard`
