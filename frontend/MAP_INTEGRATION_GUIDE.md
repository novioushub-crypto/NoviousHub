# OpenStreetMap Integration Guide

## ✅ What Was Implemented

The OrderMap component has been fully integrated with OpenStreetMap and improved with:

### New Features
1. **Loading State** - Shows spinner while geocoding address
2. **Error Handling** - Graceful fallback if geocoding fails
3. **Better Markers** - Warehouse and delivery address markers
4. **Route Visualization** - Dashed line showing delivery route
5. **Map Legend** - Shows what each marker represents
6. **Console Logging** - Debug information for troubleshooting
7. **Responsive Design** - Works on all screen sizes
8. **Dark Mode Support** - Map tiles and controls adapt to theme

### Files Modified
- `components/OrderMap.tsx` - Enhanced with error handling and loading states
- `app/globals.css` - Added Leaflet CSS import and custom styles

## 🗺️ How the Map Works

### 1. Address Geocoding
```typescript
// Converts address to coordinates
const address = `${destination?.address_line1}, ${destination?.city}, ${destination?.state}, ${destination?.country}`
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
)
```

### 2. Map Display
- **Warehouse Location:** New York (40.7128, -74.0060)
- **Delivery Location:** Geocoded from shipping address
- **Route:** Purple dashed line connecting both points
- **Center:** Midpoint between warehouse and delivery

### 3. Interactive Features
- Zoom in/out controls
- Pan/drag map
- Click markers for popups
- Scroll wheel zoom enabled

## 🧪 Testing the Map

### Step 1: Start Development Server
```bash
cd frontend
npm run dev
```

### Step 2: Navigate to Tracking Page
1. Go to `http://localhost:3000/account/orders`
2. Click on an order
3. Click "Track Order on Map" button
4. Or directly visit: `http://localhost:3000/account/orders/[ORDER_NUMBER]/track`

### Step 3: Check Browser Console
Open browser DevTools (F12) and check Console tab for:
```
Geocoding address: [address]
Geocoding result: [coordinates]
Coordinates set: [lat, lon]
```

### What You Should See

#### Loading State (First 1-2 seconds)
```
┌─────────────────────────────┐
│                             │
│      ⟳ Loading map...       │
│                             │
└─────────────────────────────┘
```

#### Loaded Map
```
┌─────────────────────────────┐
│  🗺️ OpenStreetMap           │
│                             │
│  📦 -------- 🏠            │
│  Warehouse   Delivery       │
│                             │
│  Legend:                    │
│  🔵 Warehouse               │
│  🔴 Delivery                │
│  ━━ Route                   │
└─────────────────────────────┘
```

## 🔧 Troubleshooting

### Map Not Showing

**Issue:** Blank gray box instead of map

**Solutions:**
1. **Check Console for Errors**
   ```
   F12 → Console tab
   Look for red errors
   ```

2. **Verify Leaflet CSS Loaded**
   ```
   F12 → Network tab
   Filter: CSS
   Look for: leaflet.css (should be 200 OK)
   ```

3. **Check Internet Connection**
   - Map tiles load from OpenStreetMap servers
   - Requires active internet connection

4. **Clear Browser Cache**
   ```
   Ctrl + Shift + Delete
   Clear cached images and files
   ```

### Geocoding Fails

**Issue:** Map shows but wrong location

**Solutions:**
1. **Check Address Format**
   - Ensure shipping address is complete
   - Include city, state, country

2. **Check Console Logs**
   ```javascript
   Geocoding address: [your address]
   Geocoding result: [should have data]
   ```

3. **Fallback Location**
   - If geocoding fails, uses San Francisco (37.7749, -122.4194)
   - This is expected behavior

### Map Controls Not Working

**Issue:** Can't zoom or pan

**Solutions:**
1. **Check scrollWheelZoom**
   - Should be `true` in MapContainer
   
2. **Check z-index**
   - Map should be above other elements
   
3. **Check Container Size**
   - Must have explicit height (h-96 = 384px)

## 📋 Map Component Props

```typescript
interface OrderMapProps {
  destination: {
    address_line1: string
    address_line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  status: string // 'pending' | 'processing' | 'shipped' | 'delivered'
}
```

## 🎨 Customization

### Change Warehouse Location
```typescript
// In OrderMap.tsx
const warehouseLocation: [number, number] = [YOUR_LAT, YOUR_LON]
```

### Change Route Color
```typescript
<Polyline 
  positions={[warehouseLocation, coordinates]} 
  color="#YOUR_COLOR"  // Change this
  weight={3}
  opacity={0.7}
/>
```

### Change Map Zoom Level
```typescript
<MapContainer 
  center={midpoint} 
  zoom={5}  // Change this (1-18)
  style={{ height: '100%', width: '100%' }}
>
```

### Change Map Tiles (Dark Mode)
```typescript
// For dark mode tiles
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>
```

## 🌐 Map Tile Providers

### OpenStreetMap (Current)
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### CartoDB Dark (For Dark Mode)
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

### CartoDB Light
```
https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
```

## 📊 Map States

### 1. Loading
- Shows spinner
- "Loading map..." text
- Gray background

### 2. Error
- Shows error icon
- Error message
- Gray background

### 3. Loaded
- Full interactive map
- Markers visible
- Route drawn
- Legend displayed

## 🔍 Debug Checklist

When map doesn't show, check:

- [ ] Internet connection active
- [ ] Browser console for errors
- [ ] Network tab shows tile requests (200 OK)
- [ ] Leaflet CSS loaded
- [ ] Component mounted (not SSR)
- [ ] Destination address provided
- [ ] C