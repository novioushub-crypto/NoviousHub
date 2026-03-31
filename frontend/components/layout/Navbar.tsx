'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Search, Heart, ShoppingCart, User, Moon, Sun } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { useThemeStore } from '@/lib/store/themeStore'
import SearchModal from '@/components/search/SearchModal'

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items)
  const { isAuthenticated } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  // Check if we're on homepage
  const isHomepage = pathname === '/'

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine navbar style
  const isTransparent = isHomepage && !isScrolled
  const navbarBg = isTransparent ? 'bg-transparent' : 'bg-white dark:bg-brand shadow-lg'
  const textColor = isTransparent ? 'text-white' : 'text-brand dark:text-white'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-display font-bold">
            <span className={textColor}>
              NOVIIOUS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`font-semibold transition-colors ${textColor} hover:text-accent`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`font-semibold transition-colors ${textColor} hover:text-accent`}
            >
              All Products
            </Link>
            <Link
              href="/category/leather-jackets"
              className={`font-semibold transition-colors ${textColor} hover:text-accent`}
            >
              Leather Jackets
            </Link>
            <Link
              href="/category/sportswear"
              className={`font-semibold transition-colors ${textColor} hover:text-accent`}
            >
              Sportswear
            </Link>
            {isAuthenticated && (
              <Link
                href="/account/orders"
                className={`font-semibold transition-colors ${textColor} hover:text-accent`}
              >
                Track Orders
              </Link>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`${textColor} hover:text-accent transition-colors`}
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            
            {/* Theme Toggle - Switch for both Mobile & Desktop */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-accent' : 'bg-gray-300'
                }`}
                aria-label="Toggle theme"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
            
            {/* Wishlist - Desktop Only */}
            <Link href="/account/wishlist" className={`hidden md:block relative ${textColor} hover:text-accent transition-colors`}>
              <Heart className="w-6 h-6" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            {/* Cart - Desktop Only */}
            <Link href="/cart" className={`hidden md:block relative ${textColor} hover:text-accent transition-colors`}>
              <ShoppingCart className="w-6 h-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User - Desktop Only */}
            <Link href={isAuthenticated ? '/account' : '/auth/login'} className={`hidden md:block ${textColor} hover:text-accent transition-colors`}>
              <User className="w-6 h-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden ${textColor}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white dark:bg-brand border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-brand dark:text-white font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-brand dark:text-white font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link 
                href="/category/leather-jackets" 
                className="text-brand dark:text-white font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leather Jackets
              </Link>
              <Link 
                href="/category/sportswear" 
                className="text-brand dark:text-white font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sportswear
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/account/orders" 
                  className="text-brand dark:text-white font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Track Orders
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}
