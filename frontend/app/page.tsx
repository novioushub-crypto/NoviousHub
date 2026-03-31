'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Truck, Shield, Sparkles, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import api from '@/lib/api'

interface Product {
  id: number
  name: string
  slug: string
  price: string
  images: Array<{ image_url: string }>
  category: { name: string }
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/v1/products/?page_size=8')
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
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand via-accent to-gold opacity-90 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full z-10"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full z-10"
        />
        
        <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 mx-auto text-gold" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
          >
            Redefine Your
            <span className="block bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
              Style
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl mx-auto"
          >
            Premium leather jackets and sportswear crafted for the bold. 
            Experience luxury that speaks volumes.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/products" 
              className="group btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              Shop Now 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/category/leather-jackets" 
              className="btn-outline bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-brand px-8 py-4 text-lg"
            >
              Leather Collection
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-brand to-accent text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '500+', label: 'Products' },
              { number: '50+', label: 'Countries' },
              { number: '4.9', label: 'Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 bg-surface dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Discover our curated collections designed for your lifestyle
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                href: '/category/leather-jackets',
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
                title: 'Leather Jackets',
                description: 'Timeless elegance meets modern design',
                gradient: 'from-brand/90'
              },
              {
                href: '/category/sportswear',
                image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
                title: 'Sportswear',
                description: 'Performance gear for champions',
                gradient: 'from-accent/90'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Link 
                  href={category.href} 
                  className="group relative h-[500px] block overflow-hidden rounded-3xl shadow-2xl"
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} to-transparent flex items-end p-8 transition-opacity duration-300`}>
                    <div className="text-white transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                      <h3 className="text-4xl font-display font-bold mb-3">{category.title}</h3>
                      <p className="text-lg text-gray-100 mb-4">{category.description}</p>
                      <span className="inline-flex items-center gap-2 text-gold font-semibold text-lg">
                        Explore Collection 
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4 bg-white dark:bg-card-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-accent" />
                Featured Products
              </h2>
              <p className="text-xl text-text-secondary">
                Handpicked favorites from our collection
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-accent hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-accent hover:text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
            </div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-80"
                >
                  <Link href={`/products/${product.slug}`} className="group block">
                    <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
                      {product.images?.[0]?.image_url ? (
                        <Image
                          src={product.images[0].image_url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                        New
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-accent font-semibold">{product.category?.name}</p>
                      <h3 className="font-bold text-lg group-hover:text-accent transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent">${product.price}</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          4.8
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/products" 
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-surface via-white to-surface dark:from-surface-dark dark:via-brand dark:to-surface-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'Handcrafted with finest materials for lasting elegance',
                color: 'text-gold'
              },
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'Fast and free delivery on orders over $200',
                color: 'text-accent'
              },
              {
                icon: Shield,
                title: 'Easy Returns',
                description: '30-day hassle-free return policy for your peace of mind',
                color: 'text-brand'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow`}
                >
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-brand via-accent to-gold text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-xl mb-10 text-gray-100">
              Join thousands of satisfied customers who trust Noviious for premium fashion
            </p>
            <Link 
              href="/products" 
              className="btn-primary bg-white text-brand hover:bg-gray-100 inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
