#!/bin/bash

# Simplified API Seed Script
# Works with current deployed backend (without tenant routes)

API_URL="https://maximal-gym-backend.vercel.app/api"

echo "🚀 Starting Simplified API Seed..."
echo "📡 API URL: $API_URL"
echo ""

echo "ℹ️  Note: The deployed backend doesn't have tenant routes yet."
echo "ℹ️  You'll need to redeploy the backend with the new tenant code first."
echo ""

# For now, let's just register users that can be used
echo "👤 Registering Test Users..."

# User 1
echo "Creating user 1..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "testadmin@maximalgym.com",
    "password": "admin123",
    "phone": "+91 1234567890"
  }'

echo ""
echo "Creating user 2..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@maximalgym.com",
    "password": "demo123",
    "phone": "+91 9876543210"
  }'

echo ""
echo ""
echo "✅ Test users created!"
echo ""
echo "⚠️  IMPORTANT: Your deployed backend needs to be updated!"
echo ""
echo "📋 To complete multi-tenant setup:"
echo "  1. Deploy the updated backend code to Vercel"
echo "  2. Make sure it includes:"
echo "     - Tenant model"
echo "     - Tenant routes"
echo "     - Tenant middleware"
echo "     - Updated models with tenantId"
echo ""
echo "  3. Then run the full seed script again"
echo ""
echo "🎯 For now, you can test locally with:"
echo "  - Install MongoDB: brew install mongodb-community@7.0"
echo "  - Start it: brew services start mongodb-community@7.0"
echo "  - Run: node seed.js"
echo ""
