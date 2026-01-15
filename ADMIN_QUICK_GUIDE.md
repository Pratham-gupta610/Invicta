# Admin Quick Reference Guide
## Registration Management & Export System

---

## 🚀 Quick Start

### Access the Dashboard
1. Login with admin credentials
2. Navigate to **Admin Dashboard**
3. Click **Advanced Filters** tab

---

## 🔍 Filtering Registrations

### By Sport
```
1. Click "Select Sport" dropdown
2. Choose from:
   - All Sports (default)
   - Cricket
   - Football (9 vs 9)
   - Basketball
   - Table Tennis
   - Badminton
   - Volleyball
   - Athletics
   - Chess
3. Table updates automatically
```

### By Search
```
1. Type in search box
2. Search by:
   - Email address
   - Username
3. Results update in real-time (300ms delay)
```

---

## 📊 Sorting Data

### Available Sorts
- **Name:** Click "Name" header (A-Z or Z-A)
- **Sport:** Click "Sport" header (A-Z or Z-A)
- **Date:** Click "Date" header (Newest or Oldest)

### How to Sort
```
1. Click column header
2. Arrow icon shows sort direction
3. Click again to reverse
```

---

## 📥 Exporting Data

### CSV Export (Recommended for Large Datasets)
```
1. Apply filters (optional)
2. Click "Export CSV" button
3. Wait for download
4. File saves to Downloads folder
```

**File Format:** `registrations_{Sport}_{Date}.csv`

**Example:** `registrations_Cricket_2026-01-11.csv`

### Excel Export
```
1. Apply filters (optional)
2. Click "Export Excel" button
3. Wait for download
4. Open in Microsoft Excel or Google Sheets
```

**File Format:** `registrations_{Sport}_{Date}.xls`

**Example:** `registrations_Football_2026-01-11.xls`

---

## 📋 Export Columns

All exports include:
1. User ID
2. Username
3. Email
4. Phone
5. Sport
6. Event
7. Team (if applicable)
8. Registration Type (Individual/Team)
9. Status
10. Registration Date

---

## 📈 Sport Statistics

### View Counts
- Displayed as cards above filters
- Shows registrations per sport
- Updates when filters change

### Example
```
┌─────────────┐
│     30      │
│   Cricket   │
└─────────────┘
```

---

## 🔄 Pagination

### Navigate Pages
- **Previous:** Go to previous page
- **Next:** Go to next page
- **Page X of Y:** Current page indicator

### Records Per Page
- Default: 50 records
- Adjustable in code if needed

---

## 🎯 Common Tasks

### Task 1: Export All Cricket Registrations
```
1. Select "Cricket" from sport dropdown
2. Wait for table to load
3. Click "Export CSV"
4. Download starts automatically
```

### Task 2: Find User by Email
```
1. Type email in search box
2. View results in table
3. Export if needed
```

### Task 3: View Latest Registrations
```
1. Select "All Sports"
2. Click "Date" header (ensure newest first)
3. View top 50 recent registrations
```

### Task 4: Export All Registrations
```
1. Select "All Sports"
2. Clear search box
3. Click "Export CSV"
4. Wait for download (may take 10-20s for large datasets)
```

---

## ⚠️ Important Notes

### Performance
- ✅ Supports 50,000+ records
- ✅ CSV faster than Excel for large datasets
- ✅ Exports may take 10-20 seconds for 50K+ records
- ✅ Don't close browser during export

### Security
- ✅ Only admins can access
- ✅ All exports are logged
- ✅ Data is encrypted in transit
- ✅ No data stored on server

### Best Practices
- ✅ Use CSV for large exports (>10,000 records)
- ✅ Filter before exporting to reduce file size
- ✅ Export regularly for backups
- ✅ Verify data after export

---

## 🐛 Troubleshooting

### Export Button Disabled
**Cause:** No data loaded yet
**Solution:** Wait for table to load first

### No Results Found
**Cause:** Filters too restrictive
**Solution:** Try "All Sports" or clear search

### Export Takes Too Long
**Cause:** Large dataset
**Solution:** Use CSV format, be patient (up to 20s)

### Search Not Working
**Cause:** Typing too fast
**Solution:** Wait 300ms after typing

### Unauthorized Error
**Cause:** Not logged in as admin
**Solution:** Login with admin account

---

## 📞 Support

### Need Help?
- Check ADMIN_FEATURES.md for detailed documentation
- Review API_DOCUMENTATION.md for technical details
- Contact: support@iiitg-sports.com

### Report Issues
- Include: Sport filter, search query, error message
- Screenshot if possible
- Browser and OS version

---

## 🔐 Security Reminders

### Do's
✅ Logout after use
✅ Keep credentials secure
✅ Export only when needed
✅ Delete old exports from Downloads

### Don'ts
❌ Share admin credentials
❌ Export to public folders
❌ Leave browser unattended
❌ Share export files publicly

---

## 📊 Sample Export

### CSV Format
```csv
User ID,Username,Email,Phone,Sport,Event,Team,Registration Type,Status,Registration Date
a1b2c3d4,johndoe,john@example.com,+1234567890,Cricket,Cricket Championship,Team Alpha,team,confirmed,2026-01-11 10:30:00
b2c3d4e5,janedoe,jane@example.com,+1234567891,Cricket,Cricket Championship,Team Beta,team,confirmed,2026-01-11 11:00:00
```

### Excel Format
Opens directly in Excel with proper columns and formatting.

---

## 🎓 Training Checklist

### New Admin Onboarding
- [ ] Login to admin dashboard
- [ ] Navigate to Advanced Filters tab
- [ ] Filter by each sport
- [ ] Search for a user
- [ ] Sort by name, sport, date
- [ ] Export CSV
- [ ] Export Excel
- [ ] View sport statistics
- [ ] Navigate pagination
- [ ] Understand security practices

---

## 📅 Regular Tasks

### Daily
- [ ] Check registration counts
- [ ] Review recent registrations
- [ ] Export daily backup (optional)

### Weekly
- [ ] Export all registrations
- [ ] Review sport distribution
- [ ] Check for anomalies

### Monthly
- [ ] Archive old exports
- [ ] Review audit logs
- [ ] Update documentation

---

## 🎯 Performance Benchmarks

| Records | Load Time | Export Time |
|---------|-----------|-------------|
| 100 | <1s | <1s |
| 1,000 | <2s | <2s |
| 10,000 | <3s | <5s |
| 50,000 | <5s | <15s |

---

## 📄 License

© 2026 IIITG Sports Carnival. All rights reserved.

---

**Last Updated:** 2026-01-11
**Version:** 1.0.0
