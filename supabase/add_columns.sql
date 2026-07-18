-- ─────────────────────────────────────────────────────────────────────────────
-- Friday Morning International — Add Spec + Enquiry Columns (Updated)
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Changed: specifications stored as flexible JSONB array [{label, value}]
-- instead of fixed individual columns — allows any custom spec fields.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── PRODUCT SPECIFICATIONS ──────────────────────────────────────────────────
-- Drop fixed columns if they were already added from the old migration
ALTER TABLE products DROP COLUMN IF EXISTS material;
ALTER TABLE products DROP COLUMN IF EXISTS dimensions;
ALTER TABLE products DROP COLUMN IF EXISTS weight;
ALTER TABLE products DROP COLUMN IF EXISTS finish;
ALTER TABLE products DROP COLUMN IF EXISTS care_instructions;

-- Add flexible JSONB column: stores [{label: "Material", value: "Cast Aluminium"}, ...]
ALTER TABLE products ADD COLUMN IF NOT EXISTS
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb;

-- ─── CONTACT SUBMISSIONS — ENQUIRY TRACKING ──────────────────────────────────
-- Allow phone-only enquiries from the product enquiry modal
ALTER TABLE contact_submissions ALTER COLUMN email DROP NOT NULL;

-- Link enquiry to the specific product it came from
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS
  product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- Distinguish product enquiry vs. general contact form submission
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS
  inquiry_type TEXT DEFAULT 'general';

-- Track whether a Resend notification email was sent for this row
-- false = duplicate-window suppression (row is saved, no email dispatched)
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS
  notification_sent BOOLEAN NOT NULL DEFAULT true;

-- ─── VERIFY ──────────────────────────────────────────────────────────────────

SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('products', 'contact_submissions')
  AND column_name IN ('specifications','product_id','inquiry_type','notification_sent','email')
ORDER BY table_name, column_name;
