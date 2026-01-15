# Quick Testing Guide
## Duplicate Registration Prevention & New Sports

---

## 🧪 Test Scenarios

### ✅ Test 1: View New Sports
**Steps:**
1. Navigate to homepage
2. Scroll through sport cards

**Expected:**
- See 11 sports total (8 existing + 3 new)
- Dodgeball with Target icon 🎯
- Kabaddi with Users icon 👥
- Carrom with Square icon ⬜

---

### ✅ Test 2: First Registration (Success)
**Steps:**
1. Log in as a user
2. Click any sport card (e.g., Cricket)
3. Click "REGISTER HERE" button
4. Fill out registration form
5. Submit

**Expected:**
- ✅ Registration succeeds
- ✅ Redirect to dashboard
- ✅ Success toast notification
- ✅ Registration appears in dashboard

---

### ✅ Test 3: Duplicate Prevention (Same Tab)
**Steps:**
1. Complete Test 2 (register for Cricket)
2. Navigate back to Cricket sport page

**Expected:**
- ✅ Button shows "ALREADY REGISTERED"
- ✅ Button is disabled (gray)
- ✅ CheckCircle icon displayed
- ✅ Success message: "✓ You have successfully registered for this event"
- ✅ Cannot click button

---

### ✅ Test 4: Duplicate Prevention (Multiple Tabs)
**Steps:**
1. Open Cricket sport page in Tab 1
2. Open Cricket sport page in Tab 2
3. In Tab 1: Click "REGISTER HERE" and complete registration
4. In Tab 2: Try to click "REGISTER HERE"

**Expected:**
- ✅ Tab 1: Registration succeeds
- ✅ Tab 2: Button may still show "REGISTER HERE" initially
- ✅ Tab 2: On click, navigate to registration page
- ✅ Tab 2: Registration page detects duplicate
- ✅ Tab 2: Shows error toast: "Already Registered"
- ✅ Tab 2: Redirects to dashboard
- ✅ Only ONE registration in database

---

### ✅ Test 5: Direct Registration Page Access
**Steps:**
1. Register for an event (e.g., Cricket)
2. Copy the registration page URL
3. Log out and log back in
4. Paste the registration URL directly in browser

**Expected:**
- ✅ Page loads
- ✅ Detects existing registration
- ✅ Shows error toast: "Already Registered"
- ✅ Redirects to dashboard
- ✅ No form displayed

---

### ✅ Test 6: Race Condition Simulation
**Steps:**
1. Open registration page
2. Fill out form
3. Open browser DevTools → Network tab
4. Set network throttling to "Slow 3G"
5. Click Submit
6. Immediately click Submit again (before first completes)

**Expected:**
- ✅ First submission processes
- ✅ Second submission blocked
- ✅ Error message shown
- ✅ Only ONE registration created
- ✅ Duplicate attempt logged in database

---

### ✅ Test 7: Different Events (Should Allow)
**Steps:**
1. Register for Cricket event
2. Navigate to Football sport page
3. Click "REGISTER HERE"

**Expected:**
- ✅ Button is active (not disabled)
- ✅ Can register for Football
- ✅ User can have multiple registrations (different events)
- ✅ No error message

---

### ✅ Test 8: Logout and Login
**Steps:**
1. Register for an event
2. Log out
3. Log in again
4. Navigate to same sport page

**Expected:**
- ✅ Button shows "ALREADY REGISTERED"
- ✅ Registration status persists
- ✅ Cannot register again

---

## 🔍 Database Verification

### Check for Duplicates
```sql
-- Should return 0 rows
SELECT user_id, event_id, COUNT(*) as count
FROM registrations
GROUP BY user_id, event_id
HAVING COUNT(*) > 1;
```

### View Blocked Attempts
```sql
-- See all blocked duplicate attempts
SELECT 
  p.username,
  e.name as event_name,
  dra.attempted_at,
  dra.user_agent
FROM duplicate_registration_attempts dra
JOIN profiles p ON dra.user_id = p.id
JOIN events e ON dra.event_id = e.id
ORDER BY dra.attempted_at DESC
LIMIT 10;
```

### Verify New Sports
```sql
-- Should show 11 sports including new ones
SELECT name, slug FROM sports ORDER BY name;
```

### Check Unique Constraint
```sql
-- Should show the constraint
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'registrations'::regclass 
AND conname = 'unique_user_event_registration';
```

---

## 🎯 Expected Behavior Summary

### Button States

| Scenario | Button Text | Button Color | Icon | Clickable |
|----------|-------------|--------------|------|-----------|
| Not registered | REGISTER HERE | Primary (blue) | 🏆 Trophy | ✅ Yes |
| Already registered | ALREADY REGISTERED | Muted (gray) | ✓ CheckCircle | ❌ No |
| Checking status | CHECKING... | Primary (blue) | 🏆 Trophy | ❌ No |
| No active event | REGISTER HERE | Muted (gray) | 🏆 Trophy | ❌ No |

### Error Messages

| Scenario | Message | Type | Action |
|----------|---------|------|--------|
| Duplicate on sport page | "You have already registered for this event." | Toast (red) | None |
| Duplicate on registration page | "Already Registered" | Toast (red) | Redirect to dashboard |
| Form submission duplicate | "Registration Failed" | Toast (red) | Stay on page |

---

## ✅ Success Criteria

All tests should pass with:
- ✅ Zero duplicate registrations in database
- ✅ Clear UI feedback for all states
- ✅ Proper error messages
- ✅ Logging of blocked attempts
- ✅ No console errors
- ✅ Smooth user experience

---

## 🐛 Troubleshooting

### Issue: Button doesn't show "ALREADY REGISTERED"
**Solution:** Refresh the page. The check runs on page load.

### Issue: Can still click "REGISTER HERE" after registering
**Solution:** Clear browser cache and refresh.

### Issue: Error "unique constraint violation"
**Solution:** This is expected! The system is working correctly. The error is caught and shown as a user-friendly message.

### Issue: Multiple registrations in database
**Solution:** This should NOT happen. If it does:
1. Check if unique constraint exists
2. Check database migration logs
3. Verify constraint is active

---

## 📊 Monitoring

### Daily Checks
```sql
-- Count duplicate attempts today
SELECT COUNT(*) as blocked_attempts_today
FROM duplicate_registration_attempts
WHERE attempted_at >= CURRENT_DATE;
```

### Weekly Report
```sql
-- Top users with blocked attempts
SELECT 
  p.username,
  COUNT(*) as blocked_attempts,
  MAX(dra.attempted_at) as last_attempt
FROM duplicate_registration_attempts dra
JOIN profiles p ON dra.user_id = p.id
WHERE dra.attempted_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.username
ORDER BY blocked_attempts DESC
LIMIT 10;
```

---

**Ready for Production Testing! 🚀**
