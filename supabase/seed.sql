-- ─────────────────────────────────────────────────────────────────
-- Friday Morning International — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- NOTE: All prices are PLACEHOLDER values — please review and update
--       before going live. They are marked with -- ★ PRICE PLACEHOLDER
-- NOTE: Cloudinary URLs below are PLACEHOLDER. After you upload images
--       via the admin panel or Cloudinary dashboard, update these rows
--       with the real URLs returned by Cloudinary.
-- ─────────────────────────────────────────────────────────────────

-- ─── CATEGORIES ──────────────────────────────────────────────────
insert into categories (name, slug, cover_image_url, show_in_navbar, is_featured, sort_order) values
  ('Candle Holders',        'candle-holders',     'https://placehold.co/800x1000/D4A853/FFFCF8?text=Candle+Holders',    true, true,  1),
  ('Cake Stands & Trays',   'cake-stands-trays',  'https://placehold.co/800x1000/B87333/FFFCF8?text=Cake+Stands',       true, true,  2),
  ('Urlis & Decorative Bowls','urlis-bowls',       'https://placehold.co/800x1000/8B5E3C/FFFCF8?text=Urlis+%26+Bowls',  true, true,  3),
  ('Decor Figurines',       'decor-figurines',    'https://placehold.co/800x1000/D4A853/FFFCF8?text=Decor+Figurines',   true, true,  4),
  ('Serving Sets',          'serving-sets',       'https://placehold.co/800x1000/B87333/FFFCF8?text=Serving+Sets',      false, false, 5)
on conflict (slug) do nothing;

-- ─── PRODUCTS ────────────────────────────────────────────────────
-- 1. Stag Head Taper Candle Holder (FM130)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Stag Head Taper Candle Holder',
  'stag-head-taper-candle-holder',
  (select id from categories where slug = 'candle-holders'),
  'A striking statement piece cast in solid aluminium and finished in warm gold, this taper candle holder features a majestic stag head midway up its slender stem. The antlered silhouette adds a touch of woodland grandeur to any dining table, mantelpiece, or entry console — equally at home in a rustic-chic interior and a contemporary maximalist space. Each piece is individually hand-finished by artisans in Moradabad.',
  2499, -- ★ PRICE PLACEHOLDER
  1999, -- ★ PRICE PLACEHOLDER (discount)
  true,
  true
where not exists (select 1 from products where slug = 'stag-head-taper-candle-holder');

-- 2. Bird-on-Stem Tealight Stand (FMI 251)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Bird-on-Stem Tealight Stand',
  'bird-on-stem-tealight-stand',
  (select id from categories where slug = 'candle-holders'),
  'Inspired by the delicate beauty of nature, this tealight stand features a tiny sparrow perched atop a circular platform, supported by a graceful rose-thorn stem. Crafted from aluminium with a hand-applied gold finish, it casts a warm glow that brings the outdoors inside. A perfect gift for home-lovers and nature enthusiasts alike.',
  1799, -- ★ PRICE PLACEHOLDER
  null,
  false,
  true
where not exists (select 1 from products where slug = 'bird-on-stem-tealight-stand');

-- 3. Seven-Branch Candelabra (Fm252)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Seven-Branch Gold Candelabra',
  'seven-branch-gold-candelabra',
  (select id from categories where slug = 'candle-holders'),
  'Inspired by the ancient menorah, this seven-branched candelabra is cast in aluminium and finished in a lustrous antique gold. The symmetrical arching arms and solid circular base give it a ceremonial weight and presence. Use it as a bold centrepiece on a long dining table or as an arresting accent on a sideboard — lit or unlit, it commands the room.',
  3299, -- ★ PRICE PLACEHOLDER
  2799, -- ★ PRICE PLACEHOLDER
  false,
  true
where not exists (select 1 from products where slug = 'seven-branch-gold-candelabra');

-- 4. Three-Tier Floral Cake Stand (FMI 393)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Three-Tier Lotus Petal Cake Stand',
  'three-tier-lotus-petal-cake-stand',
  (select id from categories where slug = 'cake-stands-trays'),
  'Three tiers of lotus-petal platters rise from a twisted branch-form stem, crowned with a flourish of cast leaves. Each tier is shaped with the soft, irregular edges of a real flower petal, pressed with delicate vein detail. Whether displaying petit fours at a wedding or dried botanicals in a living room vignette, this stand transforms the everyday into an occasion. Entirely hand-cast in Moradabad brass with a gold finish.',
  4999, -- ★ PRICE PLACEHOLDER
  3999, -- ★ PRICE PLACEHOLDER
  true,
  true
where not exists (select 1 from products where slug = 'three-tier-lotus-petal-cake-stand');

-- 5. Monstera Leaf Sculpture (FMI 612)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Monstera Leaf Sculpture on Stand',
  'monstera-leaf-sculpture',
  (select id from categories where slug = 'decor-figurines'),
  'The iconic split leaf of the Monstera deliciosa, faithfully recreated in cast aluminium with every vein and perforation intact. The leaf rests on a small circular pedestal, finished in bright gold. A bold botanical statement for a bookshelf, coffee table, or plant-lover''s corner — no sunlight required. Part of our Botanica collection, celebrating the organic forms that have inspired metalwork artisans across centuries.',
  2999, -- ★ PRICE PLACEHOLDER
  null,
  true,
  true
where not exists (select 1 from products where slug = 'monstera-leaf-sculpture');

-- 6. Peony Tray with Twin Bowls — Flat View (Fm960)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Peony Blossom Tray & Dual Bowl Set',
  'peony-blossom-tray-dual-bowl-set',
  (select id from categories where slug = 'serving-sets'),
  'Two generous peony-shaped bowls nestle into a handled rectangular serving tray, all cast in a single warm-gold aluminium finish. The blossom bowls feature deeply pressed petal detail, making them as decorative as they are functional — perfect for serving dry fruits, sweets, or potpourri. A thoughtful wedding or housewarming gift that sits beautifully on any table.',
  3799, -- ★ PRICE PLACEHOLDER
  2999, -- ★ PRICE PLACEHOLDER
  false,
  true
where not exists (select 1 from products where slug = 'peony-blossom-tray-dual-bowl-set');

-- 7. Floral Tray with Dual Bowls — Angle View (Fm961)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Angled Peony Tray & Bowl Set',
  'angled-peony-tray-bowl-set',
  (select id from categories where slug = 'serving-sets'),
  'A slightly different silhouette to our Peony Blossom set — the tray here features a deeper texture and the twin bowls sit at an elevated angle, giving a dynamic, sculpted appearance when viewed from the side. Gold-finished, hand-cast aluminium from our Moradabad workshop. Ideal as a centrepiece serving set or a jewellery/keys tray by the entryway.',
  3599, -- ★ PRICE PLACEHOLDER
  null,
  false,
  true
where not exists (select 1 from products where slug = 'angled-peony-tray-bowl-set');

-- 8. Large Peony Urli Plate (Fm968)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Large Peony Urli Decorative Plate',
  'large-peony-urli-plate',
  (select id from categories where slug = 'urlis-bowls'),
  'A broad, shallow urli cast in the form of a fully open peony flower, with a central bud bowl rising from the heart of the blossom. At over 30 cm across, this piece has the presence of a sculptural centrepiece — float marigolds in it for a festive table, or let it stand alone as a wall or shelf accent. The hand-applied gold finish reveals the artisan''s touch in every petal ridge.',
  3499, -- ★ PRICE PLACEHOLDER
  2799, -- ★ PRICE PLACEHOLDER
  true,
  true
where not exists (select 1 from products where slug = 'large-peony-urli-plate');

-- 9. Layered Lotus Urli (Fm969)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Layered Lotus Urli Bowl',
  'layered-lotus-urli-bowl',
  (select id from categories where slug = 'urlis-bowls'),
  'Two concentric tiers of lotus petals form this graceful urli — a wide outer rim of broad petals cradling a smaller inner bowl, all in radiant gold-finish aluminium. The traditional urli form, used in Indian homes for centuries to float flowers and candles, here receives an artisanal interpretation that fits equally in a modern apartment or a heritage haveli. A serene, contemplative object.',
  3999, -- ★ PRICE PLACEHOLDER
  3299, -- ★ PRICE PLACEHOLDER
  true,
  true
where not exists (select 1 from products where slug = 'layered-lotus-urli-bowl');

-- 10. Ornate Round Urli (Fm970)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Classic Round Urli Bowl',
  'classic-round-urli-bowl',
  (select id from categories where slug = 'urlis-bowls'),
  'The most classic urli form in our collection — a deep, round bowl with a wide flared rim, cast in solid aluminium and finished in aged gold. Simple enough to complement any interior, substantial enough to anchor a dining table or a puja space. Fill it with water and floating candles for an instant atmosphere, or use it as a fruit bowl that doubles as art.',
  2799, -- ★ PRICE PLACEHOLDER
  null,
  false,
  true
where not exists (select 1 from products where slug = 'classic-round-urli-bowl');

-- 11. Branch & Bloom Urli Bowl (Fm983)
insert into products (name, slug, category_id, description, price, discount_price, is_trending, is_active)
select
  'Branch & Bloom Urli Bowl',
  'branch-bloom-urli-bowl',
  (select id from categories where slug = 'urlis-bowls'),
  'A peony-blossom bowl elevated on a tripod of cast branches — this is one of our most sculptural urli designs. The organic branch legs give it an airy quality, as if the blossom has just settled on a bed of stems. In gold-finish aluminium, it works as a standalone decorative object as much as a functional bowl for flowers, candles, or offerings. A favourite among our collectors.',
  3299, -- ★ PRICE PLACEHOLDER
  2599, -- ★ PRICE PLACEHOLDER
  true,
  true
where not exists (select 1 from products where slug = 'branch-bloom-urli-bowl');

-- ─── PRODUCT IMAGES (placeholder URLs — replace with real Cloudinary URLs after upload) ─
-- NOTE: After uploading images via the Admin Panel, delete these placeholder rows
--       and use the real Cloudinary URLs saved by the admin interface.
--       Placeholder format: first image = primary (sort_order=0, is_primary=true)

-- FM130 — Stag Head Taper Candle Holder
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=FM130A', 0, true  from products where slug='stag-head-taper-candle-holder'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=FM130C', 1, false from products where slug='stag-head-taper-candle-holder';

-- FMI 251 — Bird-on-Stem
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=FMI+251', 0, true from products where slug='bird-on-stem-tealight-stand'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=FMI+252', 1, false from products where slug='bird-on-stem-tealight-stand';

-- Fm252 — Seven-Branch Candelabra
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm252A', 0, true from products where slug='seven-branch-gold-candelabra'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=Fm252B', 1, false from products where slug='seven-branch-gold-candelabra';

-- FMI 393 — Three-Tier Cake Stand
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=FMI+393A', 0, true from products where slug='three-tier-lotus-petal-cake-stand'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=FMI+393C', 1, false from products where slug='three-tier-lotus-petal-cake-stand';

-- FMI 612 — Monstera
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=FMI+612A', 0, true from products where slug='monstera-leaf-sculpture'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=FMI+612B', 1, false from products where slug='monstera-leaf-sculpture';

-- Fm960
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm960', 0, true from products where slug='peony-blossom-tray-dual-bowl-set'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=Fm960B', 1, false from products where slug='peony-blossom-tray-dual-bowl-set';

-- Fm961
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm961', 0, true from products where slug='angled-peony-tray-bowl-set'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=Fm961C', 1, false from products where slug='angled-peony-tray-bowl-set';

-- Fm968
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm968', 0, true from products where slug='large-peony-urli-plate';

-- Fm969
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm969', 0, true from products where slug='layered-lotus-urli-bowl'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=Fm969B', 1, false from products where slug='layered-lotus-urli-bowl';

-- Fm970
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm970', 0, true from products where slug='classic-round-urli-bowl'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=Fm970D', 1, false from products where slug='classic-round-urli-bowl';

-- Fm983
insert into product_images (product_id, cloudinary_url, sort_order, is_primary)
select id, 'https://placehold.co/800x1000/D4A853/FFFCF8?text=Fm983', 0, true from products where slug='branch-bloom-urli-bowl'
union all
select id, 'https://placehold.co/800x1000/B87333/FFFCF8?text=Fm983A', 1, false from products where slug='branch-bloom-urli-bowl';

-- ─── SAMPLE REVIEWS ──────────────────────────────────────────────
insert into reviews (customer_name, rating, review_text, status) values
  ('Priya Sharma', 5, 'Absolutely stunning quality. The Stag Head candle holder was even more beautiful in person — the gold finish is rich and warm, not cheap or brassy. It now sits on my dining table and every guest asks about it. Friday Morning International clearly takes craftsmanship seriously.', 'approved'),
  ('Rohan Mehra', 5, 'Ordered the Three-Tier Lotus Cake Stand for my mother''s birthday. She was speechless. The packaging was impeccable, the piece arrived perfectly safe, and the level of detail in the petal work is remarkable. This is heirloom-quality home décor at a very reasonable price.', 'approved'),
  ('Ananya Kapoor', 4, 'The Monstera Leaf Sculpture is a real conversation starter. It''s weighty, solid aluminium — you can feel the quality the moment you pick it up. Docked one star only because delivery took a day longer than expected, but the product itself is a 5-star piece without question.', 'approved'),
  ('Vikram Bose', 5, 'I''ve been collecting brass and aluminium décor for years, and Friday Morning International stands out for their designs. The Branch & Bloom Urli is extraordinary — the tripod legs look almost alive. Bought three pieces now and each one has exceeded expectations.', 'approved')
on conflict do nothing;

-- ─── SAMPLE BANNERS ──────────────────────────────────────────────
-- Replace cloudinary_url values with real uploaded banner images
insert into banners (cloudinary_url, headline, subheadline, cta_text, cta_link, sort_order, is_active) values
  ('https://placehold.co/1920x800/8B5E3C/FFFCF8?text=Hero+Banner+1', 'The Art of the Everyday', 'Handcrafted brass & aluminium décor from the heart of Moradabad.', 'Explore Collection', '/category/candle-holders', 1, true),
  ('https://placehold.co/1920x800/B87333/FFFCF8?text=Hero+Banner+2', 'Born of the Brass City', 'Centuries of artisan tradition. Crafted for modern homes.', 'Discover Our Story', '/#story', 2, true),
  ('https://placehold.co/1920x800/D4A853/2C2417?text=Hero+Banner+3', 'Trending This Season', 'Our most sought-after pieces, curated for discerning tastes.', 'Shop Trending', '/#trending', 3, true),
  ('https://placehold.co/1920x800/2C2417/FFFCF8?text=Hero+Banner+4', 'Elevated Entertaining', 'Cake stands and serving trays that turn every table into a tableau.', 'Shop Cake Stands', '/category/cake-stands-trays', 4, true)
on conflict do nothing;
