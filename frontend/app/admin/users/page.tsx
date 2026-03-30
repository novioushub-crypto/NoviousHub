'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { 
  Search, Filter, Eye, Edit, Ban, 
  Users, UserCheck, UserX, Mail, Loader2 
} from 'lucide-react'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/auth/users/')
      return response.data
    },
  })

  const users = usersData?.results || usersData || []
  const totalUsers = users.length
  const activeUsers = users.filter((u: any) => u.is_active).length
  const inactiveUsers = totalUsers - activeUsers

  const filteredUsers = users.filter((user: any) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

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
                  <p className="text-2xl font-bold">{totalUsers}</p>
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
                  <p className="text-2xl font-bold">{activeUsers}</p>
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
                  <p className="text-2xl font-bold">{inactiveUsers}</p>
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
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Verified</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-surface dark:hover:bg-card-dark transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-accent to-gold">
                              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                {(user.first_name || user.email).charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <p className="font-semibold">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}` 
                                : user.email.split('@')[0]}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-text-secondary" />
                            <p className="text-text-secondary">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                            user.is_active 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            user.is_verified 
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {user.is_verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-text-secondary">
                            {new Date(user.date_joined).toLocaleDateString()}
                          </p>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
