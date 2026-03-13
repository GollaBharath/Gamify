# Gamify Backend API

## Overview

This backend implements the core Gamify concept:

- Hierarchical roles (`Organisation`, `Admin`, `Event Staff`, `Moderator`, `Member`)
- Events and task workflows
- Moderator validation and point awarding
- Shop and point redemption
- Leaderboard
- Organization-scoped data model

## Environment Variables

Required basics:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `SESSION_SECRET`
- `CORS_ORIGINS`

Gamify-specific:

- `DEFAULT_ORG_NAME` (default: `Gamify`)
- `BOOTSTRAP_ADMIN_EMAILS` (comma-separated list of emails that should register as `Admin`)

## Core Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

### Users and Roles

- `GET /api/users/profile` (authenticated)
- `GET /api/users` (Admin/Organisation)
- `PATCH /api/users/:userId/role` (Admin/Organisation)

### Points

- `POST /api/points/award` (Admin/Moderator/Organisation)
- `GET /api/points/history` (authenticated)
- `POST /api/points/transfer` (always forbidden by design)

### Events

- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events` (Admin/Organisation)
- `PATCH /api/events/:id` (Admin/Organisation with creator restrictions)

### Tasks and Submissions

- `GET /api/tasks?eventId=<eventId>`
- `POST /api/tasks` (Event Staff/Admin/Organisation)
- `POST /api/tasks/:taskId/submissions` (authenticated)
- `GET /api/tasks/submissions/me` (authenticated)
- `GET /api/tasks/:taskId/submissions` (Event Staff/Moderator/Admin/Organisation)
- `PATCH /api/tasks/submissions/:submissionId/review` (Moderator/Admin/Organisation)

### Shop

- `GET /api/shop/items`
- `POST /api/shop/items` (Admin/Organisation)
- `POST /api/shop/items/:itemId/purchase`
- `GET /api/shop/purchases/me`

### Leaderboard

- `GET /api/leaderboard`

### Newsletter

- `POST /api/newsletter/subscribe`
- `GET /api/newsletter/unsubscribe`
- `POST /api/newsletter/send`
- `GET /api/newsletter/count`

## Rules Enforced

- Members cannot transfer points to each other.
- Points are earned via:
  - Approved task submissions
  - Admin/moderator/organisation awards
- Shop purchases spend points only.
