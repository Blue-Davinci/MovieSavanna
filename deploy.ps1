# MovieSavanna Deployment Script for Windows
# Usage: .\deploy.ps1 [production|preview]

param(
    [string]$DeployType = "preview"
)

Write-Host "🎬 MovieSavanna Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Validate deployment type
if ($DeployType -ne "production" -and $DeployType -ne "preview") {
    Write-Host "❌ Invalid deployment type. Use 'production' or 'preview'" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "svelte.config.js")) {
    Write-Host "❌ Error: Not in MovieSavanna project directory" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm ci
}

Write-Host "🧪 Running tests..." -ForegroundColor Blue
npm run test:unit -- --run
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Type checking..." -ForegroundColor Blue
npm run check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🧹 Linting code..." -ForegroundColor Blue
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🏗️ Testing build..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All pre-deployment checks passed!" -ForegroundColor Green

# Deploy based on type
if ($DeployType -eq "production") {
    Write-Host "🚀 Deploying to PRODUCTION..." -ForegroundColor Magenta
    npm run deploy
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Production deployment complete!" -ForegroundColor Green
        Write-Host "🌐 Your app is live at your production URL" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Production deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "🔍 Deploying PREVIEW..." -ForegroundColor Magenta
    npm run deploy:preview
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Preview deployment complete!" -ForegroundColor Green
        Write-Host "🔗 Check your preview URL in the Vercel dashboard" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Preview deployment failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host "📊 Monitor your app at: https://vercel.com/dashboard" -ForegroundColor Cyan
