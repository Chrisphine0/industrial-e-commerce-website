import { getDashboardStats } from '@/app/actions/admin'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    await requireAdminAuth()
    const stats = await getDashboardStats()
    return Response.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return Response.json(
      { error: 'Unauthorized or internal error' },
      { status: 403 }
    )
  }
}
