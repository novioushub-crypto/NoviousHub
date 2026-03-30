'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { Product } from '@/types'
import { 
  Plus, Search, Edit, Trash2, Eye, 
  Package, DollarSign, TrendingUp, Loader2, X, Star
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProductsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', searchQuery, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (categoryFilter) params.append('category', categoryFilter)
      const response = await api.get(`/products/?${params}`)
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/products/${slug}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      alert('Product deleted successfully!')
    },
    onError: () => {
      alert('Failed to delete product')
    },
  })

  const handleDelete = (slug: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(slug)
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/products/edit/${slug}`)
  }

  const handlePreview = async (slug: string) => {
    try {
      const response = await api.get(`/products/${slug}/`)
      setPreviewProduct(response.data)
    } catch (error) {
      alert('Failed to load product details')
    }
  }

  const products = data?.results || []
  const totalValue = products.reduce((sum: number, p: Product) => sum + parseFloat(p.base_price), 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
          </div>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Featured</p>
                <p className="text-2xl font-bold">{products.filter((p: Product) => p.is_featured).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Categories</option>
              <option value="leather-jackets">Leather Jackets</option>
              <option value="sportswear">Sportswear</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product: Product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.primary_image || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        {product.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">${product.base_price}</p>
                      {product.compare_at_price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.compare_at_price}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.is_featured && (
                          <span className="px-2 py-1 bg-gold/20 text-gold rounded text-xs">Featured</span>
                        )}
                        {product.is_new && (
                          <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">New</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(product.slug)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(product.slug)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug, product.name)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Preview</h2>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100 mb-4">
                      <Image
                        src={previewProduct.images?.[0]?.image_url || previewProduct.primary_image || 'https://via.placeholder.com/400'}
                        alt={previewProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {previewProduct.images && previewProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {previewProduct.images.slice(0, 4).map((img: any, idx: number) => (
                          <div key={idx} className="relative h-20 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={img.image_url}
                              alt={`${previewProduct.name} ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-2 mb-3">
                      {previewProduct.is_new && <span className="badge-new">NEW</span>}
                      {previewProduct.is_bestseller && <span className="badge-bestseller">BESTSELLER</span>}
                      {previewProduct.is_featured && <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-semibold">Featured</span>}
                    </div>

                    <h3 className="text-3xl font-bold mb-2">{previewProduct.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(previewProduct.average_rating || 0)
                                ? 'fill-gold text-gold'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({previewProduct.average_rating?.toFixed(1) || '0.0'})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl font-bold text-accent">
                        ${previewProduct.base_price}
                      </span>
                      {previewProduct.compare_at_price && (
                        <>
                          <span className="text-2xl text-gray-500 line-through">
                            ${previewProduct.compare_at_price}
                          </span>
                          <span className="badge-sale">
                            -{previewProduct.discount_percentage}%
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">SKU</p>
                        <p className="font-mono">{previewProduct.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</p>
                        <p>{previewProduct.category?.name || previewProduct.category_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</p>
                        <p className="text-gray-700 dark:text-gray-300">{previewProduct.short_description}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setPreviewProduct(null)
                          handleEdit(previewProduct.slug)
                        }}
                        className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Product
                      </button>
                      <button
                        onClick={() => {
                          setPreviewProduct(null)
                          handleDelete(previewProduct.slug, previewProduct.name)
                        }}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {previewProduct.description && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-bold mb-4">Full Description</h4>
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewProduct.description }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
