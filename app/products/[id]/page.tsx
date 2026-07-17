'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProductById } from '@/app/actions/products'
import { addToCart } from '@/app/actions/cart'
import { Button } from '@/components/ui/button'
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react'

interface Product {
  id: number
  name: string
  description?: string
  price: string
  oldPrice?: string
  imageUrl?: string
  rating: number
  reviewCount: number
  stock: number
  brand?: string
  sku?: string
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(parseInt(params.id))
        setProduct(data)
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      await addToCart(product!.id, quantity)
      // TODO: Show success toast
      setQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg">Product not found</p>
          </div>
        </div>
      </main>
    )
  }

  const discount = product.oldPrice
    ? Math.round(((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100)
    : 0

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-muted rounded-lg aspect-square p-8 relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-muted-foreground">No image</div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold">
                -{discount}%
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-border'}`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} out of 5 ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">${product.oldPrice}</span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Product Details */}
            <div className="bg-muted rounded-lg p-4 mb-6 space-y-2">
              {product.sku && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="text-foreground font-medium">{product.sku}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className={product.stock > 0 ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">✓ Free shipping on all orders</p>
              <p className="text-sm text-muted-foreground mb-4">✓ 30-day return policy</p>
              <p className="text-sm text-muted-foreground">✓ 2-year warranty included</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
