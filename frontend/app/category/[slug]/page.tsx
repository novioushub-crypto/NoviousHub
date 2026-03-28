'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import FilterSidebar from '@/components/product/FilterSidebar'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [filters, setFilters] = useState({
    category: slug,
    min_price: '',
    max_price: '',
    ordering: '-created_at',
  })

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await api.get(`/categories/${slug}/`)
      return response.data
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const response = await api.get(`/products/?${params}`)
      return response.data
    },
  })

  const categoryInfo = {
    'leather-jackets': {
      title: 'Leather Jackets',
      description: 'Premium leather jackets crafted for style and durability',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920',
    },
    'sportswear': {
      title: 'Sportswear',
      description: 'High-performance athletic wear for champions',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920',
    },
  }

  const info = categoryInfo[slug as keyof typeof categoryInfo] || category

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-brand">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand/90 to-brand/50 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${info?.image})` }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            {info?.title}
          </h1>
          <p className="text-xl text-surface max-w-2xl mx-auto">
            {info?.description}
          </p>
        </motion.div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-text-secondary">
                {data?.results?.length || 0} products
              </p>
              <select
                value={filters.ordering}
                onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
                className="input w-auto"
              >
                <option value="-created_at">Newest</option>
                <option value="base_price">Price: Low to High</option>
                <option value="-base_price">Price: High to Low</option>
                <option value="-sales_count">Best Selling</option>
              </select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : data?.results?.length === 0 ? (
              <div className="card text-center py-16">
                <p className="text-xl text-text-secondary">No products found in this category</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.results?.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
