'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCart, removeFromCart, updateCartItem } from '@/app/actions/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash2 } from 'lucide-react'

interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: string
    imageUrl?: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const items = await getCart()
      setCartItems(items)
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (cartId: number, quantity: number) => {
    try {
      await updateCartItem(cartId, quantity)
      await loadCart()
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const handleRemove = async (cartId: number) => {
    try {
      await removeFromCart(cartId)
      await loadCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4 items-start"
                  >
                    {/* Image */}
                    {item.product.imageUrl && (
                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-2">{item.product.name}</h3>
                      
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Qty:</span>
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-muted transition-colors"
                          >
                            −
                          </button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1
                              if (val > 0) handleUpdateQuantity(item.id, val)
                            }}
                            className="w-12 text-center border-0 focus:ring-0"
                            min="1"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-muted transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-foreground mb-4">
                        KSH {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4 text-foreground">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>KSH {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (10%)</span>
                    <span>KSH {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-semibold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                  <span>Total</span>
                  <span className="text-primary">KSH {total.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Free shipping on all orders
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
