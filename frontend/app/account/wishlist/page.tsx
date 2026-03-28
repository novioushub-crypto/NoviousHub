'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingCart, Heart, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useCartStore } from '@/lib/store/cartStore'

export default function WishlistPage() {
  const queryClient = useQueryClient()
  const addItem = useCartStore((state) => state.addItem)

  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get('/wishlist/')
      return response.data
    },
  })

  const wishlist = wishlistData?.results || []

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/wishlist/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  const handleAddToCart = (product: any) => {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0]
      addItem({
        variant_id: variant.id,
        product,
        variant,
        quantity: 1,
      })
      alert('Added to cart!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2">My Wishlist</h1>
          <p className="text-text-secondary">
            {wishlist?.length || 0} items saved
          </p>
        </motion.div>

        {!wishlist || wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <Heart className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-text-secondary mb-6">
              Save items you love to buy them later
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group relative overflow-hidden"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  className="absolute top-4 right-4 z-10 bg-white dark:bg-card-dark p-2 rounded-full shadow-lg hover:bg-error hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link href={`/products/${item.product.slug}`}>
                  {/* Image */}
                  <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={item.product.images?.[0]?.image_url || 'https://via.placeholder.com/400'}
                      alt={item.product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="text-2xl font-bold text-accent mb-4">
                    ${item.product.base_price}
                  </p>
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item.product)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
