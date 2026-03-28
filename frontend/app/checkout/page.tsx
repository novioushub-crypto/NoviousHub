'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    useCartStore.persist.rehydrate()
  }, [])

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Handle checkout logic here
    // Create order, initiate Stripe payment, etc.
    
    setLoading(false)
  }

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items.length, router])

  if (!mounted) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-accent' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="font-semibold">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-accent' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="font-semibold">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-accent' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="font-semibold">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="input"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Continue to Payment
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const productName = item.product?.name || 'Product'
                  const variantSize = item.variant?.size || 'N/A'
                  const variantColor = item.variant?.color || 'N/A'
                  const variantPrice = item.variant?.final_price || '0.00'
                  
                  return (
                    <div key={item.variant_id} className="flex gap-3">
                      <div className="text-sm">
                        <p className="font-semibold">{productName}</p>
                        <p className="text-text-secondary">
                          {variantSize} / {variantColor} × {item.quantity}
                        </p>
                      </div>
                      <p className="ml-auto font-semibold">
                        ${(parseFloat(variantPrice) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">$10.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span className="text-accent">${(getTotalPrice() + 10).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
