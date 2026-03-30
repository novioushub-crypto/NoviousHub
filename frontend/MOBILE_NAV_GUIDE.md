# Mobile Bottom Navigation Guide

## 📱 What It Looks Like

```
┌─────────────────────────────────────────┐
│                                         │
│         Your Page Content Here          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐ ← Fixed Bottom Nav
│  🏠    📦    📍    👤    🛒             │
│ Home  Prod  Track  Acc  Cart            │
│              (5)                        │ ← Badge on Cart
└─────────────────────────────────────────┘
```

## 🎯 Navigation Structure

### 1. Home (🏠)
- **Link:** `/`
- **Icon:** House
- **Active:** When on homepage
- **Purpose:** Quick return to homepage

### 2. Products (📦)
- **Link:** `/products`
- **Icon:** Package
- **Active:** When on products or category pages
- **Purpose:** Browse all products

### 3. Tracking (📍)
- **Link:** `/account/orders`
- **Icon:** Map Pin
- **Active:** When on order tracking pages
- **Purpose:** Track order status

### 4. Account (👤)
- **Link:** `/account` (if logged in) or `/auth/login` (if not)
- **Icon:** User
- **Active:** When on account or auth pages
- **Purpose:** Access user account

### 5. Cart (🛒)
- **Link:** `/cart`
- **Icon:** Shopping Cart
- **Active:** When on cart or checkout pages
- **Badge:** Shows number of items in cart
- **Purpose:** View shopping cart

## 🎨 Visual States

### Normal State
```
Icon: Gray (#6B7280)
Label: Gray
Background: White/Dark
```

### Active State
```
Icon: Accent Color (#your-accent)
Label: Accent Color (bold)
Top Bar: Accent Color (indicator)
Background: White/Dark
```

### With Badge (Cart)
```
Icon: Normal/Active color
Badge: Red circle with white number
Position: Top-right of icon
```

## 💻 Code Structure

### File Location
```
frontend/
└── components/
    └── layout/
        ├── ConditionalLayout.tsx  ← Includes MobileBottomNav
        └── MobileBottomNav.tsx    ← The component
```

### Component Usage
```typescript
// In ConditionalLayout.tsx
<div className="flex min-h-screen flex-col">
  <Navbar />
  <main className="flex-1 pb-20 md:pb-0">
    {children}
  </main>
  <Footer />
  <MobileBottomNav />  ← Added here
</div>
```

## 📐 Dimensions

```
Height: 64px (h-16)
Width: 100% (full screen width)
Position: Fixed bottom
Z-Index: 50 (above content)
Padding: 8px horizontal

Each Item:
- Width: 20% (flex-1, 5 items)
- Height: 100%
- Icon: 24x24px (w-6 h-6)
- Label: 12px (text-xs)
- Gap: 4px (mt-1)
```

## 🎯 Responsive Behavior

### Mobile (< 768px)
```css
display: flex
position: fixed
bottom: 0
```

### Desktop (≥ 768px)
```css
display: none  /* md:hidden */
```

### Content Padding
```css
/* Main content has bottom padding on mobile */
main {
  padding-bottom: 80px;  /* pb-20 on mobile */
  padding-bottom: 0;     /* md:pb-0 on desktop */
}
```

## 🔧 Customization

### Change Colors
```typescript
// In MobileBottomNav.tsx
const isActive = item.active

// Active color
className={isActive ? 'text-accent' : 'text-gray-500'}

// Badge color
className="bg-accent text-white"
```

### Change Icons
```typescript
import { Home, Package, MapPin, User, ShoppingCart } from 'lucide-react'

// Replace with your preferred icons
const navItems = [
  { icon: Home, ... },      // Change to your icon
  { icon: Package, ... },   // Change to your icon
  // ...
]
```

### Add/Remove Items
```typescript
const navItems = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    active: pathname === '/',
  },
  // Add new item here
  {
    href: '/wishlist',
    icon: Heart,
    label: 'Wishlist',
    active: pathname === '/wishlist',
  },
]
```

## 🎭 Active State Logic

```typescript
// Homepage
active: pathname === '/'

// Products (includes categories)
active: pathname === '/products' || pathname?.startsWith('/products/') || pathname?.startsWith('/category/')

// Tracking
active: pathname?.startsWith('/account/orders')

// Account (includes auth)
active: pathname?.startsWith('/account') || pathname?.startsWith('/auth')

// Cart (includes checkout)
active: pathname === '/cart' || pathname === '/checkout'
```

## 🔔 Badge System

### Cart Badge
```typescript
// Get cart items count
const totalItems = useCartStore((state) => state.getTotalItems())

// Show badge if items > 0
{item.badge && item.badge > 0 && (
  <span className="badge">
    {item.badge > 9 ? '9+' : item.badge}
  </span>
)}
```

### Add Badge to Other Items
```typescript
{
  href: '/account/orders',
  icon: MapPin,
  label: 'Tracking',
  active: pathname?.startsWith('/account/orders'),
  badge: unreadOrders, // Add your count here
}
```

## 🚫 Hidden Routes

The mobile nav is hidden on:
- Admin routes (`/admin/*`)
- Any route starting with `/admin`

```typescript
// In MobileBottomNav.tsx
if (pathname?.startsWith('/admin')) {
  return null
}
```

## 🎨 Dark Mode Support

```typescript
// Background
className="bg-white dark:bg-brand"

// Border
className="border-gray-200 dark:border-gray-700"

// Text
className="text-gray-500 dark:text-gray-400"

// Active text
className="text-accent" // Works in both modes
```

## 📱 Touch Targets

All items meet accessibility guidelines:
- Minimum height: 64px ✅
- Minimum width: ~75px (20% of screen) ✅
- Clear visual feedback ✅
- Adequate spacing ✅

## 🧪 Testing Checklist

### Visual Testing
- [ ] Nav appears on mobile
- [ ] Nav hidden on desktop
- [ ] Icons are clear
- [ ] Labels are readable
- [ ] Active state works
- [ ] Badge shows correctly
- [ ] Dark mode works

### Functional Testing
- [ ] All links work
- [ ] Active states update
- [ ] Cart badge updates
- [ ] Auth redirect works
- [ ] Smooth transitions
- [ ] No layout shift

### Device Testing
- [ ] iPhone SE (small)
- [ ] iPhone 12/13 (medium)
- [ ] iPhone 14 Pro Max (large)
- [ ] Android phones
- [ ] Tablets (should hide at md breakpoint)

## 🐛 Troubleshooting

### Nav not showing
- Check screen size (must be < 768px)
- Check if on admin route
- Check z-index conflicts

### Content hidden behind nav
- Ensure main has `pb-20` on mobile
- Check if `md:pb-0` is applied

### Badge not updating
- Check if store is hydrated
- Check if `mounted` state is true
- Verify cart store is working

### Active state wrong
- Check pathname logic
- Verify route matches pattern
- Check if multiple items active

## 💡 Tips

1. **Keep it simple:** 5 items max for mobile
2. **Use clear icons:** Recognizable at small size
3. **Short labels:** 1-2 words maximum
4. **Test on real devices:** Simulators aren't enough
5. **Consider thumb zones:** Most important items in center

## 🎯 Best Practices

✅ **Do:**
- Use standard icons
- Keep labels short
- Show active states
- Use badges for counts
- Test on real devices

❌ **Don't:**
- Add too many items (max 5)
- Use unclear icons
- Forget active states
- Hide important actions
- Ignore touch target sizes

---

**Your mobile bottom navigation is ready to use!** 🎉
