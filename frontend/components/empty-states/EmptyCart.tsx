import Link from 'next/link'
import { ShoppingCart, ArrowRight } from 'lucide-react'

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
      </p>
      <Link href="/products" className="btn-primary inline-flex items-center gap-2">
        Start Shopping
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
