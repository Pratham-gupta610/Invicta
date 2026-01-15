# Testing Checklist
## MULTI-SPORT EVENT REGISTRATION PLATFORM - Version 2.0

---

## 🧪 Complete Testing Guide

Use this checklist to verify all upgrade features are working correctly.

---

## ✅ CHANGE 1: Sport Page Behavior

### Test 1.1: Sport Page Display
- [ ] Navigate to homepage
- [ ] Click on any sport card (e.g., Cricket)
- [ ] Verify page shows:
  - [ ] Large trophy icon with neon border
  - [ ] Sport name in large font (5xl/6xl)
  - [ ] Rules & Guidelines section
  - [ ] Large "REGISTER HERE" button
- [ ] Verify NO event list is displayed
- [ ] Verify NO filter controls are displayed

### Test 1.2: Button Appearance
- [ ] Verify button has:
  - [ ] Trophy icon
  - [ ] Text "REGISTER HERE"
  - [ ] Large size (visually prominent)
  - [ ] High contrast colors
  - [ ] Neon border effect
- [ ] Hover over button
  - [ ] Verify shadow effect increases
  - [ ] Verify smooth transition

### Test 1.3: Slot Information
- [ ] Verify text below button shows:
  - [ ] Available slots count
  - [ ] Registration type (Individual/Team)

### Test 1.4: Authentication Check
- [ ] Log out if logged in
- [ ] Navigate to any sport page
- [ ] Click "REGISTER HERE" button
- [ ] Verify toast notification:
  - [ ] Title: "Login Required"
  - [ ] Description: "Please log in to register for events"
- [ ] Verify redirect to login page

### Test 1.5: No Active Event
- [ ] (Admin) Delete all events for a sport
- [ ] Navigate to that sport page
- [ ] Verify button is disabled
- [ ] Verify message: "No active events available for this sport at the moment"

### Test 1.6: Successful Navigation
- [ ] Log in as a user
- [ ] Navigate to any sport page
- [ ] Click "REGISTER HERE" button
- [ ] Verify redirect to registration form
- [ ] Verify URL contains event ID

---

## ✅ CHANGE 2: Team Name Field - Universal Requirement

### Test 2.1: Individual Registration - Field Display
- [ ] Navigate to an individual registration event
- [ ] Verify team name field is displayed
- [ ] Verify label: "Team Name *"
- [ ] Verify helper text: "(Your individual identifier or group name)"
- [ ] Verify placeholder: "e.g., Solo Warrior, Team Phoenix"

### Test 2.2: Team Registration - Field Display
- [ ] Navigate to a team registration event
- [ ] Verify team name field is displayed
- [ ] Verify label: "Team Name *"
- [ ] Verify helper text: "(Your official team name)"
- [ ] Verify placeholder: "Enter your team name"

### Test 2.3: Validation - Empty Field
- [ ] Leave team name field empty
- [ ] Try to submit form
- [ ] Verify HTML5 validation prevents submission
- [ ] Verify browser shows "Please fill out this field" message

### Test 2.4: Validation - Less Than 3 Characters
- [ ] Enter "ab" in team name field
- [ ] Verify red border appears on input
- [ ] Verify inline error message: "Team name must be at least 3 characters"
- [ ] Try to submit form
- [ ] Verify toast notification:
  - [ ] Title: "Missing Information"
  - [ ] Description: "Please enter a team name (minimum 3 characters)"

### Test 2.5: Validation - Exactly 3 Characters
- [ ] Enter "abc" in team name field
- [ ] Verify red border disappears
- [ ] Verify inline error message disappears
- [ ] Verify submit button is enabled

### Test 2.6: Validation - Valid Team Name
- [ ] Enter "Warriors" in team name field
- [ ] Verify no error messages
- [ ] Verify normal border color
- [ ] Fill rest of form
- [ ] Submit form
- [ ] Verify successful registration

---

## ✅ CHANGE 3: Backend Validation - Uniqueness

### Test 3.1: First Registration
- [ ] Log in as User A
- [ ] Register for an event with team name "Phoenix"
- [ ] Verify successful registration
- [ ] Verify redirect to dashboard

### Test 3.2: Duplicate Team Name - Same Event
- [ ] Log in as User B (different user)
- [ ] Try to register for SAME event with team name "Phoenix"
- [ ] Submit form
- [ ] Verify toast notification:
  - [ ] Title: "Registration Failed"
  - [ ] Description: "This team name is already taken for this event. Please choose a different name."
- [ ] Verify registration is NOT created

### Test 3.3: Same Team Name - Different Event
- [ ] Log in as User B
- [ ] Register for DIFFERENT event with team name "Phoenix"
- [ ] Verify successful registration
- [ ] Verify team name "Phoenix" is allowed for different event

### Test 3.4: Case Sensitivity
- [ ] Log in as User C
- [ ] Try to register with team name "phoenix" (lowercase)
- [ ] Verify if system treats it as different from "Phoenix"
- [ ] (Expected: Should be allowed as different)

---

## ✅ CHANGE 4: Admin Dashboard Updates

### Test 4.1: Search by Team Name
- [ ] Log in as admin
- [ ] Navigate to Admin Dashboard
- [ ] Go to "Registration Management" tab
- [ ] Enter a team name in search box
- [ ] Verify results show registrations with that team name

### Test 4.2: Search Placeholder
- [ ] Verify search box placeholder text:
  - [ ] "Search by email, username, or team name..."

### Test 4.3: Team Name Column Display
- [ ] Verify registration table shows team name column
- [ ] Verify team names are displayed for all registrations
- [ ] Verify old registrations show empty/null for team name

### Test 4.4: Search by Email (Still Works)
- [ ] Enter an email in search box
- [ ] Verify results show registrations with that email

### Test 4.5: Search by Username (Still Works)
- [ ] Enter a username in search box
- [ ] Verify results show registrations with that username

### Test 4.6: Combined Search
- [ ] Enter partial text that matches team name, email, or username
- [ ] Verify all matching results are displayed

---

## ✅ CHANGE 5: Export Functionality

### Test 5.1: CSV Export - All Sports
- [ ] Log in as admin
- [ ] Navigate to Registration Management
- [ ] Click "Export CSV" button
- [ ] Verify CSV file downloads
- [ ] Open CSV file
- [ ] Verify columns include:
  - [ ] User ID
  - [ ] Username
  - [ ] Email
  - [ ] Phone
  - [ ] Sport
  - [ ] Event
  - [ ] Team (Team Name column)
  - [ ] Registration Type
  - [ ] Status
  - [ ] Registration Date

### Test 5.2: CSV Export - Filtered by Sport
- [ ] Select a sport from filter dropdown
- [ ] Click "Export CSV" button
- [ ] Verify CSV contains only that sport's registrations
- [ ] Verify team name column is included

### Test 5.3: Team Name Data in Export
- [ ] Verify team names are correctly displayed in export
- [ ] Verify old registrations show empty for team name
- [ ] Verify new registrations show team name

---

## ✅ UI/UX Requirements

### Test 6.1: Button Prominence
- [ ] Verify "REGISTER HERE" button is:
  - [ ] Large (visually dominant)
  - [ ] High contrast (easily readable)
  - [ ] Clearly visible (stands out from background)

### Test 6.2: Smooth Transitions
- [ ] Navigate from sport page to registration form
- [ ] Verify smooth page transition (no jarring jumps)
- [ ] Verify loading states are shown if needed

### Test 6.3: Form Validation - Inline Errors
- [ ] Enter invalid data in team name field
- [ ] Verify error message appears immediately (inline)
- [ ] Verify error message disappears when corrected

### Test 6.4: Form Submission Prevention
- [ ] Try to submit form with invalid team name
- [ ] Verify form does NOT submit
- [ ] Verify user is notified of error

---

## ✅ Backward Compatibility

### Test 7.1: Existing Registrations
- [ ] Log in as admin
- [ ] View registrations created before upgrade
- [ ] Verify they display correctly
- [ ] Verify team name shows as empty/null (not error)

### Test 7.2: Old Data in Dashboard
- [ ] Verify old registrations appear in admin dashboard
- [ ] Verify search still works for old registrations
- [ ] Verify export includes old registrations

### Test 7.3: New Registrations
- [ ] Create new registration with team name
- [ ] Verify it appears in dashboard
- [ ] Verify team name is searchable
- [ ] Verify team name appears in export

---

## ✅ Mobile Responsiveness

### Test 8.1: Sport Page - Mobile
- [ ] Open sport page on mobile device (or resize browser)
- [ ] Verify layout is responsive
- [ ] Verify "REGISTER HERE" button is:
  - [ ] Full width or appropriately sized
  - [ ] Easy to tap (large touch target)
  - [ ] Clearly visible

### Test 8.2: Registration Form - Mobile
- [ ] Open registration form on mobile
- [ ] Verify team name field is:
  - [ ] Full width
  - [ ] Easy to type in
  - [ ] Error messages are readable

### Test 8.3: Admin Dashboard - Mobile
- [ ] Open admin dashboard on mobile
- [ ] Verify search box is usable
- [ ] Verify table scrolls horizontally if needed
- [ ] Verify team name column is visible

---

## ✅ Performance

### Test 9.1: Page Load Speed
- [ ] Navigate to sport page
- [ ] Verify page loads quickly (< 1 second)
- [ ] Verify no noticeable lag

### Test 9.2: Form Validation Speed
- [ ] Type in team name field
- [ ] Verify validation feedback is instant
- [ ] Verify no lag in error message display

### Test 9.3: Backend Validation Speed
- [ ] Submit form with duplicate team name
- [ ] Verify error response is quick (< 2 seconds)

---

## ✅ Error Handling

### Test 10.1: Network Error
- [ ] Disconnect internet
- [ ] Try to submit registration
- [ ] Verify user-friendly error message
- [ ] Reconnect internet
- [ ] Verify form can be resubmitted

### Test 10.2: Database Error
- [ ] (Admin) Simulate database error
- [ ] Try to submit registration
- [ ] Verify graceful error handling
- [ ] Verify user is notified

---

## 📊 Test Results Summary

### Sport Page Behavior
- [ ] All tests passed (Test 1.1 - 1.6)

### Team Name Field
- [ ] All tests passed (Test 2.1 - 2.6)

### Backend Validation
- [ ] All tests passed (Test 3.1 - 3.4)

### Admin Dashboard
- [ ] All tests passed (Test 4.1 - 4.6)

### Export Functionality
- [ ] All tests passed (Test 5.1 - 5.3)

### UI/UX Requirements
- [ ] All tests passed (Test 6.1 - 6.4)

### Backward Compatibility
- [ ] All tests passed (Test 7.1 - 7.3)

### Mobile Responsiveness
- [ ] All tests passed (Test 8.1 - 8.3)

### Performance
- [ ] All tests passed (Test 9.1 - 9.3)

### Error Handling
- [ ] All tests passed (Test 10.1 - 10.2)

---

## 🎯 Final Verification

- [ ] All lint checks passed
- [ ] All TypeScript types are correct
- [ ] No console errors in browser
- [ ] No console warnings in browser
- [ ] All features work as expected
- [ ] Documentation is complete

---

## ✅ Sign-Off

**Tested By:** _________________  
**Date:** _________________  
**Status:** ☐ Passed  ☐ Failed  
**Notes:** _________________

---

**Ready for Production Deployment! 🚀**
