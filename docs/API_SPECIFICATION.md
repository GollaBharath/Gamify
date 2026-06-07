# Gamify REST API Specification

This document details the HTTP REST endpoints provided by the Gamify backend server.

## Base URL
Default development base URL: `http://localhost:5000`

## Endpoints

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate a user and receive JWT.
- `POST /api/auth/forgot-password` - Trigger reset password email link.
- `POST /api/auth/reset-password` - Reset password using secure token.

### 2. Users (`/api/users`)
- `GET /api/users/profile` - Fetch current user dashboard status.
- `GET /api/users` - List all users in organization (Admin/Moderator only).
- `PATCH /api/users/:userId/role` - Update member roles.

### 3. Points (`/api/points`)
- `POST /api/points/add` - Award points to a user for activities.
- `GET /api/points/balance` - Retrieve current user balance.

### 4. Leaderboard (`/api/leaderboard`)
- `GET /api/leaderboard` - Fetch points leaderboard ranking data.
