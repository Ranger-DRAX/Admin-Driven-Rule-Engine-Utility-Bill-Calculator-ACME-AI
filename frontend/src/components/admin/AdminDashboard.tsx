import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors, typography, spacing, borderRadius, shadows, components } from '../../styles/theme';

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
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
        boxShadow: shadows.sm
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing.lg} ${spacing.xl}`,
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
              Admin Dashboard
            </h1>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.gray[600],
              margin: `${spacing.xs} 0 0 0`
            }}>
              Welcome back, {admin?.fullName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              ...components.button.danger,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.error}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: spacing['2xl']
      }}>
        {/* Dashboard Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: spacing.xl
        }}>
          <Link
            to="/admin/rates"
            style={{
              ...components.card,
              textDecoration: 'none',
              display: 'block',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = shadows.lg;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shadows.md;
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.md,
              marginBottom: spacing.md
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: `${colors.primary[600]}15`,
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.primary[600],
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.gray[900],
                  margin: 0,
                  marginBottom: spacing.xs
                }}>
                  Rate Configuration
                </h3>
                <p style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.gray[600],
                  margin: 0,
                  lineHeight: typography.lineHeight.relaxed
                }}>
                  Manage electricity rates, VAT percentage, and service charges
                </p>
              </div>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={colors.gray[400]} 
                strokeWidth="2"
                style={{ flexShrink: 0 }}
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </Link>

          <Link
            to="/admin/history"
            style={{
              ...components.card,
              textDecoration: 'none',
              display: 'block',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = shadows.lg;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shadows.md;
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.md,
              marginBottom: spacing.md
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: `${colors.success}15`,
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.success,
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.gray[900],
                  margin: 0,
                  marginBottom: spacing.xs
                }}>
                  Calculation History
                </h3>
                <p style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.gray[600],
                  margin: 0,
                  lineHeight: typography.lineHeight.relaxed
                }}>
                  View and analyze all bill calculation records
                </p>
              </div>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={colors.gray[400]} 
                strokeWidth="2"
                style={{ flexShrink: 0 }}
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          backgroundColor: colors.gray[100],
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <h3 style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.gray[900],
            margin: `0 0 ${spacing.sm} 0`
          }}>
            Quick Tips
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: spacing.lg,
            color: colors.gray[700],
            fontSize: typography.fontSize.sm,
            lineHeight: typography.lineHeight.relaxed
          }}>
            <li>Update rates regularly to ensure accurate billing calculations</li>
            <li>Monitor calculation history to track system usage</li>
            <li>All changes are logged and take effect immediately</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
