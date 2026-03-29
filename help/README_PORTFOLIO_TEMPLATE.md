# Can I Help You

> A full-stack mobile application for football match fans — real-time scores, nearby hotels & restaurants, interactive maps, and push notifications, powered by a Cloudflare Workers edge API.

<!-- Replace the image below with an actual screenshot -->
<!-- ![App Screenshot](screenshot.png) -->

---

## What It Does

**Can I Help You** helps supporters attending football matches find everything they need:

- **Live match scores** — real-time updates with sub-30-second refresh via Upstash Redis cache
- **Nearby venues** — hotels and restaurants sourced from TripAdvisor, displayed on an interactive Mapbox map
- **Push notifications** — match alerts for both registered users and anonymous guests
- **News feed** — latest club and match announcements
- **Favorites** — save teams and venues to a personal profile

---

## Tech Stack

### Backend — Cloudflare Workers
- **Runtime**: Cloudflare Workers (edge, globally distributed)
- **Database**: PostgreSQL (users, matches, tokens, news)
- **Cache**: Upstash Redis (REST API) + Cloudflare KV (tiles/static)
- **CDN**: Cloudflare R2
- **Auth**: Firebase Authentication (JWT verified via REST — no Node.js SDK)
- **Deployment**: Wrangler 4.x (`wrangler deploy`)

### External APIs
- **TripAdvisor Content API** — venue discovery
- **Mapbox** — maps, geocoding, vector tiles (proxied to protect token)
- **API Football** — live and scheduled match data
- **Expo Push Notifications** — mobile push delivery

### Mobile — React Native / Expo
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based)
- **Storage**: AsyncStorage (push token cache, session)
- **Maps**: Mapbox GL (via proxied Worker endpoint)

---

## Architecture

```
Mobile App (Expo / React Native)
         │
         ▼ HTTPS
Cloudflare Workers (Edge API)
 ├── Firebase JWT auth (REST)
 ├── Admin middleware (JWT + email allowlist)
 ├── CORS (manual, no package)
 ├── Route handlers (matches, me, token, mapbox, notifications, cron...)
 └── Cache layer
      ├── Upstash Redis  (live data, TTL per resource)
      └── Cloudflare KV  (Mapbox tiles, 20-day TTL)
         │
         ├── PostgreSQL  (persistent data)
         ├── Firebase Auth REST (token verification)
         ├── TripAdvisor API  (live — ToS compliant)
         ├── Mapbox  (proxied)
         ├── API Football
         └── Expo Push
```

---

## API Highlights

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `GET /api/matches/live` | Live scores (30s cache) | Public |
| `GET /api/matches/today` | Today's fixtures (5min cache) | Public |
| `GET /api/tripadvisor/hotels` | Hotels near venue | Public |
| `GET /api/mapbox/tiles/*` | Proxied map tiles (20-day cache) | Public |
| `POST /api/token/register` | Register push token | Firebase JWT |
| `POST /api/token/register-guest` | Register anonymous push token | Public |
| `GET /api/me` | User profile | Firebase JWT |
| `POST /api/notifications/send` | Broadcast push notification | Admin |
| `POST /api/cron/warm` | Pre-warm cache | CRON secret |

Full endpoint list: see [ENDPOINTS.md](ENDPOINTS.md)

---

## Key Engineering Decisions

### Firebase Auth at the Edge
The Firebase Admin SDK requires Node.js APIs that don't exist in Cloudflare Workers. Instead, token verification uses Firebase's `identitytoolkit` REST endpoint directly — keeping auth fully functional at the edge without any SDK dependency.

### PostgreSQL in Workers
Workers don't support persistent TCP connections. The `db.js` utility opens a fresh connection per request — the correct pattern for this runtime, avoiding connection leak bugs common when porting Node.js code to Workers.

### Three-Tier Caching
1. **Upstash Redis** — structured data (matches, news) with per-resource TTLs
2. **Cloudflare KV** — Mapbox tiles, 20-day TTL, near-zero latency from edge
3. **HTTP `Cache-Control` headers** — browser/CDN layer for map tiles (`max-age=1728000, immutable`)

### Mapbox Token Protection
The Mapbox API key is never sent to the client. All map requests are proxied through the Worker, which injects the token server-side before forwarding to Mapbox.

### Guest Push Tokens
Most notification systems require a logged-in account. This app supports anonymous push tokens stored alongside authenticated tokens, enabling match alerts before users sign up.

---

## Database Schema

```sql
-- Core tables (see api/cloudflare/schema*.sql)
users          -- profile, firebase_uid, push_token (legacy)
tokens         -- dedicated push token table (user + guest)
matches        -- match data (also cached in KV for manual entries)
actualites     -- news articles
annonces       -- announcements
```

---

## Local Development

```bash
# Install dependencies
cd api/cloudflare && npm install

# Start local dev server (Wrangler)
npm run dev          # wrangler dev

# Deploy to Cloudflare
npm run deploy       # wrangler deploy

# Stream live logs
npm run tail         # wrangler tail
```

Secrets are managed via `wrangler secret put <KEY>` — never stored in source code.

---

## Environment Variables (Secrets)

All secrets are set via `wrangler secret put` and accessed via `env.*` in the Worker. No `.env` files are committed.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token |
| `FIREBASE_PROJECT_ID` | Firebase project identifier |
| `TRIPADVISOR_API_KEY` | TripAdvisor Content API key |
| `MAPBOX_TOKEN` | Mapbox API token |
| `API_FOOTBALL_KEY` | API Football key |
| `ADMIN_EMAILS` | Comma-separated admin email allowlist |
| `CRON_SECRET` | Shared secret for cron endpoints |

---

## Project Structure

```
Can-I-Help-You/
├── api/
│   └── cloudflare/
│       ├── src/
│       │   ├── index.js              # Worker entrypoint
│       │   ├── middleware/
│       │   │   ├── auth.js           # Firebase JWT middleware
│       │   │   └── admin.js          # Admin auth middleware
│       │   ├── routes/
│       │   │   ├── matches.js
│       │   │   ├── me.js
│       │   │   ├── token.js
│       │   │   ├── mapbox.js
│       │   │   ├── notifications.js
│       │   │   ├── cron.js
│       │   │   ├── actualites.js
│       │   │   └── tripadvisor.js
│       │   ├── models/
│       │   │   ├── user.js
│       │   │   └── token.js
│       │   ├── services/
│       │   │   └── firebase.js       # JWT verification
│       │   └── utils/
│       │       ├── cache.js          # Redis + KV helpers
│       │       ├── db.js             # PostgreSQL query helper
│       │       └── response.js       # jsonResponse, errorResponse, corsResponse
│       ├── schema.sql
│       ├── schema-tokens.sql
│       ├── schema-actualites-annonces.sql
│       └── wrangler.toml
└── app/                              # React Native / Expo mobile app
    ├── services/
    │   ├── api.js                    # API client (BASE_URL)
    │   └── tokenService.js           # Push token management
    └── utils/
        └── cdn.js                    # R2 CDN base URL
```

---

## License

<!-- Add your license here -->
