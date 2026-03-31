'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { 
  Search, Eye, Trash2, Ban, UserPlus, X,
  Users, UserCheck, UserX, Mail, Loader2, CheckCircle 
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })
  const queryClient = useQueryClient()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/auth/users/')
      return response.data
    },
  })

  // Suspend/Activate user mutation
  const suspendMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      const response = await api.patch(`/auth/users/${userId}/`, {
        is_active: !isActive
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(variables.isActive ? 'User suspended successfully' : 'User activated successfully')
    },
    onError: () => {
      toast.error('Failed to update user status')
    }
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/auth/users/${userId}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete user')
    }
  })

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const response = await api.post('/auth/register/', userData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User added successfully')
      setIsAddUserModalOpen(false)
      setNewUser({ email: '', password: '', first_name: '', last_name: '' })
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.detail || 'Failed to add user'
      toast.error(errorMsg)
    }
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

  const handleSuspendUser = (userId: number, isActive: boolean) => {
    if (confirm(`Are you sure you want to ${isActive ? 'suspend' : 'activate'} this user?`)) {
      suspendMutation.mutate({ userId, isActive })
    }
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteMutation.mutate(userId)
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    addUserMutation.mutate(newUser)
  }

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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Users</h1>
              <p className="text-text-secondary">Manage customer accounts</p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
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
                            {user.is_active ? 'Active' : 'Suspended'}
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
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSuspendUser(user.id, user.is_active)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.is_active
                                  ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600'
                                  : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600'
                              }`}
                              title={user.is_active ? 'Suspend user' : 'Activate user'}
                            >
                              {user.is_active ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-5 h-5" />
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
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddUserModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Add New User</h2>
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="input w-full"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="input w-full"
                      placeholder="••••••••"
                      minLength={8}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name</label>
                      <input
                        type="text"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                        className="input w-full"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name</label>
                      <input
                        type="text"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                        className="input w-full"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(false)}
                      className="flex-1 btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addUserMutation.isPending}
                      className="flex-1 btn-primary"
                    >
                      {addUserMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        'Add User'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
