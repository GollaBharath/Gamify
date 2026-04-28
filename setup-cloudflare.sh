#!/bin/bash
# Gamify Cloudflare Setup Script
# This script prepares the project for Cloudflare deployment

set -e

echo "🔧 Gamify Cloudflare Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Node.js: $(node --version)"
else
    echo -e "  ${RED}✗${NC} Node.js is not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} npm: $(npm --version)"
else
    echo -e "  ${RED}✗${NC} npm is not installed"
    exit 1
fi

# Check Wrangler
if command -v wrangler &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Wrangler: $(wrangler --version)"
else
    echo -e "  ${YELLOW}⚠${NC} Wrangler not installed"
    echo "  Installing Wrangler..."
    npm install -g wrangler
fi

echo ""
echo "📂 Project structure:"
echo "   - Client: ./client"
echo "   - Server: ./server"
echo "   - Bot: ./bot"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."

if [ ! -d "/home/dead/repos/Gamify/node_modules" ]; then
    echo "  Installing root dependencies..."
    cd /home/dead/repos/Gamify
    npm install --package-lock-only 2>/dev/null || true
fi

if [ ! -d "/home/dead/repos/Gamify/client/node_modules" ]; then
    echo "  Installing client dependencies..."
    cd /home/dead/repos/Gamify/client
    npm install
fi

if [ ! -d "/home/dead/repos/Gamify/server/node_modules" ]; then
    echo "  Installing server dependencies..."
    cd /home/dead/repos/Gamify/server
    npm install
fi

echo -e "  ${GREEN}✓${NC} Dependencies installed"
echo ""

# Create .env files
echo "📝 Creating environment files..."

# Client .env
if [ ! -f "/home/dead/repos/Gamify/client/.env" ]; then
    cat > /home/dead/repos/Gamify/client/.env << 'EOF'
VITE_API_URL=http://localhost:5173
EOF
    echo -e "  ${GREEN}✓${NC} Client .env created"
fi

# Server .env
if [ ! -f "/home/dead/repos/Gamify/server/.env" ]; then
    cat > /home/dead/repos/Gamify/server/.env << 'EOF'
NODE_ENV=development
PORT=5173
MONGO_URI=mongodb://localhost:27017/gamify
JWT_SECRET=your-jwt-secret-change-this
SESSION_SECRET=your-session-secret-change-this
EMAIL_USERNAME=
EMAIL_PASSWORD=
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5000,http://localhost:5001
AUTH_LOGIN_MAX=10
AUTH_LOGIN_WINDOW_MS=900000
AUTH_REGISTER_MAX=5
AUTH_REGISTER_WINDOW_MS=3600000
EOF
    echo -e "  ${GREEN}✓${NC} Server .env created"
fi

echo ""
echo "🔑 Cloudflare Configuration"
echo ""
echo "To deploy to Cloudflare, you need:"
echo "  1. A Cloudflare account (free at https://dash.cloudflare.com)"
echo "  2. Login to Wrangler: npx wrangler login"
echo "  3. Set your secrets in wrangler.jsonc"
echo ""
echo "Secrets to configure:"
echo "  - MONGO_URI: Your MongoDB connection string"
echo "  - JWT_SECRET: Your JWT signing secret"
echo "  - SESSION_SECRET: Your session secret"
echo "  - EMAIL_USERNAME: SMTP username (if using email)"
echo "  - EMAIL_PASSWORD: SMTP password (if using email)"
echo ""
echo "Deploy commands:"
echo "  - Backend: npx wrangler deploy --env production"
echo "  - Frontend: npx wrangler pages deploy ./client/dist"
echo ""
echo "================================"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "  1. Configure MongoDB (Atlas or local)"
echo "  2. Run: npx wrangler login"
echo "  3. Update secrets in wrangler.jsonc"
echo "  4. Deploy: ./deploy-cloudflare.sh all"
echo ""
