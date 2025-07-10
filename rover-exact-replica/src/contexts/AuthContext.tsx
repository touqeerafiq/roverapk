import React, {createContext, useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {RootState} from '../store';
import {
  checkAuthState,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  resetPassword,
  updateProfile,
} from '../store/slices/authSlice';
import {AppDispatch} from '../store';

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  googleLogin: () => Promise<void>;
  facebookLogin: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (profileData: any) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated, isLoading, user, error} = useSelector(
    (state: RootState) => state.auth
  );

  // Check auth state on mount
  useEffect(() => {
    dispatch(checkAuthState());

    // Subscribe to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(checkAuthState());
      } else {
        // User is signed out
        dispatch(logout());
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [dispatch]);

  // Login with email and password
  const login = async (email: string, password: string) => {
    await dispatch(loginWithEmail({email, password})).unwrap();
  };

  // Register with email and password
  const register = async (userData: any) => {
    await dispatch(
      registerWithEmail({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
      })
    ).unwrap();
  };

  // Login with Google
  const googleLogin = async () => {
    await dispatch(loginWithGoogle()).unwrap();
  };

  // Login with Facebook
  const facebookLogin = async () => {
    await dispatch(loginWithFacebook()).unwrap();
  };

  // Sign out
  const signOut = async () => {
    await dispatch(logout()).unwrap();
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    await dispatch(resetPassword(email)).unwrap();
  };

  // Update user profile
  const updateUserProfile = async (profileData: any) => {
    await dispatch(updateProfile(profileData)).unwrap();
  };

  // Context value
  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    register,
    googleLogin,
    facebookLogin,
    signOut,
    forgotPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};