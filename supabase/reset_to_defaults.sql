-- ─────────────────────────────────────────────────────────────────────────────
-- Friday Morning International — RESET TO DEFAULTS
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- ⚠️  WARNING: This wipes ALL products, categories, banners, and reviews
--     and restores them to the original seed state with real image paths.
--
--     Contact submissions and newsletter signups are NOT cleared
--     (they are real customer data — delete those manually if needed).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── STEP 1: CLEAR CONTENT TABLES (order matters for FK constraints) ─────────

TRUNCATE TABLE product_images   RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews          RESTART IDENTITY CASCADE;
DELETE FROM products;           -- CASCADE deletes product_images too
DELETE FROM categories;         -- CASCADE nullifies product.category_id
DELETE FROM banners;

-- ─── STEP 2: RE-SEED CATEGORIES ──────────────────────────────────────────────

INSERT INTO categories (name, slug, cover_image_url, show_in_navbar, is_featured, sort_order) VALUES
  ('Candle Holders',          'candle-holders',     '/items/FM130A.png',    true,  true,  1),
  ('Cake Stands & Trays',     'cake-stands-trays',  '/items/FMI 393A.jpg',  true,  true,  2),
  ('Urlis & Decorative Bowls','urlis-bowls',        '/items/Fm968.png',     true,  true,  3),
  ('Decor Figurines',         'decor-figurines',    '/items/FMI 612A.png',  true,  true,  4),
  ('Serving Sets',            'serving-sets',       '/items/Fm960.png',     false, false, 5);

-- ─── STEP 3: RE-SEED PRODUCTS ────────────────────────────────────────────────

-- 1. Stag Head Taper Candle Holder (FM130)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Stag Head Taper Candle Holder', 'stag-head-taper-candle-holder',
  (SELECT id FROM categories WHERE slug = 'candle-holders'),
  'A striking statement piece cast in solid aluminium and finished in warm gold, this taper candle holder features a majestic stag head midway up its slender stem. The antlered silhouette adds a touch of woodland grandeur to any dining table, mantelpiece, or entry console — equally at home in a rustic-chic interior and a contemporary maximalist space. Each piece is individually hand-finished by artisans in Moradabad.',
  2499, 1999, true, true;

-- 2. Bird-on-Stem Tealight Stand (FMI 251)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Bird-on-Stem Tealight Stand', 'bird-on-stem-tealight-stand',
  (SELECT id FROM categories WHERE slug = 'candle-holders'),
  'Inspired by the delicate beauty of nature, this tealight stand features a tiny sparrow perched atop a circular platform, supported by a graceful rose-thorn stem. Crafted from aluminium with a hand-applied gold finish, it casts a warm glow that brings the outdoors inside. A perfect gift for home-lovers and nature enthusiasts alike.',
  1799, null, false, true;

-- 3. Seven-Branch Gold Candelabra (Fm252)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Seven-Branch Gold Candelabra', 'seven-branch-gold-candelabra',
  (SELECT id FROM categories WHERE slug = 'candle-holders'),
  'Inspired by the ancient menorah, this seven-branched candelabra is cast in aluminium and finished in a lustrous antique gold. The symmetrical arching arms and solid circular base give it a ceremonial weight and presence. Use it as a bold centrepiece on a long dining table or as an arresting accent on a sideboard — lit or unlit, it commands the room.',
  3299, 2799, false, true;

-- 4. Three-Tier Lotus Petal Cake Stand (FMI 393)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Three-Tier Lotus Petal Cake Stand', 'three-tier-lotus-petal-cake-stand',
  (SELECT id FROM categories WHERE slug = 'cake-stands-trays'),
  'Three tiers of lotus-petal platters rise from a twisted branch-form stem, crowned with a flourish of cast leaves. Each tier is shaped with the soft, irregular edges of a real flower petal, pressed with delicate vein detail. Whether displaying petit fours at a wedding or dried botanicals in a living room vignette, this stand transforms the everyday into an occasion. Entirely hand-cast in Moradabad brass with a gold finish.',
  4999, 3999, true, true;

-- 5. Monstera Leaf Sculpture on Stand (FMI 612)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Monstera Leaf Sculpture on Stand', 'monstera-leaf-sculpture',
  (SELECT id FROM categories WHERE slug = 'decor-figurines'),
  'The iconic split leaf of the Monstera deliciosa, faithfully recreated in cast aluminium with every vein and perforation intact. The leaf rests on a small circular pedestal, finished in bright gold. A bold botanical statement for a bookshelf, coffee table, or plant-lover''s corner — no sunlight required. Part of our Botanica collection, celebrating the organic forms that have inspired metalwork artisans across centuries.',
  2999, null, true, true;

-- 6. Peony Blossom Tray & Dual Bowl Set (Fm960)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Peony Blossom Tray & Dual Bowl Set', 'peony-blossom-tray-dual-bowl-set',
  (SELECT id FROM categories WHERE slug = 'serving-sets'),
  'Two generous peony-shaped bowls nestle into a handled rectangular serving tray, all cast in a single warm-gold aluminium finish. The blossom bowls feature deeply pressed petal detail, making them as decorative as they are functional — perfect for serving dry fruits, sweets, or potpourri. A thoughtful wedding or housewarming gift that sits beautifully on any table.',
  3799, 2999, false, true;

-- 7. Angled Peony Tray & Bowl Set (Fm961)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Angled Peony Tray & Bowl Set', 'angled-peony-tray-bowl-set',
  (SELECT id FROM categories WHERE slug = 'serving-sets'),
  'A slightly different silhouette to our Peony Blossom set — the tray here features a deeper texture and the twin bowls sit at an elevated angle, giving a dynamic, sculpted appearance when viewed from the side. Gold-finished, hand-cast aluminium from our Moradabad workshop. Ideal as a centrepiece serving set or a jewellery/keys tray by the entryway.',
  3599, null, false, true;

-- 8. Large Peony Urli Decorative Plate (Fm968)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Large Peony Urli Decorative Plate', 'large-peony-urli-plate',
  (SELECT id FROM categories WHERE slug = 'urlis-bowls'),
  'A broad, shallow urli cast in the form of a fully open peony flower, with a central bud bowl rising from the heart of the blossom. At over 30 cm across, this piece has the presence of a sculptural centrepiece — float marigolds in it for a festive table, or let it stand alone as a wall or shelf accent. The hand-applied gold finish reveals the artisan''s touch in every petal ridge.',
  3499, 2799, true, true;

-- 9. Layered Lotus Urli Bowl (Fm969)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Layered Lotus Urli Bowl', 'layered-lotus-urli-bowl',
  (SELECT id FROM categories WHERE slug = 'urlis-bowls'),
  'Two concentric tiers of lotus petals form this graceful urli — a wide outer rim of broad petals cradling a smaller inner bowl, all in radiant gold-finish aluminium. The traditional urli form, used in Indian homes for centuries to float flowers and candles, here receives an artisanal interpretation that fits equally in a modern apartment or a heritage haveli. A serene, contemplative object.',
  3999, 3299, true, true;

-- 10. Classic Round Urli Bowl (Fm970)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Classic Round Urli Bowl', 'classic-round-urli-bowl',
  (SELECT id FROM categories WHERE slug = 'urlis-bowls'),
  'The most classic urli form in our collection — a deep, round bowl with a wide flared rim, cast in solid aluminium and finished in aged gold. Simple enough to complement any interior, substantial enough to anchor a dining table or a puja space. Fill it with water and floating candles for an instant atmosphere, or use it as a fruit bowl that doubles as art.',
  2799, null, false, true;

-- 11. Branch & Bloom Urli Bowl (Fm983)
INSERT INTO products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
SELECT 'Branch & Bloom Urli Bowl', 'branch-bloom-urli-bowl',
  (SELECT id FROM categories WHERE slug = 'urlis-bowls'),
  'A peony-blossom bowl elevated on a tripod of cast branches — this is one of our most sculptural urli designs. The organic branch legs give it an airy quality, as if the blossom has just settled on a bed of stems. In gold-finish aluminium, it works as a standalone decorative object as much as a functional bowl for flowers, candles, or offerings. A favourite among our collectors.',
  3299, 2599, true, true;

-- ─── STEP 4: RE-SEED PRODUCT IMAGES (real local paths) ───────────────────────

-- FM130 — Stag Head (5 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FM130A.png', 0, true  FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130C.png', 1, false FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130D.png', 2, false FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130E.png', 3, false FROM products WHERE slug = 'stag-head-taper-candle-holder' UNION ALL
SELECT id, '/items/FM130F.png', 4, false FROM products WHERE slug = 'stag-head-taper-candle-holder';

-- FMI 251 — Bird-on-Stem (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FMI 251.jpg', 0, true  FROM products WHERE slug = 'bird-on-stem-tealight-stand' UNION ALL
SELECT id, '/items/FMI 252.jpg', 1, false FROM products WHERE slug = 'bird-on-stem-tealight-stand';

-- Fm252 — Seven-Branch Candelabra (3 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm252A.png', 0, true  FROM products WHERE slug = 'seven-branch-gold-candelabra' UNION ALL
SELECT id, '/items/Fm252B.png', 1, false FROM products WHERE slug = 'seven-branch-gold-candelabra' UNION ALL
SELECT id, '/items/Fm252C.png', 2, false FROM products WHERE slug = 'seven-branch-gold-candelabra';

-- FMI 393 — Three-Tier Cake Stand (4 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FMI 393A.jpg', 0, true  FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand' UNION ALL
SELECT id, '/items/FMI 393C.jpg', 1, false FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand' UNION ALL
SELECT id, '/items/FMI 393D.jpg', 2, false FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand' UNION ALL
SELECT id, '/items/FMI 393E.jpg', 3, false FROM products WHERE slug = 'three-tier-lotus-petal-cake-stand';

-- FMI 612 — Monstera Sculpture (5 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/FMI 612A.png', 0, true  FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612B.png', 1, false FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612C.png', 2, false FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612D.png', 3, false FROM products WHERE slug = 'monstera-leaf-sculpture' UNION ALL
SELECT id, '/items/FMI 612E.png', 4, false FROM products WHERE slug = 'monstera-leaf-sculpture';

-- Fm960 — Peony Tray (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm960.png',  0, true  FROM products WHERE slug = 'peony-blossom-tray-dual-bowl-set' UNION ALL
SELECT id, '/items/Fm960B.png', 1, false FROM products WHERE slug = 'peony-blossom-tray-dual-bowl-set';

-- Fm961 — Angled Peony Tray (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm961.png',  0, true  FROM products WHERE slug = 'angled-peony-tray-bowl-set' UNION ALL
SELECT id, '/items/Fm961C.png', 1, false FROM products WHERE slug = 'angled-peony-tray-bowl-set';

-- Fm968 — Large Peony Urli (1 view)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm968.png', 0, true FROM products WHERE slug = 'large-peony-urli-plate';

-- Fm969 — Layered Lotus Urli (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm969.png',  0, true  FROM products WHERE slug = 'layered-lotus-urli-bowl' UNION ALL
SELECT id, '/items/Fm969B.png', 1, false FROM products WHERE slug = 'layered-lotus-urli-bowl';

-- Fm970 — Classic Round Urli (2 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm970.png',  0, true  FROM products WHERE slug = 'classic-round-urli-bowl' UNION ALL
SELECT id, '/items/Fm970D.png', 1, false FROM products WHERE slug = 'classic-round-urli-bowl';

-- Fm983 — Branch & Bloom Urli (4 views)
INSERT INTO product_images (product_id, cloudinary_url, sort_order, is_primary)
SELECT id, '/items/Fm983.png',  0, true  FROM products WHERE slug = 'branch-bloom-urli-bowl' UNION ALL
SELECT id, '/items/Fm983A.png', 1, false FROM products WHERE slug = 'branch-bloom-urli-bowl' UNION ALL
SELECT id, '/items/Fm983B.png', 2, false FROM products WHERE slug = 'branch-bloom-urli-bowl' UNION ALL
SELECT id, '/items/Fm983C.png', 3, false FROM products WHERE slug = 'branch-bloom-urli-bowl';

-- ─── STEP 5: RE-SEED REVIEWS ─────────────────────────────────────────────────

INSERT INTO reviews (customer_name, rating, review_text, status) VALUES
  ('Priya Sharma', 5, 'Absolutely stunning quality. The Stag Head candle holder was even more beautiful in person — the gold finish is rich and warm, not cheap or brassy. It now sits on my dining table and every guest asks about it. Friday Morning International clearly takes craftsmanship seriously.', 'approved'),
  ('Rohan Mehra',  5, 'Ordered the Three-Tier Lotus Cake Stand for my mother''s birthday. She was speechless. The packaging was impeccable, the piece arrived perfectly safe, and the level of detail in the petal work is remarkable. This is heirloom-quality home décor at a very reasonable price.', 'approved'),
  ('Ananya Kapoor',4, 'The Monstera Leaf Sculpture is a real conversation starter. It''s weighty, solid aluminium — you can feel the quality the moment you pick it up. Docked one star only because delivery took a day longer than expected, but the product itself is a 5-star piece without question.', 'approved'),
  ('Vikram Bose',  5, 'I''ve been collecting brass and aluminium décor for years, and Friday Morning International stands out for their designs. The Branch & Bloom Urli is extraordinary — the tripod legs look almost alive. Bought three pieces now and each one has exceeded expectations.', 'approved');

-- ─── STEP 6: RE-SEED HERO BANNERS (real local image paths) ───────────────────

INSERT INTO banners (cloudinary_url, headline, subheadline, cta_text, cta_link, sort_order, is_active) VALUES
  ('/banner1.jpg', 'The Art of the Everyday',    'Handcrafted brass & aluminium décor from the heart of Moradabad.', 'Explore Collection', '/category/candle-holders',    1, true),
  ('/banner2.jpg', 'Born of the Brass City',     'Centuries of artisan tradition. Crafted for modern homes.',        'Discover Our Story',  '/#story',                     2, true),
  ('/banner3.jpg', 'Trending This Season',        'Our most sought-after pieces, curated for discerning tastes.',    'Shop Trending',       '/#trending',                  3, true),
  ('/banner4.jpg', 'Elevated Entertaining',       'Cake stands and serving trays that turn every table into a tableau.', 'Shop Cake Stands', '/category/cake-stands-trays', 4, true);

-- ─── VERIFY ───────────────────────────────────────────────────────────────────

SELECT 'categories'     AS table_name, COUNT(*) AS rows FROM categories
UNION ALL
SELECT 'products',        COUNT(*) FROM products
UNION ALL
SELECT 'product_images',  COUNT(*) FROM product_images
UNION ALL
SELECT 'reviews',         COUNT(*) FROM reviews
UNION ALL
SELECT 'banners',         COUNT(*) FROM banners;
