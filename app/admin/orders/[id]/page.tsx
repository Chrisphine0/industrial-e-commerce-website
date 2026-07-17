'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: string
  productName?: string
}

interface Order {
  id: number
  orderNumber: string
  userId: string
  subtotal: string
  tax: string
  shipping: string
  total: string
  status: string
  paymentMethod?: string
  createdAt: Date
  items?: OrderItem[]
}

const statusSteps = ['pending', 'processing', 'shipped', 'delivered']
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/orders/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error('Failed to load order:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [params.id])

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setOrder({ ...order, status: newStatus })
        router.refresh()
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout userName="Admin User" userRole="admin">
        <div className="space-y-6">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout userName="Admin User" userRole="admin">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/admin/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userName="Admin User" userRole="admin">
      <div className="space-y-6">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {statusSteps.map((step, index) => (
                <Button
                  key={step}
                  variant={order.status === step ? 'default' : 'outline'}
                  onClick={() => handleStatusChange(step)}
                  disabled={updating}
                  className="justify-center"
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </Button>
              ))}
              <Button
                variant={order.status === 'cancelled' ? 'destructive' : 'outline'}
                onClick={() => handleStatusChange('cancelled')}
                disabled={updating}
                className="justify-center"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID:</span>
              <span className="font-medium">{order.userId.substring(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium">{order.paymentMethod || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>

          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 font-semibold">Product</th>
                    <th className="text-center py-3 font-semibold">Quantity</th>
                    <th className="text-right py-3 font-semibold">Price</th>
                    <th className="text-right py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="py-3">{item.productName || 'Unknown Product'}</td>
                      <td className="text-center py-3">{item.quantity}</td>
                      <td className="text-right py-3">
                        ${parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="text-right py-3">
                        ${(
                          parseFloat(item.price) * item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No items in this order</p>
          )}
        </Card>

        {/* Totals */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Total</h2>

          <div className="space-y-3 text-sm max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax:</span>
              <span>${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping:</span>
              <span>${parseFloat(order.shipping).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total:</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
