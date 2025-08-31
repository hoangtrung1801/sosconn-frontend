import { User } from '@/types';

// Define permissions
export enum Permission {
  // Public permissions (no auth required)
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_COMMUNITY = 'view_community',
  
  // User permissions (auth required)
  COMMENT_POST = 'comment_post',
  CREATE_POST = 'create_post',
  LIKE_POST = 'like_post',
  
  // Admin permissions
  VIEW_CITIZEN_PORTAL = 'view_citizen_portal',
  VIEW_EMERGENCY_MANAGEMENT = 'view_emergency_management',
  VIEW_EOP_REPORTS = 'view_eop_reports',
  MANAGE_USERS = 'manage_users',
  MANAGE_ALERTS = 'manage_alerts',
  MANAGE_RESOURCES = 'manage_resources',
}

// Define role permissions mapping
export const rolePermissions: Record<string, Permission[]> = {
  // Guest (not logged in) - can only view public content
  guest: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_COMMUNITY,
  ],
  
  // Regular user - can interact with community
  user: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_COMMUNITY,
    Permission.COMMENT_POST,
    Permission.CREATE_POST,
    Permission.LIKE_POST,
  ],
  
  // Moderator - user permissions + some admin features
  moderator: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_COMMUNITY,
    Permission.COMMENT_POST,
    Permission.CREATE_POST,
    Permission.LIKE_POST,
    Permission.VIEW_CITIZEN_PORTAL,
    Permission.MANAGE_ALERTS,
  ],
  
  // Admin - all permissions
  admin: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_COMMUNITY,
    Permission.COMMENT_POST,
    Permission.CREATE_POST,
    Permission.LIKE_POST,
    Permission.VIEW_CITIZEN_PORTAL,
    Permission.VIEW_EMERGENCY_MANAGEMENT,
    Permission.VIEW_EOP_REPORTS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_ALERTS,
    Permission.MANAGE_RESOURCES,
  ],
};

// Check if user has specific permission
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  const role = user?.role || 'guest';
  const permissions = rolePermissions[role] || rolePermissions.guest;
  return permissions.includes(permission);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

// Check if user has all of the specified permissions
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

// Get user's role
export const getUserRole = (user: User | null): string => {
  return user?.role || 'guest';
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

// Check if user is moderator or admin
export const isModerator = (user: User | null): boolean => {
  return user?.role === 'moderator' || user?.role === 'admin';
};

// Check if user is authenticated
export const isAuthenticated = (user: User | null): boolean => {
  return user !== null;
};

// Route access levels
export enum AccessLevel {
  PUBLIC = 'public',      // No authentication required
  USER = 'user',          // Requires login
  MODERATOR = 'moderator', // Requires moderator role
  ADMIN = 'admin',        // Requires admin role
}

// Define route access configuration
export const routeAccess: Record<string, AccessLevel> = {
  // Public routes
  '/': AccessLevel.PUBLIC,
  '/home': AccessLevel.PUBLIC,
  '/community': AccessLevel.PUBLIC,
  '/auth/login': AccessLevel.PUBLIC,
  '/auth/signup': AccessLevel.PUBLIC,
  '/auth/forgot-password': AccessLevel.PUBLIC,
  '/auth-demo': AccessLevel.PUBLIC,
  
  // Admin only routes
  '/citizen': AccessLevel.ADMIN,
  '/area-selection': AccessLevel.ADMIN,
  '/emergency-management': AccessLevel.ADMIN,
  '/eop': AccessLevel.ADMIN,
  '/eop/create': AccessLevel.ADMIN,
  '/eop/edit': AccessLevel.ADMIN,
  '/eop/report': AccessLevel.ADMIN,
  '/eop/ai-generate': AccessLevel.ADMIN,
};

// Check if user can access route
export const canAccessRoute = (user: User | null, route: string): boolean => {
  const requiredAccess = routeAccess[route] || AccessLevel.PUBLIC;
  
  switch (requiredAccess) {
    case AccessLevel.PUBLIC:
      return true;
    case AccessLevel.USER:
      return isAuthenticated(user);
    case AccessLevel.MODERATOR:
      return isModerator(user);
    case AccessLevel.ADMIN:
      return isAdmin(user);
    default:
      return false;
  }
};
