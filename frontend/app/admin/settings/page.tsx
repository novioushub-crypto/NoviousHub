'use client'

import { motion } from 'framer-motion'
import { Settings, Store, Bell, Shield, Mail } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your store settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Store Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Store Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Basic store configuration</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Store Name</label>
                <input
                  type="text"
                  defaultValue="Noviious"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Store Email</label>
                <input
                  type="email"
                  defaultValue="contact@noviious.com"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
              </div>
              <button className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Notifications</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage notification preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Order notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Low stock alerts</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>New user registrations</span>
                <input type="checkbox" className="w-5 h-5 accent-accent" />
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Security</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Security and privacy settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left">
                Two-Factor Authentication
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left">
                Active Sessions
              </button>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Email Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure email templates</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Order confirmation emails</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Shipping notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Marketing emails</span>
                <input type="checkbox" className="w-5 h-5 accent-accent" />
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
