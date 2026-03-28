'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, DollarSign, ShoppingCart, Users,
  ArrowUp, ArrowDown, Calendar
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const stats = [
    { 
      label: 'Revenue', 
      value: '$45,231', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign, 
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    { 
      label: 'Orders', 
      value: '1,234', 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingCart, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    },
    { 
      label: 'Customers', 
      value: '856', 
      change: '+15.3%', 
      trend: 'up',
      icon: Users, 
      color: 'text-accent',
      bgColor: 'bg-accent'
    },
    { 
      label: 'Conversion', 
      value: '3.2%', 
      change: '-0.5%', 
      trend: 'down',
      icon: TrendingUp, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
  ]

  const topProducts = [
    { name: 'Classic Black Leather Jacket', sales: 145, revenue: 43455 },
    { name: 'Performance Running Jacket', sales: 132, revenue: 11868 },
    { name: 'Brown Vintage Leather Jacket', sales: 98, revenue: 34299 },
    { name: 'Athletic Training Hoodie', sales: 87, revenue: 6083 },
    { name: 'Pro Sports Windbreaker', sales: 76, revenue: 6079 },
  ]

  const recentActivity = [
    { type: 'order', message: 'New order #NV-1234 placed', time: '2 minutes ago' },
    { type: 'user', message: 'New user registered', time: '15 minutes ago' },
    { type: 'order', message: 'Order #NV-1233 completed', time: '1 hour ago' },
    { type: 'product', message: 'Product stock updated', time: '2 hours ago' },
    { type: 'order', message: 'Order #NV-1232 shipped', time: '3 hours ago' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Analytics</h1>
              <p className="text-text-secondary">Track your business performance</p>
            </div>
            <button className="btn-outline inline-flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Last 30 Days
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
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
                  <span className="text-sm text-text-secondary">vs last month</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-4">Revenue Overview</h2>
              <div className="h-64 bg-surface dark:bg-card-dark rounded-lg flex items-center justify-center">
                <p className="text-text-secondary">Chart visualization would go here</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-4">Sales by Category</h2>
              <div className="h-64 bg-surface dark:bg-card-dark rounded-lg flex items-center justify-center">
                <p className="text-text-secondary">Chart visualization would go here</p>
              </div>
            </motion.div>
          </div>

          {/* Top Products & Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-4">Top Products</h2>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-surface dark:bg-card-dark rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{product.name}</p>
                      <p className="text-sm text-text-secondary">{product.sales} sales</p>
                    </div>
                    <p className="font-bold text-green-500">${product.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-surface dark:bg-card-dark rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'order' ? 'bg-blue-500' :
                      activity.type === 'user' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-text-secondary">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
