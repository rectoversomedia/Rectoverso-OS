# ⚠️ INSECURE SCHEMA FILES

## DO NOT USE THESE FILES IN PRODUCTION

These schema files contain **PUBLIC ACCESS** Row Level Security (RLS) policies that expose ALL data without authentication.

### Files in this folder:
- `schema-setup.sql` - Initial schema with public RLS
- `migrations/20260709000000_initial_schema.sql` - Migration with public RLS

### Why are they here?
These files were moved here to prevent accidental use in production. They may be useful for:
- Local development demos
- Testing environments
- Understanding schema evolution

### Production Schema
Use `schema-v2.sql` for production - it has proper RLS policies that require authentication.

### If you already ran these...
If you accidentally ran these schemas in production:
1. **IMMEDIATELY rotate your database credentials**
2. Review all RLS policies on all tables
3. Consider dropping and recreating the database
4. Enable `ssl_enforce` on your Supabase project

### Current RLS Policy (BAD):
```sql
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);
```

### Expected RLS Policy (GOOD):
```sql
CREATE POLICY "Authenticated users can view users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');
```
