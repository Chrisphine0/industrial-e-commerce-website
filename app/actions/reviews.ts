'use server'

import { db } from '@/lib/db'
import { reviews, products, user } from '@/lib/db/schema'
import { and, eq, desc, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getSession() {
  try {
    // For server actions, we need to check if headers are available
    // Use dynamic import to avoid issues during build
    const { headers } = await import('next/headers')
    const { auth } = await import('@/lib/auth')
    
    const headersList = await headers()
    return auth.api.getSession({ headers: headersList })
  } catch (error) {
    // Return null if session check fails (timeout, no session, etc.)
    return null
  }
}

async function getUserId() {
  try {
    const session = await getSession()
    return session?.user?.id
  } catch {
    return null
  }
}

// Submit a review (requires authentication)
export async function submitReview(productId: number, rating: number, title: string, content: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const [review] = await db.insert(reviews).values({
    userId: session.user.id,
    productId,
    rating,
    title,
    content,
    isApproved: false, // requires admin approval
  }).returning()

  // Optionally, revalidate product page to show pending review indicator
  revalidatePath(`/products/${productId}`)
  return review
}

// Get approved reviews for a product
export async function getProductReviews(productId: number) {
  return await db.select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt))
}

// Admin: get all reviews (with pending status)
export async function getAdminReviews(approved?: boolean) {
  const session = await getSession()
  if (!session?.user) throw new Error('Forbidden')

  // Fetch user to check role
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (userRecord.length === 0 || userRecord[0].role !== 'admin') {
    throw new Error('Forbidden')
  }

  const conditions = []
  if (approved !== undefined) conditions.push(eq(reviews.isApproved, approved))
  return await db.select()
    .from(reviews)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(reviews.createdAt))
}

// Admin: approve/reject a review
export async function moderateReview(reviewId: number, approve: boolean) {
  const session = await getSession()
  if (!session?.user) throw new Error('Forbidden')

  // Fetch user to check role
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (userRecord.length === 0 || userRecord[0].role !== 'admin') {
    throw new Error('Forbidden')
  }

  const [review] = await db.update(reviews)
    .set({ isApproved: approve })
    .where(eq(reviews.id, reviewId))
    .returning()

  if (approve) {
    // Update product average and count
    const result = await db
      .select({
        avg: sql<number>`AVG(${reviews.rating})`,
        count: sql<number>`COUNT(*)`
      })
      .from(reviews)
      .where(and(eq(reviews.productId, review.productId), eq(reviews.isApproved, true)))

    await db.update(products)
      .set({
        rating: result[0].avg?.toString() || '0',
        reviewCount: result[0].count || 0,
      })
      .where(eq(products.id, review.productId))
  }

  revalidatePath(`/admin/reviews`)
  revalidatePath(`/products/${review.productId}`)
  return review
}

// Helpful/unhelpful vote
export async function voteReview(reviewId: number, vote: 'helpful' | 'unhelpful') {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')

  // In real implementation, you'd track per-user votes to prevent double-voting.
  // For simplicity, we just increment.
  const column = vote === 'helpful' ? reviews.helpfulCount : reviews.unhelpfulCount
  const [updated] = await db.update(reviews)
    .set({ [column.name]: sql`${column.name} + 1` })
    .where(eq(reviews.id, reviewId))
    .returning()
  return updated
}