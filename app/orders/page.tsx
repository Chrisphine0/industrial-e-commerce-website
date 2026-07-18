'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getOrders } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, Calendar, CreditCard } from 'lucide-react'

interface Order {
  id: number
  orderNumber: string
  status: string
  total: string
  createdAt: Date | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data as Order[])
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-foreground">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No orders found</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Order #{order.orderNumber}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        KSH {order.total}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : order.status === 'shipped' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}