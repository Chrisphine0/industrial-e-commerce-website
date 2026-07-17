import { db } from '@/lib/db'
import { categories, products } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'

const SAMPLE_CATEGORIES = [
  { name: 'Power Tools', slug: 'power-tools', description: 'Professional power tools for every job' },
  { name: 'Hand Tools', slug: 'hand-tools', description: 'Essential hand tools for workshops' },
  { name: 'Safety Equipment', slug: 'safety-equipment', description: 'Personal protective equipment' },
  { name: 'Storage', slug: 'storage', description: 'Tool storage and organization' },
  { name: 'Fasteners', slug: 'fasteners', description: 'Bolts, screws, and fastening solutions' },
]

const SAMPLE_PRODUCTS = [
  {
    name: 'Professional Cordless Drill',
    description: 'Powerful 18V brushless motor with 2-speed transmission',
    sku: 'DRILL-001',
    brand: 'ProTech',
    price: '129.99',
    oldPrice: '179.99',
    categorySlug: 'power-tools',
    imageUrl: '/products/drill.jpg',
    stock: 45,
  },
  {
    name: 'Heavy-Duty Socket Set',
    description: '108-piece chrome vanadium socket set with storage case',
    sku: 'SOCKET-001',
    brand: 'ToolMaster',
    price: '89.99',
    oldPrice: '119.99',
    categorySlug: 'hand-tools',
    imageUrl: '/products/socket-set.jpg',
    stock: 38,
  },
  {
    name: 'Industrial Safety Helmet',
    description: 'Hard hat with chin strap and ventilation',
    sku: 'HELMET-001',
    brand: 'SafeGuard',
    price: '34.99',
    oldPrice: '49.99',
    categorySlug: 'safety-equipment',
    imageUrl: '/products/helmet.jpg',
    stock: 120,
  },
  {
    name: 'Stainless Steel Tool Cabinet',
    description: '5-drawer cabinet with ball-bearing slides',
    sku: 'CABINET-001',
    brand: 'StorePro',
    price: '299.99',
    oldPrice: '399.99',
    categorySlug: 'storage',
    imageUrl: '/products/cabinet.jpg',
    stock: 12,
  },
  {
    name: 'Assorted Bolt & Screw Kit',
    description: '1500+ piece assortment in plastic organizer',
    sku: 'FASTENER-001',
    brand: 'FastenRight',
    price: '44.99',
    oldPrice: '64.99',
    categorySlug: 'fasteners',
    imageUrl: '/products/fasteners.jpg',
    stock: 85,
  },
  {
    name: 'Electric Impact Wrench',
    description: '1/2" drive with variable speed control',
    sku: 'WRENCH-001',
    brand: 'ProTech',
    price: '199.99',
    oldPrice: '279.99',
    categorySlug: 'power-tools',
    imageUrl: '/products/impact-wrench.jpg',
    stock: 28,
  },
  {
    name: 'Adjustable Wrench Set',
    description: '4-piece set with chrome finish',
    sku: 'WRENCH-002',
    brand: 'ToolMaster',
    price: '24.99',
    oldPrice: '39.99',
    categorySlug: 'hand-tools',
    imageUrl: '/products/wrench-set.jpg',
    stock: 95,
  },
  {
    name: 'Safety Gloves Bundle',
    description: 'Pack of 12 pairs, nitrile-coated',
    sku: 'GLOVES-001',
    brand: 'SafeGuard',
    price: '19.99',
    oldPrice: '29.99',
    categorySlug: 'safety-equipment',
    imageUrl: '/products/gloves.jpg',
    stock: 200,
  },
]

export async function POST(request: NextRequest) {
  try {
    // Insert categories
    for (const cat of SAMPLE_CATEGORIES) {
      await db.insert(categories).values(cat).onConflictDoNothing()
    }

    // Get category IDs
    const cats = await db.select().from(categories)
    const categoryMap = new Map(cats.map((c) => [c.slug, c.id]))

    // Insert products
    for (const prod of SAMPLE_PRODUCTS) {
      const categoryId = categoryMap.get(prod.categorySlug)
      await db
        .insert(products)
        .values({
          name: prod.name,
          description: prod.description,
          sku: prod.sku,
          brand: prod.brand,
          price: prod.price,
          oldPrice: prod.oldPrice,
          categoryId,
          imageUrl: prod.imageUrl,
          stock: prod.stock,
          availability: prod.stock > 0,
          rating: (Math.random() * 1.5 + 3.5).toString(),
          reviewCount: Math.floor(Math.random() * 100 + 10),
        })
        .onConflictDoNothing()
    }

    return NextResponse.json({ success: true, message: 'Seed data inserted' })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
