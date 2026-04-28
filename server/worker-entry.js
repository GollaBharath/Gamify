/**
 * Cloudflare Workers Entry Point
 * 
 * This exports the Express app in a format compatible with Cloudflare Workers
 * Node.js compatibility mode.
 */

import app from './worker.js';

// Export as a fetch handler for Workers
export default {
  async fetch(request, env, ctx) {
    // For Express apps in Node.js compat mode,
    // we need to handle the request using the app
    return app.handle(request, env, ctx);
  },
};
