'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, MapPin, Clock, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

// Dynamically import map component to avoid SSR issues
const OrderMap = dynamic(() => import('@/components/OrderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  ),
})

export default function TrackOrderPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      const response = await api.get(`/orders/?order_number=${orderNumber}`)
      return response.data.results?.[0] || response.data[0]
    },
  })

  const trackingSteps = useMemo(() => [
    {
      status: 'pending',
      label: 'Order Placed',
      description: 'Your order has been received',
      icon: Package,
      completed: true,
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'Preparing your items',
      icon: Clock,
      completed: order?.status !== 'pending',
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'On the way to you',
      icon: Truck,
      completed: order?.status === 'shipped' || order?.status === 'delivered',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Package delivered',
      icon: CheckCircle,
      completed: order?.status === 'delivered',
    },
  ], [order?.status])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
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
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-accent hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold mb-2">
              Track Order #{order.order_number}
            </h1>
            <p className="text-text-secondary">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Tracking Timeline */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">Order Status</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700" />
              <div
                className="absolute top-6 left-6 h-0.5 bg-accent transition-all duration-500"
                style={{
                  width: `${(trackingSteps.filter(s => s.completed).length - 1) * 33.33}%`,
                }}
              />

              {/* Steps */}
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                {trackingSteps.map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                        step.completed
                          ? 'bg-accent text-white scale-110'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <p className={`font-semibold mb-1 ${step.completed ? 'text-accent' : 'text-text-secondary'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-text-secondary">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-accent" />
                Delivery Location
              </h2>
              <OrderMap
                destination={order.shipping_address}
                status={order.status}
              />
            </div>

            {/* Shipping Details */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                <div className="space-y-2 text-text-secondary">
                  <p className="font-semibold text-brand">{order.shipping_address?.full_name}</p>
                  <p>{order.shipping_address?.address_line1}</p>
                  {order.shipping_address?.address_line2 && (
                    <p>{order.shipping_address.address_line2}</p>
                  )}
                  <p>
                    {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
                    {order.shipping_address?.postal_code}
                  </p>
                  <p>{order.shipping_address?.country}</p>
                </div>
              </div>

              {order.shipping_address?.tracking_number && (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-4">Tracking Information</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Tracking Number</p>
                      <p className="font-mono font-semibold text-accent">
                        {order.shipping_address.tracking_number}
                      </p>
                    </div>
                    {order.shipping_address.carrier && (
                      <div>
                        <p className="text-sm text-text-secondary mb-1">Carrier</p>
                        <p className="font-semibold">{order.shipping_address.carrier}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-semibold">${parseFloat(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="font-semibold">${parseFloat(order.shipping_cost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tax</span>
                    <span className="font-semibold">${parseFloat(order.tax_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-accent">${parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
