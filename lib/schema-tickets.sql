-- Support tickets (WHMCS-style): run this against your Postgres (Vercel Postgres / Neon).

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',  -- open | resolved | closed
  customer_token TEXT NOT NULL UNIQUE,  -- secret for customer to view/reply via link
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_ticket_replies (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  from_role TEXT NOT NULL,  -- customer | admin
  from_email TEXT,          -- for customer replies; null for admin
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON support_ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON support_tickets(email);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_token ON support_tickets(customer_token);
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at ON support_tickets(updated_at DESC);
