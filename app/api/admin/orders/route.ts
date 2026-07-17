import { getAdminOrders } from '@/app/actions/admin'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    await requireAdminAuth()

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || undefined

    const orders = await getAdminOrders(status || undefined)
    return Response.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    return Response.json(
      { error: 'Unauthorized or internal error' },
      { status: 403 }
    )
  }
}
