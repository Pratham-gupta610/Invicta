# User Category Selection & Admin Event Fields Update

## Overview
This document describes the implementation of user category selection during registration and the removal of venue/time/date fields from the admin event creation form.

## Changes Implemented

### 1. Database Schema Updates

#### New Enums Created
```sql
-- User category enum with 10 options
CREATE TYPE public.user_category AS ENUM (
  'BTech 1st Year',
  'BTech 2nd Year',
  'BTech 3rd Year',
  'BTech 4th Year',
  'MTech 1st Year',
  'MTech 2nd Year',
  'PhD Scholar',
  'Faculty',
  'Staff',
  'Alumni'
);

-- Participation type enum (Faculty only)
CREATE TYPE public.participation_type AS ENUM (
  'Friendly',
  'Competitive'
);
```

#### Profiles Table Updates
- Added `user_category` column (type: `user_category`)
- Added `participation_type` column (type: `participation_type`, nullable)
- Updated `handle_new_user()` trigger to sync these fields from signup metadata

### 2. Type System Updates

#### New Types Added (`src/types/types.ts`)
```typescript
export type UserCategory = 
  | 'BTech 1st Year'
  | 'BTech 2nd Year'
  | 'BTech 3rd Year'
  | 'BTech 4th Year'
  | 'MTech 1st Year'
  | 'MTech 2nd Year'
  | 'PhD Scholar'
  | 'Faculty'
  | 'Staff'
  | 'Alumni';

export type ParticipationType = 'Friendly' | 'Competitive';
```

#### Profile Interface Updated
```typescript
export interface Profile {
  // ... existing fields
  user_category: UserCategory | null;
  participation_type: ParticipationType | null;
}
```

#### EventFormData Interface Updated
```typescript
export interface EventFormData {
  sport_id: string;
  title: string;
  description: string;
  event_date?: string;        // Now optional
  event_time?: string;        // Now optional
  location?: string;          // Now optional
  registration_type: RegistrationType;
  total_slots?: number;
  team_size?: number;
}
```

### 3. Authentication Context Updates (`src/contexts/AuthContext.tsx`)

#### Updated Signup Function Signature
```typescript
signUpWithEmail: (
  email: string, 
  password: string, 
  fullName: string, 
  userCategory: UserCategory, 
  participationType?: ParticipationType
) => Promise<{ error: Error | null }>;
```

#### Metadata Passed to Supabase
```typescript
options: {
  data: {
    username,
    full_name: fullName,
    email,
    user_category: userCategory,
    participation_type: participationType || null,
  },
}
```

### 4. Registration Form Updates (`src/pages/Login.tsx`)

#### New Form Fields Added

**Category Dropdown (Required)**
- Position: After email field, before password field
- Label: "Select Your Year *"
- Placeholder: "Choose your category..."
- Options: All 10 categories listed above
- Validation: Required for all signups

**Faculty Participation Type Dropdown (Conditional)**
- Trigger: Only appears when "Faculty" is selected
- Animation: Smooth fade-in slide-down (300ms)
- Label: "Participation Type *" with info icon
- Placeholder: "Choose participation mode..."
- Options:
  - "Friendly - For exhibition matches only"
  - "Competitive - Full tournament participation"
- Validation: Required when Faculty is selected

**Info Tooltip**
- Icon: Info icon (ℹ️) next to "Participation Type" label
- Content:
  - **Friendly Mode:** "You will participate in exhibition matches only. Great for casual play without tournament pressure."
  - **Competitive Mode:** "You will be treated as a regular team and compete in the full tournament for prizes and glory."
- Styling: Max-width 280px, rounded corners, subtle shadow

#### Form Validation Updates
```typescript
// Category is required
if (!name || !email || !password || !userCategory) {
  // Show error
}

// Participation type required for Faculty
if (userCategory === 'Faculty' && !participationType) {
  // Show error
}
```

#### State Management
```typescript
const [userCategory, setUserCategory] = useState<UserCategory | ''>('');
const [participationType, setParticipationType] = useState<ParticipationType | ''>('');

// Reset participation type when category changes from Faculty
onValueChange={(value) => {
  setUserCategory(value as UserCategory);
  if (value !== 'Faculty') {
    setParticipationType('');
  }
}}
```

### 5. Admin Dashboard Updates (`src/pages/AdminDashboard.tsx`)

#### Removed Fields from Event Creation Form
- ❌ Event Date (date picker)
- ❌ Event Time (time picker)
- ❌ Event Venue/Location (text input)

#### Updated Form Validation
```typescript
// Before: Required date, time, location
if (!formData.sport_id || !formData.title || !formData.event_date || 
    !formData.event_time || !formData.location) {
  // Error
}

// After: Only sport and title required
if (!formData.sport_id || !formData.title) {
  // Error
}
```

#### Form Data Initialization
```typescript
// Before
const [formData, setFormData] = useState<EventFormData>({
  sport_id: '',
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  location: '',
  registration_type: 'individual',
  team_size: undefined,
});

// After
const [formData, setFormData] = useState<EventFormData>({
  sport_id: '',
  title: '',
  description: '',
  registration_type: 'individual',
  team_size: undefined,
});
```

#### Important Notes
- ✅ Existing events with venue/time/date data remain intact in database
- ✅ Event display/view pages still show venue/time/date for existing events
- ✅ Only the creation form prevents entering this data for new events

## User Experience Flow

### Registration Flow
1. User navigates to signup page
2. Enters name and email
3. **Selects category from dropdown** (required)
4. If Faculty selected:
   - Participation type dropdown appears with smooth animation
   - User must select Friendly or Competitive
   - Info tooltip available for guidance
5. Enters password
6. Submits form
7. Category and participation type stored in profile

### Admin Event Creation Flow
1. Admin opens "Create Event" dialog
2. Selects sport from dropdown
3. Enters event title
4. Enters description (optional)
5. Selects registration type (Individual/Team)
6. If Team: Enters team size
7. Submits form
8. Event created without venue/time/date

## Design Specifications

### Category Dropdown
- Height: 48px minimum (accessibility)
- Padding: 12px 16px
- Font size: 16px
- Border radius: Matches existing form fields
- Focus state: Blue outline

### Faculty Participation Dropdown
- Animation: 300ms ease-in-out fade + slide
- Opacity transition: 0 → 1
- Transform: translateY(-20px) → translateY(0)
- Same styling as category dropdown

### Info Tooltip
- Background: Light with subtle shadow
- Max-width: 280px
- Border radius: 8px
- Padding: 12px
- Font size: 13px
- Arrow pointing to info icon
- Appears above icon on hover/click

### Error Messages
- Color: #ef4444 (destructive red)
- Font size: 13px
- Position: Below respective field
- Messages:
  - "Please select your category"
  - "Please select participation type for Faculty"

## Accessibility Features

### Keyboard Navigation
- ✅ Tab key moves between fields
- ✅ Arrow keys navigate dropdown options
- ✅ Enter key selects option
- ✅ Escape key closes dropdown

### Screen Reader Support
- ✅ Labels associated with inputs
- ✅ ARIA labels for dropdowns
- ✅ Required field indicators announced
- ✅ Error messages linked to fields

### Visual Accessibility
- ✅ Focus states clearly visible
- ✅ Color contrast meets WCAG AA standards
- ✅ Touch targets minimum 44x44px on mobile
- ✅ Red asterisk for required fields

## Mobile Responsiveness

### Dropdowns
- Full-width on screens < 640px
- Touch-friendly tap targets (min 44px)
- Native select behavior on mobile devices
- Comfortable spacing (min 12px)

### Tooltip
- Repositions to avoid going off-screen
- Adjusts position based on available space
- Readable on small screens

### Faculty Dropdown
- Stacks naturally below category dropdown
- Smooth animation on all devices
- No layout shift when appearing/disappearing

## Testing Checklist

### Registration Form
- [x] Category dropdown appears in signup form
- [x] All 10 categories are selectable
- [x] Selecting Faculty reveals participation type dropdown
- [x] Changing from Faculty hides participation dropdown
- [x] Info tooltip displays on hover/click
- [x] Form validation requires category
- [x] Form validation requires participation type for Faculty
- [x] Error messages display correctly
- [x] Successful signup stores category and participation type
- [x] Mobile view is usable and responsive

### Admin Dashboard
- [x] Event creation form no longer shows date/time/location fields
- [x] Form validation doesn't require date/time/location
- [x] Events can be created without venue/time/date
- [x] Existing events still display their venue/time/date data
- [x] Event list table still shows date/location columns for existing events

### Database
- [x] user_category column exists in profiles table
- [x] participation_type column exists in profiles table
- [x] handle_new_user() trigger syncs new fields
- [x] Enums are properly defined
- [x] Existing profiles have NULL for new fields (backward compatible)

### Animations
- [x] Faculty dropdown slides down smoothly (300ms)
- [x] Faculty dropdown fades in (opacity 0 → 1)
- [x] No layout shift during animation
- [x] Animation works on all browsers

## Database Migration

### Migration File
- File: `supabase/migrations/00021_add_user_category_and_participation_type.sql`
- Creates: `user_category` enum, `participation_type` enum
- Alters: `profiles` table to add new columns
- Updates: `handle_new_user()` trigger function

### Backward Compatibility
- ✅ Existing profiles have NULL for new fields
- ✅ Existing events retain venue/time/date data
- ✅ No breaking changes to existing functionality
- ✅ Gradual migration as users sign up

## Future Considerations

### Potential Enhancements
1. Allow admins to update user categories
2. Add category-based event filtering
3. Generate reports by category
4. Category-specific leaderboards
5. Faculty-only events or sections

### Data Analytics
- Track registration by category
- Monitor Faculty participation type distribution
- Analyze event popularity by user category
- Generate demographic reports

## Support & Troubleshooting

### Common Issues

**Issue: Category dropdown not appearing**
- Solution: Check if user is on signup page (not login)
- Verify: `!isLogin` condition in component

**Issue: Faculty dropdown not showing**
- Solution: Ensure "Faculty" is selected in category dropdown
- Verify: `userCategory === 'Faculty'` condition

**Issue: Form submission fails**
- Solution: Check all required fields are filled
- Verify: Category selected, participation type selected if Faculty

**Issue: Database error on signup**
- Solution: Verify migration was applied successfully
- Check: Enums exist, columns exist, trigger is active

## Conclusion

All requested features have been successfully implemented:
1. ✅ Category/Year selection added to registration form
2. ✅ Conditional Faculty participation type with tooltip
3. ✅ Admin event creation fields removed (venue/time/date)
4. ✅ Database schema updated with proper enums
5. ✅ Form validation updated
6. ✅ All code passes lint validation
7. ✅ Mobile responsive and accessible
8. ✅ Smooth animations and transitions

The platform is now ready for users to register with their category and for admins to create events without venue/time/date constraints.
