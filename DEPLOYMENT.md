# 🚀 MovieSavanna - Deployment Guide

## Overview

This guide covers deploying MovieSavanna to Vercel with a complete CI/CD pipeline using GitHub Actions.

## 📋 Prerequisites

### 1. Vercel Account Setup

1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Install the Vercel CLI: `npm i -g vercel`

### 2. Environment Variables

Required environment variables (add to Vercel dashboard):

```bash
# TMDB API Configuration
TMDB_API_KEY=your_actual_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Supabase Configuration (for favorites)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Application Configuration
NODE_ENV=production
```

## 🔧 Local Deployment Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Initialize Project

```bash
vercel
```

Follow the prompts to link your project.

### 4. Set Environment Variables

```bash
vercel env add TMDB_API_KEY production
vercel env add TMDB_BASE_URL production
vercel env add TMDB_IMAGE_BASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_KEY production
vercel env add NODE_ENV production
```

## 🤖 CI/CD Pipeline Setup

### 1. GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

To get these values:

```bash
# Get Vercel token from dashboard
# Settings → Tokens → Create Token

# Get project info
vercel project ls
vercel project inspect your-project-name
```

### 2. Workflow Triggers

The CI/CD pipeline runs on:

- **Push to main**: Runs tests → Production deployment
- **Push to develop**: Runs tests → Preview deployment
- **Pull requests**: Runs tests → Preview deployment with PR comment

### 3. Pipeline Stages

1. **🧪 Test Suite**

   - Type checking with `svelte-check`
   - ESLint linting
   - Unit tests with Vitest
   - Build verification

2. **🚀 Production Deploy** (main branch only)

   - Deploys to production domain
   - Updates live site

3. **🔍 Preview Deploy** (PRs & develop)
   - Creates preview deployment
   - Comments preview URL on PRs

## 📱 Manual Deployment

### Deploy to Production

```bash
npm run deploy
```

### Deploy Preview

```bash
npm run deploy:preview
```

### Build Locally

```bash
npm run build
```

## 🔧 Vercel Configuration

The `vercel.json` configures:

- **Build Settings**: SvelteKit adapter-auto
- **API Routes**: Serverless functions for `/api/*`
- **Headers**: Security & caching headers
- **Environment**: Production optimizations

## 🧪 Testing Strategy

### Pre-deployment Checks

```bash
# Type checking
npm run check

# Linting
npm run lint

# Unit tests
npm run test:unit -- --run

# Build verification
npm run build
```

### Environment Testing

- Tests use mock environment variables
- Build process validates all dependencies
- API routes tested with sample data

## 🌐 Domains & URLs

### Production

- **Main**: `https://your-project.vercel.app`
- **Custom Domain**: Configure in Vercel dashboard

### Preview Deployments

- **Develop**: `https://your-project-git-develop.vercel.app`
- **PR Previews**: `https://your-project-git-feature-branch.vercel.app`

## 📊 Monitoring & Analytics

### Vercel Dashboard

- **Performance**: Core Web Vitals
- **Analytics**: Page views, unique visitors
- **Functions**: API endpoint performance
- **Logs**: Real-time error tracking

### Error Handling

- Server-side logging with custom logger
- Client-side error boundaries
- API error responses with status codes

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use Vercel environment variables
- Separate keys for development/production

### API Security

- TMDB keys stay server-side only
- CSRF protection enabled in production
- Security headers configured

### Content Security

- No API keys exposed to client
- Secure image loading from TMDB CDN
- Input validation on all API routes

## 🚀 Deployment Checklist

### Pre-Launch

- [ ] Environment variables configured
- [ ] GitHub secrets added
- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] API endpoints tested
- [ ] Images loading correctly

### Post-Launch

- [ ] Production URL accessible
- [ ] API routes responding
- [ ] Movies loading and searching
- [ ] Favorites functionality working
- [ ] Performance monitoring active

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check environment variables
vercel env ls

# Test build locally
npm run build

# Check dependencies
npm audit
```

#### API Issues

```bash
# Test TMDB connection
curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY"

# Check Vercel logs
vercel logs
```

#### Environment Variables

```bash
# List all environment variables
vercel env ls

# Pull environment to local
vercel env pull
```

## 📈 Performance Optimization

### SvelteKit Features

- **Static Generation**: Pre-rendered pages
- **Server-Side Rendering**: Dynamic content
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Responsive images from TMDB

### Vercel Features

- **Edge Functions**: Global distribution
- **Caching**: CDN with smart invalidation
- **Compression**: Automatic gzip/brotli
- **Analytics**: Real user monitoring

## 🔄 Continuous Integration

### Automated Testing

- Runs on every push and PR
- Prevents broken code deployment
- Mock environment for testing
- Build verification before deploy

### Quality Gates

- Type checking must pass
- Linting must pass
- Unit tests must pass
- Build must succeed

## 📞 Support

For deployment issues:

1. Check Vercel deployment logs
2. Review GitHub Actions workflow
3. Verify environment variables
4. Test API endpoints individually

---

**Ready to deploy?** Follow this guide step by step for a smooth deployment experience! 🚀
