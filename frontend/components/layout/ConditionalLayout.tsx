'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    // Admin routes - no navbar/footer, just children
    return <>{children}</>
  }

  // Regular routes - with navbar/footer and mobile bottom nav
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
