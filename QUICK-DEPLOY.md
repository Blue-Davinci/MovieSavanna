# 🚀 Quick Deployment Setup - MovieSavanna

## Step-by-Step Deployment Guide

### 1. Prerequisites Check ✅

- [x] Vercel CLI installed globally
- [x] All tests passing (19 tests ✅)
- [x] Production build successful
- [x] CI/CD pipeline configured

### 2. Get Your TMDB API Key 🔑

1. Visit [TMDB Website](https://www.themoviedb.org/settings/api)
2. Create account/login
3. Request API key
4. Copy your API key

### 3. Vercel Account Setup 🌐

1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your MovieSavanna repository

### 4. Environment Variables Setup 🔧

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
TMDB_API_KEY=your_actual_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
NODE_ENV=production
```

### 5. Deploy Options 🚀

#### Option A: Automatic GitHub Deployment

1. Push to `main` branch → Auto-deploys to production
2. Push to `develop` branch → Auto-deploys to preview
3. Create PR → Auto-deploys preview with comment

#### Option B: Manual Deployment

```powershell
# PowerShell (Windows)
.\deploy.ps1 preview     # Deploy preview
.\deploy.ps1 production  # Deploy to production

# Or direct npm commands
npm run deploy:preview   # Preview deployment
npm run deploy          # Production deployment
```

### 6. GitHub Secrets (for CI/CD) 🔐

Add these in GitHub → Settings → Secrets and variables → Actions:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

Get these from:

```bash
vercel --version  # Confirm CLI is installed
vercel login      # Login to your account
vercel            # Link project (creates .vercel folder)
```

### 7. First Deployment 🎉

```powershell
# Test everything works
npm run test:unit -- --run
npm run check
npm run lint
npm run build

# Deploy preview first
.\deploy.ps1 preview

# If preview works, deploy production
.\deploy.ps1 production
```

### 8. Verify Deployment ✅

After deployment, test these features:

- [ ] Homepage loads
- [ ] Popular movies display
- [ ] Search functionality works
- [ ] Movie details page works
- [ ] Favorites functionality (if using Supabase)
- [ ] API endpoints respond correctly

### 9. Monitor & Maintain 📊

- **Vercel Dashboard**: Monitor performance, logs, analytics
- **GitHub Actions**: View CI/CD pipeline status
- **Error Tracking**: Check Vercel function logs for API issues

## Quick Commands Reference

```powershell
# Development
npm run dev                    # Start dev server

# Testing
npm run test:unit -- --run     # Run unit tests
npm run check                  # Type checking
npm run lint                   # Code linting

# Building
npm run build                  # Production build
npm run preview                # Preview build locally

# Deployment
.\deploy.ps1 preview           # Deploy preview
.\deploy.ps1 production        # Deploy production
vercel --prod                  # Direct Vercel deploy
```

## Troubleshooting 🔧

### Common Issues:

1. **Environment Variables**: Make sure all required env vars are set in Vercel
2. **TMDB API**: Verify your API key works with: `curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY"`
3. **Build Errors**: Check build logs in Vercel dashboard
4. **Function Timeouts**: API routes have 10s timeout on free tier

### Need Help?

- Check `DEPLOYMENT.md` for detailed guide
- Review Vercel deployment logs
- Test API endpoints individually
- Verify environment variables in Vercel dashboard

---

**You're ready to deploy! 🎬✨**
