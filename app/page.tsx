'use client'

import { useEffect, useState } from 'react'
import { getProducts, getCategories } from '@/app/actions/products'
import { ProductCard } from '@/components/product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface Product {
  id: number
  name: string
  description?: string
  price: string
  oldPrice?: string
  imageUrl?: string
  rating: number
  reviewCount: number
}

interface Category {
  id: number
  name: string
  slug: string
  icon_url?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(searchQuery, selectedCategory || undefined),
          getCategories(),
        ])
        setProducts(productsData || [])
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchQuery, selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Tools & Equipment</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Everything you need for your warehouse and industrial projects
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Input
                placeholder="Search tools, equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-12 border-0 rounded-lg text-foreground"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : ''
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                oldPrice={product.oldPrice}
                imageUrl={product.imageUrl}
                rating={Number(product.rating) || 0}
                reviewCount={product.reviewCount || 0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}