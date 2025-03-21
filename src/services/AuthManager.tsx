// src/services/AuthManager.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../store/slices/authSlice';
import { AppDispatch } from '../store';

interface AuthManagerProps {
  children: React.ReactNode;
}

const AuthManager: React.FC<AuthManagerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        await dispatch(checkAuthStatus());
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthManager;