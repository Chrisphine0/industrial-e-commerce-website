'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/app/actions/wishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: number
  className?: string
  showText?: boolean
}

export function WishlistButton({ productId, className, showText = false }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkWishlist = async () => {
      const result = await isInWishlist(productId)
      setInWishlist(result)
    }

    checkWishlist()
  }, [productId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    try {
      if (inWishlist) {
        await removeFromWishlist(productId)
        setInWishlist(false)
      } else {
        await addToWishlist(productId)
        setInWishlist(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'transition-colors',
        inWishlist ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      <Heart
        className={cn('h-5 w-5', inWishlist && 'fill-current')}
      />
      {showText && <span className="ml-2">{inWishlist ? 'Saved' : 'Save'}</span>}
    </Button>
  )
}
