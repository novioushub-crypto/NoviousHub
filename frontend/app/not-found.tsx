import Link from 'next/link'
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
          <h2 className="text-4xl font-display font-bold mb-4">Page Not Found</h2>
          <p className="text-xl text-text-secondary mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
              <Home className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold mb-1">Home</h3>
            <p className="text-sm text-text-secondary">Back to homepage</p>
          </Link>

          <Link
            href="/products"
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold mb-1">Shop</h3>
            <p className="text-sm text-text-secondary">Browse products</p>
          </Link>

          <Link
            href="/products"
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold mb-1">Search</h3>
            <p className="text-sm text-text-secondary">Find what you need</p>
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="btn-outline inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  )
}
