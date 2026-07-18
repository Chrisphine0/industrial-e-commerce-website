'use client'

import Link from 'next/link'
import { useSession, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getCart } from '@/app/actions/cart'
import { getWishlistItems } from '@/app/actions/wishlist'

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const updateCounts = async () => {
    if (session?.user) {
      try {
        const [cartItems, wishlistItems] = await Promise.all([
          getCart(),
          getWishlistItems(),
        ])
        setCartCount(cartItems.length)
        setWishlistCount(wishlistItems.length)
      } catch (error) {
        console.error('Error fetching counts:', error)
      }
    }
  }

  useEffect(() => {
    updateCounts()
  }, [session?.user])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
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
            {/* Wishlist - hidden on mobile, visible on desktop with count */}
            {session?.user && (
              <Link href="/wishlist" className="relative hidden md:block">
                <Heart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart - visible on all views */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth - only on desktop */}
            {session?.user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{session.user.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 text-foreground" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
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
            {session?.user ? (
              <>
                <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors">
                  Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-foreground hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/sign-in" className="text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}