# Gamify Troubleshooting Guide

This guide covers common issues and resolutions when developing or self-hosting Gamify.

## Common Issues

### 1. Database Connection Timeout
- **Symptom**: Server console outputs connection errors and fails to boot.
- **Resolution**: Ensure your `MONGO_URI` is correctly set. Check if your current IP is whitelisted on MongoDB Atlas Network Security.

### 2. Discord Bot Unauthorized (401)
- **Symptom**: Bot fails to start with "An invalid token was provided" error.
- **Resolution**: Verify that the `DISCORD_TOKEN` in your bot's `.env` is correct.

### 3. CORS Preflight Failures
- **Symptom**: Frontend console reports origin blocking.
- **Resolution**: Add your frontend URL (e.g. `http://localhost:5173`) to the server `CORS_ORIGINS` environmental variable.
