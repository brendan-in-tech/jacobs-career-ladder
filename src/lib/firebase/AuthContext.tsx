'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import { User, getIdToken } from 'firebase/auth';
import { SessionManager } from '../session/SessionManager';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: (rememberMe?: boolean) => Promise<any>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getJwt: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    resetPassword,
  } = useFirebase();

  const sessionManager = SessionManager.getInstance();

  // Initialize session when user changes
  useEffect(() => {
    if (user) {
      sessionManager.initializeSession(user);
    } else {
      sessionManager.clearSession();
    }
  }, [user]);

  // Check session validity on mount and periodically
  useEffect(() => {
    const checkSession = () => {
      if (!sessionManager.isSessionValid()) {
        logOut();
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [logOut]);

  // Add getJwt method
  const getJwt = async () => {
    const currentUser = sessionManager.getSessionUser() || user;
    if (!currentUser) return null;
    return await getIdToken(currentUser);
  };

  const value = {
    user: sessionManager.getSessionUser() || user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    resetPassword,
    getJwt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 