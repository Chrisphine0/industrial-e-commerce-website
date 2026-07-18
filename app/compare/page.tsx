import { getComparison } from "@/app/actions/comparison"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComparisonButton } from "@/components/comparison-button"

interface Product {
  id: number
  name: string
  description?: string
  sku?: string
  brand?: string
  price: string
  oldPrice?: string
  imageUrl?: string
  rating: string
  reviewCount: number
  stock: number
}

export default async function ComparePage() {
  const productIds = await getComparison()

  if (!productIds.length) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg">No products to compare. Add some from the product pages!</p>
          </div>
        </div>
      </main>
    )
  }

  const numericIds = productIds.map(id => parseInt(id)).filter(id => !isNaN(id))
  const productList = (await db.select().from(products).where(inArray(products.id, numericIds))) as Product[]

  // Define attributes to compare
  const attributes = ["name", "brand", "price", "stock", "sku", "description"]
  
  // Helper to format price with KSH
  const formatPrice = (price: string | null) => {
    return price ? `KSH ${price}` : "-"
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <h1 className="text-3xl font-bold mb-6">Compare Products</h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted font-medium">Attribute</th>
                {productList.map((p) => (
                  <th key={p.id} className="border border-border p-2 bg-muted">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr}>
                  <td className="border border-border p-2 font-medium capitalize">{attr}</td>
                  {productList.map((p) => (
                    <td key={p.id} className="border border-border p-2">
                      {attr === "price" 
                        ? formatPrice(p.price as string | null)
                        : p[attr as keyof typeof p] 
                          ? String(p[attr as keyof typeof p]) 
                          : "-"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="border border-border p-2 font-medium">Actions</td>
                {productList.map((p) => (
                  <td key={p.id} className="border border-border p-2">
                    <ComparisonButton productId={p.id} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}