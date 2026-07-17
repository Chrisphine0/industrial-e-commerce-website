'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  ShoppingCart,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  ordersByStatus: Array<{ status: string; count: number }>
  lowStockProducts: Array<{ id: number; name: string; stock: number }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminLayout userName="Admin User" userRole="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your admin dashboard. Manage products, orders, and customers.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                {loading ? (
                  <div className="h-8 bg-muted rounded mt-2 animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold mt-2">
                    ${(stats?.totalRevenue || 0).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Orders */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                {loading ? (
                  <div className="h-8 bg-muted rounded mt-2 animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold mt-2">
                    {stats?.totalOrders || 0}
                  </p>
                )}
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Orders by Status */}
          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Orders by Status</p>
              {loading ? (
                <div className="h-8 bg-muted rounded mt-2 animate-pulse" />
              ) : (
                <div className="mt-3 space-y-1 text-sm">
                  {stats?.ordersByStatus.slice(0, 2).map((status) => (
                    <p key={status.status}>
                      <span className="capitalize font-medium">
                        {status.status}:
                      </span>{' '}
                      {status.count}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Low Stock Products */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                {loading ? (
                  <div className="h-8 bg-muted rounded mt-2 animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold mt-2">
                    {stats?.lowStockProducts.length || 0}
                  </p>
                )}
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Low Stock Products Table */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Low Stock Products
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-right py-3 px-4 font-semibold">Stock</th>
                    <th className="text-right py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="text-right py-3 px-4">{product.stock}</td>
                      <td className="text-right py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.location.href = `/admin/products/${product.id}`
                          }
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              All products have sufficient stock
            </p>
          )}
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="justify-start"
            >
              <a href="/admin/products">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start"
            >
              <a href="/admin/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start"
            >
              <a href="/admin/customers">
                <Users className="h-4 w-4 mr-2" />
                View Customers
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

// Import icons
import { Package, Users } from 'lucide-react'
