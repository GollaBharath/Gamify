# Gamify Frontend

## What This Frontend Provides

This frontend is remade to match the new backend API design and concept note.

- JWT auth with register, login, and Google OAuth callback token support
- Role-aware dashboard tabs for:
  - Events management
  - Tasks creation and submissions
  - Moderation review workflow
  - Shop catalog and purchases
  - Leaderboard
  - Point ledger and manual awards
  - User role management
  - Newsletter subscribe/send/count

## Routes

- `/` -> Landing page
- `/auth` -> Login/Register page
- `/dashboard` -> Protected command center (requires auth)

## Environment

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Run

```bash
cd client
npm install
npm run dev
```

## Notes

- The UI is responsive and mobile-friendly.
- Controls are shown conditionally based on backend role policy.
- OAuth token query (`?token=...`) is consumed and cleaned from URL automatically.
