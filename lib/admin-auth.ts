import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type UserRole = 'customer' | 'warehouse_staff' | 'manager' | 'admin'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
}

/**
 * Get the current user's session and role information
 * Returns null if user is not authenticated
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (userRecord.length === 0) return null

  return {
    id: userRecord[0].id,
    name: userRecord[0].name,
    email: userRecord[0].email,
    role: (userRecord[0].role as UserRole) || 'customer',
  }
}

/**
 * Check if the current user has admin access
 * Requires user to be authenticated and have admin/manager/warehouse_staff role
 */
// Check if we're in an API route context (no HTML response expected)
function isApiRoute(): boolean {
  if (typeof process === 'undefined') return false
  // In API routes, we can't redirect, so throw an error instead
  return process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_PHASE === 'phase-production-build'
}

export async function requireAdminAuth(options?: { redirectOnFail?: boolean }): Promise<AdminUser> {
  const adminUser = await getCurrentAdminUser()

  if (!adminUser) {
    if (options?.redirectOnFail === false) {
      throw new Error('Unauthorized')
    }
    redirect('/sign-in')
  }

  const adminRoles: UserRole[] = ['admin', 'manager', 'warehouse_staff']
  if (!adminRoles.includes(adminUser.role)) {
    if (options?.redirectOnFail === false) {
      throw new Error('Forbidden')
    }
    redirect('/')
  }

  return adminUser
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(...roles: UserRole[]): Promise<boolean> {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) return false
  return roles.includes(adminUser.role)
}

/**
 * Check if the current user is an admin (highest privilege)
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin')
}

/**
 * Check if the current user is a manager or higher
 */
export async function isManager(): Promise<boolean> {
  return hasRole('admin', 'manager')
}

/**
 * Check if the current user has warehouse staff access or higher
 */
export async function isWarehouseStaff(): Promise<boolean> {
  return hasRole('admin', 'manager', 'warehouse_staff')
}

/**
 * Role-based permission matrix
 * Returns true if the user can perform the action
 */
export const rolePermissions: Record<UserRole, Record<string, boolean>> = {
  customer: {
    view_orders: true,
    view_wishlist: true,
    view_reviews: true,
    create_review: true,
    edit_own_review: true,
  },
  warehouse_staff: {
    view_dashboard: true,
    view_products: true,
    view_orders: true,
    update_order_status: true,
    view_inventory: true,
  },
  manager: {
    view_dashboard: true,
    view_products: true,
    edit_products: true,
    view_orders: true,
    update_order_status: true,
    view_inventory: true,
    edit_inventory: true,
    view_customers: true,
    view_analytics: true,
    view_admin_logs: true,
  },
  admin: {
    view_dashboard: true,
    view_products: true,
    edit_products: true,
    create_products: true,
    delete_products: true,
    view_orders: true,
    update_order_status: true,
    view_inventory: true,
    edit_inventory: true,
    view_customers: true,
    view_analytics: true,
    view_admin_logs: true,
    manage_users: true,
    approve_reviews: true,
    manage_categories: true,
  },
}

/**
 * Check if a user with the given role can perform an action
 */
export function canPerformAction(role: UserRole, action: string): boolean {
  return rolePermissions[role]?.[action] ?? false
}

/**
 * Log an admin action for audit trail
 */
export async function logAdminAction(
  userId: string,
  action: string,
  entityType: string,
  entityId?: number,
  details?: string
): Promise<void> {
  const { adminLogs } = await import('@/lib/db/schema')

  await db.insert(adminLogs).values({
    userId,
    action,
    entityType,
    entityId: entityId || null,
    details: details || null,
    createdAt: new Date(),
  })
}
