'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import FilterSidebar from '@/components/product/FilterSidebar'
import { Loader2 } from 'lucide-react'

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    min_price: '',
    max_price: '',
    ordering: '-created_at',
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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
          All Products
        </h1>

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
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.results?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
