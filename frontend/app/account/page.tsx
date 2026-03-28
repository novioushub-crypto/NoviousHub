'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Heart, MapPin, User, Settings, LogOut, ShoppingBag } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders/')
      return response.data
    },
  })

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: orders?.length || 0,
      color: 'bg-accent',
      link: '/account/orders',
    },
    {
      icon: Heart,
      label: 'Wishlist Items',
      value: '0',
      color: 'bg-gold',
      link: '/account/wishlist',
    },
    {
      icon: MapPin,
      label: 'Saved Addresses',
      value: '0',
      color: 'bg-success',
      link: '/account/addresses',
    },
  ]

  const quickLinks = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track and manage your orders',
      link: '/account/orders',
      color: 'text-accent',
    },
    {
      icon: Heart,
      title: 'Wishlist',
      description: 'View your saved items',
      link: '/account/wishlist',
      color: 'text-gold',
    },
    {
      icon: MapPin,
      title: 'Addresses',
      description: 'Manage shipping addresses',
      link: '/account/addresses',
      color: 'text-success',
    },
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Update your information',
      link: '/account/profile',
      color: 'text-brand',
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
          <p className="text-text-secondary">Manage your account and orders</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <div className="card hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} p-4 rounded-xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-text-secondary text-sm">{stat.label}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link href={link.link}>
                  <div className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`${link.color} p-3 rounded-lg bg-opacity-10`}>
                        <link.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{link.title}</h3>
                        <p className="text-text-secondary text-sm">{link.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        {orders && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <Link href="/account/orders" className="text-accent hover:underline">
                View All
              </Link>
            </div>
            <div className="card">
              {orders.slice(0, 3).map((order: any) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between py-4 border-b last:border-b-0 hover:bg-surface dark:hover:bg-surface-dark transition-colors"
                >
                  <div>
                    <p className="font-semibold">Order #{order.order_number}</p>
                    <p className="text-sm text-text-secondary">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">${order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'shipped' ? 'bg-gold/10 text-gold' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <button
            onClick={handleLogout}
            className="btn-outline flex items-center gap-2 text-error border-error hover:bg-error hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  )
}
