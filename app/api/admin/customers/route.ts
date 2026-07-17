import { db } from '@/lib/db'
import { user, orders } from '@/lib/db/schema'
import { requireAdminAuth, canPerformAction } from '@/lib/admin-auth'
import { sum } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const adminUser = await requireAdminAuth()

    if (!canPerformAction(adminUser.role, 'view_customers')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get customers with order stats
    const customers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(require('drizzle-orm').eq(user.role, 'customer'))

    // Enrich with order data
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orderStats = await db.execute(
          'SELECT COUNT(*) as order_count, SUM(CAST(total AS DECIMAL)) as total_spent FROM orders WHERE "userId" = $1',
          [customer.id]
        )

        return {
          ...customer,
          orderCount: orderStats.rows[0]?.order_count || 0,
          totalSpent: parseFloat(orderStats.rows[0]?.total_spent || '0'),
        }
      })
    )

    return Response.json(customersWithOrders)
  } catch (error) {
    console.error('Get customers error:', error)
    return Response.json(
      { error: 'Unauthorized or internal error' },
      { status: 403 }
    )
  }
}
