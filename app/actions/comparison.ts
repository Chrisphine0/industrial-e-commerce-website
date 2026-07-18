'use server'

import { db } from '@/lib/db'
import { comparisons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

export async function getComparison() {
  try {
    const session = await getSession()
    if (!session) return [] // guest handled on client
    
    const result = await db.select().from(comparisons).where(eq(comparisons.userId, session.user.id))
    return result[0]?.productIds || []
  } catch (error) {
    // Handle both session errors and missing table errors
    console.warn('Comparison check failed:', error)
    return []
  }
}

export async function addToComparison(productId: number) {
  const session = await getSession()
  if (!session) return

  try {
    const existing = await db.select().from(comparisons).where(eq(comparisons.userId, session.user.id))
    if (existing.length === 0) {
      await db.insert(comparisons).values({ userId: session.user.id, productIds: [productId.toString()] })
    } else {
      const current = existing[0].productIds as string[]
      if (!current.includes(productId.toString())) {
        await db.update(comparisons)
          .set({ productIds: [...current, productId.toString()] })
          .where(eq(comparisons.id, existing[0].id))
      }
    }
    revalidatePath('/compare')
  } catch (error) {
    console.warn('Comparisons table not found:', error)
  }
}

export async function removeFromComparison(productId: number) {
  const session = await getSession()
  if (!session) return

  try {
    const existing = await db.select().from(comparisons).where(eq(comparisons.userId, session.user.id))
    if (existing.length > 0) {
      const current = existing[0].productIds as string[]
      const updated = current.filter(id => id !== productId.toString())
      await db.update(comparisons)
        .set({ productIds: updated })
        .where(eq(comparisons.id, existing[0].id))
      revalidatePath('/compare')
    }
  } catch (error) {
    console.warn('Comparisons table not found:', error)
  }
}