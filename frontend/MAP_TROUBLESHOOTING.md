# Map Not Showing - Troubleshooting Guide

## 🔴 Issue: "No destination address provided"

This error means your order doesn't have a shipping address saved in the database.

## Why This Happens

When you create an order, the shipping address needs to be saved. If the order was created without completing the checkout process properly, the address might be missing.

## ✅ Solution: Create a Complete Order

### Step 1: Clear Cart and Start Fresh
1. Go to cart: `http://localhost:3000/cart`
2. Remove all items
3. Add a new product to cart

### Step 2: Complete Full Checkout
1. Go to checkout: `http://localhost:3000/checkout`
2. Fill in ALL shipping information:
   - Email
   - Full Name
   - Phone
   - Address Line 1
   - City
   - State
   - Postal Code
   - Country

3. Click "Continue to Payment"
4. Click "Place Order" (COD)
5. Wait for order confirmation

### Step 3: Check Order Has Address
1. Go to: `http://localhost:3000/account/orders`
2. Click eye icon (👁️) on the new order
3. Verify shipping address shows
4. Click "Track Order on Map"
5. Map should now load!

## 🧪 Test with Sample Address

Use this test address for checkout:

```
Email: test@example.com
Full Name: John Doe
Phone: +1 (555) 123-4567
Address Line 1: 123 Market Street
City: San Francisco
State: CA
Postal Code: 94102
Country: US
```

This will geocode to San Francisco and show on the map!

## 🗺️ What You Should See

After creating a proper order:

1. **Warehouse Marker** (Blue)
   - Location: New York, NY
   - Coordinates: 40.7128, -74.0060

2. **Delivery Marker** (Red)
   - Location: Your shipping address
   - Geocoded from address

3. **Route Line** (Purple)
   - Dashed line connecting markers
   - Shows delivery path

4. **Map Controls**
   - Zoom buttons (+/-)
   - Pan by dragging
   - Click markers for popups

## 🔧 Backend Check

If you have access to the backend, verify the order has shipping_address:

```python
# In Django shell
from apps.orders.models import Order

order = Order.objects.get(order_number='NVF08AD68B8E')
print(order.shipping_address)  # Should show address data
```

## 🐛 Common Issues

### 1. Order Created Without Address
**Symptom:** "No destination address provided"
**Fix:** Create new order with complete checkout

### 2. Invalid Address Format
**Symptom:** Map loads but no delivery marker
**Fix:** Use valid US address format

### 3. Geocoding Failed
**Symptom:** Map shows but marker in wrong place
**Fix:** Use more specific address (include street number)

### 4. Map Not Loading at All
**Symptom:** Gray box with loading spinner
**Fix:** Check internet connection, Leaflet CSS loaded

## 📝 Order Data Structure

A complete order should have:

```json
{
  "order_number": "NVF08AD68B8E",
  "status": "pending",
  "shipping_address": {
    "full_name": "John Doe",
    "email": "test@example.com",
    "phone": "+1 (555) 123-4567",
    "address_line1": "123 Market Street",
    "address_line2": "",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102",
    "country": "US"
  }
}
```

## 🎯 Quick Fix Steps

1. **Delete old test orders** (if any)
2. **Add product to cart**
3. **Go through complete checkout**
4. **Fill ALL address fields**
5. **Place order**
6. **Track order**
7. **See map!**

## ✅ Success Indicators

You know it's working when:

- ✅ Shipping address shows on order details page
- ✅ Map loads within 2-3 seconds
- ✅ Two markers visible (warehouse + delivery)
- ✅ Purple route line connects them
- ✅ Can zoom and pan map
- ✅ Clicking markers shows popups

## 🔄 Alternative: Update Existing Order

If you want to fix an existing order, you can update it via Django admin:

1. Go to: `http://localhost:8000/admin`
2. Find Orders
3. Click on your order
4. Add shipping address details
5. Save
6. Refresh tracking page

## 📍 Test Addresses That Work Well

### San Francisco
```
123 Market Street
San Francisco, CA 94102
```

### Los Angeles
```
456 Hollywood Blvd
Los Angeles, CA 90028
```

### Chicago
```
789 Michigan Avenue
Chicago, IL 60611
```

### Miami
```
321 Ocean Drive
Miami, FL 33139
```

All of these will geocode correctly and show on the map!

## 🚀 Next Steps

1. Create a new order with complete address
2. Track the order
3. See the map working
4. Test zoom and pan
5. Click markers for details

---

**The map IS working - you just need an order with a complete shipping address!**
