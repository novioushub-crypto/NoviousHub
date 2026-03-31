'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import api from '@/lib/api'

interface Product {
  id: number
  name: string
  slug: string
  price: string
  base_price?: string
  primary_image?: string
  images: Array<{ image_url: string; is_primary?: boolean }>
  category: { name: string }
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/?page_size=8')
        setFeaturedProducts(response.data.results || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-brand">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand/90 to-brand/50 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-display font-bold mb-6"
          >
            Redefine Your Style
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-surface"
          >
            Premium leather jackets and sportswear crafted for the bold
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/category/leather-jackets" className="btn-outline bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-brand">
              Leather Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
            Shop by Category
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/category/leather-jackets" className="group relative h-[500px] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
                alt="Leather Jackets"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/90 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-display font-bold mb-2">Leather Jackets</h3>
                  <p className="text-surface mb-4">Timeless elegance meets modern design</p>
                  <span className="inline-flex items-center gap-2 text-gold font-semibold">
                    Explore Collection <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/category/sportswear" className="group relative h-[500px] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
                alt="Sportswear"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-display font-bold mb-2">Sportswear</h3>
                  <p className="text-surface mb-4">Performance gear for champions</p>
                  <span className="inline-flex items-center gap-2 text-gold font-semibold">
                    Explore Collection <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Horizontal Scroll */}
      <section className="py-20 px-4 bg-surface dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Featured Products
            </h2>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-white dark:bg-card-dark hover:bg-accent hover:text-white transition-colors shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-white dark:bg-card-dark hover:bg-accent hover:text-white transition-colors shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
            </div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map((product) => {
                // Handle both list and detail product formats
                const primaryImage = product.primary_image || 
                                   product.images?.find((img) => img.is_primary)?.image_url || 
                                   product.images?.[0]?.image_url ||
                                   'https://via.placeholder.com/400'
                
                const productPrice = product.base_price || product.price

                return (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-72"
                  >
                    <Link href={`/products/${product.slug}`} className="group block">
                      <div className="relative h-80 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized={primaryImage.includes('placeholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-accent font-semibold">{product.category?.name}</p>
                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-accent">${productPrice}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          <div className="text-center mt-8">
            <Link 
              href="/products" 
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-text-secondary">Handcrafted with finest materials</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-text-secondary">On orders over $200</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-text-secondary">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
