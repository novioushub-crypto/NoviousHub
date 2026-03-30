# Order Tracking Page - Complete Guide

## 🗺️ How to Access the Tracking Page

### Correct URLs

1. **From Orders List:**
   - Go to: `http://localhost:3000/account/orders`
   - Click "Track Order" button on any shipped/processing order
   - OR click eye icon (👁️) then "Track Order on Map"

2. **Direct URL:**
   ```
   http://localhost:3000/account/orders/[ORDER_NUMBER]/track
   ```
   
   Example:
   ```
   http://localhost:3000/account/orders/NV332B10C2BA/track
   ```

### ❌ Wrong URLs (Will Show Orders Page)

- `http://localhost:3000/account/orders/track` ← Missing order number
- `http://localhost:3000/track` ← Wrong path
- `http://localhost:3000/account/track` ← Wrong path

## 📁 File Structure

```
frontend/app/account/orders/
├── page.tsx                           ← Orders list page
├── [orderNumber]/
│   ├── page.tsx                       ← Order details page
│   └── track/
│       └── page.tsx                   ← Tracking page with map ✅
```

## 🎯 Navigation Flow

```
Orders List Page
(/account/orders)
    ↓
    Click "Track Order" button
    ↓
Tracking Page with Map
(/account/orders/NV332B10C2BA/track)
```

OR

```
Orders List Page
(/account/orders)
    ↓
    Click eye icon (👁️)
    ↓
Order Details Page
(/account/orders/NV332B10C2BA)
    ↓
    Click "Track Order on Map" button
    ↓
Tracking Page with Map
(/account/orders/NV332B10C2BA/track)
```

## 🗺️ What the Tracking Page Shows

1. **Interactive OpenStreetMap**
   - Warehouse location (New York)
   - Delivery address location
   - Route line between them
   - Zoom/pan controls
   - Clickable markers with popups

2. **Progress Timeline**
   - Order Placed (Pending)
   - Processing
   - Shipped
   - Delivered

3. **Shipping Details**
   - Full shipping address
   - Tracking number (if available)
   - Carrier information

4. **Order Summary**
   - Subtotal
   - Shipping cost
   - Tax
   - Total

## 🔧 Troubleshooting

### Map Not Showing?

**Check these:**

1. **Correct URL?**
   - Must include order number: `/account/orders/[ORDER_NUMBER]/track`
   - Not just `/account/orders/track`

2. **Order exists?**
   - Order must exist in database
   - Order number must be valid

3. **Console errors?**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for Leaflet or map errors

4. **Network issues?**
   - Map tiles load from OpenStreetMap
   - Check internet connection
   - Check if OpenStreetMap is accessible

### Still Showing Orders Page?

**Possible causes:**

1. **Wrong URL**
   - You're at `/account/orders` instead of `/account/orders/[ORDER_NUMBER]/track`

2. **Order not found**
   - Invalid order number
   - Order doesn't exist
   - API error

3. **Cache issue**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Clear Next.js cache: `rm -rf .next`

## 🧪 Testing Steps

### Step 1: Create a Test Order
1. Add items to cart
2. Go to checkout
3. Complete order
4. Note the order number (e.g., NV332B10C2BA)

### Step 2: Access Tracking
1. Go to My Orders: `http://localhost:3000/account/orders`
2. Find your order
3. Click "Track Order" button
4. Should open: `http://localhost:3000/account/orders/NV332B10C2BA/track`

### Step 3: Verify Map
1. Map should load within 2-3 seconds
2. Should see two markers:
   - Blue marker: Warehouse (New York)
   - Red marker: Your delivery address
3. Purple dashed line connecting them
4. Can zoom in/out
5. Can click markers for popups

## 📊 Map Features

### Markers
- **Warehouse (📦):** New York, NY (40.7128, -74.0060)
- **Delivery (🏠):** Your shipping address (geocoded)

### Route Line
- Purple color (#8B5CF6)
- Dashed style
- Shows delivery path

### Controls
- **Zoom:** +/- buttons top-left
- **Pan:** Click and drag
- **Popups:** Click markers

### Legend
- Bottom-left corner
- Shows what each marker means
- Color-coded

## 🎨 Map Styling

### Light Mode
- White background
- Standard OpenStreetMap tiles
- Clear markers

### Dark Mode
- Dark gray background
- Same tiles (OpenStreetMap doesn't have dark tiles)
- Adjusted controls

## 🔍 Geocoding

The map automatically geocodes your shipping address:

1. Takes address from order
2. Sends to Nominatim (OpenStreetMap geocoding)
3. Gets coordinates (latitude, longitude)
4. Places marker on map

**Address format:**
```
{address_line1}, {city}, {state}, {country}
```

**Example:**
```
123 Main St, San Francisco, CA, US
→ Coordinates: 37.7749, -122.4194
```

## 🚀 Quick Test

Run this in your browser console when on tracking page:

```javascript
// Check if map loaded
console.log('Map container:', document.querySelector('.leaflet-container'))

// Check if markers exist
console.log('Markers:', document.querySelectorAll('.leaflet-marker-icon').length)

// Check if tiles loaded
console.log('Tiles:', document.querySelectorAll('.leaflet-tile').length)
```

Should see:
- Map container: HTMLDivElement
- Markers: 2
- Tiles: Multiple (depends on zoom)

## 📝 Example URLs

### Development
```
http://localhost:3000/account/orders/NV332B10C2BA/track
http://localhost:3000/account/orders/ABC123XYZ/track
```

### Production
```
https://noviious.com/account/orders/NV332B10C2BA/track
https://noviious.com/account/orders/ABC123XYZ/track
```

## ⚠️ Common Mistakes

1. **Forgetting order number in URL**
   - ❌ `/account/orders/track`
   - ✅ `/account/orders/NV332B10C2BA/track`

2. **Using wrong order number**
   - Must be exact match
   - Case-sensitive
   - No spaces

3. **Not waiting for map to load**
   - Map takes 2-3 seconds
   - Shows loading spinner
   - Wait for tiles to appear

4. **Expecting real-time tracking**
   - Map shows static route
   - Not live GPS tracking
   - Updates when order status changes

## 🎯 Success Indicators

You know it's working when you see:

✅ URL includes order number
✅ Page title: "Track Order #[NUMBER]"
✅ Progress timeline shows
✅ Map loads with tiles
✅ Two markers visible
✅ Purple route line
✅ Can zoom and pan
✅ Shipping address displays
✅ Order summary shows

## 🔗 Related Pages

- **Orders List:** `/account/orders`
- **Order Details:** `/account/orders/[orderNumber]`
- **Tracking:** `/account/orders/[orderNumber]/track` ← You are here

---

**Need help?** Check browser console for errors or contact support.
