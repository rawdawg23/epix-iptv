# Store (full ecommerce control)

Products, cart, checkout, and orders with full admin control.

## Database (Firebase Firestore)

Store data lives in Firestore. Collections:

- **products** – Name, slug, description, price_cents, SKU, image_url, stock_quantity, track_inventory, is_active, SEO
- **orders** – order_number, email, status, totals, shipping_address_json, etc. Subcollection **items** per order
- **coupons** – Doc id = code (e.g. SAVE10); fields: discount_value_cents, min_order_cents, is_active, expires_at, used_count

No SQL migrations. See `docs/FIREBASE_VERCEL.md` for Firebase + Vercel setup.

## Storefront (public)

| Page | Description |
|------|-------------|
| `/store` | Product grid (from API) |
| `/store/product?slug=xxx` | Product detail, add to cart |
| `/store/cart` | Cart (localStorage), total, link to checkout |
| `/store/checkout` | Email, shipping, coupon, notes → place order |
| `/store/order-confirmation?order=...&email=...` | Thank you + order ref |

Cart is stored in **localStorage** (`store_cart`). Checkout POSTs to `/api/store/checkout` and creates an order; then redirects to confirmation.

## API

### Public

- **GET /api/store/products** – List active products (optional `?category=id`)
- **GET /api/store/products/[slug]** – One product by slug
- **POST /api/store/checkout** – Create order. Body: `email`, `items: [{ productId, quantity }]`, `shippingAddress`, `billingAddress`, `coupon?`, `notes?`. Returns `orderId`, `orderNumber`, `confirmationUrl`. Stock is decremented for tracked products.

### Admin (X-Admin-Secret)

- **GET/POST /api/editor/products** – List / create product
- **GET/PUT/DELETE /api/editor/products/[id]** – One product (full CRUD)
- **GET /api/editor/orders** – List orders (optional `?status=pending|paid|...`)
- **GET /api/editor/orders/[id]** – Order + items
- **PATCH /api/editor/orders/[id]** – Update status: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`

## Admin UI (Site Editor)

- **Store** – List products, add/edit (name, slug, description, image, price, compare-at, SKU, stock, track inventory, active, SEO)
- **Orders** – List (filter by status), view order detail, **update status** (e.g. mark paid, shipped, delivered)

## Order statuses

- **pending** – Created, not paid
- **paid** – Payment received
- **processing** – Being prepared
- **shipped** – Sent
- **delivered** – Completed
- **cancelled**

## Coupons

In `store_coupons`: `code`, `discount_type`, `discount_value_cents`, `min_order_cents`, `expires_at`, `is_active`. Checkout applies the discount when `coupon` is sent and valid; `used_count` is incremented.

## Payments

Checkout currently creates the order and returns a confirmation URL. To add Stripe/PayPal, create a payment session in the checkout API and return `paymentUrl`; after webhook confirmation, set order status to `paid` (and optionally set `paid_at`, `stripe_payment_id`, etc.).
