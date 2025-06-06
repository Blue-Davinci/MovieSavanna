#!/bin/bash

# MovieSavanna Deployment Script
# Usage: ./deploy.sh [production|preview]

set -e

echo "🎬 MovieSavanna Deployment Script"
echo "================================="

# Parse deployment type
DEPLOY_TYPE=${1:-preview}

if [ "$DEPLOY_TYPE" != "production" ] && [ "$DEPLOY_TYPE" != "preview" ]; then
    echo "❌ Invalid deployment type. Use 'production' or 'preview'"
    exit 1
fi

echo "🔍 Running pre-deployment checks..."

# Check if we're in the right directory
if [ ! -f "svelte.config.js" ]; then
    echo "❌ Error: Not in MovieSavanna project directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

echo "🧪 Running tests..."
npm run test:unit -- --run

echo "🔍 Type checking..."
npm run check

echo "🧹 Linting code..."
npm run lint

echo "🏗️ Testing build..."
npm run build

echo "✅ All pre-deployment checks passed!"

# Deploy based on type
if [ "$DEPLOY_TYPE" = "production" ]; then
    echo "🚀 Deploying to PRODUCTION..."
    npm run deploy
    echo "✅ Production deployment complete!"
    echo "🌐 Your app is live at your production URL"
else
    echo "🔍 Deploying PREVIEW..."
    npm run deploy:preview
    echo "✅ Preview deployment complete!"
    echo "🔗 Check your preview URL in the Vercel dashboard"
fi

echo ""
echo "🎉 Deployment successful!"
echo "📊 Monitor your app at: https://vercel.com/dashboard"
