'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days. Express shipping is available and takes 2-3 business days. International shipping times vary by location.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes! We ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination.',
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order from your account dashboard.',
        },
        {
          question: 'What if my order arrives damaged?',
          answer: 'We take great care in packaging, but if your item arrives damaged, please contact us within 48 hours with photos. We\'ll arrange a replacement or refund immediately.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy. Items must be unworn, unwashed, and in original condition with tags attached. Return shipping is free for defective items.',
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Log into your account, go to Order History, and click "Return Item" next to the product. Follow the instructions to print your return label.',
        },
        {
          question: 'Can I exchange an item?',
          answer: 'Yes! You can exchange items for a different size or color. The process is the same as returns - just select "Exchange" instead of "Return".',
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.',
        },
      ],
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          question: 'How do I find my size?',
          answer: 'Check our detailed size guide on each product page. We provide measurements in inches and centimeters. If you\'re between sizes, we recommend sizing up.',
        },
        {
          question: 'Are your leather jackets genuine leather?',
          answer: 'Yes! All our leather jackets are made from 100% genuine leather, sourced ethically and crafted by skilled artisans.',
        },
        {
          question: 'How do I care for my leather jacket?',
          answer: 'Keep it away from direct sunlight and moisture. Use a leather conditioner every 6 months. For cleaning, use a damp cloth or take it to a professional leather cleaner.',
        },
        {
          question: 'Do you offer custom sizing?',
          answer: 'We currently don\'t offer custom sizing, but we have an extensive size range from XS to 3XL to fit most body types.',
        },
      ],
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely! We use industry-standard SSL encryption and never store your full credit card information. All payments are processed through secure payment gateways.',
        },
        {
          question: 'Can I use multiple payment methods?',
          answer: 'Currently, we only support one payment method per order. However, you can use gift cards in combination with other payment methods.',
        },
        {
          question: 'Do you offer payment plans?',
          answer: 'Yes! We partner with Klarna and Afterpay to offer flexible payment plans. You can split your purchase into 4 interest-free payments.',
        },
      ],
    },
    {
      category: 'Account & Membership',
      questions: [
        {
          question: 'Do I need an account to place an order?',
          answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and access exclusive member benefits.',
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a reset link.',
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes! Log into your account, go to Account Settings, and update your email address. You\'ll need to verify the new email.',
        },
        {
          question: 'How do I delete my account?',
          answer: 'Contact our support team at support@noviious.com to request account deletion. We\'ll process your request within 48 hours.',
        },
      ],
    },
  ]

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-brand to-brand/80">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl">Find answers to common questions</p>
        </motion.div>
      </section>

      {/* Search */}
      <section className="py-12 px-4 bg-surface dark:bg-surface-dark">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white dark:bg-card-dark border-2 border-border-light dark:border-border-dark rounded-xl outline-none focus:border-accent text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-text-secondary">
                No results found for "{searchQuery}"
              </p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {filteredFAQs.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <h2 className="text-3xl font-display font-bold mb-6">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => {
                      const globalIndex = categoryIndex * 100 + index
                      const isOpen = openIndex === globalIndex

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          className="card"
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <span className="text-lg font-semibold pr-8">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-6 h-6 text-accent transition-transform flex-shrink-0 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="text-text-secondary mt-4 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 px-4 bg-surface dark:bg-surface-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-display font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Support
          </a>
        </motion.div>
      </section>
    </div>
  )
}
