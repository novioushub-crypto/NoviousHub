'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import ThemeProvider from '@/components/providers/ThemeProvider'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { useThemeStore } from '@/lib/store/themeStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  useEffect(() => {
    // Rehydrate all stores on client side
    useCartStore.persist.rehydrate()
    useAuthStore.persist.rehydrate()
    useWishlistStore.persist.rehydrate()
    useThemeStore.persist.rehydrate()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
