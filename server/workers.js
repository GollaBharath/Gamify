/**
 * Cloudflare Workers Entry Point for Express App
 * 
 * This file adapts the Express app for Cloudflare Workers runtime.
 * Using Node.js compatibility mode (nodejs_compat) allows Express to run
 * with most of its features intact.
 * 
 * IMPORTANT: This will use up subrequests (50 free/day) for each HTTP
 * request because Express middleware runs internally. For production,
 * consider migrating to Hono.
 */

import './worker.js';
import app from './worker.js';

// Handle fetch events with the Express app
export default {
  async fetch(request, env, ctx) {
    // Cloudflare-specific context
    request.cloudflare = { env, ctx };
    
    // Pass the request to Express
    return app.fetch(request, env, ctx);
  },
};
