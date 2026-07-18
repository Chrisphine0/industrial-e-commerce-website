'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'

interface Customer {
  id: string
  name: string
  email: string
  role: string
  orderCount: number
  totalSpent: number
  createdAt: Date
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/customers')
        const data = await response.json()
        // Handle error response or array response
        if (Array.isArray(data)) {
          setCustomers(data)
        } else {
          setCustomers([])
        }
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  return (
    <AdminLayout userName="Admin User" userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-2">
            View and manage customer accounts
          </p>
        </div>

        {/* Customers Table */}
        <Card>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Name</th>
                    <th className="text-left py-4 px-6 font-semibold">Email</th>
                    <th className="text-center py-4 px-6 font-semibold">Role</th>
                    <th className="text-right py-4 px-6 font-semibold">Orders</th>
                    <th className="text-right py-4 px-6 font-semibold">Total Spent</th>
                    <th className="text-left py-4 px-6 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{customer.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {customer.email}
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {customer.role}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6">{customer.orderCount}</td>
                      <td className="text-right py-4 px-6 font-medium">
                        KSH {customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-xs">
                        {new Date(customer.createdAt).toLocaleDateString()}
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