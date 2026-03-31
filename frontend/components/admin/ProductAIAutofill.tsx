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
    },
    {
      name: 'Aviator Shearling Leather Jacket',
      short_description: 'Luxurious aviator jacket with genuine shearling collar and lining',
      description: 'Experience ultimate warmth and style with this aviator jacket featuring genuine shearling collar and interior lining. Made from premium leather with a distressed finish, it includes front zipper closure, side pockets, and adjustable waist straps. The oversized collar can be worn up or down for versatile styling.',
      base_price: '599.99',
      sku: 'LJ-AVI-006',
      category: '1'
    },
    {
      name: 'Cafe Racer Leather Jacket',
      short_description: 'Minimalist cafe racer with band collar and snap button closure',
      description: 'This sleek cafe racer jacket embodies minimalist style with its clean design and band collar. Crafted from smooth leather with a matte finish, it features snap button front closure, zippered cuffs, and two side pockets. The slim fit and lightweight construction make it perfect for year-round wear.',
      base_price: '329.99',
      sku: 'LJ-CAF-007',
      category: '1'
    },
    {
      name: 'Double Rider Leather Jacket',
      short_description: 'Classic double rider with asymmetric zipper and belt details',
      description: 'The iconic double rider jacket features an asymmetric front zipper, wide lapels, and multiple belt details for adjustable fit. Made from heavyweight leather with a semi-gloss finish, it includes zippered sleeve cuffs, side pockets, and interior pockets. Built to last and age beautifully over time.',
      base_price: '479.99',
      sku: 'LJ-DBL-008',
      category: '1'
    },
    {
      name: 'Perforated Leather Racing Jacket',
      short_description: 'Ventilated racing jacket with perforated panels and armor pockets',
      description: 'Designed for performance and style, this racing jacket features perforated leather panels for enhanced breathability. Includes CE-approved armor pockets at shoulders, elbows, and back, along with reflective piping for visibility. The pre-curved sleeves and stretch panels ensure comfortable riding position.',
      base_price: '529.99',
      sku: 'LJ-PER-009',
      category: '1'
    },
    {
      name: 'Vintage Leather Field Jacket',
      short_description: 'Military-inspired field jacket with multiple cargo pockets',
      description: 'This vintage-style field jacket combines military aesthetics with premium leather craftsmanship. Features four front cargo pockets, button-front closure, and adjustable waist tabs. The relaxed fit and durable construction make it ideal for outdoor adventures while maintaining a sophisticated urban look.',
      base_price: '369.99',
      sku: 'LJ-FLD-010',
      category: '1'
    }
  ],
  'Running & Track': [
    {
      name: 'Performance Running Shorts Pro',
      short_description: 'Lightweight moisture-wicking running shorts with built-in compression liner',
      description: 'Engineered for serious runners, these performance shorts feature advanced moisture-wicking fabric that keeps you dry during intense workouts. The built-in compression liner provides support, while the lightweight outer shell offers freedom of movement. Includes zippered pocket for secure storage and reflective details for low-light visibility.',
      base_price: '49.99',
      sku: 'SW-RUN-001',
      category: '2'
    },
    {
      name: 'Marathon Training Singlet',
      short_description: 'Ultra-lightweight racing singlet with seamless construction',
      description: 'This professional-grade racing singlet is designed for maximum performance with seamless construction to eliminate chafing. Made from ultra-lightweight, quick-dry fabric with laser-cut ventilation zones. The racerback design ensures unrestricted arm movement, while reflective logos enhance visibility.',
      base_price: '39.99',
      sku: 'SW-RUN-002',
      category: '2'
    },
    {
      name: 'All-Weather Running Jacket',
      short_description: 'Water-resistant windbreaker with packable hood and ventilation zippers',
      description: 'This versatile running jacket protects against wind and light rain with its water-resistant coating. Features include a packable hood that stores in the collar, underarm ventilation zippers, and reflective trim for visibility. The lightweight fabric packs into its own pocket for easy carrying.',
      base_price: '89.99',
      sku: 'SW-RUN-003',
      category: '2'
    },
    {
      name: 'Track Spike Running Shoes',
      short_description: 'Professional track spikes with carbon fiber plate and breathable mesh',
      description: 'Engineered for competitive track athletes, these spikes feature a carbon fiber plate for explosive propulsion and removable 6mm pyramid spikes. The breathable mesh upper with synthetic overlays provides secure lockdown, while the responsive foam midsole delivers energy return with every stride.',
      base_price: '149.99',
      sku: 'SW-RUN-004',
      category: '2'
    }
  ],
  'Training & Gym': [
    {
      name: 'Athletic Compression Shirt',
      short_description: 'Form-fitting compression top with four-way stretch and breathable mesh panels',
      description: 'This high-performance compression shirt is designed to enhance your workout with targeted muscle support and improved circulation. Made from four-way stretch fabric with strategic mesh panels for ventilation. Flatlock seams prevent chafing, while the moisture-wicking technology keeps you cool and dry during high-intensity training.',
      base_price: '59.99',
      sku: 'SW-GYM-001',
      category: '2'
    },
    {
      name: 'Training Joggers Elite',
      short_description: 'Tapered joggers with zippered pockets and adjustable drawstring waist',
      description: 'These premium training joggers combine style and functionality with a modern tapered fit. Crafted from a soft cotton-polyester blend with added stretch for comfort. Features include zippered side pockets for secure storage, ribbed ankle cuffs, and an adjustable drawstring waist. Perfect for workouts or casual wear.',
      base_price: '69.99',
      sku: 'SW-GYM-002',
      category: '2'
    },
    {
      name: 'Lightweight Athletic Hoodie',
      short_description: 'Breathable performance hoodie with thumbholes and kangaroo pocket',
      description: 'Stay comfortable during warm-ups and cool-downs with this lightweight athletic hoodie. Made from moisture-wicking fabric with a soft brushed interior. Features include a three-piece hood with drawcord, thumbholes for hand coverage, and a spacious kangaroo pocket. The relaxed fit allows for easy layering.',
      base_price: '79.99',
      sku: 'SW-GYM-003',
      category: '2'
    },
    {
      name: 'CrossFit Training Shorts',
      short_description: 'Durable stretch shorts with reinforced seams and side splits',
      description: 'Built for high-intensity functional fitness, these training shorts feature four-way stretch fabric with reinforced seams at stress points. Side splits allow for deep squats and dynamic movements, while the elastic waistband with internal drawcord ensures secure fit. Quick-dry technology keeps you comfortable through any WOD.',
      base_price: '54.99',
      sku: 'SW-GYM-004',
      category: '2'
    },
    {
      name: 'Muscle Fit Tank Top',
      short_description: 'Fitted tank with dropped armholes and curved hem',
      description: 'This muscle-fit tank is designed to showcase your physique while providing comfort during intense workouts. Features dropped armholes for unrestricted movement, a curved hem for better coverage, and moisture-wicking fabric. The fitted cut and soft material make it perfect for weightlifting and bodybuilding.',
      base_price: '34.99',
      sku: 'SW-GYM-005',
      category: '2'
    }
  ],
  'Yoga & Pilates': [
    {
      name: 'Sports Compression Leggings',
      short_description: 'Full-length compression leggings with high waistband and phone pocket',
      description: 'These compression leggings provide optimal muscle support during any activity. Made from four-way stretch fabric with a high-rise waistband for secure fit. Features include a hidden phone pocket in the waistband, flatlock seams to prevent irritation, and moisture-wicking technology. The squat-proof fabric ensures confidence during any movement.',
      base_price: '54.99',
      sku: 'SW-YOG-001',
      category: '2'
    },
    {
      name: 'Breathable Training Tank Top',
      short_description: 'Racerback tank with mesh inserts and quick-dry technology',
      description: 'Designed for maximum breathability, this training tank features strategic mesh inserts and a racerback design for unrestricted movement. The quick-dry fabric wicks away sweat instantly, while the longer back hem provides extra coverage. Reflective logo details enhance visibility during outdoor workouts.',
      base_price: '34.99',
      sku: 'SW-YOG-002',
      category: '2'
    },
    {
      name: 'Seamless Yoga Bra',
      short_description: 'Medium-support sports bra with removable pads and seamless construction',
      description: 'This seamless yoga bra offers medium support for low to moderate impact activities. Features removable padding for customizable coverage, wide elastic underband for stability, and seamless construction to eliminate chafing. The soft, stretchy fabric moves with your body through every pose.',
      base_price: '44.99',
      sku: 'SW-YOG-003',
      category: '2'
    },
    {
      name: 'Cropped Yoga Pants',
      short_description: '7/8 length yoga pants with side pockets and gusseted crotch',
      description: 'These cropped yoga pants hit just above the ankle for a flattering fit. Made from buttery-soft fabric with four-way stretch, they feature a high-rise waistband, side pockets for essentials, and a gusseted crotch for enhanced mobility. The moisture-wicking material keeps you dry through hot yoga sessions.',
      base_price: '64.99',
      sku: 'SW-YOG-004',
      category: '2'
    }
  ],
  'Basketball': [
    {
      name: 'Basketball Performance Jersey',
      short_description: 'Mesh basketball jersey with moisture-wicking technology',
      description: 'This professional-grade basketball jersey features breathable mesh construction for maximum airflow. The moisture-wicking fabric keeps you dry during intense games, while the sleeveless design allows for unrestricted shooting motion. Reinforced stitching at stress points ensures durability through countless games.',
      base_price: '44.99',
      sku: 'SW-BBL-001',
      category: '2'
    },
    {
      name: 'Basketball Shorts Pro',
      short_description: 'Lightweight basketball shorts with elastic waistband and side pockets',
      description: 'Designed for peak performance on the court, these basketball shorts feature lightweight, quick-dry fabric with a comfortable elastic waistband and internal drawcord. Deep side pockets provide secure storage, while the loose fit allows for explosive movements. Mesh panels enhance breathability.',
      base_price: '39.99',
      sku: 'SW-BBL-002',
      category: '2'
    },
    {
      name: 'Compression Arm Sleeves',
      short_description: 'Pair of compression sleeves with UV protection and moisture-wicking',
      description: 'These compression arm sleeves provide muscle support and improve circulation during play. Made from stretchy, moisture-wicking fabric with UPF 50+ sun protection. The silicone grip at the top prevents slipping, while the seamless construction ensures comfort. Sold as a pair.',
      base_price: '24.99',
      sku: 'SW-BBL-003',
      category: '2'
    }
  ],
  'Soccer & Football': [
    {
      name: 'Soccer Training Jersey',
      short_description: 'Lightweight soccer jersey with ventilated mesh panels',
      description: 'This training jersey is engineered for soccer players with strategically placed mesh panels for enhanced ventilation. The moisture-wicking fabric keeps you dry, while the athletic fit allows for full range of motion. Raglan sleeves prevent shoulder seam irritation during play.',
      base_price: '49.99',
      sku: 'SW-SOC-001',
      category: '2'
    },
    {
      name: 'Soccer Training Pants',
      short_description: 'Tapered training pants with zippered ankles and side pockets',
      description: 'These soccer training pants feature a modern tapered fit with zippered ankle openings for easy on/off over cleats. Made from lightweight, water-resistant fabric with zippered side pockets. The elastic waistband with drawcord ensures secure fit during drills and practice sessions.',
      base_price: '59.99',
      sku: 'SW-SOC-002',
      category: '2'
    },
    {
      name: 'Compression Soccer Shorts',
      short_description: 'Tight-fit compression shorts for under soccer uniforms',
      description: 'Wear these compression shorts under your soccer uniform for added support and muscle stabilization. The four-way stretch fabric moves with you, while the moisture-wicking technology keeps you dry. Flatlock seams prevent chafing during 90-minute matches.',
      base_price: '34.99',
      sku: 'SW-SOC-003',
      category: '2'
    }
  ],
  'Track Suits & Sets': [
    {
      name: 'High-Performance Track Suit',
      short_description: 'Complete track suit set with jacket and pants in moisture-wicking fabric',
      description: 'This professional-grade track suit includes a full-zip jacket and matching pants, both made from advanced moisture-wicking polyester. The jacket features side pockets and elastic cuffs, while the pants have a tapered fit with zippered ankle openings. Ideal for training, warm-ups, or casual athletic wear.',
      base_price: '129.99',
      sku: 'SW-TRK-001',
      category: '2'
    },
    {
      name: 'Retro Track Suit Set',
      short_description: 'Vintage-inspired track suit with contrast stripes and snap buttons',
      description: 'Embrace retro style with this vintage-inspired track suit featuring contrast stripes down the sleeves and legs. The jacket has snap button closure and side pockets, while the pants include an elastic waistband with drawcord. Made from comfortable tricot fabric with a slight sheen.',
      base_price: '99.99',
      sku: 'SW-TRK-002',
      category: '2'
    },
    {
      name: 'Fleece Track Suit',
      short_description: 'Warm fleece track suit perfect for cold weather training',
      description: 'Stay warm during cold-weather workouts with this fleece-lined track suit. The jacket features a full-zip front, hood, and kangaroo pocket, while the pants have an elastic waistband and cuffed ankles. The soft fleece interior provides warmth without bulk.',
      base_price: '119.99',
      sku: 'SW-TRK-003',
      category: '2'
    },
    {
      name: 'Tech Fleece Jogger Set',
      short_description: 'Modern jogger set with tech fleece fabric and zippered pockets',
      description: 'This contemporary jogger set features innovative tech fleece fabric that provides warmth without weight. The hoodie includes a three-piece hood and zippered pockets, while the joggers have a tapered fit with zippered side pockets and ribbed cuffs. Perfect for athleisure wear.',
      base_price: '149.99',
      sku: 'SW-TRK-004',
      category: '2'
    }
  ],
  'Swimming & Water Sports': [
    {
      name: 'Competition Swim Jammer',
      short_description: 'Chlorine-resistant swim jammer with compression fit',
      description: 'Designed for competitive swimmers, this jammer provides compression and muscle support. Made from chlorine-resistant fabric that maintains shape and color. The flatlock seams reduce drag, while the drawcord waistband ensures secure fit during races and training.',
      base_price: '54.99',
      sku: 'SW-SWM-001',
      category: '2'
    },
    {
      name: 'Rash Guard Long Sleeve',
      short_description: 'UPF 50+ rash guard for surfing and water sports',
      description: 'This long-sleeve rash guard offers UPF 50+ sun protection for extended water activities. Made from quick-dry, four-way stretch fabric with flatlock seams to prevent chafing. The fitted design reduces drag in water, while the crew neck provides comfortable coverage.',
      base_price: '44.99',
      sku: 'SW-SWM-002',
      category: '2'
    }
  ],
  'Cycling': [
    {
      name: 'Cycling Bib Shorts Pro',
      short_description: 'Professional cycling bib shorts with Italian chamois pad',
      description: 'These pro-level bib shorts feature an Italian-made chamois pad for maximum comfort on long rides. The compression fabric provides muscle support, while the mesh bib straps ensure breathability. Silicone leg grippers keep shorts in place, and reflective details enhance visibility.',
      base_price: '129.99',
      sku: 'SW-CYC-001',
      category: '2'
    },
    {
      name: 'Cycling Jersey Aero',
      short_description: 'Aerodynamic cycling jersey with three rear pockets',
      description: 'This aerodynamic jersey is designed to reduce drag with its race-fit cut and smooth fabric. Features three rear pockets for nutrition and essentials, full-length front zipper for ventilation control, and silicone gripper at hem. Made from moisture-wicking fabric with UPF 30 sun protection.',
      base_price: '89.99',
      sku: 'SW-CYC-002',
      category: '2'
    }
  ],
  'Winter Sports': [
    {
      name: 'Thermal Base Layer Set',
      short_description: 'Merino wool base layer top and bottom for cold weather',
      description: 'This thermal base layer set is made from merino wool blend that naturally regulates temperature and resists odors. The fitted design allows for easy layering, while flatlock seams prevent chafing. Ideal for skiing, snowboarding, and other winter activities.',
      base_price: '119.99',
      sku: 'SW-WIN-001',
      category: '2'
    },
    {
      name: 'Insulated Ski Jacket',
      short_description: 'Waterproof ski jacket with synthetic insulation and powder skirt',
      description: 'Stay warm and dry on the slopes with this fully waterproof ski jacket. Features synthetic insulation for warmth, a removable powder skirt, multiple pockets including a goggle pocket, and adjustable cuffs. The helmet-compatible hood and ventilation zippers add versatility.',
      base_price: '299.99',
      sku: 'SW-WIN-002',
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                  {Object.keys(PRODUCT_TEMPLATES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentSuggestion(null)
                      }}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {PRODUCT_TEMPLATES[selectedCategory].length} templates available in {selectedCategory}
                </p>
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
