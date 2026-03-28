'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import Script from 'next/script'

declare global {
  interface Window {
    google: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleLoaded, setGoogleLoaded] = useState(false)

  useEffect(() => {
    // Initialize Google Sign-In when script loads
    if (window.google && googleLoaded) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      })
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          theme: 'outline', 
          size: 'large',
          width: '100%',
          text: 'continue_with',
        }
      )
    }
  }, [googleLoaded])

  const handleGoogleLogin = async (response: any) => {
    setLoading(true)
    setError('')

    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      })

      const data = await result.json()

      if (!result.ok) {
        throw new Error(data.error || 'Google login failed')
      }

      // Store tokens and user data
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      useAuthStore.setState({ user: data.user, isAuthenticated: true })

      // Redirect based on user role
      if (data.user.is_staff || data.user.is_superuser) {
        router.push('/admin')
      } else {
        router.push('/account')
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      
      // Fetch user data to check if admin
      const { user } = useAuthStore.getState()
      
      // Redirect based on user role
      if (user?.is_staff || user?.is_superuser) {
        router.push('/admin')
      } else {
        router.push('/account')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setGoogleLoaded(true)}
      />
      
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-surface via-white to-surface dark:from-surface-dark dark:via-brand dark:to-surface-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          <div className="card">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
              <p className="text-text-secondary">Sign in to your Noviious account</p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Remember & Forgot */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-accent" />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-accent hover:underline">
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative my-8"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light dark:border-border-dark"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card dark:bg-card-dark text-text-secondary">Or continue with</span>
              </div>
            </motion.div>

            {/* Google Sign-In Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              id="googleSignInButton"
              className="flex justify-center"
            />

            {/* Sign Up Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center mt-6 text-sm"
            >
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-accent font-semibold hover:underline">
                Sign up
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
