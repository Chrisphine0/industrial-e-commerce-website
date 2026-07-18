import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignUpPage() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user) redirect('/')
  } catch (error) {
    // Session check failed, continue to show sign-up form
    console.warn('Session check failed:', error)
  }
  return <AuthForm mode="sign-up" />
}
