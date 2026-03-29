'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store/cartStore'
import { Star, Heart, Truck, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const addItem = useCartStore((state) => state.addItem)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/products/${slug}/`)
      return response.data
    },
  })

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    // If product has variants, find the matching variant
    if (product?.variants && product.variants.length > 0) {
      const variant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      )

      if (variant && product) {
        addItem({
          variant_id: variant.id,
          product,
          variant,
          quantity,
        })
        alert('Added to cart!')
      }
    } else {
      // If no variants exist, create a temporary variant for cart
      const tempVariant = {
        id: product?.id || 0,
        size: selectedSize,
        color: selectedColor,
        color_hex: '#000000',
        sku: product?.sku || '',
        stock: 100,
        price_adjustment: 0,
        final_price: product?.base_price || 0,
      }

      if (product) {
        addItem({
          variant_id: tempVariant.id,
          product,
          variant: tempVariant,
          quantity,
        })
        alert('Added to cart!')
      }
    }
  }

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>
  }

  if (!product) {
    return <div className="min-h-screen pt-24 flex items-center justify-center">Product not found</div>
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/products" className="inline-flex items-center gap-2 text-accent mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative h-[600px] mb-4 rounded-2xl overflow-hidden">
              <Image
                src={product.images[selectedImage]?.image_url || 'https://via.placeholder.com/600'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <Image src={image.image_url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.is_new && <span className="badge-new">NEW</span>}
              {product.is_bestseller && <span className="badge-bestseller">BESTSELLER</span>}
            </div>

            <h1 className="text-4xl font-display font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.average_rating)
                        ? 'fill-gold text-gold'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-text-secondary">
                {product.average_rating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-accent">${product.base_price}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-2xl text-text-secondary line-through">
                    ${product.compare_at_price}
                  </span>
                  <span className="badge-sale">-{product.discount_percentage}%</span>
                </>
              )}
            </div>

            <p className="text-text-secondary mb-8">{product.short_description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-3">Size</label>
              {product.variants && product.variants.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {[...new Set(product.variants.map((v) => v.size))].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-3">Color</label>
              {product.variants && product.variants.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {[...new Set(product.variants.map((v) => v.color))].map((color) => {
                    const variant = product.variants.find((v) => v.color === color)
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                          selectedColor === color 
                            ? 'border-accent scale-110 shadow-lg' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-accent'
                        }`}
                        style={{ backgroundColor: variant?.color_hex || '#ccc' }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full shadow-md" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Black', hex: '#000000' },
                    { name: 'White', hex: '#FFFFFF' },
                    { name: 'Red', hex: '#EF4444' },
                    { name: 'Blue', hex: '#3B82F6' },
                    { name: 'Green', hex: '#10B981' }
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColor === color.name 
                          ? 'border-accent scale-110 shadow-lg' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-accent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className={`w-3 h-3 rounded-full shadow-md ${color.name === 'White' ? 'bg-black' : 'bg-white'}`} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:border-accent transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:border-accent transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button onClick={handleAddToCart} className="btn-primary flex-1">
                Add to Cart
              </button>
              <button className="btn-outline p-4">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-accent" />
                <span>Free shipping on orders over $200</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-accent" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16">
          <h2 className="text-3xl font-display font-bold mb-6">Description</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  )
}
