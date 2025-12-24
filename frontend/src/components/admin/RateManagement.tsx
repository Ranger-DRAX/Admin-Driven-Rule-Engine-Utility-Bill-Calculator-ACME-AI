import React, { useEffect, useState } from 'react';
import { configService } from '../../services/config.service';
import type { Config } from '../../types';
import { colors, typography, spacing, borderRadius, components } from '../../styles/theme';

/**
 * Admin component for managing electricity billing rates
 * Allows updating rate per kWh, VAT percentage, and fixed service charge
 */
const RateManagement: React.FC = () => {
  const [currentRate, setCurrentRate] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ratePerUnit, setRatePerUnit] = useState<number>(0);
  const [vatPercentage, setVatPercentage] = useState<number>(0);
  const [fixedServiceCharge, setFixedServiceCharge] = useState<number>(0);
  const [errors, setErrors] = useState<{ vat?: string }>({});

  useEffect(() => {
    fetchCurrentRate();
  }, []);

  const fetchCurrentRate = async () => {
    try {
      const data = await configService.getAll();
      if (data.length > 0) {
        setCurrentRate(data[0]);
        const rate = data[0].rateValue ?? data[0].ratePerUnit ?? 0;
        setRatePerUnit(rate);
        setVatPercentage(data[0].vatPercentage ?? 0);
        setFixedServiceCharge(data[0].fixedServiceCharge ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch rate:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validate VAT percentage (0-100)
    if (vatPercentage < 0 || vatPercentage > 100) {
      setErrors({ vat: 'VAT must be between 0 and 100%' });
      return;
    }

    setLoading(true);

    try {
      const rateData = {
        rateName: 'Standard Rate',
        rateType: 'tier_rate' as const,
        rateValue: ratePerUnit,
        unitType: 'per_kwh' as const,
        consumerType: 'residential' as const,
        tierMinUnits: 0,
        tierMaxUnits: null,
        vatPercentage: vatPercentage,
        fixedServiceCharge: fixedServiceCharge,
        isActive: true,
      };

      if (currentRate) {
        await configService.update(String(currentRate.id), rateData);
      } else {
        await configService.create(rateData);
      }
      
      await fetchCurrentRate();
      setEditing(false);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save rate:', error);
      setErrors({ vat: 'Failed to save configuration. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setSuccess(false);
    if (currentRate) {
      const rate = currentRate.rateValue ?? currentRate.ratePerUnit ?? 0;
      setRatePerUnit(rate);
      setVatPercentage(currentRate.vatPercentage ?? 0);
      setFixedServiceCharge(currentRate.fixedServiceCharge ?? 0);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: colors.surface,
      fontFamily: typography.fontFamily.sans,
      padding: spacing['2xl']
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <h1 style={{ 
            fontSize: typography.fontSize['2xl'], 
            fontWeight: typography.fontWeight.bold,
            color: colors.gray[900],
            marginBottom: spacing.xs
          }}>
            Pricing Configuration
          </h1>
          <p style={{
            fontSize: typography.fontSize.sm,
            color: colors.gray[600]
          }}>
            Manage electricity rates, VAT, and service charges
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            ...components.card,
            backgroundColor: '#f0fdf4',
            border: `1px solid #86efac`,
            marginBottom: spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span style={{ color: '#15803d', fontWeight: typography.fontWeight.medium }}>
              Configuration updated successfully!
            </span>
          </div>
        )}

        {/* Main Card */}
        <div style={components.card}>
          {/* Display Mode */}
          {!editing && currentRate && (
            <>
              {/* Rate Highlight */}
              <div style={{
                backgroundColor: colors.primary[50],
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.lg,
                border: `2px solid ${colors.primary[200]}`,
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: colors.primary[700],
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing.sm
                }}>
                  Current Rate per kWh
                </div>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: typography.fontWeight.bold, 
                  color: colors.primary[700]
                }}>
                  ৳{((currentRate.rateValue ?? currentRate.ratePerUnit ?? 0)).toFixed(3)}
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  color: colors.primary[600],
                  marginTop: spacing.xs
                }}>
                  per kilowatt-hour
                </div>
              </div>

              {/* Additional Charges Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: spacing.lg,
                marginBottom: spacing.xl
              }}>
                {/* VAT Card */}
                <div style={{
                  padding: spacing.lg,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.md
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gray[600]} strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    <span style={{ 
                      fontSize: typography.fontSize.sm, 
                      color: colors.gray[600],
                      fontWeight: typography.fontWeight.medium
                    }}>
                      VAT
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize['2xl'], 
                    fontWeight: typography.fontWeight.bold, 
                    color: colors.gray[900]
                  }}>
                    {currentRate.vatPercentage}%
                  </div>
                </div>

                {/* Service Charge Card */}
                <div style={{
                  padding: spacing.lg,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.md
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gray[600]} strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                      <path d="M12 18V6"/>
                    </svg>
                    <span style={{ 
                      fontSize: typography.fontSize.sm, 
                      color: colors.gray[600],
                      fontWeight: typography.fontWeight.medium
                    }}>
                      Service Charge
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize['2xl'], 
                    fontWeight: typography.fontWeight.bold, 
                    color: colors.gray[900]
                  }}>
                    ৳{currentRate.fixedServiceCharge.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={() => setEditing(true)}
                style={{
                  ...components.button.primary,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primary[700]}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary[600]}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Update Configuration
              </button>
            </>
          )}

          {/* Edit Mode */}
          {editing && (
            <form onSubmit={handleSubmit}>
              <h2 style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.gray[900],
                marginBottom: spacing.lg
              }}>
                {currentRate ? 'Update Pricing' : 'Set Initial Pricing'}
              </h2>

              {/* Rate Input */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={components.label}>
                  Rate per kWh (৳)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.001"
                  style={components.input}
                  value={ratePerUnit}
                  onChange={(e) => setRatePerUnit(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.primary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.gray[300]}
                  placeholder="e.g., 0.120"
                />
                <p style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.gray[500],
                  marginTop: spacing.xs
                }}>
                  Base rate charged per kilowatt-hour consumed
                </p>
              </div>

              {/* VAT Input */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={components.label}>
                  VAT Percentage (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  style={{
                    ...components.input,
                    borderColor: errors.vat ? colors.error : colors.gray[300]
                  }}
                  value={vatPercentage}
                  onChange={(e) => {
                    setVatPercentage(parseFloat(e.target.value) || 0);
                    setErrors({});
                  }}
                  onFocus={(e) => !errors.vat && (e.currentTarget.style.borderColor = colors.primary[500])}
                  onBlur={(e) => !errors.vat && (e.currentTarget.style.borderColor = colors.gray[300])}
                  placeholder="e.g., 15"
                />
                {errors.vat && (
                  <p style={{ 
                    color: colors.error, 
                    fontSize: typography.fontSize.sm, 
                    marginTop: spacing.xs 
                  }}>
                    {errors.vat}
                  </p>
                )}
              </div>

              {/* Service Charge Input */}
              <div style={{ marginBottom: spacing.xl }}>
                <label style={components.label}>
                  Fixed Service Charge (৳)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  style={components.input}
                  value={fixedServiceCharge}
                  onChange={(e) => setFixedServiceCharge(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.primary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.gray[300]}
                  placeholder="e.g., 5.00"
                />
                <p style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.gray[500],
                  marginTop: spacing.xs
                }}>
                  Fixed monthly charge added to all bills
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: spacing.md }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...components.button.primary,
                    flex: 1,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary[700])}
                  onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary[600])}
                >
                  {loading ? 'Saving...' : 'Save Configuration'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    ...components.button.secondary,
                    flex: 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.gray[200])}
                  onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.gray[100])}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* No Rate Set */}
          {!currentRate && !editing && (
            <div style={{ 
              textAlign: 'center', 
              padding: `${spacing['2xl']} ${spacing.lg}`,
              color: colors.gray[600]
            }}>
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={colors.gray[400]} 
                strokeWidth="1.5"
                style={{ margin: `0 auto ${spacing.lg}` }}
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
              <p style={{ 
                marginBottom: spacing.lg,
                fontSize: typography.fontSize.base,
                color: colors.gray[700],
                fontWeight: typography.fontWeight.medium
              }}>
                No pricing configuration found
              </p>
              <p style={{ marginBottom: spacing.xl, fontSize: typography.fontSize.sm }}>
                Set up your initial rates to start billing
              </p>
              <button
                onClick={() => setEditing(true)}
                style={{
                  ...components.button.primary
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primary[700]}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary[600]}
              >
                Set Initial Configuration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateManagement;
