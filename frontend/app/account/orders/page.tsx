'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import Image from 'next/image'

export default function MyOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'processing':
        return <Package className="w-5 h-5" />
      case 'shipped':
        return <Truck className="w-5 h-5" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      case 'shipped':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  const ordersList = orders?.results || orders || []

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold mb-2">My Orders</h1>
            <p className="text-text-secondary">Track and manage your orders</p>
          </div>

          {ordersList.length === 0 ? (
            <div className="card text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-text-secondary mb-6">Start shopping to see your orders here</p>
              <Link href="/products" className="btn-primary inline-block">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {ordersList.map((order: any) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Order #{order.order_number}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-text-secondary">Total</p>
                        <p className="text-2xl font-bold text-accent">${parseFloat(order.total).toFixed(2)}</p>
                      </div>
                      <Link
                        href={`/account/orders/${order.order_number}`}
                        className="btn-outline p-3"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="pt-4 space-y-3">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        {item.variant?.product?.images?.[0]?.image_url && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.variant.product.images[0].image_url}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{item.product_name}</p>
                          <p className="text-sm text-text-secondary">
                            {item.variant_details} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">${parseFloat(item.total_price).toFixed(2)}</p>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-sm text-text-secondary">
                        +{order.items.length - 3} more item(s)
                      </p>
                    )}
                  </div>

                  {/* Track Order Button */}
                  {(order.status === 'shipped' || order.status === 'processing') && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                      <Link
                        href={`/account/orders/${order.order_number}/track`}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <Truck className="w-5 h-5" />
                        Track Order
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
