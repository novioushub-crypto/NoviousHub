'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'

export default function HomePage() {
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
