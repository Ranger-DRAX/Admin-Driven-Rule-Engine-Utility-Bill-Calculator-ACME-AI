import React, { useState } from 'react';
import { calculationService } from '../../services/calculation.service';
import type { CalculateBillRequest, CalculationResult } from '../../types';
import { colors, typography, spacing, borderRadius, shadows, components } from '../../styles/theme';

const BillCalculator: React.FC = () => {
  const [unitsConsumed, setUnitsConsumed] = useState<number>(0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData: CalculateBillRequest = {
        consumerType: 'residential',
        unitsConsumed: unitsConsumed,
      };
      const calculationResult = await calculationService.calculate(formData);
      setResult(calculationResult);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to calculate bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.surface,
      fontFamily: typography.fontFamily.sans
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.background,
        borderBottom: `1px solid ${colors.border}`,
        padding: `${spacing.md} 0`,
        boxShadow: shadows.sm
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${spacing.lg}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: typography.fontSize['2xl'], 
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              margin: 0
            }}>
              ACME Electricity
            </h1>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.gray[600],
              margin: `${spacing.xs} 0 0 0`
            }}>
              Bill Calculator
            </p>
          </div>
          <a
            href="/admin/login"
            style={{
              ...components.button.secondary,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[200];
              e.currentTarget.style.borderColor = colors.gray[400];
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
              e.currentTarget.style.borderColor = colors.gray[300];
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Admin Access
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: spacing['2xl'] }}>
        {/* Calculator Card */}
        <div style={{ 
          ...components.card,
          marginBottom: spacing.xl
        }}>
          <h2 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.gray[900],
            marginBottom: spacing.lg
          }}>
            Calculate Your Bill
          </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: spacing.lg }}>
            <label style={components.label}>
              Units Consumed (kWh)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              style={{
                ...components.input,
                fontSize: typography.fontSize.base
              }}
              value={unitsConsumed}
              onChange={(e) => setUnitsConsumed(parseFloat(e.target.value) || 0)}
              onFocus={(e) => e.currentTarget.style.borderColor = colors.primary[500]}
              onBlur={(e) => e.currentTarget.style.borderColor = colors.gray[300]}
              placeholder="Enter units consumed"
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: `1px solid #fecaca`,
              color: colors.error,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              marginBottom: spacing.lg,
              fontSize: typography.fontSize.sm
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...components.button.primary,
              width: '100%',
              padding: `${spacing.md} ${spacing.lg}`,
              fontSize: typography.fontSize.base,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary[700])}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary[600])}
          >
            {loading ? 'Calculating...' : 'Calculate Bill'}
          </button>
        </form>
        </div>

        {/* Results Card */}
        {result && (
          <div style={{ ...components.card }}>
            <h2 style={{ 
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              marginBottom: spacing.lg
            }}>
              Bill Summary
            </h2>

            {/* Consumption Info */}
            <div style={{
              backgroundColor: colors.primary[50],
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.lg,
              border: `1px solid ${colors.primary[200]}`
            }}>
              <div style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.primary[700],
                marginBottom: spacing.xs
              }}>
                Total Consumption
              </div>
              <div style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.primary[700]
              }}>
                {unitsConsumed} kWh
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ marginBottom: spacing.lg }}>
              {/* Subtotal */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${spacing.md} 0`,
                borderBottom: `1px solid ${colors.gray[200]}`
              }}>
                <span style={{ 
                  color: colors.gray[600],
                  fontSize: typography.fontSize.sm
                }}>
                  Base Charge ({unitsConsumed} kWh × ৳{Number(result.tierBreakdown[0]?.ratePerUnit || 0).toFixed(2)})
                </span>
                <span style={{ 
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.gray[900],
                  fontSize: typography.fontSize.base
                }}>
                  ৳{Number(result.baseAmount).toFixed(2)}
                </span>
              </div>

              {/* VAT */}
              {result.taxes.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${spacing.md} 0`,
                  borderBottom: `1px solid ${colors.gray[200]}`
                }}>
                  <span style={{ 
                    color: colors.gray[600],
                    fontSize: typography.fontSize.sm
                  }}>
                    {result.taxes[0].name} ({result.taxes[0].value}%)
                  </span>
                  <span style={{ 
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.gray[900],
                    fontSize: typography.fontSize.base
                  }}>
                    ৳{Number(result.totalTax).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Service Charge */}
              {result.surcharges.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${spacing.md} 0`,
                  borderBottom: `1px solid ${colors.gray[200]}`
                }}>
                  <span style={{ 
                    color: colors.gray[600],
                    fontSize: typography.fontSize.sm
                  }}>
                    {result.surcharges[0].name}
                  </span>
                  <span style={{ 
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.gray[900],
                    fontSize: typography.fontSize.base
                  }}>
                    ৳{Number(result.totalSurcharge).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${spacing.lg} 0`,
                marginTop: spacing.md
              }}>
                <span style={{ 
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.gray[900]
                }}>
                  Total Amount
                </span>
                <span style={{ 
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.primary[600]
                }}>
                  ৳{Number(result.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={async () => {
                try {
                  const pdfBlob = await calculationService.downloadPDF({
                    consumerType: 'residential',
                    unitsConsumed: unitsConsumed,
                  });
                  const url = window.URL.createObjectURL(pdfBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `bill_${Date.now()}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('Failed to download PDF:', err);
                }
              }}
              style={{
                ...components.button.primary,
                width: '100%',
                backgroundColor: colors.success,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.success}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Bill (PDF)
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.background,
        borderTop: `1px solid ${colors.border}`,
        padding: `${spacing.xl} 0`,
        marginTop: spacing['3xl'],
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: typography.fontSize.sm,
          color: colors.gray[600],
          margin: 0
        }}>
          © 2025 ACME Electricity Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default BillCalculator;
