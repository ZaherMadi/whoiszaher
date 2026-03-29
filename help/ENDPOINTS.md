# Can I Help You API — Endpoint Reference

Base URL: `https://can-i-help-you-api.zaher-5hc.workers.dev/api`
Runtime: Cloudflare Workers
Source: `api/cloudflare/src/`

---

## Authentication Schemes

| Scheme | Header | Validator |
|--------|--------|-----------|
| Firebase JWT | `Authorization: Bearer <firebase-id-token>` | `authMiddleware` → `verifyFirebaseTokenWithAPI` |
| Admin JWT | `Authorization: Bearer <firebase-id-token>` | `adminMiddleware` → Firebase JWT + `ADMIN_EMAILS` env check |
| CRON secret | `Authorization: Bearer <CRON_SECRET>` | Inline check in `routes/cron.js` |
| None | — | Public endpoint |

---

## Endpoints Table

### Matches

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| GET | `/api/matches` | List all matches (cached 10 min) | None | `routes/matches.js` |
| GET | `/api/matches/live` | Live matches only (cached 30s) | None | `routes/matches.js` |
| GET | `/api/matches/today` | Today's matches (cached 5 min) | None | `routes/matches.js` |
| GET | `/api/matches/:id` | Single match by ID | None | `routes/matches.js` |
| POST | `/api/matches` | Create match (admin) | Admin JWT | `routes/matches.js` |
| PUT | `/api/matches/:id` | Update match (admin) | Admin JWT | `routes/matches.js` |
| DELETE | `/api/matches/:id` | Delete match (admin) | Admin JWT | `routes/matches.js` |
| GET | `/api/matches/manual` | List manual (KV-stored) matches | None | `routes/matches.js` |
| POST | `/api/matches/manual` | Create manual match entry | Admin JWT | `routes/matches.js` |

### User Profile

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| GET | `/api/me` | Get current user profile | Firebase JWT | `routes/me.js` |
| PUT | `/api/me` | Update user profile | Firebase JWT | `routes/me.js` |
| DELETE | `/api/me` | Delete user account | Firebase JWT | `routes/me.js` |
| GET | `/api/me/favorites` | List user's favorite teams/venues | Firebase JWT | `routes/me.js` |
| POST | `/api/me/favorites` | Add to favorites | Firebase JWT | `routes/me.js` |
| DELETE | `/api/me/favorites/:id` | Remove from favorites | Firebase JWT | `routes/me.js` |

### Push Tokens

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| POST | `/api/token/register` | Register push token for authenticated user | Firebase JWT | `routes/token.js` |
| POST | `/api/token/register-guest` | Register push token for anonymous guest | None | `routes/token.js` |

### Notifications

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| POST | `/api/notifications/send` | Send push to all users | Admin JWT | `routes/notifications.js` |
| POST | `/api/notifications/send-team` | Send push to fans of a specific team | Admin JWT | `routes/notifications.js` |
| POST | `/api/notifications/test` | Send test push to a single token | Admin JWT | `routes/notifications.js` |
| GET | `/api/notifications/stats` | Push token statistics | Admin JWT | `routes/notifications.js` |

### Mapbox Proxy

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| GET | `/api/mapbox/style` | Proxy Mapbox style JSON | None | `routes/mapbox.js` |
| GET | `/api/mapbox/geocoding` | Proxy Mapbox geocoding API | None | `routes/mapbox.js` |
| GET | `/api/mapbox/tiles/*` | Proxy Mapbox vector tiles (cached 20 days) | None | `routes/mapbox.js` |
| GET | `/api/mapbox/sprites/*` | Proxy Mapbox sprites | None | `routes/mapbox.js` |

### Actualités (News) & Annonces

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| GET | `/api/actualites` | List news articles (cached 30 min) | None | `routes/actualites.js` |
| GET | `/api/actualites/:id` | Single news article | None | `routes/actualites.js` |
| POST | `/api/actualites` | Create news article | Admin JWT | `routes/actualites.js` |
| PUT | `/api/actualites/:id` | Update news article | Admin JWT | `routes/actualites.js` |
| DELETE | `/api/actualites/:id` | Delete news article | Admin JWT | `routes/actualites.js` |
| GET | `/api/annonces` | List announcements | None | `routes/annonces.js` |
| POST | `/api/annonces` | Create announcement | Admin JWT | `routes/annonces.js` |

### TripAdvisor

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| GET | `/api/tripadvisor/hotels` | Hotels near a location (live — no full cache per ToS) | None | `routes/tripadvisor.js` |
| GET | `/api/tripadvisor/restaurants` | Restaurants near a location | None | `routes/tripadvisor.js` |
| GET | `/api/tripadvisor/:id` | Venue details (live — TripAdvisor ToS) | None | `routes/tripadvisor.js` |

### CRON / Cache Warming

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| POST | `/api/cron/warm` | Pre-warm Redis cache (matches, news) | CRON_SECRET | `routes/cron.js` |

### Static / Auth

| Method | Path | Purpose | Auth | Source File |
|--------|------|---------|------|-------------|
| GET | `/auth.html` | Firebase Auth UI page (inline HTML) | None | `src/index.js` |
| OPTIONS | `*` | CORS preflight for all routes | None | `src/index.js` |

---

## CORS Policy

All responses include CORS headers set via `corsResponse()` / `jsonResponse()` in `src/utils/response.js`.
No npm `cors` package — headers are set manually per response.

---

## Response Format

All API endpoints return JSON:

```json
{
  "data": ...,
  "error": "message"   // only on error responses
}
```

Error responses use `errorResponse(message, status)` from `src/utils/response.js`.

---

## Cache Hit Headers

When a response is served from Redis cache, the `X-Cache: HIT` header is set (implementation in `src/utils/cache.js`).
