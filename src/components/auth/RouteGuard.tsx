'use client';

import React from 'react';
import { useLocation } from '@tanstack/react-router';
import { usePermissions } from '@/hooks/use-permissions';
import { routeAccess, AccessLevel } from '@/lib/auth/permissions';
import AccessDenied from './AccessDenied';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isModerator } = usePermissions();
  
  const currentPath = location.pathname;
  const requiredAccess = routeAccess[currentPath] || AccessLevel.PUBLIC;
  
  // Check if user can access current route
  const hasAccess = () => {
    switch (requiredAccess) {
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

  // If user doesn't have access, show access denied
  if (!hasAccess()) {
    return <AccessDenied requiredLevel={requiredAccess} />;
  }

  return <>{children}</>;
};

export default RouteGuard;
