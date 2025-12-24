import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Admin } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedAdmin = localStorage.getItem('admin');

      if (storedToken && storedAdmin && storedAdmin !== 'undefined') {
        try {
          const parsedAdmin = JSON.parse(storedAdmin);
          setToken(storedToken);
          setAdmin(parsedAdmin);
          
          // Try to verify token with backend, but don't fail if it doesn't work
          try {
            const profile = await authService.getProfile();
            setAdmin(profile);
            localStorage.setItem('admin', JSON.stringify(profile));
          } catch (verifyError) {
            // Keep the stored credentials even if verification fails
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          setToken(null);
          setAdmin(null);
        }
      } else {
        // Clear any invalid data
        if (storedAdmin === 'undefined' || storedToken === 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    
    // Extract admin data from response
    const adminData = response.admin;
    
    if (!response.access_token || !adminData) {
      throw new Error('Invalid login response from server');
    }
    
    setToken(response.access_token);
    setAdmin(adminData);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
