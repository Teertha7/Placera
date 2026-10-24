import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { User, Role, ApiResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('placera_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await api.get<ApiResponse<User>>('/api/auth/me');
      if (res.data.success && res.data.data) {
        setUser(res.data.data);
        localStorage.setItem('placera_user', JSON.stringify(res.data.data));
      }
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('placera_token');
      localStorage.removeItem('placera_user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('placera_token');
    const savedUser = localStorage.getItem('placera_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        // Verify with backend
        refreshUser();
      } catch {
        localStorage.removeItem('placera_token');
        localStorage.removeItem('placera_user');
        setIsLoading(false);
      }
    } else if (savedToken) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('placera_token', newToken);
    localStorage.setItem('placera_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('placera_token');
      localStorage.removeItem('placera_user');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
