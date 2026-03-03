'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/client';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('token');
      if (stored) {
        setToken(stored);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authAPI.login(email, password);
      const t = res.data?.data?.token;
      if (t) {
        setToken(t);
        localStorage.setItem('token', t);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
