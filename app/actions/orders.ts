'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, orderItems, payments, cart, products } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id
}

export async function createOrder(
  items: Array<{ productId: number; quantity: number }>,
  paymentMethod: string,
  total: number
) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Insert order
    const orderResult = await db
      .insert(orders)
      .values({
        userId,
        orderNumber,
        subtotal: parseFloat((total * 0.9).toFixed(2)),
        tax: parseFloat((total * 0.1).toFixed(2)),
        shipping: 0,
        total: parseFloat(total.toFixed(2)),
        status: 'pending',
        paymentMethod,
      })
      .returning({ id: orders.id })

    const orderId = orderResult[0].id

    // Insert order items
    for (const item of items) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))

      if (product.length > 0) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: product[0].price,
        })
      }
    }

    // Create payment record
    await db.insert(payments).values({
      orderId,
      amount: parseFloat(total.toFixed(2)),
      paymentMethod,
      status: 'pending',
    })

    // Clear cart
    await db.delete(cart).where(eq(cart.userId, userId))

    return { success: true, orderId, orderNumber }
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getOrders(limit = 10, offset = 0) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    return userOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function getOrderById(orderId: number) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    const order = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))

    if (order.length === 0) throw new Error('Order not found')

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: {
          id: products.id,
          name: products.name,
          imageUrl: products.imageUrl,
        },
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId))

    return { ...order[0], items }
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    await db
      .update(orders)
      .set({ status })
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))

    return { success: true }
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}
