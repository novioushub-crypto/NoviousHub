'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Package, ShoppingCart, Users, DollarSign, 
  TrendingUp, Eye, AlertCircle, ArrowUp, ArrowDown 
} from 'lucide-react'
import api from '@/lib/api'

export default function AdminDashboard() {
  // Fetch real data
  const { data: products } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: async () => {
      const response = await api.get('/products/')
      return response.data
    },
  })

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data
    },
  })

  const productsCount = products?.results?.length || 0
  const ordersCount = orders?.results?.length || 0

  const stats = [
    { 
      label: 'Total Revenue', 
      value: '$45,231', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign, 
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    { 
      label: 'Total Orders', 
      value: ordersCount.toString(), 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingCart, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    },
    { 
      label: 'Total Products', 
      value: productsCount.toString(), 
      change: `${productsCount} active`, 
      trend: 'up',
      icon: Package, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
    { 
      label: 'Total Users', 
      value: '856', 
      change: '+15.3%', 
      trend: 'up',
      icon: Users, 
      color: 'text-accent',
      bgColor: 'bg-accent'
    },
  ]

  const quickLinks = [
    { title: 'Add Product', href: '/admin/products/new', icon: Package, color: 'bg-purple-500', description: 'Create new product' },
    { title: 'View Orders', href: '/admin/orders', icon: ShoppingCart, color: 'bg-blue-500', description: 'Manage orders' },
    { title: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-accent', description: 'User management' },
    { title: 'Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'bg-green-500', description: 'View reports' },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, idx) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-accent hover:underline text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {orders?.results?.slice(0, 4).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-semibold">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${order.total}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              )) || (
                <p className="text-center text-gray-500 py-8">No orders yet</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Top Products</h2>
              <Link href="/admin/products" className="text-accent hover:underline text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {products?.results?.slice(0, 4).map((product: any) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold line-clamp-1">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${product.base_price}</p>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
              )) || (
                <p className="text-center text-gray-500 py-8">No products yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

