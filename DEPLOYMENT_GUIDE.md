# 🎮 Gamify - Cloudflare Deployment Configuration

## 📄 File Description

This directory contains all configuration files needed to deploy Gamify to Cloudflare's free tier.

## 🗂️ Project Structure

```
gamify/
├── wrangler.jsonc              # Workers configuration (backend)
├── wrangler.toml               # Pages configuration (frontend)
├── setup-cloudflare.sh         # Setup script
├── deploy-cloudflare.sh        # Deployment script
├── .github/workflows/deploy.yml # CI/CD pipeline
├── CLOUDFLARE_DEPLOYMENT.md    # Detailed deployment guide
├── CLOUDFLARE_FREE_TIER.md     # Free tier quick reference
├── CLOUDflare_SUMMARY.md       # This file - summary
├── server/
│   ├── index.worker.js         # Express app for Workers
│   ├── worker.js               # Alternative worker entry
│   ├── worker-hono.js          # Hono-based alternative
│   └── (other server files)
├── client/
│   └── (React frontend files)
└── bot/
    └── (Discord bot files)
```

---

## 🚀 What This Configuration Does

### Frontend (Cloudflare Pages)
- Hosts React + Vite app on Cloudflare's global CDN
- Automatic HTTPS certificates
- Preview deployments for PRs
- Custom domain support
- Free tier: Unlimited bandwidth, 500 builds/month

### Backend (Cloudflare Workers)
- Runs Express.js API on Cloudflare's edge network
- Node.js compatibility mode for MongoDB support
- 100,000 requests/day free
- Global distribution (300+ locations)
- Subrequest limit: 50/request (for MongoDB queries)

### Database (External)
- MongoDB Atlas (or self-hosted)
- Workers connect via HTTP
- Requires MongoDB connection string

---

## 💰 Pricing: $0/Month (Free Tier)

### Cloudflare Free Tier Includes

✅ **Cloudflare Pages**
- Static site hosting
- 500 builds/month
- Unlimited bandwidth
- 100 custom domains
- Automatic HTTPS

✅ **Cloudflare Workers**
- 100,000 requests/day
- 50ms CPU time/request
- 1GB KV storage
- 5GB D1 database
- 100,000/day on free plan

✅ **Additional Features**
- DDoS protection
- Web Application Firewall (WAF)
- Bot management
- Analytics
- Preview deployments

**Total Cost: $0/month** 🎉

---

## ⚡ Quick Start (3 Steps)

### Step 1: Setup

```bash
cd /home/dead/repos/Gamify
./setup-cloudflare.sh
```

This will:
- Check prerequisites
- Install dependencies
- Create environment files
- Provide configuration instructions

### Step 2: Configure

```bash
# Login to Cloudflare
npx wrangler login

# Set your secrets (you'll be prompted for each)
npx wrangler secret put MONGO_URI
npx wrangler secret put JWT_SECRET
npx wrangler secret put SESSION_SECRET
```

### Step 3: Deploy

```bash
# Deploy everything
./deploy-cloudflare.sh all
```

Or deploy separately:

```bash
# Backend only (Cloudflare Workers)
./deploy-cloudflare.sh backend

# Frontend only (Cloudflare Pages)
./deploy-cloudflare.sh frontend
```

---

## 🔧 Configuration Files

### 1. wrangler.jsonc (Backend)

```jsonc
{
  "name": "gamify-api",
  "compatibility_date": "2026-04-28",
  "compatibility_flags": ["nodejs_compat"],
  "main": "server/index.worker.js",
  "node_compat": true,
  "env": {
    "production": {
      "vars": {
        "MONGO_URI": "@mongodb_uri",
        "JWT_SECRET": "@jwt_secret"
      }
    }
  }
}
```

**Key Settings:**
- `nodejs_compat`: Allows Express to work (with limitations)
- `subrequests`: 50/day free limit
- Uses MongoDB Atlas (external)

### 2. wrangler.toml (Frontend)

```toml
name = "gamify-frontend"
pages_build_output_dir = "client/dist"

[build]
command = "npm run build"
cwd = "client"
```

**Key Settings:**
- Builds React app with Vite
- Outputs to `client/dist`
- Preview deployments enabled

### 3. server/index.worker.js

Express app configured for Workers:
- Reduced rate limits (50/15min vs 100/15min)
- No MongoDB auto-connect
- Environment-aware

---

## 🌍 Deployment Targets

After deployment, your app will be available at:

```
Frontend:  https://gamify-frontend.pages.dev
Backend:   https://gamify-api.<subdomain>.workers.dev
Custom:    https://gamify.yourdomain.com  (if configured)
```

### Local Development

```bash
# Frontend
cd client && npm run dev
# http://localhost:5173

# Backend (Express)
cd server && LOCAL_DEV=true npm run dev
# http://localhost:5173

# Workers (local simulation)
npx wrangler dev server/index.worker.js --local
# http://localhost:8787
```

---

## ⚠️ Important Limitations

### 1. MongoDB Connection

**Status:** ⚠️ External database required

**Why:** Cloudflare Workers don't support MongoDB driver natively.

**Solution:** Use MongoDB Atlas (free tier works fine)

**Impact:** 
- Each MongoDB query = 1 subrequest
- Free tier: 50 subrequests/request
- For complex operations, this may be limiting

**Recommendations:**
1. Start with MongoDB Atlas (minimal changes)
2. Monitor subrequest usage
3. Migrate to D1 (SQLite) when needed

### 2. Session Storage

**Status:** ⚠️ Stateless workers

**Solution:** 
- JWT tokens (configured)
- Encrypted cookies
- Not using server-side sessions

### 3. Subrequest Limit

**Status:** ⚠️ 50 subrequests/day free

**Impact:** Each HTTP request to MongoDB counts as 1

**Solutions:**
- Cache with KV (reduces DB queries)
- Batch operations
- Migrate to D1 (0 subrequests)

### 4. Workers Free Tier

**100,000 requests/day**

**Breakdown:**
- ~3,333 requests/hour
- ~55 requests/minute
- ~1 request/second (average)

**Is this enough?**

For Gamify:
- ✅ Small teams (< 100 users) = Plenty
- ✅ Medium teams (100-1000 users) = Adequate
- ⚠️ Large teams (1000+ users) = May need optimization

**Optimization strategies:**
1. Cache API responses in KV
2. Use D1 for database (no subrequests)
3. Implement client-side caching
4. Use Durable Objects for state

---

## 🚦 Subrequest Usage Guide

### What Counts as a Subrequest?

Each MongoDB operation in Express = 1 subrequest:

```javascript
// These count as subrequests:
await User.find({})                    // 1 subrequest
await User.findOne({ email })          // 1 subrequest
await user.save()                      // 1 subrequest
await User.updateOne({ _id }, data)    // 1 subrequest
await User.deleteOne({ _id })          // 1 subrequest

// Per HTTP request:
GET  /api/users      → 1 subrequest (MongoDB query)
POST /api/users      → 1 subrequest (MongoDB insert)
PUT  /api/users/123  → 1 subrequest (MongoDB update)
```

### Daily Subrequest Budget

**Free tier: 50 subrequests/request × 100,000 requests/day**

But practically:
- Each API call = 1 MongoDB query = 1 subrequest
- 100,000 API calls/day = 100,000 subrequests

**Realistic usage:**
- 100 users × 50 requests/day = 5,000 subrequests
- 500 users × 50 requests/day = 25,000 subrequests
- 1000 users × 50 requests/day = 50,000 subrequests

**You're safe if:**
- ✅ < 100 active users
- ✅ < 50 API calls/user/day
- ⚠️ Monitor usage closely

**Upgrade when:**
- ❌ > 100,000 requests/day
- ❌ > 50 subrequests/request pattern
- ❌ Performance issues

---

## 🔄 Migration Paths

### Option 1: Keep MongoDB Atlas (Recommended for start)

**Pros:**
- ✅ Minimal code changes
- ✅ All features work
- ✅ Familiar technology

**Cons:**
- ⚠️ Uses subrequests (50 free/day)
- ⚠️ Higher latency
- ⚠️ External dependency

**Best for:** MVP, testing, small teams

```
Workers → HTTP → MongoDB Atlas
```

### Option 2: Migrate to D1 (SQLite)

**Pros:**
- ✅ Zero subrequests
- ✅ Full Cloudflare integration
- ✅ Better performance
- ✅ Included in free tier (5GB)

**Cons:**
- ⚠️ Requires schema migration
- ⚠️ SQL instead of MongoDB queries
- ⚠️ Learning curve

**Best for:** Production, scaling

```
Workers → D1 (SQLite)
```

### Option 3: Hybrid Approach

**Short-term:**
- Keep MongoDB Atlas
- Cache frequently-accessed data in KV
- Optimize queries

**Long-term:**
- Migrate to D1
- Use Durable Objects for state
- WebSocket support

---

## 📊 Free Tier Comparison

| Feature | Free Tier | Paid (Starting) |
|---------|-----------|-----------------|
| Worker Requests | 100k/day | $5/mo (10M/day) |
| Pages Builds | 500/mo | $5/mo (unlimited) |
| KV Storage | 1 GB | 1 GB included |
| D1 Storage | 5 GB | 5 GB included |
| Bandwidth | Unlimited | Unlimited |
| Custom Domains | 100 | Unlimited |
| Support | Community | Email/Chat |

**For Gamify, free tier is sufficient if:**
- ✅ < 100 active users
- ✅ < 50,000 requests/month
- ✅ Simple features
- ✅ No real-time requirements

---

## 🔍 Monitoring & Observability

### View Worker Logs

```bash
# Real-time logs
npx wrangler tail --env production

# Filter by status
npx wrangler tail --env production --format pretty
```

### Check Deployment Status

```bash
# List deployments
npx wrangler deployments

# View specific deployment
npx wrangler deploy --env production --dry-run
```

### Health Checks

```bash
# Check API health
curl https://gamify-api.worker.dev/api/health

# Expected response:
# {
#   "ok": true,
#   "time": "2026-04-28T...",
#   "platform": "cloudflare-workers"
# }
```

### Metrics Dashboard

Access in Cloudflare Dashboard:
- https://dash.cloudflare.com/?to=/:account/workers
- Request count
- Error rate
- CPU time
- Subrequests

---

## 🚨 Troubleshooting

### Issue: "Too many subrequests"

**Cause:** MongoDB queries exceed 50/day limit

**Solution:**
```bash
# Check your MongoDB queries
# Add caching for frequently-accessed data
# Batch operations where possible
# Consider migrating to D1
```

### Issue: "MongoDB connection timeout"

**Cause:** Workers can't reach MongoDB

**Solution:**
```bash
# Verify MongoDB Atlas allows connections
# Check firewall rules
# Ensure connection string is correct
# Set secrets properly:
npx wrangler secret put MONGO_URI
```

### Issue: "CORS errors"

**Cause:** Frontend and backend on different domains

**Solution:**
```javascript
// Update CORS_ORIGINS in wrangler.jsonc
"CORS_ORIGINS": "https://gamify.pages.dev,https://your-domain.com"
```

### Issue: "Session not persisting"

**Cause:** Workers are stateless

**Solution:**
```javascript
// Use JWT tokens instead
// Or store sessions in KV
// Or migrate to Durable Objects
```

### Issue: "Rate limit exceeded"

**Cause:** Too many requests

**Solution:**
```javascript
// Adjust rate limits in server/index.worker.js
max: 50,  // Increase if needed
windowMs: 15 * 60 * 1000,
```

---

## 🛠️ Advanced Configuration

### Add KV Namespace

```jsonc
// wrangler.jsonc
{
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "<KV_NAMESPACE_ID>",
      "preview_id": "<PREVIEW_KV_NAMESPACE_ID>"
    }
  ]
}
```

### Add D1 Database

```jsonc
// wrangler.jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "gamify",
      "database_id": "<D1_DATABASE_ID>"
    }
  ]
}
```

### Environment-Specific Configs

```jsonc
// wrangler.jsonc
"env": {
  "staging": {
    "name": "gamify-api-staging",
    "vars": {
      "NODE_ENV": "staging"
    }
  },
  "production": {
    "name": "gamify-api",
    "vars": {
      "NODE_ENV": "production"
    }
  }
}
```

Deploy to specific environment:
```bash
npx wrangler deploy --env staging
npx wrangler deploy --env production
```

---

## 📈 Scaling Recommendations

### Current (Free Tier)

- ✅ < 100 users
- ✅ < 50,000 requests/day
- ✅ Simple features
- ✅ MongoDB Atlas (external)

### Next Level ($5/month)

- ✅ 100-1,000 users
- ✅ 500,000 requests/day
- ✅ More complex queries
- ✅ D1 database
- ✅ Priority support

### Enterprise (Custom)

- ✅ 1,000+ users
- ✅ Unlimited requests
- ✅ Full feature set
- ✅ Dedicated support
- ✅ Custom SLAs

---

## 📚 Helpful Resources

### Official Documentation

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/wrangler/)
- [Hono Framework](https://hono.dev/)

### Migration Guides

- [Migrate to Workers](https://developers.cloudflare.com/workers/tutorials/migrate-to-workers/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [D1 Quickstart](https://developers.cloudflare.com/d1/)

### Community

- [Cloudflare Discord](https://discord.cloudflare.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cloudflare-workers)
- [GitHub Issues](https://github.com/cloudflare/workers-sdk/issues)

---

## 🎯 Best Practices

### Code

✅ Use async/await
✅ Handle errors gracefully
✅ Validate inputs
✅ Log important events
✅ Keep functions small

### Performance

✅ Cache responses in KV
✅ Minimize subrequests
✅ Batch operations
✅ Use efficient queries
✅ Enable compression

### Security

✅ Use HTTPS everywhere
✅ Validate all inputs
✅ Sanitize outputs
✅ Rotate secrets regularly
✅ Monitor for anomalies

### Deployment

✅ Use preview deployments
✅ Test before deploying
✅ Monitor after deploy
✅ Have rollback plan
✅ Document changes

---

## 🔄 CI/CD Pipeline

The included `.github/workflows/deploy.yml`:

1. **On Push to Main**
   - Runs tests
   - Builds frontend
   - Deploys to Cloudflare

2. **Separate Jobs**
   - Frontend (Pages)
   - Backend (Workers)

3. **Environment Variables**
   - `CF_API_TOKEN`: Cloudflare API token
   - `CF_ACCOUNT_ID`: Your Cloudflare account ID

Set up in GitHub:
```bash
Settings → Secrets → Actions
- CF_API_TOKEN (create in Cloudflare)
- CF_ACCOUNT_ID (from Cloudflare dashboard)
```

---

## ✅ Deployment Checklist

- [ ] Run `./setup-cloudflare.sh`
- [ ] Login: `npx wrangler login`
- [ ] Set MONGO_URI secret
- [ ] Set JWT_SECRET secret
- [ ] Set SESSION_SECRET secret
- [ ] Test locally: `npx wrangler dev --local`
- [ ] Deploy: `npx wrangler deploy --env production`
- [ ] Verify: Check deployment URL
- [ ] Monitor: View logs
- [ ] Test: Make API requests

---

## 🎉 Summary

**You now have:**

✅ Complete Cloudflare configuration  
✅ Express app ready for Workers  
✅ Frontend ready for Pages  
✅ Deployment automation  
✅ CI/CD pipeline  
✅ Documentation  
✅ Free tier optimization  

**Total Cost: $0/month**  

**Deploy in 3 steps:**

```bash
./setup-cloudflare.sh
npx wrangler login
./deploy-cloudflare.sh all
```

**Happy deploying! 🚀**

---

## 📞 Questions?

- Check: `CLOUDFLARE_DEPLOYMENT.md`
- Check: `CLOUDFLARE_FREE_TIER.md`
- Visit: [Cloudflare Docs](https://developers.cloudflare.com/)

---

**Configuration created for Gamify**  
**Compatible with Cloudflare Free Tier**  
**Zero cost deployment** 🎉
