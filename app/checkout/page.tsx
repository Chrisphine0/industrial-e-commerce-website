'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCart } from '@/app/actions/cart'
import { createOrder } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { useSession } from '@/lib/auth-client'

interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    phone: '',
  })

  useEffect(() => {
    if (!session?.user) {
      router.push('/sign-in')
      return
    }

    loadCart()
  }, [session, router])

  const loadCart = async () => {
    try {
      const items = await getCart()
      setCartItems(items)
      setFormData((prev) => ({
        ...prev,
        email: session?.user?.email || '',
      }))
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      )
      const tax = subtotal * 0.1
      const total = subtotal + tax

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        total,
      }

      const result = await createOrder(
        orderData.items,
        orderData.paymentMethod,
        orderData.total
      )

      if (result.success) {
        router.push(`/order-confirmation/${result.orderNumber}`)
      }
    } catch (error) {
      console.error('Error processing order:', error)
      // TODO: Show error toast
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
          </div>
        </div>
      </main>
    )
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
        <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Checkout</h2>

              {/* Contact Information */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4 text-foreground">Contact Information</h3>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="mb-4"
                />
              </div>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4 text-foreground">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="mb-4"
                  required
                />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="province"
                    placeholder="State/Province"
                    value={formData.province}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="KE">Kenya</option>
                    <option value="UG">Uganda</option>
                    <option value="TZ">Tanzania</option>
                    <option value="ZA">South Africa</option>
                    <option value="NG">Nigeria</option>
                    <option value="US">United States</option>
                  </select>
                </div>
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-foreground">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-foreground">Credit/Debit Card (Stripe)</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-foreground">M-Pesa</p>
                      <p className="text-sm text-muted-foreground">Mobile money for Kenya</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-foreground">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold"
            >
              {processing ? 'Processing...' : 'Complete Order'}
            </Button>
          </form>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4 text-foreground">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-foreground">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>KSH {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

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

              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">KSH {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}