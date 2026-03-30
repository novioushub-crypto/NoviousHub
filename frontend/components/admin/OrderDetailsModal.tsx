'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, MapPin, CreditCard, Calendar, User, Mail, Phone, Truck } from 'lucide-react'
import Image from 'next/image'

interface OrderDetailsModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      case 'shipped': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Order #{order.order_number}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-6 space-y-6">
                  {/* Status and Date */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Order Date</p>
                      </div>
                      <p className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="font-bold text-lg">Customer Information</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                        <p className="font-semibold">{order.shipping_address?.full_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold">{order.user?.email || order.shipping_address?.email || 'N/A'}</p>
                        </div>
                      </div>
                      {order.shipping_address?.phone && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold">{order.shipping_address.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h3 className="font-bold text-lg">Shipping Address</h3>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">{order.shipping_address.full_name}</p>
                        <p>{order.shipping_address.address_line1}</p>
                        {order.shipping_address.address_line2 && (
                          <p>{order.shipping_address.address_line2}</p>
                        )}
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="font-bold text-lg">Order Items ({order.items?.length || 0})</h3>
                    </div>
                    <div className="space-y-3">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-800 rounded-lg p-3">
                          {item.variant?.product?.images?.[0]?.image_url && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.variant.product.images[0].image_url}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold mb-1">{item.product_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.variant_details}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${parseFloat(item.total_price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="font-bold text-lg">Payment Summary</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-semibold">${parseFloat(order.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="font-semibold">${parseFloat(order.shipping_cost).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="font-semibold">${parseFloat(order.tax_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-lg font-bold text-accent">${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Payment Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Information */}
                  {order.shipping_address?.tracking_number && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-bold">Tracking Information</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tracking Number</p>
                          <p className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {order.shipping_address.tracking_number}
                          </p>
                        </div>
                        {order.shipping_address.carrier && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Carrier</p>
                            <p className="font-semibold">{order.shipping_address.carrier}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
