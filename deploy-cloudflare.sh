#!/bin/bash
# Cloudflare Deployment Script for Gamify
# This script deploys both frontend and backend to Cloudflare

set -e

echo "🚀 Gamify Cloudflare Deployment"
echo "================================="
echo ""

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed."
    echo "   Install with: npm install -g wrangler"
    exit 1
fi

# Function to deploy backend (Workers)
deploy_backend() {
    echo "📦 Deploying Backend (Cloudflare Workers)..."
    echo "   Note: This will deploy the Express API to Workers"
    echo "   Configuration: wrangler.jsonc"
    echo ""
    
    cd /home/dead/repos/Gamify
    npx wrangler deploy --env production
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend deployed successfully!"
    else
        echo "❌ Backend deployment failed!"
        return 1
    fi
}

# Function to deploy frontend (Pages)
deploy_frontend() {
    echo ""
    echo "🌐 Deploying Frontend (Cloudflare Pages)..."
    echo "   Configuration: wrangler.toml"
    echo ""
    
    cd /home/dead/repos/Gamify/client
    npm run build
    
    if [ $? -eq 0 ]; then
        cd /home/dead/repos/Gamify
        npx wrangler pages deploy ./client/dist
        echo "✅ Frontend deployed successfully!"
    else
        echo "❌ Frontend build failed!"
        return 1
    fi
}

# Function for local testing
test_local() {
    echo ""
    echo "🧪 Running local tests..."
    echo ""
    
    cd /home/dead/repos/Gamify/client
    npm run build
    
    cd /home/dead/repos/Gamify/server
    echo "   Backend: http://localhost:8787"
    echo "   Frontend: http://localhost:8788"
    npx wrangler dev --local --port 8787 server/worker.js &
    
    echo "✅ Local test server running!"
}

# Parse arguments
case "$1" in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_backend
        deploy_frontend
        ;;
    test)
        test_local
        ;;
    *)
        echo "Usage: $0 {backend|frontend|all|test}"
        echo ""
        echo "Options:"
        echo "  backend   Deploy backend to Cloudflare Workers"
        echo "  frontend  Deploy frontend to Cloudflare Pages"
        echo "  all       Deploy both backend and frontend"
        echo "  test      Run local test server"
        exit 1
        ;;
esac

echo ""
echo "================================="
echo "🎉 Deployment Complete!"
echo "================================="
