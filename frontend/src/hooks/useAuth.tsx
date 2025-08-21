import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { LOGIN, SIGNUP, LOGOUT } from '../graphql/mutations';
import { GET_USER } from '../graphql/queries';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'Buyer' | 'Seller' | 'Admin';
  created_at: string;
  addresses?: any[];
  orders?: any[];
  reviews?: any[];
  products?: any[];
  cart?: any;
  payments?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);
  const [logoutMutation] = useMutation(LOGOUT);

  const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(GET_USER, {
    skip: !localStorage.getItem('authToken'),
    onCompleted: (data) => {
      if (data?.user) {
        setUser(data.user);
        setError(null);
      }
    },
    onError: (error) => {
      console.error('User query error:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setError('Authentication failed. Please log in again.');
    }
  });

  useEffect(() => {
    if (!userLoading) {
      setLoading(false);
    }
  }, [userLoading]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await loginMutation({
        variables: { email, password }
      });
      
      if (data?.login) {
        setUser(data.login);
        localStorage.setItem('authToken', 'logged-in');
        // Don't call refetchUser here since we already have the user data
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await signupMutation({
        variables: { data: userData }
      });
      
      if (data?.signup) {
        setUser(data.signup);
        localStorage.setItem('authToken', 'logged-in');
        // Don't call refetchUser here since we already have the user data
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'Signup failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutMutation();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state regardless of server response
      setUser(null);
      setError(null);
      localStorage.removeItem('authToken');
      await client.clearStore();
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 