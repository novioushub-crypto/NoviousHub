import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import { Product } from '@/types'

interface WishlistItem {
  id: number
  product: Product
  created_at: string
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: number) => Promise<boolean>
  removeFromWishlist: (itemId: number) => Promise<void>
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        try {
          set({ isLoading: true })
          const response = await api.get('/wishlist/')
          set({ items: response.data.results || [], isLoading: false })
        } catch (error: any) {
          console.error('Failed to fetch wishlist:', error)
          // If unauthorized, clear wishlist
          if (error.response?.status === 401) {
            set({ items: [], isLoading: false })
          } else {
            set({ isLoading: false })
          }
        }
      },

      addToWishlist: async (productId: number) => {
        try {
          const response = await api.post('/wishlist/', { product_id: productId })
          set((state) => ({
            items: [...state.items, response.data],
          }))
          return true
        } catch (error: any) {
          console.error('Failed to add to wishlist:', error)
          if (error.response?.status === 401) {
            alert('Please login to add items to wishlist')
          } else if (error.response?.status === 400) {
            // Already in wishlist
            return false
          } else {
            alert('Failed to add to wishlist')
          }
          return false
        }
      },

      removeFromWishlist: async (itemId: number) => {
        try {
          await api.delete(`/wishlist/${itemId}/`)
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }))
        } catch (error) {
          console.error('Failed to remove from wishlist:', error)
          alert('Failed to remove from wishlist')
        }
      },

      isInWishlist: (productId: number) => {
        return get().items.some((item) => item.product.id === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    }
  )
)
