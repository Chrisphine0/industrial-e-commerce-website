'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cart, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id
}

export async function getCart() {
  try {
    const userId = await getUserId()
    if (!userId) return []

    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          imageUrl: products.imageUrl,
        },
      })
      .from(cart)
      .innerJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId))

    return cartItems
  } catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

export async function addToCart(productId: number, quantity: number = 1) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    // Check if item already in cart
    const existing = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))

    if (existing.length > 0) {
      // Update quantity
      await db
        .update(cart)
        .set({ quantity: existing[0].quantity + quantity })
        .where(eq(cart.id, existing[0].id))
    } else {
      // Insert new item
      await db.insert(cart).values({
        userId,
        productId,
        quantity,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

export async function updateCartItem(cartId: number, quantity: number) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    if (quantity <= 0) {
      await db.delete(cart).where(eq(cart.id, cartId))
    } else {
      await db.update(cart).set({ quantity }).where(eq(cart.id, cartId))
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating cart:', error)
    throw error
  }
}

export async function removeFromCart(cartId: number) {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    await db.delete(cart).where(eq(cart.id, cartId))
    return { success: true }
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

export async function clearCart() {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    await db.delete(cart).where(eq(cart.userId, userId))
    return { success: true }
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}
