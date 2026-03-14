# Site Editor (WordPress-style)

A beginner-friendly, SEO-aware editor to manage site content from one place.

## Access

- **URL:** `/admin/editor` (dashboard)
- **Auth:** Enter your **Admin key** in the bar at the top (stored in the browser for the session). Set the same value as `ADMIN_SECRET` in your environment.

## What you can edit

| Section | Description |
|--------|-------------|
| **Dashboard** | Overview and quick links |
| **Site settings** | Brand name, site URL, support email, payment type |
| **Pages** | Create/edit pages with title, slug, body (Markdown), and **SEO** (meta title, description, focus keyword) |
| **Pricing** | Plans with name, price, features, and **SEO** |
| **FAQ** | Questions and answers with optional **SEO** |
| **Support channels** | Telegram and WhatsApp: toggle on/off, set username/number and optional pre-filled message. Shown on contact page and footer. |
| **SEO** | Global defaults: default meta title/description, focus keyword, Open Graph image, Twitter handle |

## Layout

- **Sidebar** – Navigation between sections (WP-style).
- **Main area** – Forms with clear labels and help text. Each edit screen has **Content** and **SEO** sections where relevant.

## API

All editor APIs live under `/api/editor/` and require the `X-Admin-Secret` header (same value as `ADMIN_SECRET`).

- `GET/PUT /api/editor/config` – Site config (JSON).
- `GET/POST /api/editor/pages` – List / create page.
- `GET/PUT/DELETE /api/editor/pages/[id]` – One page.
- `GET/POST /api/editor/pricing` – List / create plan.
- `GET/PUT/DELETE /api/editor/pricing/[id]` – One plan.
- `GET/POST /api/editor/faq` – List / create FAQ.
- `GET/PUT/DELETE /api/editor/faq/[id]` – One FAQ.
- `GET/PUT /api/editor/config` – Site config (includes `supportChannels` for Telegram/WhatsApp when saved from Support page).
- `GET/PUT /api/editor/seo` – Global SEO defaults.
- `GET /api/support-channels` – **Public**; returns Telegram/WhatsApp enabled state and links for contact page and footer.

## Database (Firebase Firestore)

Editor data is in Firestore: `editor_config` (doc `main`), `editor_seo` (doc `global`), `editor_pages`, `editor_pricing`, `editor_faq`. No SQL to run. See `docs/FIREBASE_VERCEL.md`.

## Using editor content on the live site

Editor content is stored in the database. To show it on the site you can:

1. **Build-time:** In your Astro build, call the editor API (e.g. `GET /api/editor/config`, `/api/editor/pages`, etc.) and use the JSON in your pages. Set `SITE_URL` (or your app URL) and optionally protect the read endpoints or use a read-only key.
2. **Export:** Add a “Export to files” action that writes editor data to your repo (e.g. via a GitHub Action or a script with write access), then keep building from files as today.
