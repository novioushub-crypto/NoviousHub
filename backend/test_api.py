#!/usr/bin/env python
"""Quick test script to verify API and images are working"""
import requests

print("Testing Noviious API...")
print("-" * 50)

# Test products endpoint
print("\n1. Testing products endpoint...")
response = requests.get('http://localhost:8000/api/v1/products/')
if response.status_code == 200:
    data = response.json()
    print(f"✓ Products API working - Found {len(data['results'])} products")
    
    # Test first product image
    if data['results']:
        first_product = data['results'][0]
        print(f"\n2. Testing image for: {first_product['name']}")
        image_url = first_product.get('primary_image')
        if image_url:
            print(f"   Image URL: {image_url}")
            img_response = requests.get(image_url)
            if img_response.status_code == 200:
                print(f"   ✓ Image accessible - Size: {len(img_response.content)} bytes")
            else:
                print(f"   ✗ Image failed - Status: {img_response.status_code}")
        else:
            print("   ✗ No primary_image found")
else:
    print(f"✗ Products API failed - Status: {response.status_code}")

print("\n" + "-" * 50)
print("Test complete!")
