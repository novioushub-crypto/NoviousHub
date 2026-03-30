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
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/',
    },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-brand border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.active

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 ${
                isActive
                  ? 'text-accent scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-accent active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 shadow-md">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-accent rounded-b-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
