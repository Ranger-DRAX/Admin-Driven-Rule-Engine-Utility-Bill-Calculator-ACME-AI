# Database Documentation

## Overview
PostgreSQL database schema for ACME AI Electricity Billing System.

## Tables

### 1. `admins`
Stores admin user credentials and authentication information.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `username` (VARCHAR) - Login username (unique)
- `email` (VARCHAR) - Email address (unique)
- `password` (VARCHAR) - Bcrypt hashed password
- `full_name` (VARCHAR) - Admin's full name
- `role` (VARCHAR) - Role: 'admin' or 'super_admin'
- `is_active` (BOOLEAN) - Account status
- `last_login` (TIMESTAMP) - Last login timestamp
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

### 2. `configs`
Stores electricity rate configurations and pricing tiers.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `rate_name` (VARCHAR) - Descriptive name
- `rate_type` (VARCHAR) - 'base_rate', 'tax', 'surcharge', 'tier_rate'
- `rate_value` (DECIMAL) - Rate value
- `unit_type` (VARCHAR) - 'per_kwh', 'percentage', 'fixed'
- `consumer_type` (VARCHAR) - 'residential', 'commercial', 'industrial', 'all'
- `tier_min_units` (INTEGER) - Minimum units for tier
- `tier_max_units` (INTEGER) - Maximum units for tier (NULL = unlimited)
- `description` (TEXT) - Detailed description
- `is_active` (BOOLEAN) - Active status
- `effective_from` (DATE) - Effective start date
- `effective_to` (DATE) - Effective end date (NULL = no expiry)
- `created_by` (UUID, FK) - Admin who created this config
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

### 3. `calculation_history`
Maintains audit trail of all bill calculations.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `consumer_name` (VARCHAR) - Consumer name (optional)
- `consumer_type` (VARCHAR) - 'residential', 'commercial', 'industrial'
- `units_consumed` (INTEGER) - Total units consumed
- `base_amount` (DECIMAL) - Base charge amount
- `tax_amount` (DECIMAL) - Total tax amount
- `surcharge_amount` (DECIMAL) - Total surcharge amount
- `total_amount` (DECIMAL) - Final bill amount
- `calculation_breakdown` (JSONB) - Detailed breakdown in JSON format
- `calculation_date` (TIMESTAMP) - When calculation was performed
- `billing_month` (VARCHAR) - Billing month in YYYY-MM format
- `ip_address` (VARCHAR) - Client IP address
- `user_agent` (TEXT) - Client user agent
- `created_at` (TIMESTAMP) - Record creation time

## Views

### `active_configs`
Shows all currently active rate configurations.

### `monthly_calculation_summary`
Aggregated monthly statistics by consumer type:
- Total calculations
- Total units consumed
- Total revenue
- Average, max, and min bill amounts

## Setup Instructions

### Using Supabase (Recommended - Cloud Hosted)

**1. Create Supabase Account & Project**
- Visit https://supabase.com/
- Sign up/login and click "New Project"
- Choose a name, database password, and region
- Wait ~2 minutes for provisioning

**2. Run Schema & Seed Files**
```
1. Open Supabase Dashboard
2. Navigate to: SQL Editor (left sidebar)
3. Click "New Query"
4. Copy-paste entire contents of database/schema.sql
5. Click "Run" button (or press Ctrl+Enter)
6. Wait for "Success" message
7. Click "New Query" again
8. Copy-paste entire contents of database/seed.sql
9. Click "Run"
```

**3. Get Connection Details**
```
Go to: Settings → Database → Connection String
Copy the "URI" format connection string

Example:
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

**4. Test Connection**
In Supabase SQL Editor, run:
```sql
SELECT * FROM admins;
SELECT * FROM configs WHERE is_active = true;
SELECT COUNT(*) FROM calculation_history;
```

You should see:
- 2 admin users
- Multiple rate configurations
- 3 sample calculations

### Alternative: Local PostgreSQL (Optional)
### Alternative: Local PostgreSQL (Optional)

If you prefer local setup:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE acme_billing;

# Connect to the database
\c acme_billing

# Run schema
\i database/schema.sql

# Run seed data
\i database/seed.sql
```

### 3. Verify Installation
```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check data
SELECT * FROM admins;
SELECT * FROM configs WHERE is_active = true;
SELECT * FROM calculation_history LIMIT 5;

-- Check views
SELECT * FROM active_configs;
SELECT * FROM monthly_calculation_summary;
```

## Default Credentials

**Username:** `admin`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately in production!

## Migrations

Migration files are located in `database/migrations/` directory:
- `001_initial_schema.sql` - Initial database schema
- `002_add_calculation_history.sql` - Calculation history table
- `003_add_admin_roles.sql` - Admin roles and permissions

To apply migrations:
```bash
psql -U postgres -d acme_billing -f database/migrations/001_initial_schema.sql
```

## Backup & Restore

### Backup
```bash
# Full database backup
pg_dump -U postgres -d acme_billing > backup.sql

# Schema only
pg_dump -U postgres -d acme_billing -s > schema_backup.sql

# Data only
pg_dump -U postgres -d acme_billing -a > data_backup.sql
```

### Restore
```bash
psql -U postgres -d acme_billing < backup.sql
```

## Rate Configuration Examples

### Residential Tiered Pricing
- 0-100 units: Rs. 5.50/unit
- 101-200 units: Rs. 7.00/unit
- 201-500 units: Rs. 8.50/unit
- 501+ units: Rs. 10.00/unit

### Commercial Tiered Pricing
- 0-500 units: Rs. 8.00/unit
- 501-1000 units: Rs. 9.50/unit
- 1001+ units: Rs. 11.00/unit

### Industrial Flat Rate
- All units: Rs. 7.50/unit
- Fixed demand charge: Rs. 500/month

### Common Charges (All Consumer Types)
- Electricity Duty: 6%
- GST: 18%
- Meter Rent: Rs. 50/month
- Fuel Adjustment: Rs. 0.50/unit

## Performance Optimization

### Indexes
- Username and email lookup indexes on `admins`
- Rate type and consumer type indexes on `configs`
- Date range indexes for efficient queries
- JSONB index on `calculation_breakdown` for JSON queries

### Query Tips
```sql
-- Efficient date range query
SELECT * FROM calculation_history 
WHERE calculation_date BETWEEN '2025-01-01' AND '2025-01-31';

-- Query JSON breakdown
SELECT id, consumer_name, 
       calculation_breakdown->'taxes'->'gst' as gst_amount
FROM calculation_history
WHERE consumer_type = 'residential';
```

## Troubleshooting

### Connection Issues (Supabase)
1. **Check project status** - Ensure project is not paused (free tier pauses after inactivity)
2. **Verify password** - Use the password from Supabase project settings
3. **Check IP whitelist** - Supabase allows all IPs by default, but verify in settings
4. **Connection string format**:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### SQL Execution Issues
- **UUID Extension Error**: If you see UUID errors, ensure the first line `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` runs successfully
- **Permission Denied**: Make sure you're using the `postgres` user credentials from Supabase
- **Table Already Exists**: If re-running, the DROP TABLE statements at the beginning will handle this

### Local PostgreSQL Connection Issues
### Local PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running (if using local setup)
# On Windows:
Get-Service postgresql*

# Check logs (Docker)
docker logs acme_postgres

# Restart container (Docker)
docker-compose restart postgres
```

### Permission Issues
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE acme_billing TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

## Support

For database-related issues, check:
1. PostgreSQL logs: `docker logs acme_postgres`
2. Connection settings in backend `.env` file
3. Firewall settings for port 5432

---

**Last Updated:** December 23, 2025
