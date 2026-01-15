# Admin Event Creation - Quick Reference

## ✅ What Was Fixed

The "Failed to create event" error has been resolved. You can now create events without any issues.

## 📝 How to Create an Event

### Step 1: Open Create Event Dialog
1. Log in as admin
2. Go to Admin Dashboard
3. Click the "Create Event" button (+ icon)

### Step 2: Fill in Event Details

#### Required Fields (All Events)
- **Sport**: Select from dropdown (Cricket, Football, Basketball, etc.)
- **Event Title**: Name of your event (e.g., "U19 Tennis Championship")
- **Description**: Brief description of the event
- **Event Date**: Date of the event (format: DD/MM/YYYY)
- **Event Time**: Time of the event (format: HH:MM)
- **Location**: Venue (e.g., "SAC", "Cricket Ground")
- **Registration Type**: Individual or Team

#### Additional Field for Team Events
- **Team Size (Max Members)**: Required for team events
  - Example: 11 for cricket, 9 for football, 5 for basketball
  - This is the maximum number of members allowed per team (including captain)

### Step 3: Submit
1. Click "Create Event" button
2. Wait for success message
3. Event will appear in the events list

## 🎯 Important Notes

### Unlimited Participation
- **No slot limits**: Everyone can register without capacity restrictions
- You don't need to set maximum participants
- The system handles unlimited registrations automatically

### Team Size Limits
- **For team events only**: Set the maximum team size
- **Enforced strictly**: Team captains cannot add more members than allowed
- **Includes captain**: If you set team size to 11, that's 1 captain + 10 members

### Registration Types

#### Individual Events
- Users register individually
- No team formation required
- Examples: Table Tennis, Badminton Singles, Chess

#### Team Events
- Users register as team captain
- Captain can add members manually or via QR code
- Team size limit enforced
- Examples: Cricket (11), Football 9v9 (9), Basketball (5)

## ⚠️ Common Mistakes to Avoid

### ❌ Mistake 1: Missing Team Size for Team Events
**Error**: "Missing Team Size"
**Solution**: Always specify team size when creating team events

### ❌ Mistake 2: Empty Required Fields
**Error**: "Missing Information"
**Solution**: Fill in all required fields before submitting

### ❌ Mistake 3: Invalid Date/Time Format
**Error**: Form validation error
**Solution**: Use the date/time pickers provided

## 📊 Examples

### Example 1: Individual Event
```
Sport: Table Tennis
Event Title: U19 Table Tennis Championship
Description: Annual table tennis tournament for under-19 students
Event Date: 22/01/2026
Event Time: 14:00
Location: SAC Indoor Stadium
Registration Type: Individual
```

### Example 2: Team Event
```
Sport: Cricket
Event Title: Inter-College Cricket Tournament
Description: Team cricket competition between colleges
Event Date: 25/01/2026
Event Time: 09:00
Location: Main Cricket Ground
Registration Type: Team
Team Size: 11
```

### Example 3: Team Event (Football)
```
Sport: Football (9 vs 9)
Event Title: Football 9v9 Championship
Description: Fast-paced 9-a-side football tournament
Event Date: 28/01/2026
Event Time: 16:00
Location: Football Field
Registration Type: Team
Team Size: 9
```

## 🔍 Verification

After creating an event, verify:
1. ✅ Event appears in "All Events" table
2. ✅ Event details are correct
3. ✅ Registration type is correct
4. ✅ Team size is displayed (for team events)
5. ✅ Status is "upcoming"

## 🛠️ Troubleshooting

### Issue: Event not appearing in list
**Solution**: Refresh the page or check the "All Events" tab

### Issue: Cannot edit event after creation
**Solution**: Use the "Edit" button in the events table (coming soon)

### Issue: Users cannot register
**Solution**: Check event status is "upcoming" and not "closed"

### Issue: Team size not enforced
**Solution**: Verify team size was set correctly when creating the event

## 📱 User Registration Flow

After you create an event:

1. **Users see the event** on the sport-specific page
2. **Users click "REGISTER HERE"** button
3. **For individual events**: Users fill in their details and submit
4. **For team events**: 
   - Captain fills in team name and details
   - Captain can add members manually
   - Captain gets a QR code to share with team members
   - Members scan QR code to join the team
5. **System validates**: 
   - No duplicate registrations
   - Team size limits (for team events)
   - All required fields filled
6. **Users receive**: Digital ticket with QR code for event entry

## 🎉 Success Indicators

When event creation is successful, you'll see:
- ✅ Green success toast: "Event created successfully"
- ✅ Dialog closes automatically
- ✅ Event appears in the events table
- ✅ Event is immediately available for registration

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages (F12 → Console tab)
2. Verify all required fields are filled
3. Ensure you're logged in as admin
4. Try refreshing the page
5. Contact technical support with error details

---

**Last Updated**: 2026-01-12
**Version**: 2.3.2
**Status**: ✅ All Systems Operational
