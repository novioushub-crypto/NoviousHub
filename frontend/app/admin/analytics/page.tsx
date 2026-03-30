'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { 
  TrendingUp, DollarSign, ShoppingCart, Users,
  ArrowUp, ArrowDown, Calendar, Loader2, RefreshCw
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics/overview/?days=30')
      return response.data
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  })

  const { data: dailyData } = useQuery({
    queryKey: ['daily-revenue'],
    queryFn: async () => {
      const response = await api.get('/analytics/daily-revenue/?days=7')
      return response.data
    },
    refetchInterval: 5000,
  })

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const response = await api.get('/analytics/top-products/?limit=5')
      return response.data
    },
    refetchInterval: 5000,
  })

  const stats = [
    { 
      label: 'Revenue', 
      value: analyticsData ? `$${analyticsData.total_revenue.toFixed(2)}` : '$0.00', 
      change: analyticsData ? `${analyticsData.revenue_change > 0 ? '+' : ''}${analyticsData.revenue_change}%` : '0%', 
      trend: analyticsData?.revenue_change >= 0 ? 'up' : 'down',
      icon: DollarSign, 
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    { 
      label: 'Orders', 
      value: analyticsData?.total_orders?.toString() || '0', 
      change: analyticsData ? `${analyticsData.orders_change > 0 ? '+' : ''}${analyticsData.orders_change}%` : '0%', 
      trend: analyticsData?.orders_change >= 0 ? 'up' : 'down',
      icon: ShoppingCart, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    },
    { 
      label: 'Customers', 
      value: analyticsData?.new_users?.toString() || '0', 
      change: analyticsData ? `${analyticsData.users_change > 0 ? '+' : ''}${analyticsData.users_change}%` : '0%', 
      trend: analyticsData?.users_change >= 0 ? 'up' : 'down',
      icon: Users, 
      color: 'text-accent',
      bgColor: 'bg-accent'
    },
    { 
      label: 'Avg Order', 
      value: analyticsData ? `$${analyticsData.avg_order_value.toFixed(2)}` : '$0.00', 
      change: '+3.2%', 
      trend: 'up',
      icon: TrendingUp, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
  ]

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
            <h1 className="text-3xl font-display font-bold mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your business performance • Live data</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => refetch()}
              className="btn-outline inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button className="btn-outline inline-flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
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

        {/* Status Breakdown */}
        {analyticsData?.status_breakdown && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4">Order Status Breakdown</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.status_breakdown.map((item: any) => (
                <div key={item.status} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-1">{item.status}</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">Daily Revenue (Last 7 Days)</h2>
            <div className="space-y-3">
              {dailyData?.map((day: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-lg transition-all"
                        style={{ 
                          width: `${Math.min((day.revenue / Math.max(...(dailyData?.map((d: any) => d.revenue) || [1]))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right font-semibold">
                    ${day.revenue.toFixed(0)}
                  </div>
                  <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                    {day.orders} orders
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">Top Products</h2>
            <div className="space-y-4">
              {topProducts?.map((product: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{product.product_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.total_quantity} sales</p>
                  </div>
                  <p className="font-bold text-green-500">${product.total_revenue.toFixed(2)}</p>
                </div>
              )) || (
                <p className="text-center text-gray-500 py-8">No data available</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
