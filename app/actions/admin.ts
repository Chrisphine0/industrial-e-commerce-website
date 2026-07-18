'use server'

import { db } from '@/lib/db'
import {
  products,
  categories,
  orders,
  orderItems,
  adminLogs,
  user,
} from '@/lib/db/schema'
import {
  requireAdminAuth,
  isManager,
  logAdminAction,
  canPerformAction,
} from '@/lib/admin-auth'
import { eq, and, desc, asc } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from '@/lib/email'

// ============================================================================
// PRODUCT MANAGEMENT
// ============================================================================

export async function getAdminProducts(search?: string) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'view_products')) {
    throw new Error('Unauthorized')
  }

  let query = db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      price: products.price,
      stock: products.stock,
      categoryId: products.categoryId,
      availability: products.availability,
      createdAt: products.createdAt,
    })
    .from(products)

  if (search) {
    query = query.where(
      sql`${products.name} ILIKE ${'%' + search + '%'}`
    ) as any
  }

  return await query.orderBy(desc(products.createdAt))
}

export async function getProductById(productId: number) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'view_products')) {
    throw new Error('Unauthorized')
  }

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      sku: products.sku,
      brand: products.brand,
      price: products.price,
      oldPrice: products.oldPrice,
      categoryId: products.categoryId,
      imageUrl: products.imageUrl,
      stock: products.stock,
      availability: products.availability,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  return result[0] || null
}

export async function updateProduct(
  productId: number,
  data: {
    name?: string
    description?: string
    price?: string
    oldPrice?: string | null
    stock?: number
    availability?: boolean
    categoryId?: number
    imageUrl?: string
  }
) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'edit_products')) {
    throw new Error('Unauthorized')
  }

  // Build update values, handling oldPrice properly (null when empty/undefined)
  const updateValues: any = {
    ...data,
    updatedAt: new Date(),
  }

  // Convert empty oldPrice string to null
  if (data.oldPrice === '' || data.oldPrice === undefined) {
    updateValues.oldPrice = null
  }

  await db
    .update(products)
    .set(updateValues)
    .where(eq(products.id, productId))

  await logAdminAction(
    adminUser.id,
    'UPDATE_PRODUCT',
    'product',
    productId,
    `Updated product: ${JSON.stringify(data)}`
  )

  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function createProduct(data: {
  name: string
  description?: string
  sku?: string
  brand?: string
  price: string
  oldPrice?: string
  categoryId?: number
  stock?: number
  imageUrl?: string
}) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'create_products')) {
    throw new Error('Unauthorized')
  }

  const result = await db
    .insert(products)
    .values({
      ...data,
      availability: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: products.id })

  const productId = result[0]?.id

  await logAdminAction(
    adminUser.id,
    'CREATE_PRODUCT',
    'product',
    productId,
    `Created product: ${data.name}`
  )

  revalidatePath('/admin/products')
  revalidatePath('/')

  return productId
}

export async function deleteProduct(productId: number) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'delete_products')) {
    throw new Error('Unauthorized')
  }

  const product = await getProductById(productId)
  if (!product) throw new Error('Product not found')

  await db.delete(products).where(eq(products.id, productId))

  await logAdminAction(
    adminUser.id,
    'DELETE_PRODUCT',
    'product',
    productId,
    `Deleted product: ${product.name}`
  )

  revalidatePath('/admin/products')
  revalidatePath('/')
}

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

export async function getAdminOrders(status?: string) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'view_orders')) {
    throw new Error('Unauthorized')
  }

  let query = db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      total: orders.total,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      userId: orders.userId,
    })
    .from(orders)

  if (status) {
    query = query.where(eq(orders.status, status)) as any
  }

  return await query.orderBy(desc(orders.createdAt))
}

export async function getOrderById(orderId: number) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'view_orders')) {
    throw new Error('Unauthorized')
  }

  const orderData = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (orderData.length === 0) return null

  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))

  return {
    ...orderData[0],
    items,
  }
}

export async function updateOrderStatus(
  orderId: number,
  newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'update_order_status')) {
    throw new Error('Unauthorized')
  }

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (order.length === 0) throw new Error('Order not found')

  await db
    .update(orders)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  await logAdminAction(
    adminUser.id,
    'UPDATE_ORDER_STATUS',
    'order',
    orderId,
    `Changed status from ${order[0].status} to ${newStatus}`
  )

  // Send email notifications
  const orderUser = await db
    .select()
    .from(user)
    .where(eq(user.id, order[0].userId))
    .limit(1)

  if (orderUser[0]?.email) {
    if (newStatus === 'shipped') {
      await sendOrderShippedEmail({
        to: orderUser[0].email,
        orderNumber: order[0].orderNumber,
        customerName: orderUser[0].name || 'Customer',
      })
    }

    if (newStatus === 'delivered') {
      await sendOrderDeliveredEmail({
        to: orderUser[0].email,
        orderNumber: order[0].orderNumber,
        customerName: orderUser[0].name || 'Customer',
      })
    }
  }

  revalidatePath('/admin/orders')
}

// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================

export async function getDashboardStats() {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'view_analytics')) {
    throw new Error('Unauthorized')
  }

  // Total revenue
  const revenueResult = await db.execute(
    sql`SELECT SUM(CAST(total AS DECIMAL)) as total_revenue FROM orders WHERE status != 'cancelled'`
  )

  // Total orders
  const ordersResult = await db.execute(
    sql`SELECT COUNT(*) as order_count FROM orders`
  )

  // Orders by status
  const statusResult = await db.execute(
    sql`SELECT status, COUNT(*) as count FROM orders GROUP BY status`
  )

  // Low stock products
  const lowStockResult = await db
    .select()
    .from(products)
    .where(sql`${products.stock} <= 10`)
    .orderBy(asc(products.stock))
    .limit(5)

  return {
    totalRevenue: revenueResult.rows[0]?.total_revenue || 0,
    totalOrders: ordersResult.rows[0]?.order_count || 0,
    ordersByStatus: statusResult.rows || [],
    lowStockProducts: lowStockResult,
  }
}

// ============================================================================
// ADMIN LOGS
// ============================================================================

export async function getAdminLogs(limit = 50) {
  const adminUser = await requireAdminAuth()

  if (!canPerformAction(adminUser.role, 'view_admin_logs')) {
    throw new Error('Unauthorized')
  }

  return await db
    .select()
    .from(adminLogs)
    .orderBy(desc(adminLogs.createdAt))
    .limit(limit)
}
