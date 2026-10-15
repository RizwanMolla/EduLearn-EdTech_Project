# EduLearn Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET` and, if needed, `CLIENT_ORIGINS`.
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token
- `GET|PUT /api/profile`, `PUT /api/profile/image`, `PUT /api/profile/password` — Profile management
- `POST /api/profile/purchase` — Record purchased course ids
- `GET|PUT /api/profile/learning` — Sync learning progress
- `GET /api/health` — Health check

See the root README for the full project overview.
