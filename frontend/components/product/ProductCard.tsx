'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { Product } from '@/types'
import { motion } from 'framer-motion'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, isInWishlist } = useWishlistStore()
  const [isAdding, setIsAdding] = useState(false)
  const inWishlist = isInWishlist(product.id)

  // Handle both list and detail product formats
  const primaryImage = product.primary_image || 
                       product.images?.find((img) => img.is_primary)?.image_url || 
                       product.images?.[0]?.image_url ||
                       'https://via.placeholder.com/400'

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding) return
    
    setIsAdding(true)
    await addToWishlist(product.id)
    setIsAdding(false)
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card group cursor-pointer relative overflow-hidden"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.is_new && <span className="badge-new">NEW</span>}
          {product.is_bestseller && <span className="badge-bestseller">BESTSELLER</span>}
          {product.discount_percentage > 0 && (
            <span className="badge-sale">-{product.discount_percentage}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg transition-all ${
            inWishlist 
              ? 'bg-accent text-white' 
              : 'bg-white dark:bg-card-dark hover:bg-accent hover:text-white'
          } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAddToWishlist}
          disabled={isAdding}
        >
          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Image */}
        <div className="relative h-80 mb-4 overflow-hidden rounded-lg">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.average_rating)
                      ? 'fill-gold text-gold'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary">
              ({product.average_rating.toFixed(1)})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">
              ${product.base_price}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-text-secondary line-through">
                ${product.compare_at_price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
