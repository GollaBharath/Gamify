# 🚀 Cloudflare Deployment for Gamify

This directory contains all configuration files to deploy Gamify to Cloudflare's free tier.

## 📦 What's Included

### Configuration Files
- **`wrangler.jsonc`** — Cloudflare Workers (backend API) configuration
- **`wrangler.toml`** — Cloudflare Pages (frontend) configuration
- **`server/index.worker.js`** — Express app adapted for Workers runtime

### Deployment Scripts
- **`setup-cloudflare.sh`** — Automated setup (checks deps, installs, configures)
- **`deploy-cloudflare.sh`** — Automated deployment script

### CI/CD
- **`.github/workflows/deploy.yml`** — GitHub Actions pipeline for auto-deployment

### Documentation
- **`CLOUDFLARE_DEPLOYMENT.md`** — Detailed deployment guide
- **`CLOUDFLARE_FREE_TIER.md`** — Free tier limitations & optimization
- **`DEPLOYMENT_GUIDE.md`** — Complete deployment summary

## 🎯 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# 1. Run setup script
./setup-cloudflare.sh

# 2. Login to Cloudflare
npx wrangler login

# 3. Set secrets
npx wrangler secret put MONGO_URI
npx wrangler secret put JWT_SECRET
npx wrangler secret put SESSION_SECRET

# 4. Deploy everything
./deploy-cloudflare.sh all
```

### Option 2: Manual Deployment

```bash
# Deploy backend (Workers)
npx wrangler deploy --env production

# Deploy frontend (Pages)
npx wrangler pages deploy ./client/dist
```

## 🌐 What Gets Deployed

### Frontend → Cloudflare Pages
- React + Vite app
- Static files on global CDN
- Custom domains supported
- Automatic HTTPS
- **Cost: $0/month**

### Backend → Cloudflare Workers
- Express.js API
- Node.js compatibility mode
- MongoDB Atlas connection (external)
- 100,000 requests/day free
- **Cost: $0/month**

### Database → MongoDB Atlas
- External database (must be self-hosted)
- Free tier sufficient for small apps
- Workers connect via HTTP

## 💰 Total Cost: $0/Month

All deployment is on Cloudflare's free tier:
- ✅ Pages hosting
- ✅ Workers execution
- ✅ Custom domains
- ✅ SSL certificates
- ✅ DDoS protection
- ✅ Global CDN

## ⚠️ Important Notes

### MongoDB External
Cloudflare Workers don't support MongoDB directly. This deployment:
- ✅ Uses Node.js compat mode
- ✅ Connects to MongoDB Atlas (external)
- ⚠️ Each DB query = 1 subrequest (50 free/day)
- ⚠️ For production, consider migrating to D1 (SQLite)

### Subrequest Limit
- **Free tier:** 50 subrequests/day
- **Each MongoDB query:** 1 subrequest
- **Safe for:** < 100 users or < 50K requests/month
- **Upgrade path:** Migrate to D1 (0 subrequests)

## 🔧 Configuration

### Backend (wrangler.jsonc)
```jsonc
{
  "name": "gamify-api",
  "compatibility_flags": ["nodejs_compat"],
  "main": "server/index.worker.js",
  "node_compat": true
}
```

### Frontend (wrangler.toml)
```toml
name = "gamify-frontend"
pages_build_output_dir = "client/dist"
```

## 🚦 Local Development

```bash
# Frontend
cd client && npm run dev
# http://localhost:5173

# Backend (Node)
cd server && LOCAL_DEV=true npm run dev
# http://localhost:5173

# Workers (simulated)
npx wrangler dev server/index.worker.js --local
# http://localhost:8787
```

## 📊 Free Tier Limits

| Resource | Limit | Status |
|----------|-------|--------|
| Worker Requests | 100k/day | ✅ |
| Worker CPU | 50ms/request | ✅ |
| Pages Builds | 500/month | ✅ |
| Bandwidth | Unlimited | ✅ |
| Custom Domains | 100 | ✅ |

## 🔍 Monitoring

```bash
# View logs
npx wrangler tail --env production

# Check deployments
npx wrangler deployments
```

## 📚 Documentation

- [Detailed Guide](DEPLOYMENT_GUIDE.md)
- [Free Tier Guide](CLOUDFLARE_FREE_TIER.md)
- [Deployment Guide](CLOUDFLARE_DEPLOYMENT.md)

## ✅ Features

- ✅ Zero-cost deployment
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Preview deployments
- ✅ CI/CD automation
- ✅ No vendor lock-in

## 🎉 You're Ready!

```bash
./setup-cloudflare.sh    # Setup
./deploy-cloudflare.sh all  # Deploy
```

**Cost: $0/month** 🚀
