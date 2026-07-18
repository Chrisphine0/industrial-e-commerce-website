import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/app/actions/admin'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth({ redirectOnFail: false })

    const { id } = await params
    const product = await getProductById(id)
    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return Response.json(product)
  } catch (error: any) {
    console.error('Get product error:', error)
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return Response.json(
      { error: error.message || 'Failed' },
      { status }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth({ redirectOnFail: false })

    const { id } = await params
    const body = await request.json()
    await updateProduct(id, body)

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Update product error:', error)
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 400
    return Response.json(
      { error: error.message || 'Failed to update product' },
      { status }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth({ redirectOnFail: false })

    const { id } = await params
    await deleteProduct(id)

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Delete product error:', error)
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 400
    return Response.json(
      { error: error.message || 'Failed to delete product' },
      { status }
    )
  }
}