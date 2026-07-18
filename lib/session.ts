import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Get the current session in:
 * - Server Actions (use without arguments)
 * - API Routes (pass the NextRequest or the Request object)
 * - Server Components (use the `headers()` function)
 */
export async function getServerSession(
  req?: NextRequest | Request | Headers
) {
  let headersObj: Headers

  if (req instanceof Headers) {
    // If we already have a Headers object
    headersObj = req
  } else if (req && 'headers' in req) {
    // If it's a Request or NextRequest, use its headers
    headersObj = req.headers
  } else {
    // Fallback: use the `headers()` from `next/headers` (Server Components / Actions)
    headersObj = await headers()
  }

  return auth.api.getSession({ headers: headersObj })
}