# API Documentation
## MULTI-SPORT EVENT REGISTRATION PLATFORM

---

## Base URL
```
https://your-project.supabase.co
```

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Get Token
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'username@miaoda.com',
  password: 'your-password'
})

const token = data.session.access_token
```

---

## Endpoints

### 1. Sports

#### GET /rest/v1/sports
Get all sports

**Query Parameters:**
- `select` (optional): Fields to return (default: *)
- `order` (optional): Sort order (default: name.asc)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Cricket",
    "slug": "cricket",
    "description": "Cricket description...",
    "rules": "Cricket rules...",
    "icon_url": null,
    "created_at": "2026-01-11T00:00:00Z"
  }
]
```

#### GET /rest/v1/sports?slug=eq.{slug}
Get sport by slug

**Response:**
```json
{
  "id": "uuid",
  "name": "Cricket",
  "slug": "cricket",
  "description": "...",
  "rules": "...",
  "icon_url": null,
  "created_at": "2026-01-11T00:00:00Z"
}
```

---

### 2. Events

#### GET /rest/v1/events
Get all events

**Query Parameters:**
- `sport_id` (optional): Filter by sport
- `status` (optional): Filter by status (upcoming, ongoing, completed, cancelled)
- `select` (optional): Fields to return
- `order` (optional): Sort order

**Example:**
```
GET /rest/v1/events?status=eq.upcoming&order=event_date.asc
```

**Response:**
```json
[
  {
    "id": "uuid",
    "sport_id": "uuid",
    "title": "Cricket Championship 2026",
    "description": "Annual cricket tournament",
    "event_date": "2026-02-15",
    "event_time": "10:00:00",
    "location": "Main Stadium",
    "registration_type": "team",
    "total_slots": 16,
    "available_slots": 8,
    "team_size": 11,
    "status": "upcoming",
    "created_by": "uuid",
    "created_at": "2026-01-11T00:00:00Z",
    "updated_at": "2026-01-11T00:00:00Z"
  }
]
```

#### GET /rest/v1/events?id=eq.{id}
Get event by ID

**Response:** Single event object

---

### 3. Registration

#### POST /functions/v1/register-event
Register for an event (uses atomic registration engine)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Individual):**
```json
{
  "event_id": "uuid",
  "registration_type": "individual"
}
```

**Request Body (Team):**
```json
{
  "event_id": "uuid",
  "registration_type": "team",
  "team_name": "Team Alpha",
  "team_members": [
    {
      "member_name": "John Doe",
      "member_email": "john@example.com",
      "member_phone": "+1234567890",
      "position": "Captain"
    },
    {
      "member_name": "Jane Smith",
      "member_email": "jane@example.com",
      "member_phone": "+1234567891",
      "position": "Player"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "registration_id": "uuid"
}
```

**Error Response (400):**
```json
{
  "error": "No slots available"
}
```

**Possible Errors:**
- "Event not found"
- "Event is not open for registration"
- "Registration deadline has passed"
- "No slots available"
- "Already registered for this event"
- "Invalid registration type for this event"
- "Team name and members required"
- "Team must have exactly X members"

---

#### GET /rest/v1/registrations
Get user's registrations

**Query Parameters:**
- `user_id=eq.{user_id}`: Filter by user
- `select`: Include related data

**Example:**
```
GET /rest/v1/registrations?user_id=eq.{user_id}&select=*,event:events(*,sport:sports(*)),team_members(*),documents(*)
```

**Response:**
```json
[
  {
    "id": "uuid",
    "event_id": "uuid",
    "user_id": "uuid",
    "registration_type": "team",
    "team_name": "Team Alpha",
    "status": "confirmed",
    "qr_code_data": "sha256-hash",
    "created_at": "2026-01-11T00:00:00Z",
    "event": {
      "id": "uuid",
      "title": "Cricket Championship",
      "event_date": "2026-02-15",
      "sport": {
        "name": "Cricket"
      }
    },
    "team_members": [
      {
        "member_name": "John Doe",
        "member_email": "john@example.com",
        "position": "Captain"
      }
    ]
  }
]
```

---

#### POST /rest/v1/rpc/cancel_registration
Cancel a registration

**Request Body:**
```json
{
  "p_registration_id": "uuid",
  "p_user_id": "uuid"
}
```

**Response:**
```json
[
  {
    "success": true,
    "message": "Registration cancelled successfully"
  }
]
```

---

### 4. Check-In (Admin Only)

#### POST /functions/v1/check-in
Check in a participant using QR code

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "qr_code_data": "sha256-hash",
  "location": "Main Stadium Gate 1"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Check-in successful",
  "registration": {
    "registration_id": "uuid",
    "user_name": "johndoe",
    "event_title": "Cricket Championship",
    "registration_type": "team",
    "team_name": "Team Alpha"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid QR code"
}
```

**Possible Errors:**
- "Invalid QR code"
- "Already checked in"
- "Admin access required"

---

### 5. Admin Analytics

#### GET /functions/v1/admin-analytics
Get comprehensive analytics (Admin only)

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_events": 10,
      "total_registrations": 150,
      "total_users": 200,
      "upcoming_events": 5,
      "available_slots": 50,
      "registrations_today": 12
    },
    "sport_distribution": {
      "Cricket": 30,
      "Football": 25,
      "Basketball": 20,
      "Table Tennis": 15,
      "Badminton": 18,
      "Volleyball": 12,
      "Athletics": 20,
      "Chess": 10
    },
    "recent_registrations": [
      {
        "id": "uuid",
        "created_at": "2026-01-11T10:30:00Z",
        "registration_type": "team",
        "team_name": "Team Alpha",
        "profiles": {
          "username": "johndoe"
        },
        "events": {
          "title": "Cricket Championship"
        }
      }
    ],
    "upcoming_events": [
      {
        "id": "uuid",
        "title": "Cricket Championship",
        "event_date": "2026-02-15",
        "total_slots": 16,
        "available_slots": 8,
        "sports": {
          "name": "Cricket"
        }
      }
    ],
    "registration_trend": {
      "2026-01-05": 10,
      "2026-01-06": 15,
      "2026-01-07": 12,
      "2026-01-08": 18,
      "2026-01-09": 14,
      "2026-01-10": 16,
      "2026-01-11": 12
    }
  }
}
```

---

### 6. Teams

#### GET /rest/v1/teams
Get teams for an event

**Query Parameters:**
- `event_id=eq.{event_id}`: Filter by event

**Response:**
```json
[
  {
    "id": "uuid",
    "event_id": "uuid",
    "team_name": "Team Alpha",
    "captain_id": "uuid",
    "team_size": 11,
    "status": "active",
    "created_at": "2026-01-11T00:00:00Z"
  }
]
```

---

### 7. Notifications

#### GET /rest/v1/notifications
Get user notifications

**Query Parameters:**
- `user_id=eq.{user_id}`: Filter by user
- `read=eq.false`: Get unread only
- `order=created_at.desc`: Sort by date

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "type": "registration_success",
    "title": "Registration Successful",
    "message": "You have successfully registered for Cricket Championship",
    "event_id": "uuid",
    "read": false,
    "created_at": "2026-01-11T10:30:00Z"
  }
]
```

#### PATCH /rest/v1/notifications?id=eq.{id}
Mark notification as read

**Request Body:**
```json
{
  "read": true
}
```

---

### 8. Audit Log (Admin Only)

#### GET /rest/v1/audit_log
Get audit log entries

**Query Parameters:**
- `table_name=eq.{table}`: Filter by table
- `user_id=eq.{user_id}`: Filter by user
- `order=created_at.desc`: Sort by date
- `limit={n}`: Limit results

**Response:**
```json
[
  {
    "id": "uuid",
    "table_name": "registrations",
    "record_id": "uuid",
    "action": "create",
    "old_data": null,
    "new_data": {
      "event_id": "uuid",
      "user_id": "uuid",
      "registration_type": "team"
    },
    "user_id": "uuid",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "created_at": "2026-01-11T10:30:00Z"
  }
]
```

---

### 9. Statistics

#### POST /rest/v1/rpc/get_registration_stats
Get registration statistics

**Response:**
```json
[
  {
    "total_events": 10,
    "total_registrations": 150,
    "total_users": 200,
    "upcoming_events": 5,
    "available_slots": 50,
    "registrations_today": 12
  }
]
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting

**Limits:**
- Anonymous: 60 requests/minute
- Authenticated: 300 requests/minute
- Admin: 600 requests/minute

**Headers:**
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1641945600
```

---

## Real-Time Subscriptions

### Subscribe to Event Updates
```javascript
const channel = supabase
  .channel('events')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'events' 
    },
    (payload) => {
      console.log('Event updated:', payload.new)
      // Update UI with new available_slots
    }
  )
  .subscribe()
```

### Subscribe to New Registrations
```javascript
const channel = supabase
  .channel('registrations')
  .on('postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'registrations',
      filter: `event_id=eq.${eventId}`
    },
    (payload) => {
      console.log('New registration:', payload.new)
      // Show notification
    }
  )
  .subscribe()
```

### Subscribe to Notifications
```javascript
const channel = supabase
  .channel('user-notifications')
  .on('postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New notification:', payload.new)
      // Show toast notification
    }
  )
  .subscribe()
```

---

## Code Examples

### Complete Registration Flow

```javascript
// 1. Get event details
const { data: event } = await supabase
  .from('events')
  .select('*')
  .eq('id', eventId)
  .single()

// 2. Check available slots
if (event.available_slots <= 0) {
  throw new Error('No slots available')
}

// 3. Register for event
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/register-event',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_id: eventId,
      registration_type: 'individual'
    })
  }
)

const result = await response.json()

if (result.success) {
  console.log('Registration successful:', result.registration_id)
} else {
  console.error('Registration failed:', result.error)
}
```

### Check-In Flow

```javascript
// Admin scans QR code
const qrCodeData = scannedQRCode

// Call check-in endpoint
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/check-in',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      qr_code_data: qrCodeData,
      location: 'Main Stadium Gate 1'
    })
  }
)

const result = await response.json()

if (result.success) {
  console.log('Check-in successful:', result.registration)
  // Show success message with user details
} else {
  console.error('Check-in failed:', result.error)
  // Show error message
}
```

---

## Testing

### Test Credentials
```
Username: testuser
Password: Test@123
Email: testuser@miaoda.com
```

### Test Event IDs
Check the database for actual event IDs after seeding.

---

## Support

For API issues:
- Check Supabase logs
- Review audit_log table
- Monitor Edge Function logs
- Contact: support@iiitg-sports.com

---

## Changelog

### v1.0.0 (2026-01-11)
- Initial release
- Atomic registration engine
- QR code check-in system
- Admin analytics
- Real-time updates
- Audit logging
