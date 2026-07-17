'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye } from 'lucide-react'

interface Order {
  id: number
  orderNumber: string
  total: string
  status: string
  paymentMethod?: string
  createdAt: Date
  userId: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/admin/orders?status=${encodeURIComponent(statusFilter)}`
        )
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [statusFilter])

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <AdminLayout userName="Admin User" userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track customer orders
          </p>
        </div>

        {/* Status Filter */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === (status === 'all' ? '' : status) ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status === 'all' ? '' : status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Order Number</th>
                    <th className="text-left py-4 px-6 font-semibold">Customer</th>
                    <th className="text-right py-4 px-6 font-semibold">Total</th>
                    <th className="text-left py-4 px-6 font-semibold">Payment</th>
                    <th className="text-center py-4 px-6 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 font-semibold">Date</th>
                    <th className="text-right py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{order.orderNumber}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {order.userId.substring(0, 8)}...
                      </td>
                      <td className="text-right py-4 px-6">
                        ${parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {order.paymentMethod || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-right py-4 px-6">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
