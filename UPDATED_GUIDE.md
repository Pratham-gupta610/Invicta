# IIITG Sports Carnival - Platform Guide

A production-ready sports event registration platform for IIIT Guwahati, organised by the Sports Board.

## Overview

The IIITG Sports Carnival platform enables students and participants to register for sports events across 8 categories with comprehensive admin management capabilities.

## Design System

### Color Palette
The platform uses a light icy blue color palette (#B9CFDF) for a cool, clean, and modern aesthetic:
- **Primary**: `hsl(205 35% 75%)` - Light icy blue
- **Secondary**: `hsl(205 25% 85%)` - Lighter blue-gray
- **Accent**: `hsl(205 30% 88%)` - Soft blue accent
- **Background**: White in light mode, dark blue-gray in dark mode
- **High contrast against dark backgrounds**
- **Minimalistic, crisp, and futuristic aesthetic**

## Features

### User Features
- **8 Sports Categories**: Cricket, Football (9v9), Basketball, Table Tennis, Badminton, Volleyball, Athletics, Chess
- **Flexible Registration**: Individual and team-based registrations
- **Real-Time Availability**: Live slot tracking
- **Digital Tickets**: QR code-based entry tickets
- **User Dashboard**: Manage all registrations
- **Event Filtering**: Filter by location and registration type

### Admin Features
- **Comprehensive Dashboard**: 4-card statistics overview
  - Total Events with upcoming count
  - Total Registrations (team/individual breakdown)
  - Total Users count
  - Database status
- **Event Management**: Create, view, and delete events
- **User Management**: View all users and manage roles (user/admin)
- **Registration Management**: View and delete registrations
- **Database Overview**: Complete access to all platform data

## Getting Started

### Installation
```bash
npm install
npm run dev
```

### First-Time Setup
⚠️ **IMPORTANT**: The first user to register will automatically become an admin.

1. Open the application
2. Click "Login" → "Sign up"
3. Create your admin account
4. You'll automatically have admin access

## User Guide

### Registration Process
1. Browse sports on the homepage
2. Click on a sport card to view events
3. Use filters to find events by location or type
4. Click "Register Now" on available events
5. Complete the registration form
6. View your ticket with QR code in the dashboard

### Viewing Your Events
- Click "My Events" in the header
- View all registered events
- Click "View Ticket" to see QR code
- Show QR code at event entrance

## Admin Guide

### Accessing Admin Panel
- Click "Admin" button in the header (only visible to admins)
- View comprehensive statistics dashboard

### Managing Events
1. Click "Create Event" button
2. Fill in event details:
   - Select sport category
   - Enter title and description
   - Set time and location
   - Choose registration type
   - Set total slots
   - Add team size (for team events)
3. View all events in the Events tab
4. Delete events using the trash icon

### Managing Users
1. Go to "Users" tab in admin dashboard
2. View all registered users
3. Change user roles using the dropdown:
   - User: Regular participant
   - Admin: Full platform access
4. Monitor user registration dates

### Managing Registrations
1. Go to "Registrations" tab
2. View all event registrations
3. See registration details:
   - Event name and sport
   - Registration type (team/individual)
   - Team name (if applicable)
   - Registration date
   - Status
4. Delete registrations if needed (slots will be restored)

### Statistics Dashboard
The admin dashboard provides real-time statistics:
- **Total Events**: Number of all events with upcoming count
- **Total Registrations**: All registrations with team/individual breakdown
- **Total Users**: Number of registered users
- **Database**: Active profiles count

## Technical Details

### Database Structure
- **profiles**: User accounts with role management
- **sports**: 8 pre-populated sports categories
- **events**: All sports events with availability tracking
- **registrations**: User event registrations with QR codes
- **team_members**: Team member details
- **documents**: Event-related documents

### Security
- Row Level Security (RLS) enabled
- Admin-only access for management features
- Users can only view/edit their own data
- Public read access for sports and events

### Authentication
- Username + password authentication
- Usernames: letters, numbers, and underscores only
- No email verification required
- Automatic admin assignment for first user

## Key Changes from Original

### Branding
- Changed from "SportEvents" to "IIITG Sports Carnival"
- Added "Organised by Sports Board" subheading
- Updated footer with IIITG branding

### Design
- Implemented icy blue color palette (#B9CFDF)
- Cool, clean, modern tone
- High contrast design
- Minimalistic and futuristic aesthetic

### UI Changes
- Removed date filter from event browsing
- Removed sport descriptions (kept rules only)
- Enhanced admin panel with comprehensive database management

### Admin Panel Enhancements
- Added user management interface
- Added registration deletion capability
- Enhanced statistics with 4-card dashboard
- Added detailed breakdowns (team/individual, upcoming events)
- Complete database visibility

## Support

### Common Issues
- **Can't see Admin button**: Only the first registered user and users with admin role can see it
- **Event fully booked**: Slots are limited and updated in real-time
- **Can't register twice**: Duplicate registrations are prevented
- **Forgot to register as admin first**: Contact existing admin to change your role

### Admin Tasks
- Create events before users can register
- Monitor registration numbers
- Manage user roles as needed
- Delete invalid registrations if necessary

## Copyright

© 2026 IIITG Sports Carnival. All rights reserved.
Organised by Sports Board, IIIT Guwahati.
