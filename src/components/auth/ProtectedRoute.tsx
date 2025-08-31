'use client';

import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { usePermissions } from '@/hooks/use-permissions';
import { AccessLevel } from '@/lib/auth/permissions';
import AccessDenied from '@/components/auth/AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredLevel: AccessLevel;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredLevel,
  fallbackPath = '/auth/login',
}) => {
  const { isAuthenticated, isAdmin, isModerator } = usePermissions();
  const location = useLocation();
  
  // Check access based on required level
  const hasAccess = () => {
    switch (requiredLevel) {
      case AccessLevel.PUBLIC:
        return true;
      case AccessLevel.USER:
        return isAuthenticated();
      case AccessLevel.MODERATOR:
        return isModerator();
      case AccessLevel.ADMIN:
        return isAdmin();
      default:
        return false;
    }
  };

  // If user doesn't have access
  if (!hasAccess()) {
    // If not authenticated and requires auth, redirect to login
    if (!isAuthenticated() && requiredLevel !== AccessLevel.PUBLIC) {
      return (
        <Navigate 
          to="/auth/login" 
          search={{ redirect: location.pathname }}
          replace
        />
      );
    }
    
    // If authenticated but insufficient permissions, show access denied
    if (isAuthenticated()) {
      return <AccessDenied requiredLevel={requiredLevel} />;
    }
    
    // Fallback redirect
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
