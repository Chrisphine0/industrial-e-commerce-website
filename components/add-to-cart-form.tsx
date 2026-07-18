'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { addToCart } from '@/app/actions/cart'

interface AddToCartFormProps {
  productId: number
  stock: number
}

export function AddToCartForm({ productId, stock }: AddToCartFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart(productId, 1)
      // TODO: Show toast notification
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      disabled={stock === 0 || isLoading}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold gap-2"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-5 w-5" />
      {stock === 0 ? 'Out of Stock' : isLoading ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}