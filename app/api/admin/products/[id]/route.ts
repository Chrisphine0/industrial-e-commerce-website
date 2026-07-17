import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/app/actions/admin'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth()

    const product = await getProductById(parseInt(params.id))
    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return Response.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return Response.json(
      { error: 'Unauthorized or internal error' },
      { status: 403 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth()

    const body = await request.json()
    await updateProduct(parseInt(params.id), body)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Update product error:', error)
    return Response.json(
      { error: 'Failed to update product' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth()

    await deleteProduct(parseInt(params.id))

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return Response.json(
      { error: 'Failed to delete product' },
      { status: 400 }
    )
  }
}
