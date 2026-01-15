# MULTI-SPORT EVENT REGISTRATION PLATFORM
## Backend Architecture Documentation

---

## 🏗️ System Overview

A production-ready, high-concurrency backend system for sports event registration with:
- **Zero duplicate registrations** (database-level constraints + atomic operations)
- **Live slot tracking** (real-time updates via Supabase Realtime)
- **Secure authentication** (Supabase Auth with JWT)
- **Scalable architecture** (PostgreSQL with optimized indexes)
- **Audit logging** (complete change tracking)
- **QR code check-in system** (secure event entry)

---

## 📊 Database Schema

### Core Tables

#### 1. **profiles** (Users)
```sql
id              UUID PRIMARY KEY (references auth.users)
username        TEXT UNIQUE
email           TEXT
phone           TEXT
role            user_role ENUM ('user', 'admin')
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

**Indexes:**
- `idx_profiles_email` on email
- `idx_profiles_role` on role

**RLS Policies:**
- Users can view their own profile
- Admins have full access
- Public can view basic profile info

---

#### 2. **sports**
```sql
id              UUID PRIMARY KEY
name            TEXT UNIQUE NOT NULL
slug            TEXT UNIQUE NOT NULL
description     TEXT NOT NULL
rules           TEXT NOT NULL
icon_url        TEXT
created_at      TIMESTAMPTZ
```

**RLS Policies:**
- Anyone can view sports
- Admins can manage sports

---

#### 3. **events**
```sql
id                  UUID PRIMARY KEY
sport_id            UUID REFERENCES sports
title               TEXT NOT NULL
description         TEXT
event_date          DATE NOT NULL
event_time          TIME NOT NULL
location            TEXT NOT NULL
registration_type   registration_type ENUM ('individual', 'team')
total_slots         INTEGER NOT NULL
available_slots     INTEGER NOT NULL
team_size           INTEGER
status              event_status ENUM ('upcoming', 'ongoing', 'completed', 'cancelled')
created_by          UUID REFERENCES profiles
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

**Indexes:**
- `idx_events_sport_id` on sport_id
- `idx_events_status` on status
- `idx_events_date` on event_date
- `idx_events_available_slots` on available_slots WHERE available_slots > 0

**RLS Policies:**
- Anyone can view events
- Admins can manage events

---

#### 4. **registrations**
```sql
id                  UUID PRIMARY KEY
event_id            UUID REFERENCES events
user_id             UUID REFERENCES profiles
registration_type   registration_type ENUM
team_name           TEXT
status              TEXT DEFAULT 'confirmed'
qr_code_data        TEXT NOT NULL (SHA-256 hash)
created_at          TIMESTAMPTZ

UNIQUE(event_id, user_id)  -- Prevents duplicate registrations
```

**Indexes:**
- `idx_registrations_event_id` on event_id
- `idx_registrations_user_id` on user_id
- `idx_registrations_status` on status
- `idx_registrations_created_at` on created_at DESC

**RLS Policies:**
- Users can view their own registrations
- Users can create registrations
- Admins can view/manage all registrations

---

#### 5. **teams**
```sql
id              UUID PRIMARY KEY
event_id        UUID REFERENCES events
team_name       TEXT NOT NULL
captain_id      UUID REFERENCES profiles
team_size       INTEGER NOT NULL
status          TEXT DEFAULT 'active'
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ

UNIQUE(event_id, team_name)  -- Prevents duplicate team names per event
```

**Indexes:**
- `idx_teams_event_id` on event_id
- `idx_teams_captain_id` on captain_id

**RLS Policies:**
- Anyone can view teams
- Captains can create teams
- Admins can manage teams

---

#### 6. **team_members**
```sql
id                  UUID PRIMARY KEY
registration_id     UUID REFERENCES registrations
member_name         TEXT NOT NULL
member_email        TEXT
member_phone        TEXT
position            TEXT
created_at          TIMESTAMPTZ
```

**RLS Policies:**
- Users can view their team members
- Users can create team members for their registrations
- Admins can view all team members

---

#### 7. **check_ins**
```sql
id                  UUID PRIMARY KEY
registration_id     UUID REFERENCES registrations
checked_in_by       UUID REFERENCES profiles
check_in_time       TIMESTAMPTZ DEFAULT NOW()
location            TEXT
notes               TEXT

UNIQUE(registration_id)  -- Prevents duplicate check-ins
```

**RLS Policies:**
- Users can view their check-ins
- Admins can manage check-ins

---

#### 8. **notifications**
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES profiles
type            notification_type ENUM
title           TEXT NOT NULL
message         TEXT NOT NULL
event_id        UUID REFERENCES events
read            BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ
```

**Notification Types:**
- `registration_success`
- `event_reminder`
- `event_cancelled`
- `slot_alert`
- `admin_announcement`

**Indexes:**
- `idx_notifications_user_id` on user_id
- `idx_notifications_read` on read WHERE read = false
- `idx_notifications_created_at` on created_at DESC

**RLS Policies:**
- Users can view their notifications
- Users can update their notifications (mark as read)
- System can create notifications

---

#### 9. **documents**
```sql
id                  UUID PRIMARY KEY
registration_id     UUID REFERENCES registrations
file_name           TEXT NOT NULL
file_url            TEXT NOT NULL
file_type           TEXT NOT NULL
uploaded_at         TIMESTAMPTZ
```

**RLS Policies:**
- Users can view their documents
- Users can upload documents
- Admins can view all documents

---

#### 10. **audit_log**
```sql
id              UUID PRIMARY KEY
table_name      TEXT NOT NULL
record_id       UUID NOT NULL
action          audit_action ENUM ('create', 'update', 'delete', 'check_in', 'cancel')
old_data        JSONB
new_data        JSONB
user_id         UUID REFERENCES profiles
ip_address      INET
user_agent      TEXT
created_at      TIMESTAMPTZ
```

**Indexes:**
- `idx_audit_log_table_record` on (table_name, record_id)
- `idx_audit_log_user_id` on user_id
- `idx_audit_log_created_at` on created_at DESC

**RLS Policies:**
- Admins only can view audit log

---

## 🔐 Security Architecture

### Authentication
- **Supabase Auth** with JWT tokens
- Username + password (simulated email with @miaoda.com)
- First user automatically becomes admin
- Session management via HTTP-only cookies

### Authorization
- **Row Level Security (RLS)** on all tables
- Role-based access control (user/admin)
- Helper function `is_admin(uid)` for policy checks
- Service role key for Edge Functions

### Data Protection
- Password hashing (bcrypt via Supabase Auth)
- SQL injection prevention (parameterized queries)
- Input validation in Edge Functions
- CORS headers for API security

---

## ⚡ Registration Engine

### Atomic Registration Flow

The `register_for_event()` function implements a **transaction-based, race-condition-free** registration system:

```sql
CREATE OR REPLACE FUNCTION register_for_event(
  p_event_id UUID,
  p_user_id UUID,
  p_registration_type registration_type,
  p_team_name TEXT DEFAULT NULL,
  p_team_members JSONB DEFAULT NULL
)
```

### Registration Steps (All Atomic)

1. **Lock Event Row**
   ```sql
   SELECT * FROM events WHERE id = p_event_id FOR UPDATE;
   ```
   - Prevents concurrent modifications
   - Ensures data consistency

2. **Validate Event**
   - Event exists
   - Status is 'upcoming'
   - Registration deadline not passed
   - Slots available (available_slots > 0)

3. **Check Duplicate**
   ```sql
   SELECT id FROM registrations 
   WHERE event_id = p_event_id AND user_id = p_user_id;
   ```
   - Database-level UNIQUE constraint
   - Application-level check

4. **Validate Registration Type**
   - Must match event's registration_type
   - Team events require team_name and team_members

5. **Team Validation** (if team event)
   - Team size matches event requirement
   - All team member data provided
   - Create team record

6. **Generate QR Code**
   ```sql
   v_qr_data := encode(
     digest(event_id || user_id || NOW(), 'sha256'),
     'hex'
   );
   ```
   - Unique SHA-256 hash
   - Used for check-in verification

7. **Create Registration**
   - Insert into registrations table
   - Status set to 'confirmed'

8. **Insert Team Members** (if team event)
   - Bulk insert from JSONB array
   - Linked to registration_id

9. **Decrement Slots** (Atomic)
   ```sql
   UPDATE events 
   SET available_slots = available_slots - 1
   WHERE id = p_event_id;
   ```

10. **Create Notification**
    - Success notification to user
    - Includes event details

11. **Audit Log**
    - Record registration creation
    - Store event_id, user_id, type

12. **Return Success**
    - Returns registration_id
    - Transaction commits

### Failure Handling
- **Any step fails → ROLLBACK**
- No partial registrations
- Slots not decremented on failure
- Error message returned to user

---

## 🎫 Check-In System

### QR Code Generation
- SHA-256 hash of: `event_id + user_id + timestamp`
- Stored in `registrations.qr_code_data`
- Unique per registration

### Check-In Flow

```sql
CREATE OR REPLACE FUNCTION check_in_registration(
  p_qr_code_data TEXT,
  p_checked_in_by UUID,
  p_location TEXT DEFAULT NULL
)
```

**Steps:**
1. Find registration by QR code
2. Validate not already checked in
3. Create check_in record
4. Update registration status
5. Audit log
6. Return registration details

**Prevents:**
- Duplicate check-ins (UNIQUE constraint)
- Invalid QR codes
- Unauthorized access

---

## 📡 API Endpoints

### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Sports
```
GET  /sports
GET  /sports/{slug}
```

### Events
```
GET    /events?sport_id={id}&status={status}
GET    /events/{id}
POST   /events (admin only)
PUT    /events/{id} (admin only)
DELETE /events/{id} (admin only)
```

### Registration
```
POST   /functions/v1/register-event
DELETE /registrations/{id}
GET    /registrations?user_id={id}
```

### Check-In
```
POST /functions/v1/check-in (admin only)
```

### Admin
```
GET  /functions/v1/admin-analytics (admin only)
POST /notifications (admin only)
GET  /audit_log (admin only)
```

---

## 🚀 Edge Functions

### 1. register-event
**Purpose:** Handle event registration with validation

**Endpoint:** `POST /functions/v1/register-event`

**Request:**
```json
{
  "event_id": "uuid",
  "registration_type": "individual" | "team",
  "team_name": "string (optional)",
  "team_members": [
    {
      "member_name": "string",
      "member_email": "string",
      "member_phone": "string",
      "position": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "registration_id": "uuid"
}
```

---

### 2. check-in
**Purpose:** QR code scanning for event check-in

**Endpoint:** `POST /functions/v1/check-in`

**Request:**
```json
{
  "qr_code_data": "string",
  "location": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in successful",
  "registration": {
    "registration_id": "uuid",
    "user_name": "string",
    "event_title": "string",
    "registration_type": "individual" | "team",
    "team_name": "string"
  }
}
```

---

### 3. admin-analytics
**Purpose:** Comprehensive analytics dashboard

**Endpoint:** `GET /functions/v1/admin-analytics`

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
      "Basketball": 20
    },
    "recent_registrations": [...],
    "upcoming_events": [...],
    "registration_trend": {
      "2026-01-05": 10,
      "2026-01-06": 15,
      "2026-01-07": 12
    }
  }
}
```

---

## 📈 Performance Optimization

### Database Indexes
- **Events:** sport_id, status, event_date, available_slots
- **Registrations:** event_id, user_id, status, created_at
- **Teams:** event_id, captain_id
- **Notifications:** user_id, read, created_at
- **Audit Log:** (table_name, record_id), user_id, created_at
- **Profiles:** email, role

### Query Optimization
- Use `SELECT FOR UPDATE` for row locking
- Batch inserts for team members
- Indexed foreign keys
- Partial indexes (e.g., WHERE available_slots > 0)

### Caching Strategy (Recommended)
- **Redis** for:
  - Live slot counts
  - Event details (5-minute TTL)
  - User sessions
  - Rate limiting

---

## 🔄 Real-Time Features

### Supabase Realtime
Enable real-time subscriptions on:

```javascript
// Subscribe to slot updates
supabase
  .channel('events')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'events' },
    (payload) => {
      // Update UI with new available_slots
    }
  )
  .subscribe()

// Subscribe to new registrations
supabase
  .channel('registrations')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'registrations' },
    (payload) => {
      // Show new registration notification
    }
  )
  .subscribe()
```

---

## 🛡️ Concurrency Handling

### Race Condition Prevention

**Scenario:** 2 users register for last slot simultaneously

**Solution:**
1. Both transactions lock event row with `FOR UPDATE`
2. First transaction:
   - Checks available_slots = 1 ✅
   - Creates registration
   - Decrements slots to 0
   - Commits
3. Second transaction:
   - Waits for lock release
   - Checks available_slots = 0 ❌
   - Returns "No slots available"
   - Rolls back

**Result:** Zero overbooking, zero duplicates

---

## 📊 Monitoring & Logging

### Audit Log
All critical operations logged:
- Registration creation
- Registration cancellation
- Check-ins
- Event modifications
- User role changes

### Metrics to Track
- Registrations per minute
- Failed registration attempts
- Average registration time
- Slot utilization rate
- Check-in success rate

---

## 🚀 Deployment

### Environment Variables
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Deploy Edge Functions
```bash
# Deploy registration function
supabase functions deploy register-event

# Deploy check-in function
supabase functions deploy check-in

# Deploy analytics function
supabase functions deploy admin-analytics
```

### Database Migrations
```bash
# Apply all migrations
supabase db push

# Reset database (dev only)
supabase db reset
```

---

## 🧪 Testing

### Load Testing
Test with 5000+ concurrent users:

```bash
# Using Apache Bench
ab -n 5000 -c 100 -H "Authorization: Bearer TOKEN" \
   -p registration.json \
   https://your-project.supabase.co/functions/v1/register-event

# Using k6
k6 run --vus 100 --duration 30s load-test.js
```

### Test Scenarios
1. **Concurrent registrations** for same event
2. **Duplicate registration** attempts
3. **Slot exhaustion** handling
4. **Team registration** with invalid size
5. **QR code check-in** validation
6. **Admin operations** under load

---

## 📋 Admin Operations

### Create Event
```sql
INSERT INTO events (
  sport_id, title, description, event_date, event_time,
  location, registration_type, total_slots, available_slots,
  team_size, status, created_by
) VALUES (...);
```

### Cancel Event
```sql
UPDATE events 
SET status = 'cancelled' 
WHERE id = 'event-id';

-- Notify all registered users
INSERT INTO notifications (user_id, type, title, message, event_id)
SELECT user_id, 'event_cancelled', 'Event Cancelled', 
       'The event has been cancelled', event_id
FROM registrations
WHERE event_id = 'event-id';
```

### Export Registrations (CSV)
```sql
COPY (
  SELECT 
    r.id,
    p.username,
    p.email,
    e.title,
    r.registration_type,
    r.team_name,
    r.created_at
  FROM registrations r
  JOIN profiles p ON p.id = r.user_id
  JOIN events e ON e.id = r.event_id
  WHERE e.id = 'event-id'
) TO '/tmp/registrations.csv' WITH CSV HEADER;
```

---

## 🔧 Maintenance

### Database Vacuum
```sql
-- Reclaim storage and update statistics
VACUUM ANALYZE;
```

### Archive Old Data
```sql
-- Archive completed events (older than 6 months)
INSERT INTO events_archive
SELECT * FROM events
WHERE status = 'completed' 
  AND event_date < NOW() - INTERVAL '6 months';

DELETE FROM events
WHERE status = 'completed'
  AND event_date < NOW() - INTERVAL '6 months';
```

---

## 🎯 Scalability Roadmap

### Phase 1: Current (5K users)
- PostgreSQL with optimized indexes
- Supabase Realtime
- Edge Functions

### Phase 2: 50K users
- Redis caching layer
- Read replicas
- Connection pooling (PgBouncer)

### Phase 3: 500K users
- Horizontal sharding
- Message queue (RabbitMQ/Redis)
- CDN for static assets
- Load balancer

---

## 📞 Support

For backend issues:
1. Check Supabase logs
2. Review audit_log table
3. Monitor database performance
4. Check Edge Function logs

---

## 📄 License

© 2026 IIITG Sports Carnival. All rights reserved.
