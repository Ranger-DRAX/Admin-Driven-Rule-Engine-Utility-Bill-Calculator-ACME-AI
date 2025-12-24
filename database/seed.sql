-- ============================================
-- ACME AI Electricity Billing System
-- Seed Data for Initial Setup
-- ============================================

-- Note: Make sure schema.sql has been executed first

-- ============================================
-- Seed: Default Admin User
-- ============================================
-- Password: admin123 (bcrypt hash)
-- IMPORTANT: Change this password immediately after first login in production!
INSERT INTO admins (id, username, email, password, full_name, role, is_active) VALUES
(
    uuid_generate_v4(),
    'admin',
    'admin@acme.com',
    '$2b$10$rZV5T3qh3qp5YJKGxP5YEO8W7jX7vH1K8vXxYqH5k5k5k5k5k5k5k', -- Hash for 'admin123'
    'System Administrator',
    'super_admin',
    true
),
(
    uuid_generate_v4(),
    'manager',
    'manager@acme.com',
    '$2b$10$rZV5T3qh3qp5YJKGxP5YEO8W7jX7vH1K8vXxYqH5k5k5k5k5k5k5k', -- Hash for 'admin123'
    'Billing Manager',
    'admin',
    true
);

-- ============================================
-- Seed: Electricity Rate Configurations
-- ============================================

-- Residential Rates (Tiered Pricing)
-- Tier 1: 0-100 units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Residential Tier 1', 'tier_rate', 5.50, 'per_kwh', 'residential', 0, 100, 'First 100 units at Rs. 5.50 per unit', true);

-- Tier 2: 101-200 units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Residential Tier 2', 'tier_rate', 7.00, 'per_kwh', 'residential', 101, 200, '101-200 units at Rs. 7.00 per unit', true);

-- Tier 3: 201-500 units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Residential Tier 3', 'tier_rate', 8.50, 'per_kwh', 'residential', 201, 500, '201-500 units at Rs. 8.50 per unit', true);

-- Tier 4: 501+ units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Residential Tier 4', 'tier_rate', 10.00, 'per_kwh', 'residential', 501, NULL, 'Above 500 units at Rs. 10.00 per unit', true);

-- Commercial Rates (Tiered Pricing)
-- Tier 1: 0-500 units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Commercial Tier 1', 'tier_rate', 8.00, 'per_kwh', 'commercial', 0, 500, 'First 500 units at Rs. 8.00 per unit', true);

-- Tier 2: 501-1000 units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Commercial Tier 2', 'tier_rate', 9.50, 'per_kwh', 'commercial', 501, 1000, '501-1000 units at Rs. 9.50 per unit', true);

-- Tier 3: 1001+ units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Commercial Tier 3', 'tier_rate', 11.00, 'per_kwh', 'commercial', 1001, NULL, 'Above 1000 units at Rs. 11.00 per unit', true);

-- Industrial Rates (Flat Rate + Demand Charge)
-- Base rate for all units
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Industrial Base Rate', 'base_rate', 7.50, 'per_kwh', 'industrial', 0, NULL, 'Flat rate of Rs. 7.50 per unit for all consumption', true);

-- Fixed demand charge
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, tier_min_units, tier_max_units, description, is_active) VALUES
('Industrial Demand Charge', 'surcharge', 500.00, 'fixed', 'industrial', 0, NULL, 'Fixed monthly demand charge of Rs. 500', true);

-- ============================================
-- Seed: Taxes and Surcharges (Applicable to All)
-- ============================================

-- Electricity Duty (Tax)
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, description, is_active) VALUES
('Electricity Duty', 'tax', 6.00, 'percentage', 'all', 'Government electricity duty at 6% of base amount', true);

-- GST (Tax)
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, description, is_active) VALUES
('GST', 'tax', 18.00, 'percentage', 'all', 'Goods and Services Tax at 18% of base amount', true);

-- Meter Rent (Fixed Charge)
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, description, is_active) VALUES
('Meter Rent', 'surcharge', 50.00, 'fixed', 'all', 'Monthly meter rent of Rs. 50', true);

-- Fuel Adjustment Charge
INSERT INTO configs (rate_name, rate_type, rate_value, unit_type, consumer_type, description, is_active) VALUES
('Fuel Adjustment Charge', 'surcharge', 0.50, 'per_kwh', 'all', 'Fuel adjustment charge at Rs. 0.50 per unit', true);

-- ============================================
-- Seed: Sample Calculation History
-- ============================================

-- Sample calculation 1: Residential consumer
INSERT INTO calculation_history (
    consumer_name, 
    consumer_type, 
    units_consumed, 
    base_amount, 
    tax_amount, 
    surcharge_amount, 
    total_amount, 
    calculation_breakdown,
    billing_month
) VALUES (
    'John Doe',
    'residential',
    250,
    1875.00,
    450.00,
    175.00,
    2500.00,
    '{"tier_1": {"units": 100, "rate": 5.50, "amount": 550.00}, "tier_2": {"units": 100, "rate": 7.00, "amount": 700.00}, "tier_3": {"units": 50, "rate": 8.50, "amount": 425.00}, "taxes": {"electricity_duty": 112.50, "gst": 337.50}, "surcharges": {"meter_rent": 50.00, "fuel_adjustment": 125.00}}',
    TO_CHAR(CURRENT_DATE, 'YYYY-MM')
);

-- Sample calculation 2: Commercial consumer
INSERT INTO calculation_history (
    consumer_name, 
    consumer_type, 
    units_consumed, 
    base_amount, 
    tax_amount, 
    surcharge_amount, 
    total_amount, 
    calculation_breakdown,
    billing_month
) VALUES (
    'ABC Store',
    'commercial',
    750,
    6625.00,
    1590.00,
    425.00,
    8640.00,
    '{"tier_1": {"units": 500, "rate": 8.00, "amount": 4000.00}, "tier_2": {"units": 250, "rate": 9.50, "amount": 2625.00}, "taxes": {"electricity_duty": 397.50, "gst": 1192.50}, "surcharges": {"meter_rent": 50.00, "fuel_adjustment": 375.00}}',
    TO_CHAR(CURRENT_DATE, 'YYYY-MM')
);

-- Sample calculation 3: Industrial consumer
INSERT INTO calculation_history (
    consumer_name, 
    consumer_type, 
    units_consumed, 
    base_amount, 
    tax_amount, 
    surcharge_amount, 
    total_amount, 
    calculation_breakdown,
    billing_month
) VALUES (
    'XYZ Manufacturing',
    'industrial',
    5000,
    37500.00,
    9000.00,
    3000.00,
    49500.00,
    '{"base": {"units": 5000, "rate": 7.50, "amount": 37500.00}, "taxes": {"electricity_duty": 2250.00, "gst": 6750.00}, "surcharges": {"meter_rent": 50.00, "demand_charge": 500.00, "fuel_adjustment": 2500.00}}',
    TO_CHAR(CURRENT_DATE, 'YYYY-MM')
);

-- ============================================
-- Verification Queries (Comment out in production)
-- ============================================

-- Uncomment to verify seeded data
-- SELECT 'Admins Count:' as info, COUNT(*) as count FROM admins;
-- SELECT 'Configs Count:' as info, COUNT(*) as count FROM configs;
-- SELECT 'Calculation History Count:' as info, COUNT(*) as count FROM calculation_history;

-- SELECT * FROM active_configs ORDER BY consumer_type, tier_min_units;
-- SELECT * FROM monthly_calculation_summary;

-- ============================================
-- End of Seed Data
-- ============================================

-- Log seed completion
INSERT INTO schema_version (version, description) 
VALUES ('1.0.0-seed', 'Initial seed data with default admin, rates, and sample calculations')
ON CONFLICT (version) DO NOTHING;
