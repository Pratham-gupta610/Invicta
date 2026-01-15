# Deployment Guide
## MULTI-SPORT EVENT REGISTRATION PLATFORM

---

## Prerequisites

- Supabase account
- Node.js 18+ installed
- Git installed
- Supabase CLI installed

---

## 1. Supabase Setup

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Link Project
```bash
cd /workspace/app-8uulibpxqebl
supabase link --project-ref your-project-ref
```

---

## 2. Database Setup

### Apply Migrations
```bash
# Apply all migrations in order
supabase db push

# Or apply individually
supabase db push --file supabase/migrations/00001_create_initial_schema.sql
supabase db push --file supabase/migrations/00002_create_storage_bucket.sql
supabase db push --file supabase/migrations/00003_add_helper_functions.sql
supabase db push --file supabase/migrations/00004_enhance_backend_architecture.sql
```

### Verify Database
```bash
# Check tables
supabase db diff

# Run SQL query
supabase db execute "SELECT * FROM sports;"
```

---

## 3. Edge Functions Deployment

### Deploy All Functions
```bash
# Deploy register-event function
supabase functions deploy register-event

# Deploy check-in function
supabase functions deploy check-in

# Deploy admin-analytics function
supabase functions deploy admin-analytics
```

### Test Functions
```bash
# Test register-event
curl -X POST \
  https://your-project.supabase.co/functions/v1/register-event \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_id":"uuid","registration_type":"individual"}'

# Test check-in
curl -X POST \
  https://your-project.supabase.co/functions/v1/check-in \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"qr_code_data":"hash","location":"Gate 1"}'

# Test admin-analytics
curl -X GET \
  https://your-project.supabase.co/functions/v1/admin-analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 4. Storage Setup

### Verify Storage Bucket
The migration creates a storage bucket named `{APP_ID}_documents`.

Check in Supabase Dashboard:
- Go to Storage
- Verify bucket exists
- Check bucket policies

### Test Upload
```javascript
const { data, error } = await supabase.storage
  .from('{APP_ID}_documents')
  .upload('test.pdf', file)
```

---

## 5. Authentication Setup

### Disable Email Verification (Username/Password Mode)
```bash
# In Supabase Dashboard:
# 1. Go to Authentication > Settings
# 2. Disable "Enable email confirmations"
# 3. Save changes
```

Or use CLI:
```bash
supabase auth update --enable-signup --disable-email-confirmations
```

### Configure Auth Settings
In Supabase Dashboard > Authentication > Settings:
- **Site URL:** `https://your-domain.com`
- **Redirect URLs:** `https://your-domain.com/**`
- **JWT expiry:** 3600 (1 hour)
- **Refresh token expiry:** 2592000 (30 days)

---

## 6. Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ID=your-app-id
```

### Edge Functions
Environment variables are automatically available:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 7. Frontend Deployment

### Build Frontend
```bash
cd /workspace/app-8uulibpxqebl
npm install
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Supabase (Static Hosting)
```bash
# Coming soon - Supabase static hosting
```

---

## 8. Database Indexes Verification

### Check Indexes
```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Expected Indexes
- `idx_events_sport_id`
- `idx_events_status`
- `idx_events_date`
- `idx_events_available_slots`
- `idx_registrations_event_id`
- `idx_registrations_user_id`
- `idx_registrations_status`
- `idx_registrations_created_at`
- `idx_teams_event_id`
- `idx_teams_captain_id`
- `idx_notifications_user_id`
- `idx_notifications_read`
- `idx_notifications_created_at`
- `idx_audit_log_table_record`
- `idx_audit_log_user_id`
- `idx_audit_log_created_at`
- `idx_profiles_email`
- `idx_profiles_role`

---

## 9. RLS Policies Verification

### Check Policies
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Test RLS
```javascript
// Test as user
const { data: userRegistrations } = await supabase
  .from('registrations')
  .select('*')
// Should only return user's own registrations

// Test as admin
const { data: allRegistrations } = await supabase
  .from('registrations')
  .select('*')
// Should return all registrations
```

---

## 10. Performance Testing

### Load Test Registration Endpoint
```bash
# Using Apache Bench
ab -n 1000 -c 50 \
   -H "Authorization: Bearer TOKEN" \
   -p registration.json \
   -T "application/json" \
   https://your-project.supabase.co/functions/v1/register-event
```

### Monitor Database Performance
```sql
-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 11. Monitoring Setup

### Enable Supabase Monitoring
In Supabase Dashboard:
1. Go to Settings > Monitoring
2. Enable metrics collection
3. Set up alerts for:
   - High CPU usage (>80%)
   - High memory usage (>80%)
   - Slow queries (>1s)
   - Failed requests (>5%)

### Custom Monitoring Queries
```sql
-- Registration rate (per hour)
SELECT 
  DATE_TRUNC('hour', created_at) AS hour,
  COUNT(*) AS registrations
FROM registrations
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Event popularity
SELECT 
  e.title,
  e.total_slots,
  e.available_slots,
  COUNT(r.id) AS registrations,
  ROUND(100.0 * COUNT(r.id) / e.total_slots, 2) AS fill_rate
FROM events e
LEFT JOIN registrations r ON r.event_id = e.id
WHERE e.status = 'upcoming'
GROUP BY e.id, e.title, e.total_slots, e.available_slots
ORDER BY fill_rate DESC;

-- User activity
SELECT 
  DATE(created_at) AS date,
  COUNT(DISTINCT user_id) AS active_users,
  COUNT(*) AS total_registrations
FROM registrations
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;
```

---

## 12. Backup Strategy

### Automated Backups
Supabase automatically backs up your database daily.

### Manual Backup
```bash
# Export database
supabase db dump -f backup.sql

# Export specific table
supabase db dump -t registrations -f registrations_backup.sql
```

### Restore from Backup
```bash
# Restore database
supabase db reset
supabase db push --file backup.sql
```

---

## 13. Security Checklist

- [ ] RLS enabled on all tables
- [ ] Admin helper function created
- [ ] Service role key secured (never exposed to frontend)
- [ ] CORS configured for Edge Functions
- [ ] Rate limiting enabled
- [ ] Input validation in Edge Functions
- [ ] SQL injection prevention (parameterized queries)
- [ ] Password hashing enabled (Supabase Auth)
- [ ] JWT expiry configured
- [ ] Audit logging enabled
- [ ] Storage bucket policies configured
- [ ] HTTPS enforced
- [ ] Environment variables secured

---

## 14. Post-Deployment Verification

### 1. Test User Registration
```bash
# Register new user
curl -X POST \
  https://your-project.supabase.co/auth/v1/signup \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@miaoda.com","password":"Test@123"}'
```

### 2. Test Event Registration
```bash
# Register for event
curl -X POST \
  https://your-project.supabase.co/functions/v1/register-event \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_id":"EVENT_UUID","registration_type":"individual"}'
```

### 3. Test Admin Access
```bash
# Get analytics
curl -X GET \
  https://your-project.supabase.co/functions/v1/admin-analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4. Test Real-Time Updates
```javascript
// Subscribe to events
const channel = supabase
  .channel('events')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'events' },
    (payload) => console.log('Event updated:', payload)
  )
  .subscribe()

// Trigger update
await supabase
  .from('events')
  .update({ available_slots: 10 })
  .eq('id', 'EVENT_UUID')

// Should receive real-time update
```

---

## 15. Troubleshooting

### Issue: Migrations Fail
```bash
# Check migration status
supabase migration list

# Reset database (dev only)
supabase db reset

# Reapply migrations
supabase db push
```

### Issue: Edge Functions Not Working
```bash
# Check function logs
supabase functions logs register-event

# Redeploy function
supabase functions deploy register-event --no-verify-jwt
```

### Issue: RLS Blocking Queries
```sql
-- Temporarily disable RLS (dev only)
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'registrations';

-- Re-enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
```

### Issue: Slow Queries
```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM registrations
WHERE event_id = 'uuid';

-- Check missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

---

## 16. Scaling Considerations

### Current Capacity (Free Tier)
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

### Upgrade Path
1. **Pro Plan** ($25/month)
   - 8 GB database
   - 100 GB file storage
   - 250 GB bandwidth
   - No user limit

2. **Team Plan** ($599/month)
   - 100 GB database
   - 1 TB file storage
   - 1 TB bandwidth
   - Priority support

3. **Enterprise**
   - Custom resources
   - Dedicated support
   - SLA guarantees

### Optimization Tips
- Use connection pooling (PgBouncer)
- Enable read replicas
- Implement caching (Redis)
- Use CDN for static assets
- Optimize database queries
- Archive old data

---

## 17. Maintenance Schedule

### Daily
- Monitor error logs
- Check registration success rate
- Review slow queries

### Weekly
- Analyze database performance
- Review audit logs
- Check storage usage
- Update dependencies

### Monthly
- Database vacuum and analyze
- Archive old data
- Review and optimize indexes
- Security audit

### Quarterly
- Load testing
- Disaster recovery drill
- Performance benchmarking
- Feature usage analysis

---

## 18. Support Contacts

### Supabase Support
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Email: support@supabase.io

### Application Support
- Email: support@iiitg-sports.com
- GitHub: https://github.com/your-repo
- Docs: /BACKEND_ARCHITECTURE.md

---

## 19. Rollback Procedure

### Rollback Database Migration
```bash
# List migrations
supabase migration list

# Create rollback migration
supabase migration new rollback_feature_name

# Write rollback SQL
# DROP TABLE new_table;
# ALTER TABLE old_table DROP COLUMN new_column;

# Apply rollback
supabase db push
```

### Rollback Edge Function
```bash
# Deploy previous version
git checkout previous-commit
supabase functions deploy function-name
```

### Rollback Frontend
```bash
# Revert to previous deployment
vercel rollback
# or
netlify rollback
```

---

## 20. Success Metrics

### Key Performance Indicators (KPIs)
- Registration success rate: >95%
- Average registration time: <2 seconds
- API response time: <500ms
- Database query time: <100ms
- Uptime: >99.9%
- Concurrent users: 5000+
- Zero duplicate registrations
- Zero overbooking incidents

### Monitoring Dashboard
Create a dashboard to track:
- Total registrations (daily/weekly/monthly)
- Active users
- Event popularity
- Registration trends
- Error rates
- Performance metrics

---

## Conclusion

Your MULTI-SPORT EVENT REGISTRATION PLATFORM is now deployed and ready for production use!

For any issues or questions, refer to:
- BACKEND_ARCHITECTURE.md
- API_DOCUMENTATION.md
- Supabase documentation

**Happy deploying! 🚀**
