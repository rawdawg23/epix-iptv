-- Site Editor (WP-style): content managed by admin. Run after schema-tickets.sql.

-- Single row: site-wide config (brand, contact, payment, etc.)
CREATE TABLE IF NOT EXISTS editor_site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  config_json JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pages (about, contact, custom landing, etc.)
CREATE TABLE IF NOT EXISTS editor_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  body_md TEXT NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  order_num INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pricing plans
CREATE TABLE IF NOT EXISTS editor_pricing (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_period TEXT NOT NULL DEFAULT 'monthly',
  description TEXT NOT NULL DEFAULT '',
  features_json JSONB NOT NULL DEFAULT '[]',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  cta_text TEXT NOT NULL DEFAULT 'Subscribe Now',
  order_num INT NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS editor_faq (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  category TEXT,
  order_num INT NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Global SEO defaults (used when page/post doesn't set its own)
CREATE TABLE IF NOT EXISTS editor_seo_defaults (
  id TEXT PRIMARY KEY DEFAULT 'global',
  default_meta_title TEXT,
  default_meta_description TEXT,
  default_focus_keyword TEXT,
  og_image_url TEXT,
  twitter_handle TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editor_pages_slug ON editor_pages(slug);
CREATE INDEX IF NOT EXISTS idx_editor_pages_order ON editor_pages(order_num);
CREATE INDEX IF NOT EXISTS idx_editor_pricing_order ON editor_pricing(order_num);
CREATE INDEX IF NOT EXISTS idx_editor_faq_order ON editor_faq(order_num);

-- Seed one row so config exists
INSERT INTO editor_site_config (id, config_json) VALUES ('main', '{}')
ON CONFLICT (id) DO NOTHING;
INSERT INTO editor_seo_defaults (id) VALUES ('global')
ON CONFLICT (id) DO NOTHING;
