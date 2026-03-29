# Can I Help You — Technical Claims Evidence File

This file cites the exact source location for every major technical claim made in REPORT.md and README_PORTFOLIO_TEMPLATE.md.

---

## 1. Cloudflare Workers — Edge Serverless Runtime

**Claim**: The API runs as a Cloudflare Worker with a standard `export default { async fetch() }` entrypoint.

| Evidence | Location |
|----------|----------|
| `export default { async fetch(request, env, ctx)` | `api/cloudflare/src/index.js` — top of file |
| `workers_dev = true` | `api/cloudflare/wrangler.toml` |
| `"wrangler": "^4.47.0"` | `api/cloudflare/package.json` → `devDependencies` |
| Scripts: `dev`, `deploy`, `tail` | `api/cloudflare/package.json` → `scripts` |
| `name = "can-i-help-you-cloudflare-worker"` | `api/cloudflare/wrangler.toml` |

---

## 2. Firebase JWT Authentication (Workers-Compatible, No Admin SDK)

**Claim**: Firebase tokens are verified via REST API without the Firebase Admin SDK.

| Evidence | Location |
|----------|----------|
| `export async function verifyFirebaseTokenWithAPI(env, token)` | `api/cloudflare/src/services/firebase.js` |
| `export async function authMiddleware(request, env)` calls `verifyFirebaseTokenWithAPI` | `api/cloudflare/src/middleware/auth.js` |
| `adminMiddleware` wraps `authMiddleware` + checks `env.ADMIN_EMAILS` | `api/cloudflare/src/middleware/admin.js` |
| All `/api/me` routes call `authMiddleware` | `api/cloudflare/src/routes/me.js` |

---

## 3. PostgreSQL — New Connection Per Request

**Claim**: PostgreSQL uses a new connection per request (correct Workers pattern; no persistent pool).

| Evidence | Location |
|----------|----------|
| `query()` utility function | `api/cloudflare/src/utils/db.js` |
| `query()` called in route handlers | `api/cloudflare/src/routes/matches.js`, `routes/me.js`, `routes/token.js`, `routes/notifications.js` |
| Schema definitions | `api/cloudflare/schema.sql`, `schema-tokens.sql`, `schema-actualites-annonces.sql` |

---

## 4. Upstash Redis Cache (REST API)

**Claim**: Upstash Redis is used as the primary cache layer via its REST API (no ioredis/node-redis).

| Evidence | Location |
|----------|----------|
| Redis REST client — `get`, `set` with `ex` TTL, `del` | `api/cloudflare/src/utils/cache.js` |
| `initCache(env)` called in route handlers | `api/cloudflare/src/routes/matches.js` |
| Cache TTL constants (30s live, 5min today, 10min all, 30min news) | `api/cloudflare/src/routes/matches.js`, `routes/actualites.js` |

---

## 5. Cloudflare KV — Secondary Cache

**Claim**: Cloudflare KV is used as a secondary cache for Mapbox tiles and manual match data.

| Evidence | Location |
|----------|----------|
| KV namespace binding in `wrangler.toml` | `api/cloudflare/wrangler.toml` |
| `CACHE_KEYS.MANUAL` KV storage for manual matches | `api/cloudflare/src/routes/matches.js` |
| KV used in Mapbox tile caching | `api/cloudflare/src/routes/mapbox.js` |

---

## 6. Mapbox Reverse Proxy

**Claim**: Mapbox API token is never exposed to the client; all map requests are proxied through the Worker.

| Evidence | Location |
|----------|----------|
| Proxy handlers for style, geocoding, tiles, sprites | `api/cloudflare/src/routes/mapbox.js` |
| `Cache-Control: public, max-age=1728000, immutable` for tiles | `api/cloudflare/src/routes/mapbox.js` |
| Client calls `/api/mapbox/*` | `app/services/api.js` |

---

## 7. TripAdvisor Integration (ToS Compliant)

**Claim**: Full TripAdvisor venue data is served live without caching (per TripAdvisor ToS); partial/list data uses Redis.

| Evidence | Location |
|----------|----------|
| TripAdvisor route handlers | `api/cloudflare/src/routes/tripadvisor.js` |
| Distinction between cached list and live detail calls | `api/cloudflare/src/routes/tripadvisor.js` |

---

## 8. Dual Push Token System (User + Guest)

**Claim**: Both authenticated users and anonymous guests can register push tokens.

| Evidence | Location |
|----------|----------|
| `handleRegisterUserToken` (requires Firebase JWT) | `api/cloudflare/src/routes/token.js` |
| `handleRegisterGuestToken` (no auth required) | `api/cloudflare/src/routes/token.js` |
| `upsertUserToken`, `upsertGuestToken`, `findTokenByValue`, `deleteToken` | `api/cloudflare/src/models/token.js` |
| `tokens` table schema (`type: 'user' | 'guest'`) | `api/cloudflare/schema-tokens.sql` |
| Client-side token management with AsyncStorage | `app/services/tokenService.js` |

---

## 9. Push Notifications (Send to All / By Team)

**Claim**: Admin can push notifications to all users or only fans of a specific team.

| Evidence | Location |
|----------|----------|
| `getAllPushTokens` | `api/cloudflare/src/models/user.js` |
| `getPushTokensByTeam` | `api/cloudflare/src/models/user.js` |
| `getPushTokensPremium` | `api/cloudflare/src/models/user.js` |
| `/notifications/send`, `/notifications/send-team`, `/notifications/test`, `/notifications/stats` | `api/cloudflare/src/routes/notifications.js` |

---

## 10. CRON Pre-Warming Endpoint

**Claim**: A CRON endpoint exists for cache pre-warming, protected by a shared-secret Bearer token.

| Evidence | Location |
|----------|----------|
| `CRON_SECRET` Bearer token check | `api/cloudflare/src/routes/cron.js` |
| Cache warm-up logic | `api/cloudflare/src/routes/cron.js` |

---

## 11. CORS — Manual Headers, No Package

**Claim**: CORS is handled manually via utility functions, without an npm `cors` package.

| Evidence | Location |
|----------|----------|
| `corsResponse()`, `jsonResponse()`, `errorResponse()` | `api/cloudflare/src/utils/response.js` |
| `if (method === "OPTIONS") return corsResponse()` | `api/cloudflare/src/index.js` |
| No `cors` entry in dependencies | `api/cloudflare/package.json` |

---

## 12. Cloudflare R2 CDN

**Claim**: Static assets are served from Cloudflare R2.

| Evidence | Location |
|----------|----------|
| `R2_CDN_BASE = 'https://can-i-help-you-cdn.zaher-5hc.workers.dev'` | `app/utils/cdn.js` |

---

## 13. React Native / Expo Mobile App

**Claim**: The frontend is a React Native app built with Expo.

| Evidence | Location |
|----------|----------|
| `BASE_URL = "https://can-i-help-you-api.zaher-5hc.workers.dev/api"` | `app/services/api.js` |
| AsyncStorage usage for push token cache | `app/services/tokenService.js` |
| `app/` directory with Expo structure | `app/` |

---

## 14. Admin Middleware Chain

**Claim**: Admin routes use a middleware chain: Firebase JWT → email allowlist check.

| Evidence | Location |
|----------|----------|
| `adminMiddleware` implementation | `api/cloudflare/src/middleware/admin.js` |
| `env.ADMIN_EMAILS` check | `api/cloudflare/src/middleware/admin.js` |

---

## 15. Known Gap — Matches Admin TODO

**Claim (transparency)**: Admin token validation on matches routes has a `// TODO` comment; the shared `adminMiddleware` is not yet wired up.

| Evidence | Location |
|----------|----------|
| `// TODO` comment in admin CRUD section | `api/cloudflare/src/routes/matches.js` |

---

## 16. PostgreSQL Schema

**Claim**: The database includes tables for users, tokens, matches, news, and announcements.

| Evidence | Location |
|----------|----------|
| `users` table (incl. `push_token TEXT`) | `api/cloudflare/schema.sql` |
| `tokens` table (dedicated push tokens) | `api/cloudflare/schema-tokens.sql` |
| `actualites` and `annonces` tables | `api/cloudflare/schema-actualites-annonces.sql` |
