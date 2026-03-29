'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Shirt, Sparkles, Sun, Moon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useThemeStore } from '@/lib/store/themeStore'

export default function WelcomeModal() {
  const router = useRouter()
  const { setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: theme, 2: category
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has already seen the welcome modal
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      // Show modal after a short delay
      setTimeout(() => setIsOpen(true), 1000)
    }
  }, [])

  const handleThemeNext = () => {
    if (selectedTheme) {
      setTheme(selectedTheme)
      setStep(2)
    }
  }

  const handleContinue = () => {
    // Save preference
    localStorage.setItem('hasSeenWelcome', 'true')
    if (selectedCategory) {
      localStorage.setItem('preferredCategory', selectedCategory)
    }
    
    setIsOpen(false)
    
    // Navigate to selected category
    if (selectedCategory === 'leather') {
      router.push('/category/leather-jackets')
    } else if (selectedCategory === 'sportswear') {
      router.push('/category/sportswear')
    } else {
      router.push('/products')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setIsOpen(false)
  }

  const themes = [
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Bright and clean interface',
      icon: Sun,
      gradient: 'from-yellow-400 to-orange-500',
      preview: 'bg-white border-gray-200',
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes',
      icon: Moon,
      gradient: 'from-indigo-500 to-purple-600',
      preview: 'bg-gray-900 border-gray-700',
    },
  ]

  const categories = [
    {
      id: 'leather',
      name: 'Leather Jackets',
      description: 'Premium leather craftsmanship',
      icon: ShoppingBag,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'sportswear',
      name: 'Sportswear',
      description: 'High-performance athletic wear',
      icon: Shirt,
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      id: 'all',
      name: 'Browse All',
      description: 'Explore our full collection',
      icon: Sparkles,
      gradient: 'from-pink-500 to-rose-600',
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm sm:max-w-md md:max-w-2xl w-full p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Progress Indicator */}
            <div className="flex gap-2 mb-4 sm:mb-6">
              <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>

            {/* Step 1: Theme Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1 sm:mb-2">
                    Welcome to Noviious!
                  </h2>
                  <p className="text-text-secondary text-sm sm:text-base md:text-lg">
                    Choose your preferred theme
                  </p>
                </div>

                {/* Theme Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {themes.map((theme, index) => (
                    <motion.button
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => setSelectedTheme(theme.id as 'light' | 'dark')}
                      className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
                        selectedTheme === theme.id
                          ? 'border-accent bg-accent/5 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                      >
                        <theme.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg mb-1">{theme.name}</h3>
                      <p className="text-xs sm:text-sm text-text-secondary mb-2 sm:mb-3">
                        {theme.description}
                      </p>
                      {/* Preview */}
                      <div className={`h-10 sm:h-12 rounded-lg border-2 ${theme.preview}`} />
                    </motion.button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={handleSkip}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleThemeNext}
                    disabled={!selectedTheme}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Category Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1 sm:mb-2">
                    What are you shopping for?
                  </h2>
                  <p className="text-text-secondary text-sm sm:text-base md:text-lg">
                    Choose your preferred category
                  </p>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
                        selectedCategory === category.id
                          ? 'border-accent bg-accent/5 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                      >
                        <category.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg mb-1">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-text-secondary">
                        {category.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSkip}
                    className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!selectedCategory}
                    className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
