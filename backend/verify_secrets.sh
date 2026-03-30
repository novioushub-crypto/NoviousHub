#!/bin/bash

# Verify Fly.io Secrets Script
# This script helps verify that all required secrets are set on Fly.io

echo "🔍 Checking Fly.io Secrets..."
echo "================================"
echo ""

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI is not installed"
    echo "Install it from: https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

echo "✅ Fly CLI is installed"
echo ""

# List all secrets
echo "📋 Current secrets on Fly.io:"
echo "--------------------------------"
fly secrets list

echo ""
echo "🔑 Required secrets for Google OAuth:"
echo "--------------------------------"
echo "1. GOOGLE_OAUTH2_KEY"
echo "2. GOOGLE_OAUTH2_SECRET"
echo ""

# Check if specific secrets exist
echo "🔍 Checking for Google OAuth secrets..."
if fly secrets list | grep -q "GOOGLE_OAUTH2_KEY"; then
    echo "✅ GOOGLE_OAUTH2_KEY is set"
else
    echo "❌ GOOGLE_OAUTH2_KEY is NOT set"
    echo ""
    echo "To set it, run:"
    echo 'fly secrets set GOOGLE_OAUTH2_KEY="YOUR_GOOGLE_CLIENT_ID"'
fi

if fly secrets list | grep -q "GOOGLE_OAUTH2_SECRET"; then
    echo "✅ GOOGLE_OAUTH2_SECRET is set"
else
    echo "❌ GOOGLE_OAUTH2_SECRET is NOT set"
    echo ""
    echo "To set it, run:"
    echo 'fly secrets set GOOGLE_OAUTH2_SECRET="YOUR_GOOGLE_CLIENT_SECRET"'
fi

echo ""
echo "================================"
echo "✨ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Set any missing secrets using the commands above"
echo "2. Replace YOUR_GOOGLE_CLIENT_ID and YOUR_GOOGLE_CLIENT_SECRET with actual values"
echo "3. Deploy the app: fly deploy"
echo "4. Check logs: fly logs"
echo "5. Test Google OAuth on your production site"
