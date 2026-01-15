# Deleted User Auto-Redirect System

## Overview
This system ensures that when an admin deletes a user account, that user is automatically redirected to the login/signup page, regardless of whether they are actively using the application or not.

## How It Works

### 1. Database-Level Deletion
When an admin deletes a user through the admin dashboard:
- The `delete_user_cascade` RPC function is called
- This function deletes:
  - Documents associated with user's registrations
  - Team memberships
  - User registrations
  - User profile from `profiles` table
  - User authentication record from `auth.users` table

### 2. Multi-Layer Detection System

#### Layer 1: Periodic Profile Checks (Active Users)
**Location**: `src/contexts/AuthContext.tsx`

- Every 10 seconds, the system checks if the logged-in user's profile still exists
- If the profile is missing, it triggers the account deletion handler
- This catches deletions for users actively using the app

```typescript
// Runs every 10 seconds for logged-in users
setInterval(async () => {
  const exists = await checkProfileExists(user.id);
  if (!exists) {
    await handleAccountDeleted();
  }
}, 10000);
```

#### Layer 2: Auth State Change Listener
**Location**: `src/contexts/AuthContext.tsx`

- Monitors Supabase authentication state changes
- Detects when a user's session becomes invalid
- Checks profile existence on token refresh and sign-in events
- Handles cases where auth.users record is deleted

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
    // Check if profile exists
    if (!profileData) {
      handleAccountDeleted();
    }
  }
});
```

#### Layer 3: Profile Refresh Checks
**Location**: `src/contexts/AuthContext.tsx`

- When `refreshProfile()` is called, it verifies profile existence
- If profile is missing, triggers deletion handler
- Catches deletions during normal app operations

#### Layer 4: API Error Handler (Fallback)
**Location**: `src/lib/errorHandler.ts`

- Global error handler for API calls
- Detects errors related to missing profiles or invalid sessions
- Can be wrapped around API calls for additional protection
- Redirects to login if profile doesn't exist

### 3. Account Deletion Handler

When a deleted account is detected, the system:

1. **Clears User State**
   - Removes user and profile from React state
   - Signs out from Supabase authentication

2. **Clears Local Storage**
   - Removes remembered username
   - Clears any cached user data

3. **Sets Session Flag**
   - Stores `account_deleted` flag in sessionStorage
   - Used to show appropriate message on login page

4. **Redirects to Login**
   - Navigates to `/login?deleted=true`
   - URL parameter triggers notification display

### 4. User Notification

**Location**: `src/pages/Login.tsx`

When user arrives at login page with `?deleted=true`:
- Displays toast notification explaining account deletion
- Automatically switches to signup mode
- Cleans up URL to remove the parameter

```typescript
useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('deleted') === 'true') {
    toast({
      title: 'Account Deleted',
      description: 'Your account has been deleted by an administrator...',
      variant: 'destructive',
    });
    setIsLogin(false); // Switch to signup mode
  }
}, [location.search]);
```

## Testing Scenarios

### Scenario 1: Active User
1. User A is logged in and browsing the application
2. Admin deletes User A's account
3. Within 10 seconds, User A is automatically redirected to login
4. User A sees notification about account deletion
5. User A is in signup mode to create a new account

### Scenario 2: Inactive User (Same Tab)
1. User B is logged in but idle on a page
2. Admin deletes User B's account
3. Within 10 seconds, User B is automatically redirected
4. When User B returns, they see the deletion notification

### Scenario 3: User Returns After Deletion
1. User C is logged in and closes the browser
2. Admin deletes User C's account
3. User C returns and opens the application
4. On page load, profile check fails
5. User C is immediately redirected to login with notification

### Scenario 4: User Tries to Perform Action
1. User D is logged in
2. Admin deletes User D's account
3. User D tries to register for an event or perform any action
4. API call fails due to missing profile
5. Error handler detects the issue and redirects

## Key Features

✅ **Real-time Detection**: 10-second polling interval catches deletions quickly
✅ **Multiple Safeguards**: 4 layers of detection ensure no edge cases are missed
✅ **Clean Redirect**: Automatic sign-out and state cleanup
✅ **User-Friendly**: Clear notification explaining what happened
✅ **Seamless Signup**: Automatically switches to signup mode
✅ **No Manual Intervention**: Fully automated process

## Performance Considerations

- **Polling Interval**: 10 seconds is aggressive enough to catch deletions quickly without excessive API calls
- **Lightweight Checks**: Only queries the profile ID, not full profile data
- **Cleanup**: Intervals are properly cleared when user signs out
- **No Memory Leaks**: Uses refs to manage intervals safely

## Security

- User cannot bypass the redirect
- All local data is cleared
- Session is properly terminated
- No cached credentials remain

## Future Enhancements

Possible improvements:
1. WebSocket-based real-time notifications (if Supabase Realtime is enabled)
2. Configurable polling interval
3. Admin notification when user is forcefully logged out
4. Audit log of forced logouts
