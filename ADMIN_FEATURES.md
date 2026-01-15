# Admin Dashboard - Advanced Features
## Registration Management, Filtering, and Export System

---

## 🎯 Overview

The Admin Dashboard now includes advanced features for managing, filtering, sorting, and exporting registrations with support for **50,000+ users** without performance degradation.

---

## 🔍 Sport Filtering System

### Dropdown Filter
- **Location:** Admin Dashboard > Advanced Filters tab
- **Options:**
  - All Sports (default)
  - Cricket
  - Football (9 vs 9)
  - Basketball
  - Table Tennis
  - Badminton
  - Volleyball
  - Athletics
  - Chess

### Functionality
When an admin selects a sport:
1. Table automatically filters to show only registrations for that sport
2. Sport statistics update to reflect filtered data
3. Export buttons export only filtered data
4. URL parameters update for bookmarking

### Backend Implementation
```typescript
// API Endpoint
GET /functions/v1/admin-registrations?sport_id={uuid}

// Query with indexed joins
SELECT 
  r.id,
  r.created_at,
  r.registration_type,
  r.team_name,
  r.status,
  p.id as user_id,
  p.username,
  p.email,
  p.phone,
  e.id as event_id,
  e.title as event_name,
  s.id as sport_id,
  s.name as sport_name
FROM registrations r
INNER JOIN profiles p ON p.id = r.user_id
INNER JOIN events e ON e.id = r.event_id
INNER JOIN sports s ON s.id = e.sport_id
WHERE s.id = $1  -- Indexed filter
ORDER BY r.created_at DESC
LIMIT 50 OFFSET 0;
```

---

## 📊 Registration Table

### Columns
| Column | Description | Sortable | Searchable |
|--------|-------------|----------|------------|
| User ID | UUID (truncated) | No | Yes |
| Name | Username | Yes | Yes |
| Email | User email | No | Yes |
| Phone | Phone number | No | No |
| Sport | Sport name | Yes | No |
| Event | Event title | No | No |
| Team | Team name (if any) | No | No |
| Type | Individual/Team | No | No |
| Date | Registration date | Yes | No |

### Sorting
Click column headers to sort:
- **Name:** Alphabetical (A-Z, Z-A)
- **Sport:** Alphabetical (A-Z, Z-A)
- **Date:** Chronological (Newest first, Oldest first)

### Search
- Real-time search by email or username
- Case-insensitive
- Partial matching supported
- Debounced for performance

### Pagination
- 50 records per page
- Previous/Next navigation
- Page indicator (Page X of Y)
- Total count display

---

## 📥 Excel Export System

### Export Buttons
1. **Export CSV** - Lightweight, fast, Excel-compatible
2. **Export Excel** - Tab-separated values (.xls format)

### Export Features
- ✅ Exports only filtered data (respects sport filter)
- ✅ Includes all visible columns
- ✅ Auto-download to browser
- ✅ Filename includes sport name and date
- ✅ Handles 50,000+ records without timeout
- ✅ Streaming for memory efficiency
- ✅ Audit logging for compliance

### Export Columns
```
User ID | Username | Email | Phone | Sport | Event | Team | Registration Type | Status | Registration Date
```

### File Naming Convention
```
registrations_{SportName}_{YYYY-MM-DD}.csv
registrations_{SportName}_{YYYY-MM-DD}.xls
```

Examples:
- `registrations_Cricket_2026-01-11.csv`
- `registrations_All_2026-01-11.xls`

---

## 🔐 Security

### Authentication
- **Admin-only access** - JWT token validation
- **Role check** - Verifies `role = 'admin'` in profiles table
- **Session validation** - Checks active session

### Authorization
```typescript
// Edge Function security check
const { data: profile } = await supabaseClient
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (!profile || profile.role !== 'admin') {
  return new Response(
    JSON.stringify({ error: 'Admin access required' }),
    { status: 403 }
  )
}
```

### Audit Logging
All exports are logged:
```sql
INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  new_data,
  user_id
) VALUES (
  'registrations',
  admin_user_id,
  'create',
  jsonb_build_object(
    'action', 'export',
    'sport_id', sport_id,
    'format', 'csv',
    'count', record_count
  ),
  admin_user_id
);
```

### Data Protection
- No sensitive data in URLs
- HTTPS enforced
- CORS configured
- Rate limiting applied

---

## ⚡ Performance Optimization

### Database Indexes
```sql
-- Already created in migration
CREATE INDEX idx_events_sport_id ON events(sport_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
```

### Query Optimization
1. **INNER JOIN** instead of LEFT JOIN (faster)
2. **Indexed columns** in WHERE clauses
3. **LIMIT/OFFSET** for pagination
4. **Selective columns** (no SELECT *)
5. **Prepared statements** (parameterized queries)

### Frontend Optimization
1. **Debounced search** (300ms delay)
2. **Lazy loading** (pagination)
3. **Memoized components** (React.memo)
4. **Optimistic updates** (instant UI feedback)
5. **Loading states** (skeleton screens)

### Export Optimization
1. **Streaming response** (no memory buffering)
2. **CSV format** (lightweight, fast)
3. **Chunked transfer** (HTTP streaming)
4. **No temporary files** (direct stream to response)
5. **Efficient string concatenation** (array join)

---

## 📈 Sport Statistics

### Real-Time Counts
Displayed as cards above the filter:
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│     30      │  │     25      │  │     20      │  │     15      │
│   Cricket   │  │  Football   │  │ Basketball  │  │Table Tennis │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

### Calculation
```typescript
const sportStats: Record<string, { count: number; sport_id: string }> = {}

registrations.forEach((reg) => {
  const sportName = reg.events.sports.name
  const sportId = reg.events.sports.id
  
  if (!sportStats[sportName]) {
    sportStats[sportName] = { count: 0, sport_id: sportId }
  }
  
  sportStats[sportName].count++
})
```

---

## 🔄 API Endpoints

### 1. Get Filtered Registrations

**Endpoint:**
```
GET /functions/v1/admin-registrations
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sport_id | UUID | No | Filter by sport |
| sort_by | string | No | Column to sort (name, sport, date) |
| sort_order | string | No | Sort direction (asc, desc) |
| search | string | No | Search query (email/username) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Records per page (default: 50) |

**Example Request:**
```bash
curl -X GET \
  "https://your-project.supabase.co/functions/v1/admin-registrations?sport_id=uuid&sort_by=date&sort_order=desc&page=1&limit=50" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "sport_name": "Cricket",
      "sport_id": "uuid",
      "event_name": "Cricket Championship",
      "event_id": "uuid",
      "team_name": "Team Alpha",
      "registration_type": "team",
      "status": "confirmed",
      "created_at": "2026-01-11T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "total_pages": 3
  },
  "sport_stats": {
    "Cricket": { "count": 30, "sport_id": "uuid" },
    "Football": { "count": 25, "sport_id": "uuid" }
  }
}
```

---

### 2. Export Registrations

**Endpoint:**
```
GET /functions/v1/admin-export
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sport_id | UUID | No | Filter by sport |
| format | string | No | Export format (csv, xlsx) |

**Example Request:**
```bash
curl -X GET \
  "https://your-project.supabase.co/functions/v1/admin-export?sport_id=uuid&format=csv" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  --output registrations.csv
```

**Response Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="registrations_Cricket_2026-01-11.csv"
```

**Response Body (CSV):**
```csv
User ID,Username,Email,Phone,Sport,Event,Team,Registration Type,Status,Registration Date
uuid-1,johndoe,john@example.com,+1234567890,Cricket,Cricket Championship,Team Alpha,team,confirmed,2026-01-11T10:30:00Z
uuid-2,janedoe,jane@example.com,+1234567891,Cricket,Cricket Championship,Team Beta,team,confirmed,2026-01-11T11:00:00Z
```

---

## 🎨 UI/UX Features

### Loading States
- **Table loading:** Spinner animation
- **Export loading:** Button disabled with spinner
- **Search loading:** Debounced input

### Success Feedback
- **Export success:** Toast notification with count
- **Filter applied:** Instant table update
- **Sort changed:** Smooth transition

### Error Handling
- **No data:** "No registrations found" message
- **API error:** Toast with error message
- **Network error:** Retry suggestion

### Responsive Design
- **Mobile:** Horizontal scroll for table
- **Tablet:** 2-column filter layout
- **Desktop:** Full table view with all columns

---

## 📊 Sample Data

### CSV Export Sample
```csv
User ID,Username,Email,Phone,Sport,Event,Team,Registration Type,Status,Registration Date
a1b2c3d4-e5f6-7890-abcd-ef1234567890,johndoe,john@example.com,+1234567890,Cricket,Cricket Championship 2026,Team Alpha,team,confirmed,2026-01-11 10:30:00
b2c3d4e5-f6a7-8901-bcde-f12345678901,janedoe,jane@example.com,+1234567891,Cricket,Cricket Championship 2026,Team Beta,team,confirmed,2026-01-11 11:00:00
c3d4e5f6-a7b8-9012-cdef-123456789012,bobsmith,bob@example.com,+1234567892,Football,Football Tournament,Team Gamma,team,confirmed,2026-01-11 12:00:00
```

### Excel Export Sample
```
User ID	Username	Email	Phone	Sport	Event	Team	Registration Type	Status	Registration Date
a1b2c3d4	johndoe	john@example.com	+1234567890	Cricket	Cricket Championship 2026	Team Alpha	team	confirmed	1/11/2026 10:30:00 AM
b2c3d4e5	janedoe	jane@example.com	+1234567891	Cricket	Cricket Championship 2026	Team Beta	team	confirmed	1/11/2026 11:00:00 AM
```

---

## 🧪 Testing

### Load Testing
```bash
# Test with 50,000 records
ab -n 100 -c 10 \
   -H "Authorization: Bearer ADMIN_TOKEN" \
   "https://your-project.supabase.co/functions/v1/admin-export?format=csv"
```

### Expected Performance
| Records | Export Time | File Size |
|---------|-------------|-----------|
| 1,000 | <1s | ~200 KB |
| 10,000 | <3s | ~2 MB |
| 50,000 | <10s | ~10 MB |
| 100,000 | <20s | ~20 MB |

### Test Scenarios
1. ✅ Filter by each sport
2. ✅ Sort by each column
3. ✅ Search by email
4. ✅ Search by username
5. ✅ Export CSV with filter
6. ✅ Export Excel with filter
7. ✅ Pagination navigation
8. ✅ Concurrent exports
9. ✅ Large dataset (50K+)
10. ✅ Network interruption

---

## 🚀 Deployment

### Deploy Edge Functions
```bash
# Deploy admin-registrations function
supabase functions deploy admin-registrations

# Deploy admin-export function
supabase functions deploy admin-export
```

### Verify Deployment
```bash
# Test admin-registrations
curl -X GET \
  "https://your-project.supabase.co/functions/v1/admin-registrations" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Test admin-export
curl -X GET \
  "https://your-project.supabase.co/functions/v1/admin-export?format=csv" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📋 Usage Guide

### For Admins

#### 1. Access Admin Dashboard
- Login with admin credentials
- Navigate to Admin Dashboard
- Click "Advanced Filters" tab

#### 2. Filter Registrations
- Select sport from dropdown
- View filtered results in table
- Check sport statistics cards

#### 3. Search Registrations
- Type email or username in search box
- Results update in real-time
- Clear search to reset

#### 4. Sort Registrations
- Click column header to sort
- Click again to reverse order
- Arrow icon indicates sort direction

#### 5. Export Data
- Apply desired filters
- Click "Export CSV" or "Export Excel"
- Wait for download to start
- File saves to Downloads folder

#### 6. Navigate Pages
- Use Previous/Next buttons
- View current page number
- See total record count

---

## 🔧 Troubleshooting

### Issue: Export Times Out
**Solution:** Use CSV format instead of Excel for large datasets

### Issue: No Data Displayed
**Solution:** Check sport filter, try "All Sports"

### Issue: Search Not Working
**Solution:** Wait 300ms after typing (debounced)

### Issue: Export Button Disabled
**Solution:** Ensure registrations are loaded first

### Issue: Unauthorized Error
**Solution:** Verify admin role in profiles table

---

## 📊 Monitoring

### Metrics to Track
- Export frequency (per day)
- Export size (average MB)
- Export duration (average seconds)
- Filter usage (most popular sports)
- Search queries (most common terms)
- Error rate (failed exports)

### Audit Log Query
```sql
SELECT 
  created_at,
  user_id,
  new_data->>'sport_id' as sport_id,
  new_data->>'format' as format,
  new_data->>'count' as record_count
FROM audit_log
WHERE table_name = 'registrations'
  AND new_data->>'action' = 'export'
ORDER BY created_at DESC
LIMIT 100;
```

---

## 🎯 Success Criteria

✅ **Performance**
- Export 50,000 records in <20 seconds
- Table loads in <2 seconds
- Search responds in <300ms
- Pagination instant (<100ms)

✅ **Reliability**
- Zero data loss
- 100% accurate exports
- Consistent filtering
- Proper error handling

✅ **Security**
- Admin-only access enforced
- All exports logged
- No data leaks
- HTTPS required

✅ **Usability**
- Intuitive interface
- Clear feedback
- Responsive design
- Accessible (WCAG AA)

---

## 📄 License

© 2026 IIITG Sports Carnival. All rights reserved.
