-- ============================================================================
-- Kape Muna - Seed Data for Categories, Menu Items & Customizations
-- ============================================================================

-- Categories
insert into public.categories (id, name, icon, display_order) values
  ('all', 'All', 'Sparkles', 0),
  ('espresso', 'Espresso', 'Coffee', 1),
  ('cold-brew', 'Cold Brew', 'CupSoda', 2),
  ('pastries', 'Pastries', 'Croissant', 3),
  ('non-coffee', 'Non-Coffee', 'Milk', 4),
  ('sandwiches', 'Sandwiches', 'Layers', 5),
  ('desserts', 'Desserts', 'Cake', 6)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  display_order = excluded.display_order;

-- Customization Options (As defined in requirements)
-- 1. Sizes: 12oz (Base), 16oz (+₱20)
-- 2. Sweetness: 0%, 50%, 100%
-- 3. Milk: Whole Milk (Base), Oat Milk (+₱30), Almond Milk (+₱30)
-- 4. Espresso shots: Single (Base), Double (+₱25), Decaf (+₱0)

delete from public.customization_options;
insert into public.customization_options (id, group_type, name, price_modifier, is_default, display_order) values
  -- Sizes
  ('size-12oz', 'size', '12oz (Regular)', 0.00, true, 1),
  ('size-16oz', 'size', '16oz (Large)', 20.00, false, 2),

  -- Sweetness
  ('sweet-0', 'sweetness', '0% (Unsweetened)', 0.00, false, 1),
  ('sweet-50', 'sweetness', '50% (Less Sweet)', 0.00, false, 2),
  ('sweet-100', 'sweetness', '100% (Standard Sweet)', 0.00, true, 3),

  -- Milk Choices
  ('milk-whole', 'milk', 'Whole Milk', 0.00, true, 1),
  ('milk-oat', 'milk', 'Oat Milk (+₱30)', 30.00, false, 2),
  ('milk-almond', 'milk', 'Almond Milk (+₱30)', 30.00, false, 3),

  -- Espresso Shots
  ('shot-single', 'shots', 'Single Shot', 0.00, true, 1),
  ('shot-double', 'shots', 'Double Shot (+₱25)', 25.00, false, 2),
  ('shot-decaf', 'shots', 'Decaf', 0.00, false, 3);

-- Menu Items
insert into public.menu_items (id, name, category_id, description, base_price, image_url, badge, rating, review_count, is_available, has_customization) values
  ('cappuccino', 'Cappuccino', 'espresso', 'Smooth espresso with perfectly balanced steamed milk & velvety foam dusted with cocoa.', 145.00, '/images/cappuccino.png', 'BESTSELLER', 4.8, '1.2k+', true, true),
  ('spanish-latte', 'Spanish Latte', 'espresso', 'Kape Muna signature rich espresso with silky condensed milk & creamy microfoam.', 165.00, '/images/spanish_latte.png', 'BESTSELLER', 4.9, '2.1k+', true, true),
  ('barako-cold-brew', 'Barako Cold Brew', 'cold-brew', 'Slow-steeped 16-hour Batangas Liberica roast with aromatic dark chocolate undertones.', 150.00, '/images/cold_brew.png', 'POPULAR', 4.8, '850+', true, true),
  ('caramel-macchiato', 'Caramel Macchiato', 'espresso', 'Vanilla-infused steamed milk marked with double espresso and rich buttery caramel drizzle.', 175.00, '/images/caramel_macchiato.png', 'BESTSELLER', 4.9, '1.5k+', true, true),
  ('chocolate-muffin', 'Chocolate Muffin', 'pastries', 'Rich, moist and perfectly baked artisanal dark chocolate muffin with molten ganache center.', 110.00, '/images/chocolate_muffin.png', 'CHEF''S PICK', 4.7, '968+', true, false),
  ('chicken-club-sandwich', 'Chicken Club Sandwich', 'sandwiches', 'Triple-decker toasted brioche with grilled chicken breast, fresh veggies, bacon & garlic aioli.', 195.00, '/images/club_sandwich.png', 'POPULAR', 4.6, '743+', true, false),
  ('butter-croissant', 'Artisan Butter Croissant', 'pastries', 'Flaky golden French pastry with honeycomb interior, baked fresh every morning.', 120.00, '/images/croissant.png', 'BESTSELLER', 4.8, '1.4k+', true, false),
  ('matcha-cloud-latte', 'Matcha Cloud Latte', 'non-coffee', 'Ceremonial grade Kyoto matcha topped with a velvet sweet vanilla cold foam.', 170.00, '/images/matcha_latte.png', 'POPULAR', 4.7, '890+', true, true),
  ('ube-halaya-latte', 'Ube Halaya Latte', 'non-coffee', 'Authentic creamy Tagaytay ube blended with coconut cream and fresh whole milk.', 180.00, '/images/ube_latte.png', 'CHEF''S PICK', 4.9, '1.1k+', true, true),
  ('pandesal-sliders', 'Pandesal Trio Sliders', 'sandwiches', 'Warm traditional pandesal stuffed with artisanal corned beef, kesong puti and fluffy eggs.', 165.00, '/images/pandesal_sliders.png', 'CHEF''S PICK', 4.7, '620+', true, false),
  ('basque-cheesecake', 'Mini Basque Burnt Cheesecake', 'desserts', 'Caramelized burnt crust with an oozing, silky smooth cream cheese center.', 185.00, '/images/cheesecake.png', 'BESTSELLER', 4.9, '1.3k+', true, false)
on conflict (id) do update set
  name = excluded.name,
  category_id = excluded.category_id,
  description = excluded.description,
  base_price = excluded.base_price,
  image_url = excluded.image_url,
  badge = excluded.badge,
  rating = excluded.rating,
  review_count = excluded.review_count,
  is_available = excluded.is_available,
  has_customization = excluded.has_customization;

-- Sample Active Order for Instant Testing & Live Tracking
insert into public.orders (
  order_code,
  customer_name,
  customer_phone,
  branch_name,
  order_type,
  payment_method,
  payment_status,
  payment_reference,
  pickup_time,
  status,
  subtotal,
  service_fee,
  discount,
  total_price,
  notes
) values (
  'KM-108',
  'Jusselle Surio',
  '0917-888-2468',
  'Kape Muna — Main Branch',
  'In-Store Walk-in',
  'Pay at Counter',
  'pending',
  null,
  'ASAP (10-15 mins)',
  'Pending Payment',
  310.00,
  0.00,
  0.00,
  310.00,
  'Extra hot please, ready for counter pickup'
) on conflict (order_code) do nothing;
