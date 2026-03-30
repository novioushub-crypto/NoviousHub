'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { 
  Search, Filter, Eye, Download, 
  Package, Clock, CheckCircle, XCircle, Loader2, Edit2, Save, X 
} from 'lucide-react'
import OrderDetailsModal from '@/components/admin/OrderDetailsModal'

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter) params.append('status', statusFilter)
      const response = await api.get(`/orders/?${params}`)
      return response.data
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await api.patch(`/orders/${orderId}/update_status/`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      setEditingOrder(null)
      setNewStatus('')
    },
  })

  const orders = data?.results || []
  const pendingCount = orders.filter((o: any) => o.status === 'pending').length
  const processingCount = orders.filter((o: any) => o.status === 'processing').length
  const shippedCount = orders.filter((o: any) => o.status === 'shipped').length
  const completedCount = orders.filter((o: any) => o.status === 'delivered').length

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

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status })
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer orders • Auto-refreshing</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
            <Download className="w-5 h-5" />
            Export Orders
          </button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Processing</p>
                <p className="text-2xl font-bold">{processingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Shipped</p>
                <p className="text-2xl font-bold">{shippedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Delivered</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent w-full sm:w-48"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold">{order.order_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{order.user?.email || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p>{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">${order.total}</p>
                      </td>
                      <td className="px-6 py-4">
                        {editingOrder === order.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={newStatus || order.status}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="px-2 py-1 text-sm border rounded"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleStatusUpdate(order.id, newStatus || order.status)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              disabled={updateStatusMutation.isPending}
                            >
                              {updateStatusMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingOrder(null)
                                setNewStatus('')
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <button
                              onClick={() => {
                                setEditingOrder(order.id)
                                setNewStatus(order.status)
                              }}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
      />
    </div>
  )
}
