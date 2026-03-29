'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, RefreshCw, ChevronDown } from 'lucide-react'

interface ProductSuggestion {
  name: string
  short_description: string
  description: string
  base_price: string
  sku: string
  category: string
}

interface ProductAIAutofillProps {
  onApply: (data: Partial<ProductSuggestion>) => void
}

const PRODUCT_TEMPLATES: Record<string, ProductSuggestion[]> = {
  'Leather Jackets': [
    {
      name: 'Classic Black Leather Biker Jacket',
      short_description: 'Timeless black leather jacket with asymmetric zipper and quilted shoulders',
      description: 'Crafted from premium genuine leather, this classic biker jacket features an asymmetric front zipper, quilted shoulder panels, and multiple zippered pockets. The slim-fit design offers both style and comfort, with a soft inner lining for all-day wear. Perfect for adding an edgy touch to any outfit.',
      base_price: '299.99',
      sku: 'LJ-BLK-001',
      category: '1'
    },
    {
      name: 'Vintage Brown Leather Bomber Jacket',
      short_description: 'Distressed brown leather bomber with ribbed cuffs and waistband',
      description: 'This vintage-inspired bomber jacket is made from distressed brown leather that develops a unique patina over time. Features include ribbed cuffs and waistband, front snap button closure, and two side pockets. The relaxed fit and soft leather make it perfect for casual everyday wear.',
      base_price: '349.99',
      sku: 'LJ-BRN-002',
      category: '1'
    },
    {
      name: 'Slim Fit Leather Racer Jacket',
      short_description: 'Sleek racing-inspired leather jacket with minimalist design',
      description: 'Inspired by classic racing jackets, this slim-fit design features clean lines and minimal hardware. Made from supple lambskin leather with a smooth finish, it includes a stand-up collar, front zipper closure, and zippered sleeve pockets. The streamlined silhouette makes it perfect for both casual and smart-casual occasions.',
      base_price: '399.99',
      sku: 'LJ-RAC-003',
      category: '1'
    },
    {
      name: 'Quilted Leather Moto Jacket',
      short_description: 'Premium moto jacket with diamond quilted pattern and silver hardware',
      description: 'This premium moto jacket features distinctive diamond quilting on the shoulders and sleeves, crafted from high-quality cowhide leather. Silver-tone hardware, multiple zippered pockets, and adjustable waist belts provide both style and functionality. The padded shoulders and reinforced elbows add durability and protection.',
      base_price: '449.99',
      sku: 'LJ-MOT-004',
      category: '1'
    },
    {
      name: 'Suede Leather Trucker Jacket',
      short_description: 'Soft suede trucker jacket with button front and chest pockets',
      description: 'A modern take on the classic trucker jacket, crafted from buttery-soft suede leather. Features include a button-front closure, two chest pockets with button flaps, and side hand pockets. The relaxed fit and soft texture make it comfortable for all-day wear, while the timeless design ensures versatility.',
      base_price: '279.99',
      sku: 'LJ-SUD-005',
      category: '1'
    }
  ],
  'Sportswear': [
    {
      name: 'Performance Running Shorts Pro',
      short_description: 'Lightweight moisture-wicking running shorts with built-in compression liner',
      description: 'Engineered for serious runners, these performance shorts feature advanced moisture-wicking fabric that keeps you dry during intense workouts. The built-in compression liner provides support, while the lightweight outer shell offers freedom of movement. Includes zippered pocket for secure storage and reflective details for low-light visibility.',
      base_price: '49.99',
      sku: 'SW-RUN-001',
      category: '2'
    },
    {
      name: 'Athletic Compression Shirt',
      short_description: 'Form-fitting compression top with four-way stretch and breathable mesh panels',
      description: 'This high-performance compression shirt is designed to enhance your workout with targeted muscle support and improved circulation. Made from four-way stretch fabric with strategic mesh panels for ventilation. Flatlock seams prevent chafing, while the moisture-wicking technology keeps you cool and dry during high-intensity training.',
      base_price: '59.99',
      sku: 'SW-COM-002',
      category: '2'
    },
    {
      name: 'Training Joggers Elite',
      short_description: 'Tapered joggers with zippered pockets and adjustable drawstring waist',
      description: 'These premium training joggers combine style and functionality with a modern tapered fit. Crafted from a soft cotton-polyester blend with added stretch for comfort. Features include zippered side pockets for secure storage, ribbed ankle cuffs, and an adjustable drawstring waist. Perfect for workouts or casual wear.',
      base_price: '69.99',
      sku: 'SW-JOG-003',
      category: '2'
    },
    {
      name: 'Lightweight Athletic Hoodie',
      short_description: 'Breathable performance hoodie with thumbholes and kangaroo pocket',
      description: 'Stay comfortable during warm-ups and cool-downs with this lightweight athletic hoodie. Made from moisture-wicking fabric with a soft brushed interior. Features include a three-piece hood with drawcord, thumbholes for hand coverage, and a spacious kangaroo pocket. The relaxed fit allows for easy layering.',
      base_price: '79.99',
      sku: 'SW-HOD-004',
      category: '2'
    },
    {
      name: 'High-Performance Track Suit',
      short_description: 'Complete track suit set with jacket and pants in moisture-wicking fabric',
      description: 'This professional-grade track suit includes a full-zip jacket and matching pants, both made from advanced moisture-wicking polyester. The jacket features side pockets and elastic cuffs, while the pants have a tapered fit with zippered ankle openings. Ideal for training, warm-ups, or casual athletic wear.',
      base_price: '129.99',
      sku: 'SW-TRK-005',
      category: '2'
    },
    {
      name: 'Sports Compression Leggings',
      short_description: 'Full-length compression leggings with high waistband and phone pocket',
      description: 'These compression leggings provide optimal muscle support during any activity. Made from four-way stretch fabric with a high-rise waistband for secure fit. Features include a hidden phone pocket in the waistband, flatlock seams to prevent irritation, and moisture-wicking technology. The squat-proof fabric ensures confidence during any movement.',
      base_price: '54.99',
      sku: 'SW-LEG-006',
      category: '2'
    },
    {
      name: 'Breathable Training Tank Top',
      short_description: 'Racerback tank with mesh inserts and quick-dry technology',
      description: 'Designed for maximum breathability, this training tank features strategic mesh inserts and a racerback design for unrestricted movement. The quick-dry fabric wicks away sweat instantly, while the longer back hem provides extra coverage. Reflective logo details enhance visibility during outdoor workouts.',
      base_price: '34.99',
      sku: 'SW-TNK-007',
      category: '2'
    },
    {
      name: 'All-Weather Running Jacket',
      short_description: 'Water-resistant windbreaker with packable hood and ventilation zippers',
      description: 'This versatile running jacket protects against wind and light rain with its water-resistant coating. Features include a packable hood that stores in the collar, underarm ventilation zippers, and reflective trim for visibility. The lightweight fabric packs into its own pocket for easy carrying.',
      base_price: '89.99',
      sku: 'SW-JAC-008',
      category: '2'
    }
  ]
}

export default function ProductAIAutofill({ onApply }: ProductAIAutofillProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('Leather Jackets')
  const [generating, setGenerating] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState<ProductSuggestion | null>(null)

  const generateSuggestion = () => {
    setGenerating(true)
    
    // Simulate AI generation delay
    setTimeout(() => {
      const templates = PRODUCT_TEMPLATES[selectedCategory]
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
      setCurrentSuggestion(randomTemplate)
      setGenerating(false)
    }, 1000)
  }

  const applySuggestion = () => {
    if (currentSuggestion) {
      onApply(currentSuggestion)
      setIsOpen(false)
    }
  }

  const applyField = (field: keyof ProductSuggestion) => {
    if (currentSuggestion) {
      onApply({ [field]: currentSuggestion[field] })
    }
  }

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-xl hover:from-purple-600 hover:to-orange-600 transition-all flex items-center justify-between group shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <div className="text-left">
            <div className="font-bold text-lg">AI Product Autofill</div>
            <div className="text-sm opacity-90">Generate product details instantly</div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-lg">
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Select Product Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(PRODUCT_TEMPLATES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentSuggestion(null)
                      }}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={generateSuggestion}
                disabled={generating}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-lg hover:from-purple-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-semibold shadow-md mb-6"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Generate Product Suggestion
                  </>
                )}
              </button>

              {/* Suggestion Display */}
              {currentSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Generated Suggestion</h3>
                      <button
                        type="button"
                        onClick={applySuggestion}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                      >
                        Apply All Fields
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Product Name */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Product Name</span>
                          <button
                            type="button"
                            onClick={() => applyField('name')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="font-semibold">{currentSuggestion.name}</p>
                      </div>

                      {/* SKU */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">SKU</span>
                          <button
                            type="button"
                            onClick={() => applyField('sku')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="font-mono">{currentSuggestion.sku}</p>
                      </div>

                      {/* Short Description */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Short Description</span>
                          <button
                            type="button"
                            onClick={() => applyField('short_description')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="text-sm">{currentSuggestion.short_description}</p>
                      </div>

                      {/* Full Description */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Full Description</span>
                          <button
                            type="button"
                            onClick={() => applyField('description')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{currentSuggestion.description}</p>
                      </div>

                      {/* Price */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Base Price</span>
                          <button
                            type="button"
                            onClick={() => applyField('base_price')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="font-bold text-lg text-green-600">${currentSuggestion.base_price}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!currentSuggestion && !generating && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Generate Product Suggestion" to get AI-powered product details</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
