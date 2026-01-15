# Multi-Sport Event Registration Platform

A production-ready web application for managing sports event registrations across multiple sports categories.

## Features

### User Features
- **Multi-Sport Support**: Browse and register for events across 8 sports categories:
  - Cricket
  - Football (9 vs 9)
  - Basketball
  - Table Tennis
  - Badminton
  - Volleyball
  - Athletics
  - Chess

- **Flexible Registration**: Support for both individual and team registrations
- **Real-Time Availability**: Live slot tracking to prevent overbooking
- **Digital Tickets**: QR code-based entry tickets for registered events
- **User Dashboard**: View and manage all your event registrations
- **Event Filtering**: Filter events by date, location, and registration type

### Admin Features
- **Event Management**: Create, edit, and delete sports events
- **Participant Tracking**: View all registrations and participant details
- **Analytics Dashboard**: Overview of total events, registrations, and upcoming events
- **Role Management**: First registered user automatically becomes admin

### Technical Features
- **Secure Authentication**: Username/password authentication with role-based access
- **Document Storage**: Supabase storage for event-related documents
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Full dark mode support
- **Real-Time Updates**: Live slot availability updates

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development URL shown in the terminal.

## Usage Guide

### For Users

#### 1. Registration
- Click "Login" in the header
- Choose "Sign up" and create an account with a username and password
- Username can only contain letters, numbers, and underscores

#### 2. Browse Events
- Visit the homepage to see all 8 sports categories
- Click on any sport card to view available events for that sport

#### 3. Register for an Event
- On a sport detail page, browse available events
- Use filters to find events by date, location, or registration type
- Click "Register Now" on any event with available slots
- Complete the registration form:
  - For individual events: Confirm your participation
  - For team events: Enter team name and add team member details

#### 4. View Your Registrations
- Click "My Events" in the header or "Dashboard" button
- View all your registered events
- Click "View Ticket" to see your QR code entry ticket
- Show the QR code at the event entrance

### For Admins

#### 1. Access Admin Dashboard
- The first user to register automatically becomes an admin
- Click "Admin" button in the header to access the admin dashboard

#### 2. Create Events
- Click "Create Event" button
- Fill in event details:
  - Select sport category
  - Enter event title and description
  - Set date, time, and location
  - Choose registration type (individual or team)
  - Set total slots and team size (if applicable)

#### 3. Manage Events
- View all events in the Events tab
- See registration statistics
- Delete events if needed
- View participant lists for each event

#### 4. View Registrations
- Switch to Registrations tab
- See all registrations across all events
- Export data for event management

## Database Structure

### Tables
- **profiles**: User accounts with role management
- **sports**: 8 pre-populated sports categories
- **events**: All sports events with availability tracking
- **registrations**: User event registrations with QR codes
- **team_members**: Team member details for team registrations
- **documents**: Event-related document storage

### Security
- Row Level Security (RLS) enabled on all tables
- Admin-only access for event management
- Users can only view/edit their own registrations
- Public read access for sports and events

## Color System

The platform uses an energetic sports-themed color palette:
- **Primary (Blue)**: Main actions and branding - `hsl(217 91% 60%)`
- **Secondary (Green)**: Success states and secondary actions - `hsl(142 76% 36%)`
- **Accent (Orange)**: Highlights and attention-grabbing elements - `hsl(38 92% 50%)`
- **Destructive (Red)**: Warnings and destructive actions - `hsl(0 84% 60%)`

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Authentication + Storage)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **QR Codes**: qrcode library

## Project Structure

```
src/
├── components/
│   ├── layouts/          # Header, Footer
│   ├── sports/           # SportCard, EventCard
│   ├── ui/               # shadcn/ui components
│   └── common/           # RouteGuard, etc.
├── pages/
│   ├── Home.tsx          # Landing page with sport cards
│   ├── SportDetail.tsx   # Sport-specific event listing
│   ├── Registration.tsx  # Event registration form
│   ├── UserDashboard.tsx # User's registered events
│   ├── AdminDashboard.tsx # Admin event management
│   └── Login.tsx         # Authentication page
├── db/
│   ├── supabase.ts       # Supabase client
│   └── api.ts            # Database query functions
├── types/
│   └── types.ts          # TypeScript interfaces
├── contexts/
│   └── AuthContext.tsx   # Authentication context
└── hooks/                # Custom React hooks
```

## Important Notes

### First User Setup
⚠️ **IMPORTANT**: The first user to register will automatically be assigned the admin role. Make sure to register your admin account first!

### Authentication
- Uses username + password authentication
- Email verification is disabled for easier testing
- Usernames are stored as `username@miaoda.com` internally
- Only letters, numbers, and underscores allowed in usernames

### Event Registration
- Users cannot register for the same event twice
- Slot availability is updated in real-time
- Team registrations require team name and member details
- QR codes are generated automatically for each registration

### Admin Capabilities
- Only admins can create, edit, and delete events
- Admins can view all registrations across all events
- Admin panel is only visible to users with admin role

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run preview` - Preview production build

### Environment Variables
The following environment variables are automatically configured:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Support

For issues or questions about the platform:
1. Check the console for error messages
2. Verify your authentication status
3. Ensure you have the correct permissions for the action
4. Check that events have available slots before registering

## License

© 2026 SportEvents. All rights reserved.
