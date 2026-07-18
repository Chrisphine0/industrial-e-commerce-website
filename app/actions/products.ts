'use server'

import { db } from '@/lib/db'
import { products, categories } from '@/lib/db/schema'
import { eq, ilike, desc, and } from 'drizzle-orm'

// Simple in-memory cache with 5-minute TTL
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return cached.data as T
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function getCategories() {
  const cached = getCached('categories')
  if (cached) return cached

  try {
    const data = await db.select().from(categories).orderBy(categories.name)
    setCached('categories', data)
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getProducts(search?: string, categoryId?: number, limit = 20, offset = 0) {
  const cacheKey = `products:${search || ''}:${categoryId || ''}:${limit}:${offset}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    let data
    if (search && categoryId) {
      data = await db
        .select()
        .from(products)
        .where(and(ilike(products.name, `%${search}%`), eq(products.categoryId, categoryId)))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset)
    } else if (search) {
      data = await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset)
    } else if (categoryId) {
      data = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, categoryId))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset)
    } else {
      data = await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset)
    }
    
    setCached(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: number) {
  const cacheKey = `product:${id}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const result = await db.select().from(products).where(eq(products.id, id))
    const data = result[0] || null
    setCached(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function searchProducts(query: string) {
  const cacheKey = `search:${query}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const data = await db
      .select()
      .from(products)
      .where(ilike(products.name, `%${query}%`))
      .limit(10)
    
    setCached(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}