'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCustomerTier } from '@/lib/shopify';
import { trackUserLogin } from '@/lib/analytics';

interface AuthContextType {
  customerToken: string | null;
  customerTier: string;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isBlackCard: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [customerTier, setCustomerTier] = useState<string>('GUEST');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('customerToken');
    if (storedToken) {
      setCustomerToken(storedToken);
      checkTier(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkTier = async (token: string) => {
    try {
      const tier = await getCustomerTier(token);
      setCustomerTier(tier);
    } catch (error) {
      console.error('Error checking customer tier:', error);
      setCustomerTier('GUEST');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    setIsLoading(true);
    setCustomerToken(token);
    localStorage.setItem('customerToken', token);
    await checkTier(token);

    // Track successful login
    trackUserLogin(customerTier);
  };

  const logout = () => {
    setCustomerToken(null);
    setCustomerTier('GUEST');
    localStorage.removeItem('customerToken');
  };

  const value: AuthContextType = {
    customerToken,
    customerTier,
    isLoading,
    login,
    logout,
    isAuthenticated: !!customerToken,
    isBlackCard: customerTier === 'BLACK_CARD',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}