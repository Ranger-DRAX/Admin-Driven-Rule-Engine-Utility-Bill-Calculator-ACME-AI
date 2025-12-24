-- ============================================
-- ACME AI Electricity Billing System
-- Database Schema Definition
-- PostgreSQL 14+
-- ============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS calculation_history CASCADE;
DROP TABLE IF EXISTS configs CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: admins
-- Description: Stores admin user credentials and roles
-- ============================================
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will store bcrypt hashed password
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_is_active ON admins(is_active);

-- ============================================
-- Table: configs
-- Description: Stores electricity rate configurations
-- ============================================
CREATE TABLE configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_name VARCHAR(100) NOT NULL,
    rate_type VARCHAR(50) NOT NULL CHECK (rate_type IN ('base_rate', 'tax', 'surcharge', 'tier_rate')),
    rate_value DECIMAL(10, 4) NOT NULL, -- Rate value (can be per unit or percentage)
    unit_type VARCHAR(50) CHECK (unit_type IN ('per_kwh', 'percentage', 'fixed')),
    consumer_type VARCHAR(50) CHECK (consumer_type IN ('residential', 'commercial', 'industrial', 'all')),
    tier_min_units INTEGER DEFAULT 0, -- Minimum units for tiered pricing
    tier_max_units INTEGER, -- Maximum units for tiered pricing (NULL for unlimited)
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_configs_rate_type ON configs(rate_type);
CREATE INDEX idx_configs_consumer_type ON configs(consumer_type);
CREATE INDEX idx_configs_is_active ON configs(is_active);
CREATE INDEX idx_configs_effective_dates ON configs(effective_from, effective_to);

-- ============================================
-- Table: calculation_history
-- Description: Stores history of all bill calculations
-- ============================================
CREATE TABLE calculation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_name VARCHAR(100),
    consumer_type VARCHAR(50) NOT NULL CHECK (consumer_type IN ('residential', 'commercial', 'industrial')),
    units_consumed INTEGER NOT NULL CHECK (units_consumed >= 0),
    
    -- Breakdown of charges
    base_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    surcharge_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Detailed breakdown as JSON
    calculation_breakdown JSONB, -- Stores detailed tier-wise breakdown
    
    -- Metadata
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    billing_month VARCHAR(7), -- Format: YYYY-MM
    ip_address VARCHAR(45), -- IPv4 or IPv6
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reporting and analytics
CREATE INDEX idx_calculation_history_consumer_type ON calculation_history(consumer_type);
CREATE INDEX idx_calculation_history_calculation_date ON calculation_history(calculation_date);
CREATE INDEX idx_calculation_history_billing_month ON calculation_history(billing_month);
CREATE INDEX idx_calculation_history_total_amount ON calculation_history(total_amount);

-- JSONB index for querying breakdown
CREATE INDEX idx_calculation_breakdown ON calculation_history USING GIN (calculation_breakdown);

-- ============================================
-- Trigger: Update updated_at timestamp automatically
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to admins table
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to configs table
CREATE TRIGGER update_configs_updated_at
    BEFORE UPDATE ON configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views for Analytics
-- ============================================

-- View: Monthly calculation summary
CREATE OR REPLACE VIEW monthly_calculation_summary AS
SELECT 
    billing_month,
    consumer_type,
    COUNT(*) as total_calculations,
    SUM(units_consumed) as total_units,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_bill_amount,
    MAX(total_amount) as max_bill_amount,
    MIN(total_amount) as min_bill_amount
FROM calculation_history
WHERE billing_month IS NOT NULL
GROUP BY billing_month, consumer_type
ORDER BY billing_month DESC, consumer_type;

-- View: Active rate configurations
CREATE OR REPLACE VIEW active_configs AS
SELECT 
    id,
    rate_name,
    rate_type,
    rate_value,
    unit_type,
    consumer_type,
    tier_min_units,
    tier_max_units,
    description,
    effective_from,
    effective_to
FROM configs
WHERE is_active = true
  AND effective_from <= CURRENT_DATE
  AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
ORDER BY consumer_type, tier_min_units;

-- ============================================
-- Comments for Documentation
-- ============================================
COMMENT ON TABLE admins IS 'Stores admin user accounts for system management';
COMMENT ON TABLE configs IS 'Stores electricity rate configurations and pricing tiers';
COMMENT ON TABLE calculation_history IS 'Maintains audit trail of all bill calculations';

COMMENT ON COLUMN configs.rate_type IS 'Type of rate: base_rate, tax, surcharge, tier_rate';
COMMENT ON COLUMN configs.unit_type IS 'Unit of measurement: per_kwh, percentage, fixed';
COMMENT ON COLUMN configs.consumer_type IS 'Applicable consumer type: residential, commercial, industrial, all';
COMMENT ON COLUMN calculation_history.calculation_breakdown IS 'JSON object containing detailed tier-wise calculation breakdown';

-- ============================================
-- Grant Permissions (Optional - adjust as needed)
-- ============================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO acme_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO acme_app_user;

-- ============================================
-- Schema Version Control
-- ============================================
CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial schema with admins, configs, and calculation_history tables');

-- ============================================
-- End of Schema Definition
-- ============================================
