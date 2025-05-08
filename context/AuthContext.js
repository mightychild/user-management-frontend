import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data: user } = await api.get('/auth/me');
      setUser(user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const { data: { token, user } } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signOut = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  // Auto logout when token expires
  useEffect(() => {
    const checkTokenExpiration = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { exp } = JSON.parse(atob(token.split('.')[1]));
          if (exp * 1000 < Date.now()) {
            signOut();
          }
        } catch (err) {
          signOut();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenExpiration);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signOut,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};