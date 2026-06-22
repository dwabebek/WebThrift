#!/bin/bash
# Test script untuk verify aplikasi lokal sebelum deployment

echo "🔍 Testing Thrift.Lab Application..."
echo ""

# Check Node.js
echo "✓ Checking Node.js version..."
node -v
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install
echo ""

# Run application
echo "🚀 Starting application..."
echo "Aplikasi akan berjalan di http://localhost:3000"
echo ""
echo "Test endpoints berikut:"
echo "  - GET  http://localhost:3000/health"
echo "  - GET  http://localhost:3000/"
echo "  - POST http://localhost:3000/api/register"
echo "  - POST http://localhost:3000/api/login"
echo "  - GET  http://localhost:3000/api/products"
echo ""
echo "Press Ctrl+C untuk stop server"
echo ""

npm start
