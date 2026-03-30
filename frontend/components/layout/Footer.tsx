'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">NOVIIOUS</h3>
            <p className="text-surface mb-4">
              Premium leather jackets and sportswear for those who dare to stand out.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-surface hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-surface hover:text-gold transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-surface hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-surface hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-surface hover:text-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/category/leather-jackets" className="text-surface hover:text-gold transition-colors">Leather Jackets</Link></li>
              <li><Link href="/category/sportswear" className="text-surface hover:text-gold transition-colors">Sportswear</Link></li>
              <li><Link href="/products" className="text-surface hover:text-gold transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-surface mb-4">Subscribe for exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button className="bg-gold hover:bg-gold/90 p-2 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-surface">
          <p>&copy; 2024 Noviious. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
