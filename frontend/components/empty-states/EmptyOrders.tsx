import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'

export default function EmptyOrders() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold mb-3">No orders yet</h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        You haven't placed any orders yet. Start shopping to see your orders here!
      </p>
      <Link href="/products" className="btn-primary inline-flex items-center gap-2">
        Browse Products
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
