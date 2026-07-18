'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

interface Product {
  id: number
  name: string
  sku?: string
  price: string
  stock: number
  categoryId?: number
  availability: boolean
  createdAt: Date
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/admin/products?search=${encodeURIComponent(search)}`
        )
        const data = await response.json()
        // Handle error response or array response
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [search])

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId))
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <AdminLayout userName="Admin User" userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-2">
              Manage your product catalog
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Name</th>
                    <th className="text-left py-4 px-6 font-semibold">SKU</th>
                    <th className="text-right py-4 px-6 font-semibold">Price</th>
                    <th className="text-right py-4 px-6 font-semibold">Stock</th>
                    <th className="text-center py-4 px-6 font-semibold">Status</th>
                    <th className="text-right py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{product.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {product.sku || '—'}
                      </td>
                      <td className="text-right py-4 px-6">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="text-right py-4 px-6">
                        <span
                          className={
                            product.stock < 10
                              ? 'text-destructive font-semibold'
                              : ''
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.availability
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {product.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6 flex justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
