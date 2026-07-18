-- ─────────────────────────────────────────────────────────────────────────────
-- Friday Morning International — Real Image URLs
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- This replaces all placehold.co placeholder images with real local image
-- paths served from the /public folder. Works on both dev and production.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. HERO BANNERS ─────────────────────────────────────────────────────────

UPDATE banners SET cloudinary_url = '/banner1.jpg'
  WHERE headline = 'The Art of the Everyday';

UPDATE banners SET cloudinary_url = '/banner2.jpg'
  WHERE headline = 'Born of the Brass City';

UPDATE banners SET cloudinary_url = '/banner3.jpg'
  WHERE headline = 'Trending This Season';

UPDATE banners SET cloudinary_url = '/banner4.jpg'
  WHERE headline = 'Elevated Entertaining';

-- ─── 2. CATEGORY COVER IMAGES ────────────────────────────────────────────────

UPDATE categories SET cover_image_url = '/items/FM130A.png'
  WHERE slug = 'candle-holders';

UPDATE categories SET cover_image_url = '/items/FMI 393A.jpg'
  WHERE slug = 'cake-stands-trays';

UPDATE categories SET cover_image_url = '/items/Fm968.png'
  WHERE slug = 'urlis-bowls';

UPDATE categories SET cover_image_url = '/items/FMI 612A.png'
  WHERE slug = 'decor-figurines';

UPDATE categories SET cover_image_url = '/items/Fm960.png'
  WHERE slug = 'serving-sets';

-- ─── 3. PRODUCT IMAGES ───────────────────────────────────────────────────────
-- First wipe placeholder rows (safe — leaves any real Cloudinary URLs untouched)

DELETE FROM product_images
  WHERE cloudinary_url LIKE '%placehold.co%';

-- FM130 — Stag Head Taper Candle Holder (5 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FM130A.png', 0, true  FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130C.png', 1, false FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130D.png', 2, false FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130E.png', 3, false FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130F.png', 4, false FROM products WHERE slug = 'stag-head-taper-candle-holder';

-- FMI 251 — Bird-on-Stem Tealight Stand (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FMI 251.jpg', 0, true  FROM products WHERE slug = 'bird-on-stem-tealight-stand' UNION ALL
SELECT id, '/items/FMI 252.jpg', 1, false FROM products WHERE slug = 'bird-on-stem-tealight-stand';

-- Fm252 — Seven-Branch Gold Candelabra (3 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm252A.png', 0, true  FROM products WHERE slug = 'seven-branch-gold-candelabra' UNION ALL
SELECT id, '/items/Fm252B.png', 1, false FROM products WHERE slug = 'seven-branch-gold-candelabra' UNION ALL
SELECT id, '/items/Fm252C.png', 2, false FROM products WHERE slug = 'seven-branch-gold-candelabra';

-- FMI 393 — Three-Tier Lotus Petal Cake Stand (4 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FMI 393A.jpg', 0, true  FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand' UNION ALL
SELECT id, '/items/FMI 393C.jpg', 1, false FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand' UNION ALL
SELECT id, '/items/FMI 393D.jpg', 2, false FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand' UNION ALL
SELECT id, '/items/FMI 393E.jpg', 3, false FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand';

-- FMI 612 — Monstera Leaf Sculpture on Stand (5 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FMI 612A.png', 0, true  FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612B.png', 1, false FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612C.png', 2, false FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612D.png', 3, false FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612E.png', 4, false FROM products WHERE slug = 'monstera-leaf-sculpture';

-- Fm960 — Peony Blossom Tray & Dual Bowl Set (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm960.png',  0, true  FROM products WHERE slug = 'peony-blossom-tray-dual-bowl-set' UNION ALL
SELECT id, '/items/Fm960B.png', 1, false FROM products WHERE slug = 'peony-blossom-tray-dual-bowl-set';

-- Fm961 — Angled Peony Tray & Bowl Set (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm961.png',  0, true  FROM products WHERE slug = 'angled-peony-tray-bowl-set' UNION ALL
SELECT id, '/items/Fm961C.png', 1, false FROM products WHERE slug = 'angled-peony-tray-bowl-set';

-- Fm968 — Large Peony Urli Decorative Plate (1 view)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm968.png', 0, true FROM products WHERE slug = 'large-peony-urli-plate';

-- Fm969 — Layered Lotus Urli Bowl (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm969.png',  0, true  FROM products WHERE slug = 'layered-lotus-urli-bowl' UNION ALL
SELECT id, '/items/Fm969B.png', 1, false FROM products WHERE slug = 'layered-lotus-urli-bowl';

-- Fm970 — Classic Round Urli Bowl (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm970.png',  0, true  FROM products WHERE slug = 'classic-round-urli-bowl' UNION ALL
SELECT id, '/items/Fm970D.png', 1, false FROM products WHERE slug = 'classic-round-urli-bowl';

-- Fm983 — Branch & Bloom Urli Bowl (4 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm983.png',  0, true  FROM products WHERE slug = 'branch-bloom-urli-bowl' UNION ALL
SELECT id, '/items/Fm983A.png', 1, false FROM products WHERE slug = 'branch-bloom-urli-bowl' UNION ALL
SELECT id, '/items/Fm983B.png', 2, false FROM products WHERE slug = 'branch-bloom-urli-bowl' UNION ALL
SELECT id, '/items/Fm983C.png', 3, false FROM products WHERE slug = 'branch-bloom-urli-bowl';

-- ─── VERIFY ───────────────────────────────────────────────────────────────────
SELECT 'banners' as tbl, count(*) as updated FROM banners WHERE cloudinary_url LIKE '/banner%'
UNION ALL
SELECT 'categories', count(*) FROM categories WHERE cover_image_url LIKE '/items/%'
UNION ALL
SELECT 'product_images', count(*) FROM product_images WHERE cloudinary_url LIKE '/items/%';
