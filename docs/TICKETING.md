# Support Ticketing (WHMCS-style)

Customers and admins can create and reply to tickets. Both receive email notifications. Admin has full control: update status, delete tickets.

## Ticket statuses

- **open** – Active; customer and admin can reply.
- **resolved** – Marked resolved by admin; customer can still reply (ticket reopens on reply).
- **closed** – No more replies; customer cannot reply.

## API (admin auth)

All admin endpoints require header: `X-Admin-Secret: <ADMIN_SECRET>` (set in env).

### Customer

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets/create` | Create ticket. Body: `{ email, subject, message }`. Returns `ticketId`, `token`, `viewUrl`. |
| GET | `/api/tickets/[id]?token=...` | Get ticket + replies (customer must pass valid `token`). |
| POST | `/api/tickets/[id]/reply` | Add reply. Body: `{ message, token }`. Customer cannot reply if ticket is **closed**. |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/tickets` | List all tickets (newest first). |
| GET | `/api/admin/tickets/[id]` | Get one ticket + replies. |
| PATCH | `/api/admin/tickets/[id]` | Update status. Body: `{ status: "open" \| "resolved" \| "closed" }`. |
| DELETE | `/api/admin/tickets/[id]` | Delete ticket and all replies (irreversible). |
| POST | `/api/tickets/[id]/reply` | Add admin reply (same as customer endpoint with `X-Admin-Secret`). |

## Environment

- `POSTGRES_URL` or `DATABASE_URL` – Postgres connection string.
- `RESEND_API_KEY` – Resend API key for emails.
- `SUPPORT_EMAIL_FROM` / `ADMIN_EMAIL` – From address and admin notification address.
- `ADMIN_SECRET` – Secret for `X-Admin-Secret` header (admin API and reply as admin).
- `SITE_URL` or `VERCEL_URL` – Base URL for links in emails.
- `BRAND_NAME` – Optional; used in customer-facing emails.

## Database (Firebase Firestore)

Tickets use Firestore: collection `tickets` (doc id = ticket id), subcollection `replies` per ticket. No SQL to run. See `docs/FIREBASE_VERCEL.md` for Firebase + Vercel setup.
