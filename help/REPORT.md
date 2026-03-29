# Can I Help You — Portfolio Technical Report

## Headline

**Full-stack mobile application with a production Cloudflare Workers API** — real-time football match tracking, hotel/restaurant discovery, interactive maps, and push notifications, deployed at the edge for sub-50ms global latency.

---

## Summary

"Can I Help You" is a React Native / Expo mobile app paired with a Cloudflare Workers backend that serves fans attending football matches. The API layer handles live match data, TripAdvisor venue discovery, push notifications (user + guest), Mapbox proxying, news feeds, and user profile management — all from a single stateless Worker deployed globally at Cloudflare's edge network.

The project demonstrates end-to-end ownership: schema design (PostgreSQL + KV), multi-layer caching strategy (Redis + KV + HTTP headers), JWT authentication without a Node.js runtime (pure Workers-compatible REST verification), CORS handling, and CI-friendly deployment via Wrangler.

---

## Key Achievements

| # | Achievement | Technical Detail |
|---|-------------|-----------------|
| 1 | **Edge-deployed monolithic Worker** | Single `wrangler deploy` ships all routes; zero cold-start penalty vs Lambda |
| 2 | **Firebase JWT auth without Admin SDK** | Workers-compatible REST-based token verification (`verifyFirebaseTokenWithAPI`) |
| 3 | **Three-tier cache architecture** | Upstash Redis (primary) → Cloudflare KV (tiles/static) → HTTP Cache-Control headers |
| 4 | **TripAdvisor API integration with compliance** | Full data served live (no caching per ToS); partial data cached at Redis layer |
| 5 | **Dual push-token system** | Authenticated users + anonymous guests tracked in dedicated `tokens` table via Expo |
| 6 | **Mapbox reverse proxy** | Token never exposed to client; tiles cached 20 days via KV |
| 7 | **Admin CRUD with middleware chain** | `adminMiddleware` → Firebase JWT + `ADMIN_EMAILS` env check |
| 8 | **CRON pre-warming endpoint** | Shared-secret Bearer auth (`CRON_SECRET`) for cache pre-warming jobs |
| 9 | **R2 CDN integration** | Static assets served from `can-i-help-you-cdn.zaher-5hc.workers.dev` |
| 10 | **New-connection-per-request PostgreSQL** | Correct Workers pattern — no persistent connection pool leaks |

---

## Tech Stack

### Backend
| Technology | Role |
|-----------|------|
| Cloudflare Workers | Edge serverless runtime — all API routes |
| Wrangler 4.x | Build, dev server, secrets management, deployment |
| PostgreSQL | Persistent data store (users, tokens, matches, news) |
| Upstash Redis (REST API) | Primary cache layer — Workers-compatible HTTP client |
| Cloudflare KV | Secondary cache — Mapbox tiles, optional match data |
| Cloudflare R2 | CDN — images and static assets |
| Firebase Authentication | Identity provider — JWT verification via REST |

### External APIs
| API | Usage |
|-----|-------|
| TripAdvisor Content API | Hotels and restaurants near match venues |
| Mapbox | Maps, geocoding, vector tiles, sprites |
| API Football | Live and scheduled match data |
| Expo Push Notifications | Mobile push delivery |

### Frontend / Mobile
| Technology | Role |
|-----------|------|
| React Native | Cross-platform mobile UI |
| Expo | Build toolchain, push notifications, AsyncStorage |
| Expo Router | File-based navigation |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Mobile App (Expo)                    │
│  React Native · Expo Router · AsyncStorage           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│          Cloudflare Workers (Edge)                   │
│  api/cloudflare/src/index.js — fetch() entrypoint    │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  auth/admin │  │ CORS handler │  │ CRON guard │ │
│  │ middleware  │  │ corsResponse │  │CRON_SECRET │ │
│  └──────┬──────┘  └──────────────┘  └────────────┘ │
│         │                                           │
│  ┌──────▼──────────────────────────────────────┐   │
│  │              Route Handlers                  │   │
│  │  /matches  /me  /token  /mapbox  /cron       │   │
│  │  /notifications  /actualites  /tripadvisor   │   │
│  └──────┬──────────────────────────────────────┘   │
│         │                                           │
│  ┌──────▼──────────────────────────────────────┐   │
│  │           Cache Layer                        │   │
│  │  Upstash Redis (REST) · Cloudflare KV        │   │
│  └──────┬──────────────────────────────────────┘   │
└─────────┼───────────────────────────────────────────┘
          │
     ┌────▼─────┐   ┌──────────────┐   ┌────────────┐
     │PostgreSQL│   │  Firebase    │   │ TripAdvisor│
     │ (Neon/   │   │  Auth REST   │   │  API       │
     │  Supabase│   │  API         │   │            │
     └──────────┘   └──────────────┘   └────────────┘
          │
     ┌────▼─────┐   ┌──────────────┐   ┌────────────┐
     │ Mapbox   │   │ API Football │   │  Expo Push │
     │ (proxied)│   │              │   │  Service   │
     └──────────┘   └──────────────┘   └────────────┘

CDN: Cloudflare R2 → can-i-help-you-cdn.zaher-5hc.workers.dev
```

### Cache TTL Policy

| Data | TTL | Store |
|------|-----|-------|
| Live match data | 30 seconds | Redis |
| Today's matches | 5 minutes | Redis |
| All matches | 10 minutes | Redis |
| Actualités (news) | 30 minutes | Redis |
| Mapbox tiles | 20 days (1,728,000s) | KV + Cache-Control |

---

## Notable Design Decisions

### 1. Workers-Compatible Firebase Auth
The standard Firebase Admin SDK requires Node.js APIs unavailable in Workers. The solution: decode the JWT locally, then verify via Firebase's `identitytoolkit` REST API. This keeps auth fully functional at the edge with zero npm bloat.

### 2. New Connection Per Request (PostgreSQL)
Cloudflare Workers do not support persistent TCP connections across requests. Each `query()` call in `src/utils/db.js` opens a fresh connection — the correct pattern for this runtime, avoiding the connection leak bugs common when porting Node.js database code to Workers.

### 3. Manual CORS Without a Package
All CORS headers are set via the `corsResponse()` / `jsonResponse()` utilities in `src/utils/response.js`. No `cors` npm package — keeps the Worker bundle minimal and makes header logic explicit and auditable.

### 4. TripAdvisor Compliance
TripAdvisor's Content API ToS prohibits caching full venue details. The implementation respects this: full detail endpoints hit the API live, while lightweight list responses use the Redis cache.

### 5. Guest Push Tokens
Many notification systems require a logged-in user. This app supports anonymous guest tokens stored in the `tokens` table alongside authenticated user tokens, allowing fan engagement before sign-up.

---

## Skills Demonstrated

- **Cloudflare Workers** architecture and deployment (Wrangler 4.x)
- **Edge computing** constraints (no Node.js APIs, new-connection-per-request DB)
- **Multi-layer caching** (Redis + KV + HTTP headers, per-resource TTL strategy)
- **JWT authentication** at the edge without SDKs
- **Third-party API integration** under ToS constraints (TripAdvisor)
- **Reverse proxy pattern** for API key protection (Mapbox)
- **PostgreSQL schema design** (users, tokens, matches, news, announcements)
- **Push notifications** (Expo, dual user/guest modes)
- **React Native / Expo** mobile development
- **CORS handling** without frameworks
- **CI/CD** with Wrangler secrets and `wrangler deploy`

---

## Roadmap / Next Steps

1. **Complete `adminMiddleware` on matches routes** — There is a `// TODO` comment in `routes/matches.js` for admin token validation; migrate to the shared `adminMiddleware` for consistency.
2. **Rate limiting** — Add per-IP rate limiting using Cloudflare's built-in rate limit bindings to protect TripAdvisor and API Football quota.
3. **Durable Objects for live match rooms** — Replace the 30s Redis poll with a Durable Object WebSocket room for true real-time match updates.
4. **Offline mode (mobile)** — Cache the last known match state in AsyncStorage so the app loads instantly without a network round-trip.
5. **OpenAPI spec** — Auto-generate from route definitions to enable SDK generation and better API documentation.
6. **Error monitoring** — Integrate Sentry for Workers (via `wrangler tail` hooks or Sentry's edge SDK) for production error tracking.

---

## Screenshots / Captures to Make

For a complete portfolio presentation, capture:

- [ ] Live match card in the mobile app (showing real-time score update)
- [ ] Map screen with Mapbox tiles and nearby venue markers
- [ ] TripAdvisor hotel/restaurant search results screen
- [ ] Push notification received on device (iOS or Android)
- [ ] Wrangler deploy output (`wrangler deploy --dry-run` or real output)
- [ ] `wrangler tail` log showing a live request/response cycle
- [ ] Upstash Redis dashboard showing hit rate
- [ ] Cloudflare Workers dashboard (requests/day graph)
