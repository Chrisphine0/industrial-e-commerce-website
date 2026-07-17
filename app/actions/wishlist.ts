'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { wishlist, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function addToWishlist(productId: number) {
  const userId = await getUserId()

  // Check if already in wishlist
  const existing = await db
    .select()
    .from(wishlist)
    .where(and(
      eq(wishlist.userId, userId),
      eq(wishlist.productId, productId)
    ))
    .limit(1)

  if (existing.length > 0) {
    return { success: false, message: 'Already in wishlist' }
  }

  await db.insert(wishlist).values({
    userId,
    productId,
  })

  return { success: true, message: 'Added to wishlist' }
}

export async function removeFromWishlist(productId: number) {
  const userId = await getUserId()

  await db
    .delete(wishlist)
    .where(and(
      eq(wishlist.userId, userId),
      eq(wishlist.productId, productId)
    ))

  return { success: true, message: 'Removed from wishlist' }
}

export async function isInWishlist(productId: number): Promise<boolean> {
  try {
    const userId = await getUserId()

    const result = await db
      .select()
      .from(wishlist)
      .where(and(
        eq(wishlist.userId, userId),
        eq(wishlist.productId, productId)
      ))
      .limit(1)

    return result.length > 0
  } catch {
    return false
  }
}

export async function getWishlistItems() {
  const userId = await getUserId()

  return await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      sku: products.sku,
      brand: products.brand,
      price: products.price,
      oldPrice: products.oldPrice,
      imageUrl: products.imageUrl,
      rating: products.rating,
      reviewCount: products.reviewCount,
      availability: products.availability,
      stock: products.stock,
      categoryId: products.categoryId,
      createdAt: products.createdAt,
    })
    .from(wishlist)
    .innerJoin(products, eq(wishlist.productId, products.id))
    .where(eq(wishlist.userId, userId))
    .orderBy(() => wishlist.createdAt)
}

export async function getWishlistCount(): Promise<number> {
  try {
    const userId = await getUserId()

    const result = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.userId, userId))

    return result.length
  } catch {
    return 0
  }
}
