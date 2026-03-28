export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  avatar: string
  phone: string
  is_verified: boolean
  is_staff: boolean
  is_superuser: boolean
  date_joined: string
  profile: Profile
}

export interface Profile {
  bio: string
  date_of_birth: string | null
  newsletter_subscribed: boolean
}

export interface Address {
  id: number
  address_type: 'shipping' | 'billing'
  full_name: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  parent: number | null
  children: Category[]
  is_active: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  base_price: string
  compare_at_price: string | null
  discount_percentage: number
  sku: string
  category: Category
  category_name?: string
  primary_image?: string
  images: ProductImage[]
  variants: ProductVariant[]
  reviews: Review[]
  average_rating: number
  total_stock: number
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  weight: string | null
  meta_title: string
  meta_description: string
  views_count: number
  sales_count: number
  created_at: string
}


export interface ProductImage {
  id: number
  image_url: string
  alt_text: string
  is_primary: boolean
  order: number
}

export interface ProductVariant {
  id: number
  size: string
  color: string
  color_hex: string
  sku: string
  stock: number
  price_adjustment: string
  final_price: string
  is_active: boolean
}

export interface Review {
  id: number
  user: number
  user_name: string
  user_avatar: string
  rating: number
  title: string
  comment: string
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
}

export interface Order {
  id: number
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: string
  discount_amount: string
  shipping_cost: string
  tax_amount: string
  total: string
  items: OrderItem[]
  shipping_address: ShippingAddress
  notes: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  variant: number
  product_name: string
  variant_details: string
  quantity: number
  unit_price: string
  total_price: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  email: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  tracking_number: string
  carrier: string
}

export interface CartItem {
  variant_id: number
  product: Product
  variant: ProductVariant
  quantity: number
}

export interface WishlistItem {
  id: number
  product: Product
  created_at: string
}
