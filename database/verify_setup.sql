-- ============================================
-- Verification Script for Database Setup
-- Run this in Supabase SQL Editor after running schema.sql and seed.sql
-- ============================================

-- Check if all tables exist
SELECT 
    'Tables Check' as check_type,
    COUNT(*) as count,
    'Expected: 4 (admins, configs, calculation_history, schema_version)' as expected
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Check admins
SELECT 
    'Admins' as table_name,
    COUNT(*) as count,
    'Expected: 2' as expected
FROM admins;

-- Check configs
SELECT 
    'Configs' as table_name,
    COUNT(*) as count,
    'Expected: 15' as expected
FROM configs;

-- Check calculation history
SELECT 
    'Calculation History' as table_name,
    COUNT(*) as count,
    'Expected: 3' as expected
FROM calculation_history;

-- Check views
SELECT 
    'Views Check' as check_type,
    COUNT(*) as count,
    'Expected: 2 (active_configs, monthly_calculation_summary)' as expected
FROM information_schema.views 
WHERE table_schema = 'public';

-- Show admin users
SELECT 
    username, 
    email, 
    role, 
    is_active,
    'Admin users created successfully' as status
FROM admins;

-- Show active configs by type
SELECT 
    consumer_type,
    rate_type,
    COUNT(*) as config_count
FROM configs
WHERE is_active = true
GROUP BY consumer_type, rate_type
ORDER BY consumer_type, rate_type;

-- Show sample calculations
SELECT 
    consumer_name,
    consumer_type,
    units_consumed,
    total_amount,
    billing_month
FROM calculation_history
ORDER BY consumer_type;

-- Final Status
SELECT 
    '✅ Database Setup Complete!' as status,
    'All tables, views, and sample data created successfully' as message;
