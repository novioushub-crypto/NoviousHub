'use client'

import { useCartStore } from '@/lib/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-text-secondary mb-8">Add some products to get started</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const imageUrl = item.product?.images?.[0]?.image_url || 'https://via.placeholder.com/100'
              const productName = item.product?.name || 'Product'
              const variantSize = item.variant?.size || 'N/A'
              const variantColor = item.variant?.color || 'N/A'
              const variantPrice = item.variant?.final_price || '0.00'
              
              return (
                <div key={item.variant_id} className="card flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={imageUrl}
                      alt={productName}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{productName}</h3>
                    <p className="text-sm text-text-secondary mb-2">
                      {variantSize} / {variantColor}
                    </p>
                    <p className="text-accent font-bold">${variantPrice}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="text-error hover:text-error/80"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-surface rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="p-1 hover:bg-surface rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
