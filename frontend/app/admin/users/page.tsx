'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Eye, Edit, Ban, 
  Users, UserCheck, UserX, Mail 
} from 'lucide-react'
import Image from 'next/image'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: 1299.99, status: 'active', joined: '2026-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, spent: 899.99, status: 'active', joined: '2026-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 5, spent: 549.99, status: 'active', joined: '2026-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', orders: 15, spent: 1899.99, status: 'active', joined: '2025-12-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', orders: 0, spent: 0, status: 'inactive', joined: '2026-03-25' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold mb-2">Users</h1>
            <p className="text-text-secondary">Manage customer accounts</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Total Users</p>
                  <p className="text-2xl font-bold">856</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Active Users</p>
                  <p className="text-2xl font-bold">789</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Inactive</p>
                  <p className="text-2xl font-bold">67</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <button className="btn-outline inline-flex items-center gap-2">
                <Filter className="w-5 h-5" />
                More Filters
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface dark:bg-card-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Total Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-surface dark:hover:bg-card-dark transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-brand">
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                          </div>
                          <p className="font-semibold">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-secondary" />
                          <p className="text-text-secondary">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p>{user.orders} orders</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">${user.spent.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                          user.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-text-secondary">{user.joined}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-surface dark:hover:bg-card-dark rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-surface dark:hover:bg-card-dark rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
