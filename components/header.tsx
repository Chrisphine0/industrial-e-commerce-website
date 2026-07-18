'use client'

import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Menu, LogOut, User, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getCart } from '@/app/actions/cart'

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const cartItems = await getCart()
        setCartCount(cartItems.length)
      } catch (error) {
        // Cart might be empty or error
      }
    }
    if (session?.user) {
      updateCartCount()
    }
  }, [session?.user])

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              HT
            </div>
            <span>HardwareTools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            {session?.user && (
              <Link href="/wishlist" className="relative">
                <Heart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Compare */}
          <Link href="/compare" className="relative">
            <BarChart3 className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
          </Link>

          {/* Auth */}
            {session?.user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">{session.user.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 text-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="outline" className="hidden sm:flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="sm:hidden">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-4 pb-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            {!session?.user && (
              <>
                <Link href="/sign-in" className="text-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
