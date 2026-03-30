'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, MapPin, Clock, Loader2, ArrowLeft, Calendar, CreditCard, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import Image from 'next/image'

export default function OrderDetailsPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      const response = await api.get(`/orders/?order_number=${orderNumber}`)
      return response.data.results?.[0] || response.data[0]
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6" />
      case 'processing':
        return <Package className="w-6 h-6" />
      case 'shipped':
        return <Truck className="w-6 h-6" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />
      default:
        return <Package className="w-6 h-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'shipped':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-text-secondary mb-6">
            We couldn't find an order with number {orderNumber}
          </p>
          <Link href="/account/orders" className="btn-primary inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-accent hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          {/* Order Header */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-display font-bold mb-2">
                  Order #{order.order_number}
                </h1>
                <p className="text-text-secondary flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className={`px-6 py-3 rounded-lg border-2 flex items-center gap-3 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="font-bold text-lg">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Track Order Button */}
            {(order.status === 'shipped' || order.status === 'processing') && (
              <Link
                href={`/account/orders/${order.order_number}/track`}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Track Order on Map
              </Link>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                      {item.variant?.product?.images?.[0]?.image_url && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.variant.product.images[0].image_url}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{item.product_name}</h3>
                        <p className="text-sm text-text-secondary mb-2">
                          {item.variant_details}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-text-secondary">Qty: {item.quantity}</span>
                          <span className="text-text-secondary">
                            ${parseFloat(item.unit_price).toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-accent">
                          ${parseFloat(item.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-accent" />
                  Shipping Address
                </h2>
                <div className="bg-surface dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <p className="font-bold text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {order.shipping_address?.full_name}
                  </p>
                  <p className="text-text-secondary flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {order.shipping_address?.email}
                  </p>
                  {order.shipping_address?.phone && (
                    <p className="text-text-secondary flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {order.shipping_address.phone}
                    </p>
                  )}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <p>{order.shipping_address?.address_line1}</p>
                    {order.shipping_address?.address_line2 && (
                      <p>{order.shipping_address.address_line2}</p>
                    )}
                    <p>
                      {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
                      {order.shipping_address?.postal_code}
                    </p>
                    <p className="font-semibold">{order.shipping_address?.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Payment Summary */}
              <div className="card sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-semibold">${parseFloat(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="font-semibold">
                      {parseFloat(order.shipping_cost) === 0 
                        ? 'FREE' 
                        : `$${parseFloat(order.shipping_cost).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tax</span>
                    <span className="font-semibold">${parseFloat(order.tax_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-accent">${parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </h3>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      {order.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Card Payment'}
                    </p>
                    {order.payment_method === 'cod' && (
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Pay ${parseFloat(order.total).toFixed(2)} when delivered
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Status Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-3">Need Help?</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    If you have any questions about your order, please contact our support team.
                  </p>
                  <Link href="/contact" className="btn-outline w-full text-center">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
