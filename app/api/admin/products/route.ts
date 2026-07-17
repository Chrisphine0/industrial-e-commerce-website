import { getAdminProducts, createProduct } from '@/app/actions/admin'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    await requireAdminAuth()

    const url = new URL(request.url)
    const search = url.searchParams.get('search') || undefined

    const products = await getAdminProducts(search || undefined)
    return Response.json(products)
  } catch (error) {
    console.error('Get products error:', error)
    return Response.json(
      { error: 'Unauthorized or internal error' },
      { status: 403 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminAuth()

    const body = await request.json()
    const productId = await createProduct(body)

    return Response.json({ id: productId }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return Response.json(
      { error: 'Failed to create product' },
      { status: 400 }
    )
  }
}
