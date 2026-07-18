'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'

interface Product {
  id: number
  name: string
  description?: string
  sku?: string
  brand?: string
  price: string
  oldPrice?: string
  categoryId?: number
  imageUrl?: string
  stock: number
  availability: boolean
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const productId = resolvedParams.id
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState<Partial<Product>>({})

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          setFormData(data)
          setImageUrl(data.imageUrl || '')
        }
      } catch (error) {
        console.error('Failed to load product:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]:
        type === 'number' ? (value ? parseInt(value) : 0) : 
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl }),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        alert('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    } finally {
      setSaving(false)
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

  if (!product) {
    return (
      <AdminLayout userName="Admin User" userRole="admin">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userName="Admin User" userRole="admin">
      <div className="space-y-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-2">{product.name}</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Product Image */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product Image</h3>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(results) => {
                  const url = (results.info as { secure_url?: string })?.secure_url
                  if (url) setImageUrl(url)
                }}
                options={{
                  folder: 'products',
                  maxFileSize: 5000000,
                  resourceType: 'image',
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                )}
              </CldUploadWidget>
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>
                <Input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <Input
                    name="sku"
                    value={formData.sku || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <Input
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold">Pricing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <Input
                    name="price"
                    type="text"
                    value={formData.price || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Old Price (Optional)
                  </label>
                  <Input
                    name="oldPrice"
                    type="text"
                    value={formData.oldPrice || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold">Inventory</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="availability"
                  id="availability"
                  checked={formData.availability ?? true}
                  onChange={handleChange}
                  className="rounded"
                />
                <label htmlFor="availability" className="text-sm font-medium cursor-pointer">
                  Product is available
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  )
}