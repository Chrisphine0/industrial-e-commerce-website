import { getOrderById, updateOrderStatus } from '@/app/actions/admin'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth()

    const order = await getOrderById(parseInt(params.id))
    if (!order) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return Response.json(order)
  } catch (error) {
    console.error('Get order error:', error)
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
    if (body.status) {
      await updateOrderStatus(
        parseInt(params.id),
        body.status
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Update order error:', error)
    return Response.json(
      { error: 'Failed to update order' },
      { status: 400 }
    )
  }
}
