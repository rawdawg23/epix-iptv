# Firebase + Vercel Setup

This project uses **Firebase (Firestore)** as the database and **Vercel** for hosting (Astro static site + serverless API).

## 1. Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. Enable **Firestore Database** (Create database, start in production mode, choose a region).
3. Get **service account** credentials:
   - Project settings → Service accounts → Generate new private key (JSON).
   - From the JSON you need: `project_id`, `client_email`, `private_key`.

## 2. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `my-app-12345` |
| `FIREBASE_CLIENT_EMAIL` | Service account client email | `firebase-adminsdk-xxx@my-app.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Service account private key (PEM) | `-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n` |

**Private key on Vercel:** Paste the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. If you copy from the JSON file, the `\n` might be literal backslash-n; the code replaces `\\n` with real newlines. You can also paste the key with real newlines.

## 3. Firestore collections (no SQL migrations)

Data is stored in these collections:

| Collection | Description |
|------------|-------------|
| `tickets` | Support tickets. Subcollection `replies` per ticket. |
| `editor_config` | Site editor config (doc id: `main`). |
| `editor_seo` | SEO defaults (doc id: `global`). |
| `editor_pages` | Site editor pages. |
| `editor_pricing` | Site editor pricing plans. |
| `editor_faq` | Site editor FAQ. |
| `products` | Store products. |
| `orders` | Store orders. Subcollection `items` per order. |
| `coupons` | Store coupons (doc id = coupon code, e.g. `SAVE10`). |

**Indexes:** Firestore may ask you to create composite indexes when you first run queries (e.g. `products` where `is_active==true` orderBy `order_num`). Follow the link in the error message to create the index in the Firebase Console.

## 4. Deploy on Vercel

1. Connect your repo to Vercel.
2. Build command: `npm run build` (Astro).
3. Output directory: `dist`.
4. Add the Firebase env vars above (and any others: `ADMIN_SECRET`, `RESEND_API_KEY`, `SITE_URL`, **`TMDB_API_KEY`** for the Movies & Series carousel, etc.).
5. Deploy. The `/api/*` routes become serverless functions automatically.

## 5. TMDB (Movies & Series carousel)

The homepage includes a responsive carousel of popular movies and TV shows from [The Movie Database (TMDB)](https://www.themoviedb.org/).

1. Sign up at [TMDB](https://www.themoviedb.org/signup) and go to **Settings → API** to request an API key (free).
2. In Vercel (and locally in `.env`), add: `TMDB_API_KEY=your_api_key`.
3. The `/api/tmdb/featured` route fetches popular movies and TV server-side and the **Movies & Series** section on the homepage displays them. If the key is missing, the section shows a short message and no posters.

## 6. Optional: Firebase Auth

To use **Firebase Authentication** (e.g. for admin login instead of `X-Admin-Secret`):

1. Enable Auth in Firebase Console (e.g. Email/Password or Google).
2. On the client, use the Firebase JS SDK to sign in and get an ID token.
3. In API routes, use Firebase Admin `auth().verifyIdToken(token)` to verify the token and get the user. Require admin for protected routes (e.g. by checking a custom claim or an allowlist of UIDs).

## 7. Security rules (Firestore)

For server-side only access (recommended): your API runs on Vercel with the **Admin SDK** (service account), so it bypasses Firestore security rules. Do **not** expose your service account key to the client. Keep `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` only in Vercel (and local `.env` for dev).

If you later add client-side Firestore (e.g. real-time listeners), define rules in Firebase Console to restrict read/write by path and auth.
