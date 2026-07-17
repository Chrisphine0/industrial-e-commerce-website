'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WishlistButton } from '@/components/wishlist-button'
import { addToCart } from '@/app/actions/cart'

interface ProductCardProps {
  id: number
  name: string
  description?: string
  price: string
  oldPrice?: string
  imageUrl?: string
  rating: number
  reviewCount: number
}

export function ProductCard({
  id,
  name,
  description,
  price,
  oldPrice,
  imageUrl,
  rating,
  reviewCount,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const discount = oldPrice
    ? Math.round(((parseFloat(oldPrice) - parseFloat(price)) / parseFloat(oldPrice)) * 100)
    : 0

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart(id, 1)
      // TODO: Show toast notification
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
      {/* Image Container */}
      <Link href={`/products/${id}`} className="relative overflow-hidden bg-muted">
        <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground text-sm">No image</div>
          )}
        </div>
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
            -{discount}%
          </div>
        )}
        <div className="absolute top-2 left-2">
          <WishlistButton productId={id} />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${id}`} className="mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-border'}`}
                />
              ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Pricing */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">${price}</span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">${oldPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ShoppingCart className="h-4 w-4" />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
