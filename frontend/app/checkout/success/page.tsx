'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Mail, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('order')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!orderNumber) {
      router.push('/')
      return
    }

    // Trigger confetti
    setShowConfetti(true)
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8B5CF6', '#D97706', '#EF4444', '#10B981']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8B5CF6', '#D97706', '#EF4444', '#10B981']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [orderNumber, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-surface via-white to-surface dark:from-surface-dark dark:via-brand dark:to-surface-dark">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-14 h-14 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Order Confirmed! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-text-secondary mb-8"
          >
            Thank you for your purchase!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-accent/20"
          >
            <p className="text-sm text-text-secondary mb-2">Order Number</p>
            <p className="text-3xl font-bold text-accent font-mono">{orderNumber}</p>
          </motion.div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">What happens next?</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Order Confirmation Email</h3>
                <p className="text-text-secondary text-sm">
                  We've sent a confirmation email with your order details to your inbox.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Order Processing</h3>
                <p className="text-text-secondary text-sm">
                  Our team is preparing your order for shipment. This usually takes 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Shipping & Tracking</h3>
                <p className="text-text-secondary text-sm">
                  Once shipped, you'll receive a tracking number to monitor your delivery. Estimated delivery: 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Link
            href={`/account/orders`}
            className="btn-primary flex items-center justify-center gap-2"
          >
            View Order Details
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/products"
            className="btn-outline flex items-center justify-center gap-2"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary mb-2">Need help with your order?</p>
          <Link href="/contact" className="text-accent hover:underline font-semibold">
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
