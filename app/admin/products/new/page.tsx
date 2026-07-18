'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    brand: '',
    price: '',
    oldPrice: '',
    stock: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value ? parseInt(value) : 0) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl }),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        alert('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    } finally {
      setSaving(false)
    }
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
          <h1 className="text-3xl font-bold">Create New Product</h1>
          <p className="text-muted-foreground mt-2">
            Add a new product to your catalog
          </p>
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
                  Product Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Professional Power Drill"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Product details and features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g., PWR-DRILL-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., PowerTech"
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
                    Price *
                  </label>
                  <Input
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 299.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Old Price (Optional)
                  </label>
                  <Input
                    name="oldPrice"
                    type="text"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    placeholder="e.g., 399.99"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold">Inventory</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock *
                </label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? 'Creating...' : 'Create Product'}
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