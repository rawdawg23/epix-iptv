# Implementation Roadmap: Backend, Admin, Panels, Payments & Email

This document outlines concrete steps and file structure to add:

- **Backend API** (orders, webhooks, panel provisioning)
- **Admin area** (auth, dashboard, panel/payment/email config)
- **IPTV panel integrations** (Extreme UI, OneStreams, Xtream-style APIs)
- **Payment gateways** (Stripe, PayPal, custom)
- **Transactional email** (Resend)

**Hosting:** The site is deployed on **Vercel**. The backend options below are written for Vercel first.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  EXISTING (unchanged)                                                    │
│  Astro static site (marketing, pricing, contact) → Vercel                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API calls (fetch)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  NEW BACKEND                                                             │
│  Option A: Vercel Serverless Functions in same repo (/api) — one deploy │
│  Option B: Separate Node backend (e.g. Express/Fastify) on Railway/Render │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
   │ IPTV Panels  │         │ Payments     │         │ Email        │
   │ Extreme UI   │         │ Stripe       │         │ Resend       │
   │ OneStreams   │         │ PayPal       │         │              │
   │ Xtream API   │         │ Custom       │         │              │
   └──────────────┘         └──────────────┘         └──────────────┘
                                    │
                                    ▼
                            ┌──────────────┐
                            │ Database     │
                            │ Vercel Postgres / Neon / Turso │
                            └──────────────┘
```

**Recommendation:** Use **Option A (Vercel)** so everything stays in one repo: Astro builds to static assets, and **Vercel Serverless Functions** in `/api` handle auth, webhooks, and admin API. Add **Vercel Postgres** or **Neon** (or Turso) for the database. Use **Option B** only if you prefer a dedicated Node server elsewhere.

---

## 2. Tech Stack on Vercel (Option A)

| Layer     | Choice |
|-----------|--------|
| Frontend  | Astro (static) — existing |
| API       | Vercel Serverless Functions in `/api` (Node.js) |
| Database  | Vercel Postgres, or Neon, or Turso |
| Auth      | JWT in HTTP-only cookies; admin user in DB or env |
| Hosting   | Vercel (one project: static + serverless) |

Each file under `/api` becomes a serverless function. Example: `api/webhooks/stripe.ts` → `POST https://your-domain.vercel.app/api/webhooks/stripe`. Set secrets (Stripe, PayPal, Resend, DB URL, JWT secret) in **Vercel → Project → Settings → Environment Variables**.

---

## 3. File Structure

### Option A: Backend in same repo (Vercel)

Vercel deploys every file under `/api` at the **project root** as a serverless function. No separate worker or `functions/` folder.

```
epix-iptv/
├── src/                          # existing Astro app
│   ├── pages/
│   │   ├── admin/                # NEW: admin UI (protected)
│   │   │   ├── index.astro       # dashboard
│   │   │   ├── login.astro       # admin login
│   │   │   ├── panels.astro      # panel config
│   │   │   ├── payments.astro    # Stripe/PayPal/Resend config
│   │   │   └── orders.astro      # order list
│   │   └── ...
│   └── ...
├── api/                          # Vercel Serverless Functions (root-level)
│   ├── auth/
│   │   └── login.ts              # POST login, set cookie
│   ├── admin/
│   │   ├── config.ts             # GET/PATCH panel & payment config (protected)
│   │   └── orders.ts             # GET orders list (protected)
│   ├── checkout/
│   │   └── stripe.ts             # POST create Stripe Checkout Session
│   ├── webhooks/
│   │   ├── stripe.ts             # POST Stripe webhook
│   │   ├── paypal.ts             # POST PayPal webhook
│   │   └── custom.ts             # POST custom gateway webhook
│   └── _lib/                     # shared code (not a route; underscore = private)
│       ├── db.ts                 # Postgres client (Vercel Postgres / Neon)
│       ├── auth.ts               # verify JWT, get admin
│       ├── panels/
│       │   ├── types.ts
│       │   ├── extreme-ui.ts
│       │   ├── onestreams.ts
│       │   └── xtream.ts
│       ├── payments/
│       │   ├── stripe.ts
│       │   ├── paypal.ts
│       │   └── custom.ts
│       └── email/
│           └── resend.ts
├── lib/                          # optional: shared types/schema (used by api + astro)
│   └── schema.sql
├── docs/
│   └── IMPLEMENTATION_ROADMAP.md
├── astro.config.mjs
├── vercel.json                   # optional: rewrites, env, function config
└── package.json
```

**Vercel behaviour:** Each `.ts` in `api/` (except `_lib/`) is a serverless function. Export a default handler that receives `req` and `res` (Node.js style). Shared code in `api/_lib/` is imported by route files. Add `vercel.json` only if you need rewrites or custom function runtime.

### Option B: Separate backend repo (Node)

```
epix-iptv/                        # existing frontend (Astro)
  └── src/pages/admin/            # admin UI; calls backend API

epix-iptv-api/                    # NEW repo or /backend in monorepo
├── src/
│   ├── index.ts                  # Express/Fastify app
│   ├── middleware/
│   │   ├── auth.ts               # admin JWT/session
│   │   └── cors.ts
│   ├── routes/
│   │   ├── orders.ts
│   │   ├── webhooks/
│   │   │   ├── stripe.ts
│   │   │   ├── paypal.ts
│   │   │   └── custom.ts
│   │   └── admin/
│   │       └── config.ts
│   ├── services/
│   │   ├── panels/
│   │   │   ├── types.ts
│   │   │   ├── extreme-ui.ts
│   │   │   ├── onestreams.ts
│   │   │   └── xtream.ts
│   │   ├── payments/
│   │   │   ├── stripe.ts
│   │   │   ├── paypal.ts
│   │   │   └── custom.ts
│   │   └── email/
│   │       └── resend.ts
│   ├── db/
│   │   ├── schema.sql
│   │   ├── migrations/
│   │   └── client.ts             # Postgres client
│   └── lib/
│       ├── env.ts
│       └── errors.ts
├── package.json
└── Dockerfile or railway.toml
```

---

## 4. Database Schema (Core Tables)

```sql
-- Admin users (simple: one or few admins; extend if you need full user management)
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Panel connections (one row per panel instance)
CREATE TABLE panel_configs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,              -- 'extreme_ui' | 'onestreams' | 'xtream'
  name TEXT NOT NULL,              -- display name
  base_url TEXT NOT NULL,
  api_key_or_username TEXT,
  api_secret_or_password TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Map pricing plan (from site) to panel product/duration
CREATE TABLE panel_plan_mapping (
  id TEXT PRIMARY KEY,
  panel_config_id TEXT NOT NULL REFERENCES panel_configs(id),
  site_plan_id TEXT NOT NULL,      -- e.g. 'starter', 'standard'
  panel_product_id TEXT,          -- panel-specific product/package id
  duration_days INTEGER NOT NULL,
  UNIQUE(panel_config_id, site_plan_id)
);

-- Payment gateway config (key-value or JSON per gateway)
CREATE TABLE payment_configs (
  id TEXT PRIMARY KEY,
  gateway TEXT NOT NULL,           -- 'stripe' | 'paypal' | 'custom'
  config_json TEXT NOT NULL,      -- encrypted or env-ref; keys, webhook secret, etc.
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Email config (Resend)
CREATE TABLE email_config (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'resend',
  api_key_encrypted TEXT,
  from_address TEXT,
  from_name TEXT,
  reply_to TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Orders (created on successful payment webhook)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  external_id TEXT,               -- Stripe/PayPal payment id
  gateway TEXT NOT NULL,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | paid | provisioned | failed
  panel_config_id TEXT REFERENCES panel_configs(id),
  panel_line_id TEXT,             -- line/account id from panel
  credentials_sent_at TEXT,       -- when Resend sent the email
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 5. Implementation Steps (Order)

### Phase 1: Backend foundation

1. **Choose Option A (Vercel) or B.** For Vercel: create the `/api` folder at project root; no separate app.
2. **Add a database:** Vercel Postgres (Vercel dashboard) or Neon/Turso. Define DB schema and run migrations (e.g. SQL in Vercel Postgres console, or a migration script).
3. **Implement admin auth:**
   - Login endpoint: validate email + password (hash with bcrypt or similar), set HTTP-only cookie with JWT or session id.
   - Middleware: protect `/api/admin/*` and webhook routes (webhooks use shared secrets, not admin auth).
4. **Expose minimal admin config API:** e.g. `GET/PATCH /api/admin/config` for reading/updating panel and payment config (stored in DB).

### Phase 2: Payment gateways

5. **Stripe:**
   - Create Stripe product/prices for each plan or use existing; store price IDs in config.
   - Checkout: API route that returns a Stripe Checkout Session URL (or create session server-side and redirect).
   - Webhook: `POST /api/webhooks/stripe` — verify signature, on `checkout.session.completed` create row in `orders`, then trigger provisioning (Phase 3).
6. **PayPal:**
   - Create plans in PayPal or use one-time orders; store client id and secret in `payment_configs`.
   - Create order/capture flow; webhook for payment capture.
   - On success: create `orders` row and trigger provisioning.
7. **Custom gateway:** Same pattern: webhook or callback URL that creates `orders` and triggers provisioning.

### Phase 3: IPTV panel integrations

8. **Define a common interface** (e.g. `createLine(email, planId, durationDays)` and optionally `suspendLine`, `extendLine`).
9. **Implement one panel at a time:**
   - **Xtream-style API:** many panels use this (login with `username:password`, REST for user/create, etc.). Implement `services/panels/xtream.ts` and map plan → duration.
   - **Extreme UI / OneStreams:** use their official API docs; implement `extreme-ui.ts` and `onestreams.ts` against the same interface.
10. **On order paid:** in webhook handler, select panel (e.g. round-robin or by config), map `plan_id` → `panel_plan_mapping` → product + duration, call `createLine`, save `panel_line_id` and credentials in `orders` (or in panel and only store line id).

### Phase 4: Email (Resend)

11. **Store Resend API key** in `email_config` (or env) and configure from address/from name in admin.
12. **After provisioning:** call Resend to send “Your IPTV credentials” email (link or plain text). Set `credentials_sent_at` on the order.

### Phase 5: Admin UI

13. **Admin pages in Astro:** `src/pages/admin/login.astro`, `admin/index.astro`, `admin/panels.astro`, `admin/payments.astro`, `admin/orders.astro`.
14. **Use fetch to your API:** login form POSTs to `/api/auth/login`; other pages GET/PATCH `/api/admin/config`, GET `/api/admin/orders`, etc. Protect admin routes: if no valid session, redirect to `/admin/login`.
15. **Config forms:** panels (add/edit/delete, test connection), payment (Stripe/PayPal keys, webhook URLs), Resend (API key, from address). Display webhook URLs for copy-paste into Stripe/PayPal dashboards.

### Phase 6: Frontend checkout (existing site)

16. **Replace “Buy Now” link** for chosen plans with “Checkout” that calls your API to get Stripe/PayPal session URL (or redirect to your backend checkout page). Keep WhatsApp/email/custom link as fallback if you want.

---

## 6. Environment / Secrets (Vercel)

Add these in **Vercel → Project → Settings → Environment Variables** (and optionally in `.env.local` for local dev):

- **Backend:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `RESEND_API_KEY`, `JWT_SECRET`, and either admin credentials in DB or `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`.
- **Database:** `POSTGRES_URL` (or `DATABASE_URL`) if using Vercel Postgres / Neon / Turso.
- **Panel credentials:** store in DB (encrypted at rest if possible) or in env per panel; never expose to frontend.
- **Webhook URLs:** `https://your-domain.vercel.app/api/webhooks/stripe`, same for PayPal and custom. Use these in Stripe/PayPal dashboards.

**Deploying:** Connect the repo to Vercel; build command stays `npm run build` (Astro). Vercel will serve the static output and automatically deploy anything in `/api` as serverless functions. No need to change `astro.config.mjs` for the API.

---

## 7. Panel Integration Notes

- **Xtream-style:** Usually `http(s)://panel/admin.php` or similar; auth + endpoints to add user, set expiry, package. One generic “Xtream” adapter can work for many panels that follow this.
- **Extreme UI / OneStreams:** Use official API documentation; implement per-panel adapter that implements your internal `createLine`/suspend/extend interface.

---

## 8. Summary Checklist

- [ ] Backend (Worker or Node) with DB and migrations
- [ ] Admin auth (login + protected routes)
- [ ] Admin config API (panels, payments, email)
- [ ] Stripe webhook + order creation + provisioning trigger
- [ ] PayPal webhook + order creation + provisioning trigger
- [ ] Custom gateway (if needed) same pattern
- [ ] Panel adapters: Xtream, Extreme UI, OneStreams (common interface)
- [ ] Provisioning pipeline: order paid → create line → save credentials → send email
- [ ] Resend integration (send credentials email)
- [ ] Admin UI pages (login, dashboard, panels, payments, orders)
- [ ] Checkout flow from existing site to Stripe/PayPal (or custom)

You can implement in the order above, one phase at a time, and test each webhook and panel with sandbox/test credentials before going live.
