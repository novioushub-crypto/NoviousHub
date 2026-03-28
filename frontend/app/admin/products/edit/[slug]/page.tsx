'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [loading, setLoading] = useState(false)
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    base_price: '',
    compare_at_price: '',
    sku: '',
    category: '',
    is_featured: false,
    is_bestseller: false,
    is_new: false,
  })

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/products/${slug}/`)
      return response.data
    },
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        base_price: product.base_price || '',
        compare_at_price: product.compare_at_price || '',
        sku: product.sku || '',
        category: product.category?.id?.toString() || '',
        is_featured: product.is_featured || false,
        is_bestseller: product.is_bestseller || false,
        is_new: product.is_new || false,
      })
      setExistingImages(product.images || [])
    }
  }, [product])

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setNewImages([...newImages, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Add text fields
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('short_description', formData.short_description)
      submitData.append('base_price', formData.base_price)
      submitData.append('sku', formData.sku)
      submitData.append('category', formData.category)
      
      if (formData.compare_at_price) {
        submitData.append('compare_at_price', formData.compare_at_price)
      }
      
      submitData.append('is_featured', formData.is_featured ? 'true' : 'false')
      submitData.append('is_bestseller', formData.is_bestseller ? 'true' : 'false')
      submitData.append('is_new', formData.is_new ? 'true' : 'false')

      // Add new images
      newImages.forEach((image) => {
        submitData.append('images', image)
      })

      await api.put(`/products/${slug}/`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
      alert(`Failed to update product:\n${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

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
        <div className="mb-8">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Edit Product</h1>
          <p className="text-gray-600 dark:text-gray-400">Update product information</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">SKU *</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Short Description *</label>
                  <input type="text" required value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Full Description *</label>
                  <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-bold mb-4">Pricing</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Base Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" step="0.01" required value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Compare at Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" step="0.01" value={formData.compare_at_price} onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })} className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="text-xl font-bold mb-4">Category</h2>
              <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent">
                <option value="">Select category</option>
                <option value="1">Leather Jackets</option>
                <option value="2">Sportswear</option>
              </select>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Current Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={img.id} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={img.image_url} alt={`Image ${index + 1}`} fill className="object-cover" />
                      </div>
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      {img.is_primary && <span className="absolute bottom-2 left-2 px-2 py-1 bg-accent text-white text-xs rounded">Primary</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <h2 className="text-xl font-bold mb-4">Add New Images</h2>
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={preview} alt={`New ${index + 1}`} fill className="object-cover" />
                      </div>
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors block">
                <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="hidden" />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload new images</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </label>
            </div>

            {/* Badges */}
            <div>
              <h2 className="text-xl font-bold mb-4">Product Badges</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 accent-accent" />
                  <span className="font-semibold">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_bestseller} onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })} className="w-5 h-5 accent-accent" />
                  <span className="font-semibold">Bestseller</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_new} onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })} className="w-5 h-5 accent-accent" />
                  <span className="font-semibold">New Arrival</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              <Link href="/admin/products" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
