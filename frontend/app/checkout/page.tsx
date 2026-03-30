'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { Loader2, Banknote, Lock, CheckCircle } from 'lucide-react'
import api from '@/lib/api'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    setMounted(true)
    useCartStore.persist.rehydrate()
    useAuthStore.persist.rehydrate()
  }, [])

  const [shippingData, setShippingData] = useState({
    email: user?.email || '',
    full_name: user?.full_name || '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 200 ? 0 : 10
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.variant?.final_price || 0,
        })),
        shipping_address: shippingData,
        subtotal: subtotal.toFixed(2),
        shipping_cost: shipping.toFixed(2),
        tax_amount: tax.toFixed(2),
        total: total.toFixed(2),
        payment_method: 'cod', // Cash on Delivery
      }

      // Create order
      const response = await api.post('/orders/', orderData)
      
      setOrderNumber(response.data.order_number)
      setStep(3)
      clearCart()
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push(`/checkout/success?order=${response.data.order_number}`)
      }, 2000)
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.response?.data?.message || 'Failed to process order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted && items.length === 0 && step < 3) {
      router.push('/cart')
    }
  }, [mounted, items.length, router, step])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!isAuthenticated || (items.length === 0 && step < 3)) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-2 md:gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-accent' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent text-white' : 'bg-gray-300'}`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-semibold hidden sm:inline">Shipping</span>
            </div>
            <div className="w-8 md:w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-accent' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent text-white' : 'bg-gray-300'}`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-semibold hidden sm:inline">Payment</span>
            </div>
            <div className="w-8 md:w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-accent' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent text-white' : 'bg-gray-300'}`}>
                {step >= 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <span className="font-semibold hidden sm:inline">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="card">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingData.full_name}
                      onChange={(e) => setShippingData({ ...shippingData, full_name: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="input"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={shippingData.address_line1}
                      onChange={(e) => setShippingData({ ...shippingData, address_line1: e.target.value })}
                      className="input"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={shippingData.address_line2}
                      onChange={(e) => setShippingData({ ...shippingData, address_line2: e.target.value })}
                      className="input"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingData.postal_code}
                      onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Country</label>
                    <select
                      value={shippingData.country}
                      onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                      className="input"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-6">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Step 2: Payment Method (COD) */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="card">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Banknote className="w-6 h-6" />
                  Payment Method
                </h2>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-green-800 dark:text-green-200 mb-2">
                        Cash on Delivery (COD)
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Pay with cash when your order is delivered to your doorstep. No need for credit or debit cards!
                      </p>
                      <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pay only when you receive your order</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>No online payment required</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>100% secure and convenient</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Please keep the exact amount ready when the delivery arrives. Our delivery partner will collect <strong className="text-accent">${total.toFixed(2)}</strong> in cash.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-lg">Order Summary</h3>
                  <div className="bg-surface dark:bg-gray-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300 dark:border-gray-600">
                      <span>Total (COD)</span>
                      <span className="text-accent">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="card text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
                <p className="text-text-secondary mb-6">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
                <div className="bg-surface dark:bg-gray-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-text-secondary mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-accent">{orderNumber}</p>
                </div>
                <p className="text-sm text-text-secondary">
                  Redirecting to order confirmation...
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const productName = item.product?.name || 'Product'
                  const variantSize = item.variant?.size || 'N/A'
                  const variantColor = item.variant?.color || 'N/A'
                  const variantPrice = item.variant?.final_price || '0.00'
                  const imageUrl = item.product?.images?.[0]?.image_url
                  
                  return (
                    <div key={item.variant_id} className="flex gap-3">
                      {imageUrl && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={imageUrl} alt={productName} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 text-sm">
                        <p className="font-semibold">{productName}</p>
                        <p className="text-text-secondary">
                          {variantSize} / {variantColor}
                        </p>
                        <p className="text-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        ${(parseFloat(variantPrice.toString()) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                  🎉 You qualify for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
