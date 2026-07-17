import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { wishlist, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
      })
      .from(wishlist)
      .innerJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, session.user.id))
      .orderBy(() => wishlist.createdAt)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    const existing = await db
      .select()
      .from(wishlist)
      .where(and(
        eq(wishlist.userId, session.user.id),
        eq(wishlist.productId, productId)
      ))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Already in wishlist' },
        { status: 400 }
      )
    }

    await db.insert(wishlist).values({
      userId: session.user.id,
      productId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    await db
      .delete(wishlist)
      .where(and(
        eq(wishlist.userId, session.user.id),
        eq(wishlist.productId, productId)
      ))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wishlist DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
