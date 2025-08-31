'use client';

import { useMemo } from 'react';
import useGlobalStore from '@/store/useGlobalStore';
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  isAdmin,
  isModerator,
  isAuthenticated,
  getUserRole,
} from '@/lib/auth/permissions';

export const usePermissions = () => {
  const { user } = useGlobalStore();

  return useMemo(() => ({
    // Permission checks
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    
    // Route access
    canAccessRoute: (route: string) => canAccessRoute(user, route),
    
    // Role checks
    isAdmin: () => isAdmin(user),
    isModerator: () => isModerator(user),
    isAuthenticated: () => isAuthenticated(user),
    getUserRole: () => getUserRole(user),
    
    // Current user
    user,
  }), [user]);
};

export const useAuth = () => {
  const { user, isAuthenticated: isAuth, isLoading } = useGlobalStore();
  
  return {
    user,
    isAuthenticated: isAuth,
    isLoading,
    isAdmin: isAdmin(user),
    isModerator: isModerator(user),
    role: getUserRole(user),
  };
};
