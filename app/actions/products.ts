'use server'

import { db } from '@/lib/db'
import { products, categories } from '@/lib/db/schema'
import { eq, ilike, desc } from 'drizzle-orm'

export async function getCategories() {
  try {
    return await db.select().from(categories).orderBy(categories.name)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getProducts(search?: string, categoryId?: number, limit = 20, offset = 0) {
  try {
    let query = db.select().from(products)

    const conditions = []
    if (search) {
      conditions.push(ilike(products.name, `%${search}%`))
    }
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId))
    }

    if (conditions.length > 0) {
      query = query.where(conditions[0])
    }

    return await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: number) {
  try {
    const result = await db.select().from(products).where(eq(products.id, id))
    return result[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function searchProducts(query: string) {
  try {
    return await db
      .select()
      .from(products)
      .where(ilike(products.name, `%${query}%`))
      .limit(10)
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
