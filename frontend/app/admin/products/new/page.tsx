'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import Image from 'next/image'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImages([...images, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
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
      
      // Add optional fields only if they have values
      if (formData.compare_at_price) {
        submitData.append('compare_at_price', formData.compare_at_price)
      }
      
      // Add boolean fields as proper booleans
      submitData.append('is_featured', formData.is_featured ? 'true' : 'false')
      submitData.append('is_bestseller', formData.is_bestseller ? 'true' : 'false')
      submitData.append('is_new', formData.is_new ? 'true' : 'false')

      // Add images as array
      images.forEach((image) => {
        submitData.append('images', image)
      })

      // Debug: Log what we're sending
      console.log('Form data being sent:')
      for (let [key, value] of submitData.entries()) {
        console.log(key, ':', value)
      }

      const response = await api.post('/products/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      alert('Product created successfully!')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
      alert(`Failed to create product:\n${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Add New Product</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new product</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="Classic Black Leather Jacket" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">SKU *</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="LJ-001" />
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

            {/* Images */}
            <div>
              <h2 className="text-xl font-bold mb-4">Product Images</h2>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                      </div>
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-accent text-white text-xs rounded">Primary</span>}
                    </div>
                  ))}
                </div>
              )}
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors block">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload images</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB. First image is primary.</p>
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
                {loading ? 'Creating...' : 'Create Product'}
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
