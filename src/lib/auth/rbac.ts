/**
 * Rectoverso OS - RBAC (Role-Based Access Control)
 * Production-ready permission system
 */

import type { UserRole } from '@/types/database'

// ============================================
// Permission Definitions
// ============================================

export const PERMISSIONS = {
  // Users
  'users:read': 'View user list and details',
  'users:create': 'Create new users',
  'users:update': 'Update user information',
  'users:delete': 'Delete users',
  'users:manage_roles': 'Manage user roles',

  // Clients
  'clients:read': 'View client list and details',
  'clients:create': 'Create new clients',
  'clients:update': 'Update client information',
  'clients:delete': 'Delete clients',

  // Campaigns
  'campaigns:read': 'View campaign list and details',
  'campaigns:create': 'Create new campaigns',
  'campaigns:update': 'Update campaign information',
  'campaigns:delete': 'Delete campaigns',
  'campaigns:approve': 'Approve campaign changes',

  // Tasks
  'tasks:read': 'View task list and details',
  'tasks:create': 'Create new tasks',
  'tasks:update': 'Update task information',
  'tasks:delete': 'Delete tasks',
  'tasks:assign': 'Assign tasks to users',

  // Checklists
  'checklists:read': 'View checklist items',
  'checklists:create': 'Create checklist items',
  'checklists:update': 'Update checklist items',
  'checklists:complete': 'Mark checklist items complete',

  // Publishers
  'publishers:read': 'View publisher list and details',
  'publishers:create': 'Create new publishers',
  'publishers:update': 'Update publisher information',
  'publishers:delete': 'Delete publishers',

  // Performance
  'performance:read': 'View performance data',
  'performance:create': 'Add performance entries',
  'performance:update': 'Update performance data',
  'performance:export': 'Export performance reports',

  // Finance
  'finance:read': 'View financial data',
  'finance:create': 'Create invoices',
  'finance:update': 'Update invoices and payments',
  'finance:delete': 'Delete invoices',
  'finance:export': 'Export financial reports',

  // SOPs
  'sops:read': 'View SOP library',
  'sops:create': 'Create new SOPs',
  'sops:update': 'Update SOP content',
  'sops:delete': 'Delete SOPs',

  // Client Updates
  'client_updates:read': 'View client updates',
  'client_updates:create': 'Create client updates',
  'client_updates:delete': 'Delete client updates',

  // Settings
  'settings:read': 'View system settings',
  'settings:update': 'Update system settings',

  // Admin
  'admin:access': 'Access admin panel',
  'admin:logs': 'View audit logs',
  'admin:export': 'Export all data',
} as const

export type Permission = keyof typeof PERMISSIONS

// ============================================
// Role to Permissions Mapping
// ============================================

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  founder: Object.keys(PERMISSIONS) as Permission[],

  admin: [
    // Users
    'users:read', 'users:create', 'users:update', 'users:manage_roles',
    // Clients
    'clients:read', 'clients:create', 'clients:update', 'clients:delete',
    // Campaigns
    'campaigns:read', 'campaigns:create', 'campaigns:update', 'campaigns:delete', 'campaigns:approve',
    // Tasks
    'tasks:read', 'tasks:create', 'tasks:update', 'tasks:delete', 'tasks:assign',
    // Checklists
    'checklists:read', 'checklists:create', 'checklists:update', 'checklists:complete',
    // Publishers
    'publishers:read', 'publishers:create', 'publishers:update', 'publishers:delete',
    // Performance
    'performance:read', 'performance:create', 'performance:update', 'performance:export',
    // Finance
    'finance:read', 'finance:create', 'finance:update', 'finance:delete', 'finance:export',
    // SOPs
    'sops:read', 'sops:create', 'sops:update', 'sops:delete',
    // Client Updates
    'client_updates:read', 'client_updates:create', 'client_updates:delete',
    // Settings
    'settings:read', 'settings:update',
    // Admin
    'admin:access', 'admin:logs', 'admin:export',
  ],

  campaign_manager: [
    // Clients
    'clients:read',
    // Campaigns
    'campaigns:read', 'campaigns:create', 'campaigns:update', 'campaigns:approve',
    // Tasks
    'tasks:read', 'tasks:create', 'tasks:update', 'tasks:assign',
    // Checklists
    'checklists:read', 'checklists:create', 'checklists:update', 'checklists:complete',
    // Publishers
    'publishers:read', 'publishers:create', 'publishers:update',
    // Performance
    'performance:read', 'performance:create', 'performance:update', 'performance:export',
    // SOPs
    'sops:read',
    // Client Updates
    'client_updates:read', 'client_updates:create',
  ],

  campaign_ops: [
    // Clients
    'clients:read',
    // Campaigns
    'campaigns:read', 'campaigns:update',
    // Tasks
    'tasks:read', 'tasks:create', 'tasks:update', 'tasks:assign',
    // Checklists
    'checklists:read', 'checklists:create', 'checklists:update', 'checklists:complete',
    // Publishers
    'publishers:read',
    // Performance
    'performance:read', 'performance:create', 'performance:update',
    // SOPs
    'sops:read',
    // Client Updates
    'client_updates:read', 'client_updates:create',
  ],

  finance: [
    // Clients
    'clients:read',
    // Campaigns
    'campaigns:read',
    // Finance
    'finance:read', 'finance:create', 'finance:update', 'finance:delete', 'finance:export',
    // Invoices
    'invoices:read', 'invoices:create', 'invoices:update', 'invoices:delete',
    // Performance
    'performance:read', 'performance:export',
  ],

  sales: [
    // Clients
    'clients:read', 'clients:create', 'clients:update',
    // Campaigns
    'campaigns:read', 'campaigns:create',
    // Tasks
    'tasks:read', 'tasks:create', 'tasks:update',
    // SOPs
    'sops:read',
    // Client Updates
    'client_updates:read', 'client_updates:create',
  ],

  intern: [
    // Clients
    'clients:read',
    // Campaigns
    'campaigns:read',
    // Tasks
    'tasks:read', 'tasks:update',
    // SOPs
    'sops:read',
  ],
}

// ============================================
// Permission Checker
// ============================================

export class PermissionChecker {
  private userRole: UserRole
  private userPermissions: Permission[]

  constructor(role: UserRole, customPermissions?: Permission[]) {
    this.userRole = role
    this.userPermissions = customPermissions ?? ROLE_PERMISSIONS[role] ?? []
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    // Founder has all permissions
    if (this.userRole === 'founder') return true

    return this.userPermissions.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(p))
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(p))
  }

  /**
   * Get all permissions for this user
   */
  getPermissions(): Permission[] {
    if (this.userRole === 'founder') {
      return Object.keys(PERMISSIONS) as Permission[]
    }
    return [...this.userPermissions]
  }

  /**
   * Check if user can access a resource based on ownership
   */
  canAccessResource(
    resourceOwnerId: string | null,
    userId: string
  ): boolean {
    // Admin and founder can access all
    if (this.userRole === 'founder' || this.userRole === 'admin') {
      return true
    }

    // Check ownership
    return resourceOwnerId === userId
  }
}

// ============================================
// Permission Decorator Helper
// ============================================

export function checkPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const checker = new PermissionChecker(userRole)
  return checker.hasPermission(permission)
}

// ============================================
// Resource-Level Permissions
// ============================================

export interface ResourceOwnership {
  owner_id?: string | null
  created_by?: string | null
  user_id?: string | null
}

export function canModifyResource(
  userRole: UserRole,
  userId: string,
  resource: ResourceOwnership
): boolean {
  const checker = new PermissionChecker(userRole)

  // Admin and founder can modify all
  if (checker.hasPermission('admin:access')) return true

  // Check ownership
  const isOwner =
    resource.owner_id === userId ||
    resource.created_by === userId ||
    resource.user_id === userId

  if (isOwner) return true

  // Check specific resource permissions
  return checker.hasPermission('campaigns:update')
}

// ============================================
// Role Hierarchy
// ============================================

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  founder: 7,
  admin: 6,
  campaign_manager: 5,
  campaign_ops: 4,
  finance: 3,
  sales: 2,
  intern: 1,
}

export function isRoleHigherThan(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_HIERARCHY[roleA] > ROLE_HIERARCHY[roleB]
}

export function canManageRole(
  managerRole: UserRole,
  targetRole: UserRole
): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole]
}

// ============================================
// Permission Groups
// ============================================

export const PERMISSION_GROUPS = {
  users: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'users:manage_roles',
  ],
  clients: [
    'clients:read',
    'clients:create',
    'clients:update',
    'clients:delete',
  ],
  campaigns: [
    'campaigns:read',
    'campaigns:create',
    'campaigns:update',
    'campaigns:delete',
    'campaigns:approve',
  ],
  tasks: [
    'tasks:read',
    'tasks:create',
    'tasks:update',
    'tasks:delete',
    'tasks:assign',
  ],
  publishers: [
    'publishers:read',
    'publishers:create',
    'publishers:update',
    'publishers:delete',
  ],
  finance: [
    'finance:read',
    'finance:create',
    'finance:update',
    'finance:delete',
    'finance:export',
  ],
  sop: ['sops:read', 'sops:create', 'sops:update', 'sops:delete'],
  admin: ['admin:access', 'admin:logs', 'admin:export'],
} as const
