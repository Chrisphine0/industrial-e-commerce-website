'use client'

import { useEffect, useState } from 'react'
import { getWishlistItems } from '@/app/actions/wishlist'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface WishlistProduct {
  id: number
  name: string
  description?: string
  price: string
  oldPrice?: string
  imageUrl?: string
  rating: any
  reviewCount: number
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlistItems()
        setItems(data as WishlistProduct[])
      } catch (error) {
        console.error('Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {items.length === 0
              ? 'Your wishlist is empty'
              : `You have ${items.length} item${items.length === 1 ? '' : 's'} saved`}
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No items yet</h2>
            <p className="text-muted-foreground mb-8">
              Start adding products to your wishlist to save them for later
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  imageUrl={product.imageUrl}
                  rating={Number(product.rating) || 0}
                  reviewCount={product.reviewCount || 0}
                />
              ))}
            </div>

            {/* Continue Shopping CTA */}
            <div className="text-center py-8">
              <Link href="/">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
