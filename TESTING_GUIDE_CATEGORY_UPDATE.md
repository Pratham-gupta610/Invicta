# Quick Testing Guide - Category Selection & Admin Updates

## Testing the Registration Form

### Test 1: Basic Category Selection
1. Navigate to the signup page
2. Fill in Name: "Test User"
3. Fill in Email: "test.user@iiitg.ac.in"
4. **Verify:** Category dropdown appears after email field
5. Click on category dropdown
6. **Verify:** All 10 options are visible:
   - BTech 1st Year
   - BTech 2nd Year
   - BTech 3rd Year
   - BTech 4th Year
   - MTech 1st Year
   - MTech 2nd Year
   - PhD Scholar
   - Faculty
   - Staff
   - Alumni
7. Select "BTech 2nd Year"
8. Fill in Password: "test123"
9. Submit form
10. **Expected:** Account created successfully

### Test 2: Faculty Participation Type
1. Navigate to the signup page
2. Fill in Name: "Faculty User"
3. Fill in Email: "faculty.user@iiitg.ac.in"
4. Select Category: "Faculty"
5. **Verify:** Participation Type dropdown appears with smooth animation
6. **Verify:** Info icon (ℹ️) appears next to "Participation Type" label
7. Hover over info icon
8. **Verify:** Tooltip appears with:
   - Friendly Mode description
   - Competitive Mode description
9. Click on Participation Type dropdown
10. **Verify:** Two options visible:
    - "Friendly - For exhibition matches only"
    - "Competitive - Full tournament participation"
11. Select "Competitive"
12. Fill in Password: "test123"
13. Submit form
14. **Expected:** Account created successfully

### Test 3: Faculty Validation
1. Navigate to the signup page
2. Fill in Name: "Faculty Test"
3. Fill in Email: "faculty.test@iiitg.ac.in"
4. Select Category: "Faculty"
5. **Do NOT select Participation Type**
6. Fill in Password: "test123"
7. Submit form
8. **Expected:** Error message "Please select participation type for Faculty"

### Test 4: Category Change Behavior
1. Navigate to the signup page
2. Fill in Name: "Change Test"
3. Fill in Email: "change.test@iiitg.ac.in"
4. Select Category: "Faculty"
5. **Verify:** Participation Type dropdown appears
6. Select Participation Type: "Friendly"
7. Change Category to "BTech 1st Year"
8. **Verify:** Participation Type dropdown disappears with smooth animation
9. Change Category back to "Faculty"
10. **Verify:** Participation Type dropdown appears again (but value is reset)

### Test 5: Required Field Validation
1. Navigate to the signup page
2. Fill in Name: "Validation Test"
3. Fill in Email: "validation.test@iiitg.ac.in"
4. **Do NOT select Category**
5. Fill in Password: "test123"
6. Submit form
7. **Expected:** Error message "Please fill in all required fields"

## Testing the Admin Dashboard

### Test 6: Event Creation Without Venue/Time/Date
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Create Event" button
4. **Verify:** Form does NOT show:
   - Event Date field
   - Event Time field
   - Location/Venue field
5. **Verify:** Form DOES show:
   - Sport dropdown
   - Event Title
   - Description
   - Registration Type
   - Team Size (if Team selected)
6. Fill in:
   - Sport: "Cricket"
   - Title: "Test Cricket Match"
   - Description: "Test event"
   - Registration Type: "Team"
   - Team Size: "11"
7. Submit form
8. **Expected:** Event created successfully without venue/time/date

### Test 7: Existing Events Display
1. Login as admin
2. Navigate to Admin Dashboard
3. View the events list table
4. **Verify:** Existing events still show:
   - Event Date column
   - Location column
5. **Verify:** Newly created events (from Test 6) show:
   - Empty or default values for date/location
   - All other fields populated correctly

## Testing Mobile Responsiveness

### Test 8: Mobile Category Dropdown
1. Open browser DevTools
2. Switch to mobile view (iPhone/Android)
3. Navigate to signup page
4. **Verify:** Category dropdown is full-width
5. **Verify:** Dropdown height is at least 44px (touch-friendly)
6. Tap on dropdown
7. **Verify:** Options are easily tappable
8. **Verify:** No horizontal scrolling required

### Test 9: Mobile Faculty Dropdown
1. In mobile view
2. Navigate to signup page
3. Select Category: "Faculty"
4. **Verify:** Participation Type dropdown appears below category
5. **Verify:** No layout shift or overflow
6. **Verify:** Dropdown is full-width
7. Tap info icon
8. **Verify:** Tooltip appears and is readable
9. **Verify:** Tooltip doesn't go off-screen

## Testing Accessibility

### Test 10: Keyboard Navigation
1. Navigate to signup page
2. Press Tab key repeatedly
3. **Verify:** Focus moves through fields in order:
   - Name → Email → Category → (Faculty: Participation Type) → Password
4. When focused on Category dropdown:
   - Press Enter to open
   - Use Arrow keys to navigate options
   - Press Enter to select
5. **Verify:** All interactions work with keyboard only

### Test 11: Screen Reader
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate to signup page
3. **Verify:** Screen reader announces:
   - "Select Your Year, required"
   - "Participation Type, required" (when Faculty selected)
   - Error messages when validation fails
4. **Verify:** Required field indicators are announced

## Database Verification

### Test 12: Profile Data Storage
1. After creating a test account (Test 1)
2. Check database profiles table
3. **Verify:** New profile has:
   - `user_category` = "BTech 2nd Year"
   - `participation_type` = NULL

### Test 13: Faculty Profile Data
1. After creating a faculty account (Test 2)
2. Check database profiles table
3. **Verify:** New profile has:
   - `user_category` = "Faculty"
   - `participation_type` = "Competitive"

### Test 14: Event Data Storage
1. After creating a test event (Test 6)
2. Check database events table
3. **Verify:** New event has:
   - `title` = "Test Cricket Match"
   - `event_date` = NULL or default value
   - `event_time` = NULL or default value
   - `location` = NULL or default value

## Animation Testing

### Test 15: Faculty Dropdown Animation
1. Navigate to signup page
2. Select Category: "Faculty"
3. **Verify:** Participation Type dropdown:
   - Slides down smoothly (no jank)
   - Fades in (opacity 0 → 1)
   - Takes approximately 300ms
   - No layout shift
4. Change Category to "Staff"
5. **Verify:** Participation Type dropdown:
   - Fades out smoothly
   - Disappears without layout shift

## Error Handling

### Test 16: Invalid Email
1. Navigate to signup page
2. Fill in Email: "test@gmail.com" (not @iiitg.ac.in)
3. Select Category: "BTech 1st Year"
4. Fill in other fields
5. Submit form
6. **Expected:** Error message about invalid email domain

### Test 17: Weak Password
1. Navigate to signup page
2. Fill in all fields correctly
3. Fill in Password: "123" (too short)
4. Submit form
5. **Expected:** Error message "Password must be at least 6 characters long"

## Cross-Browser Testing

### Test 18: Browser Compatibility
Test the following in each browser:
- Chrome/Edge
- Firefox
- Safari
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Verify:**
- Dropdowns work correctly
- Animations are smooth
- Tooltips display properly
- Form submission works
- No console errors

## Performance Testing

### Test 19: Form Responsiveness
1. Navigate to signup page
2. Rapidly switch between categories
3. **Verify:** No lag or delay
4. **Verify:** Animations remain smooth
5. **Verify:** No memory leaks (check DevTools)

## Summary Checklist

After completing all tests, verify:
- [ ] Category dropdown appears and works
- [ ] All 10 categories are selectable
- [ ] Faculty participation type appears conditionally
- [ ] Info tooltip displays correctly
- [ ] Form validation works for all scenarios
- [ ] Admin event creation works without venue/time/date
- [ ] Existing events still display their data
- [ ] Mobile view is fully functional
- [ ] Keyboard navigation works
- [ ] Screen reader support is adequate
- [ ] Database stores data correctly
- [ ] Animations are smooth
- [ ] Error handling is appropriate
- [ ] Cross-browser compatibility confirmed

## Quick Commands

### Check Database Schema
```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('user_category', 'participation_type');

-- Check enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'user_category'::regtype;

SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'participation_type'::regtype;
```

### Check Recent Profiles
```sql
SELECT id, email, user_category, participation_type, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

### Check Recent Events
```sql
SELECT id, title, event_date, event_time, location, created_at
FROM events
ORDER BY created_at DESC
LIMIT 10;
```

## Troubleshooting

### Issue: Dropdown not appearing
- Clear browser cache
- Check console for errors
- Verify component is in signup mode (!isLogin)

### Issue: Animation not smooth
- Check browser performance
- Disable browser extensions
- Test in incognito mode

### Issue: Database error
- Verify migration was applied
- Check Supabase logs
- Verify enum types exist

### Issue: Form submission fails
- Check network tab for API errors
- Verify all required fields are filled
- Check Supabase auth settings

## Contact & Support

For issues or questions:
1. Check console logs for errors
2. Review CATEGORY_SELECTION_UPDATE.md for detailed documentation
3. Check TODO.md for implementation status
4. Review database migration files

---

**Last Updated:** 2026-01-11
**Status:** All features implemented and tested ✅
