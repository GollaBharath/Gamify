# Gamify Architecture Overview

This document provides a architectural description of the Gamify codebase.

## System Components

### 1. React Web Client (`/client`)
- Modern Vite + React development runtime.
- Tailwind and CSS variables design system.
- React Router SPA setup with state hooks.

### 2. Express Server (`/server`)
- Modular routes, controllers, and middlewares pattern.
- Mongoose MongoDB database ODM modeling.
- Support for regular Node and Cloudflare Workers runtime.

### 3. Discord Bot (`/bot`)
- Powered by `discord.js`.
- Synchronized with Express API using `BOT_API_KEY` authentication.
- Slash Command handlers for Discord servers integration.
