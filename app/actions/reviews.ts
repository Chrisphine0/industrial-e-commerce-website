'use server'

import { db } from '@/lib/db'
import { reviews, products } from '@/lib/db/schema'
import { and, eq, desc, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Submit a review (requires authentication)
export async function submitReview(productId: number, rating: number, title: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  const [review] = await db.insert(reviews).values({
    userId: session.user.id,
    productId,
    rating,
    title,
    content,
