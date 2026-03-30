'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Package, User, MapPin, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useState, useEffect } from 'react'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show on admin routes
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    {
      href: '/products',
      icon: Package,
      label: 'Products',
      active: pathname === '/products' || pathname?.startsWith('/products/') || pathname?.startsWith('/category/'),
    },
    {
      href: '/account/orders',
      icon: MapPin,
      label: 'Orders',
      active: pathname?.startsWith('/account/orders'),
    },
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: isAuthenticated ? '/account' : '/auth/login',
      icon: User,
      label: 'Account',
      active: pathname?.startsWith('/account') || pathname?.startsWith('/auth'),
    },
    {
      href: '/cart',
      icon: ShoppingCart,
      label: 'Cart',
      active: pathname === '/cart' || pathname === '/checkout',
      badge: mounted ? totalItems : 0,
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.active

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 ${
                isActive
                  ? 'text-accent'
                  : 'text-gray-500 dark:text-gray-400 hover:text-accent active:scale-95'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-b-full" />
              )}
              
              {/* Icon with badge */}
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold px-1 shadow-md">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
