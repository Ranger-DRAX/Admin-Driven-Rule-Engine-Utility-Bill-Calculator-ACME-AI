import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { colors, typography, spacing, borderRadius, components } from '../../styles/theme';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      fontFamily: typography.fontFamily.sans,
      padding: spacing.lg
    }}>
      <div style={{
        ...components.card,
        width: '420px',
        maxWidth: '100%'
      }}>
        {/* Logo/Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: colors.primary[100],
          borderRadius: borderRadius.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: `0 auto ${spacing.lg}`,
          border: `2px solid ${colors.primary[200]}`
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.primary[600]} strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <h2 style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          marginBottom: spacing.xs,
          textAlign: 'center',
          color: colors.gray[900]
        }}>
          Admin Portal
        </h2>
        
        <p style={{
          textAlign: 'center',
          color: colors.gray[600],
          fontSize: typography.fontSize.sm,
          marginBottom: spacing.xl
        }}>
          Sign in to access the admin dashboard
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: spacing.lg }}>
            <label style={components.label}>
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              style={{
                ...components.input
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = colors.primary[500]}
              onBlur={(e) => e.currentTarget.style.borderColor = colors.gray[300]}
              required
              autoFocus
              placeholder="Enter your username"
            />
          </div>

          <div style={{ marginBottom: spacing.lg }}>
            <label style={components.label}>
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              style={{
                ...components.input
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = colors.primary[500]}
              onBlur={(e) => e.currentTarget.style.borderColor = colors.gray[300]}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              marginBottom: spacing.lg,
              backgroundColor: '#fef2f2',
              border: `1px solid #fecaca`,
              color: colors.error,
              padding: spacing.md,
              borderRadius: borderRadius.md,
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          marginTop: spacing.lg, 
          paddingTop: spacing.lg,
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'center' 
        }}>
          <a href="/" style={{
            color: colors.primary[600],
            fontSize: typography.fontSize.sm,
            textDecoration: 'none',
            fontWeight: typography.fontWeight.medium
          }}
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            ← Back to Calculator
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
