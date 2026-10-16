-- ============================================================================
-- Kape Muna - Complete Seed Data for Categories, Menu Items & Customizations
-- Expanded authentic Filipino Coffee Shop Lineup
-- ============================================================================

-- 1. Categories
insert into public.categories (id, name, icon, display_order) values
  ('all', 'All', 'Sparkles', 0),
  ('coffee', 'Coffee', 'Coffee', 1),
  ('cold-brew', 'Cold Brew', 'CupSoda', 2),
  ('non-coffee', 'Non-Coffee', 'Milk', 3),
  ('pastries', 'Pastries', 'Croissant', 4),
  ('sandwiches', 'Sandwiches', 'Layers', 5),
  ('desserts', 'Desserts', 'Cake', 6)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  display_order = excluded.display_order;

-- 2. Customization Options (As defined in requirements)
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

-- 3. Complete Filipino Menu Items (35 Items)
insert into public.menu_items (id, name, category_id, description, base_price, image_url, badge, rating, review_count, is_available, has_customization) values
  -- 1. Coffee (Batangas & Artisanal Brews)
  ('batangas-barako-pour-over', 'Batangas Barako Pour-Over', 'coffee', 'Artisanal single-origin Batangas Liberica hand-poured through slow drip, releasing bold earthy aromatics and cacao sweetness.', 95.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'SIGNATURE ORIGIN', 4.9, '1.8k+', true, true),
  ('kape-kastila-spanish-latte', 'Kape Kastila / Spanish Latte', 'coffee', 'Signature rich espresso layered over silky sweetened condensed milk and topped with fresh microfoam.', 145.00, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.4k+', true, true),
  ('kape-leche-flan', 'Kape Leche Flan', 'coffee', 'Decadent double espresso poured over rich caramel flan custard, condensed cream, and golden amber syrup.', 165.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', 'CHEF''S SPECIAL', 4.9, '1.1k+', true, true),
  ('salted-muscovado-latte', 'Salted Muscovado Latte', 'coffee', 'Espresso combined with natural Antique muscovado raw cane syrup, steamed whole milk, and a pinch of Pangasinan sea salt.', 150.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.8, '980+', true, true),
  ('tablea-mocha', 'Tablea Mocha', 'coffee', 'Pure melted Davao heirloom tablea cacao blended with double shot espresso and velvety textured milk.', 160.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80', 'LOCAL PRIDE', 4.8, '1.3k+', true, true),
  ('kape-pandan', 'Kape Pandan', 'coffee', 'Smooth espresso infused with fragrant, house-simmered screwpine pandan leaf syrup and creamy milk.', 155.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', 'AROMATIC', 4.7, '760+', true, true),
  ('americano-batangueno', 'Americano Batangueño', 'coffee', 'Bold, smoky double shot of Barako espresso stretched over piping hot pure water with dense golden crema.', 110.00, 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80', 'BOLD KICK', 4.8, '890+', true, true),
  ('hazelnut-barako-macchiato', 'Hazelnut Barako Macchiato', 'coffee', 'Steamed milk stained with robust Barako espresso and finished with aromatic roasted hazelnut drizzle.', 140.00, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.7, '910+', true, true),

  -- 2. Cold Brew
  ('24-hour-barako-cold-brew', '24-Hour Barako Cold Brew', 'cold-brew', 'Coarse-ground Batangas Liberica steeped in cold filtered spring water for 24 full hours for a low-acid, intense dark chocolate profile.', 130.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '1.6k+', true, true),
  ('coconut-cream-cloud-cold-brew', 'Coconut Cream Cloud Cold Brew', 'cold-brew', 'Slow-steeped Barako cold brew topped with a thick, velvety blanket of whipped fresh coconut cream cold foam.', 165.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'CHEF''S PICK', 4.9, '1.2k+', true, true),
  ('sweet-muscovado-vanilla-cold-brew', 'Sweet Muscovado Vanilla Cold Brew', 'cold-brew', 'Smooth cold brew sweetened with molasses-rich muscovado and Madagascar vanilla bean essence.', 150.00, 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.8, '840+', true, true),
  ('calamansi-tonic-cold-brew', 'Calamansi Tonic Cold Brew', 'cold-brew', 'Effervescent craft tonic water poured over fresh Philippine calamansi citrus juice and floating cold brew coffee.', 160.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'REFRESHING', 4.7, '670+', true, true),
  ('kapet-gatas-cold-brew', 'Kape''t Gatas Cold Brew', 'cold-brew', 'Traditional roadside Filipino cold brew softened with creamy evaporated and condensed farm fresh milk.', 140.00, 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80', 'CLASSIC', 4.8, '1.0k+', true, true),

  -- 3. Non-Coffee
  ('davao-tablea-tsokolate-batirol', 'Davao Tablea Tsokolate Batirol', 'non-coffee', 'Heirloom roasted cacao nibs hand-whisked to a frothy perfection using an authentic wooden molinillo batirol.', 130.00, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80', 'HERITAGE', 4.9, '1.4k+', true, true),
  ('halaya-ube-latte', 'Halaya Ube Latte', 'non-coffee', 'Creamy purple yam slow-cooked with coconut milk, layered under fresh dairy and dusted with ube velvet powder.', 150.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.1k+', true, true),
  ('calamansi-mint-sparkler', 'Calamansi Mint Sparkler', 'non-coffee', 'Muddled fresh calamansi lime, crisp garden spearmint leaves, pure wild honey, and sparkling mineral soda.', 120.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'COOLER', 4.8, '820+', true, true),
  ('matcha-ube-float', 'Matcha Ube Float', 'non-coffee', 'Premium ceremonial Japanese Uji matcha poured over sweet purple ube puree and crowned with creamy vanilla float.', 170.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 'TRENDING', 4.8, '1.5k+', true, true),
  ('guyabano-ginger-iced-tea', 'Guyabano Ginger Iced Tea', 'non-coffee', 'Tangy soursop (guyabano) nectar brewed with organic black tea, a gentle hint of native ginger root, and crushed ice.', 115.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'HEALTHY', 4.7, '590+', true, true),
  ('strawberries-cream-latik-latte', 'Strawberries & Cream Latik Latte', 'non-coffee', 'La Trinidad highland crushed strawberries swirled with fresh cream and topped with fragrant toasted caramelized coconut latik.', 160.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'SEASONAL', 4.8, '780+', true, true),

  -- 4. Pastries
  ('classic-brioche-ensaymada', 'Classic Brioche Ensaymada', 'pastries', 'Ultra-fluffy French brioche bun lathered with creamy golden butter cream and piled high with aged Queso de Bola.', 95.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '1.9k+', true, false),
  ('toasted-spanish-bread', 'Toasted Spanish Bread', 'pastries', 'Warm bakery roll stuffed with rich caramelized buttery breadcrumbs, toasted sugar, and served with a golden crust.', 65.00, 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80', 'HOT BAKED', 4.8, '1.1k+', true, false),
  ('ube-cheese-pandesal', 'Ube Cheese Pandesal', 'pastries', 'Soft purple halaya ube dough filled with a savory block of melting quickmelt cheese, dusted in toasted breadcrumbs.', 75.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.9, '2.2k+', true, false),
  ('bibingka-galapong-supreme', 'Bibingka Galapong Supreme', 'pastries', 'Traditional clay-oven baked rice cake on banana leaves topped with native salted egg slices, grated fresh coconut, and melting butter.', 125.00, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80', 'TRADITIONAL', 4.9, '1.5k+', true, false),
  ('pan-de-regla', 'Pan de Regla', 'pastries', 'Nostalgic local panaderia crimson bread pastry loaded with sweet and rich red bread pudding filling.', 45.00, 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80', 'NOSTALGIC', 4.6, '720+', true, false),
  ('kare-kare-empanada', 'Kare-Kare Empanada', 'pastries', 'Flaky baked crust pastry packed with savory beef stewed in creamy roasted peanut sauce, string beans, and a dab of bagoong.', 95.00, 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=600&q=80', 'CHEF''S SPECIAL', 4.8, '860+', true, false),

  -- 5. Sandwiches
  ('corned-beef-pandesal-sliders', 'Corned Beef Pandesal Sliders', 'sandwiches', 'Three freshly baked artisan pandesal buns packed with slow-cooked shredded garlic corned beef brisket and caramelized onions.', 160.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '1.7k+', true, false),
  ('vigan-longganisa-patty-melt', 'Vigan Longganisa Patty Melt', 'sandwiches', 'Garlicky Vigan longganisa pork patty, melted cheddar cheese, fried sunny-side egg, and spiced vinegar mayo on toasted sourdough.', 180.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'CHEF''S PICK', 4.9, '1.4k+', true, false),
  ('kesong-puti-basil-pesto-toast', 'Kesong Puti & Basil Pesto Toast', 'sandwiches', 'Fresh carabao white cheese grilled golden on thick crusty country bread with aromatic basil cashew pesto and ripe tomatoes.', 150.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'VEGGIE FAVORITE', 4.8, '910+', true, false),
  ('spicy-tuna-adobo-melt', 'Spicy Tuna Adobo Melt', 'sandwiches', 'Flaked yellowfin tuna braised in spicy garlic-peppercorn adobo glaze, toasted with sharp cheddar and mozzarella on brioche.', 145.00, 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&w=600&q=80', 'SAVORY & SPICY', 4.7, '790+', true, false),
  ('tinapa-pate-crostini', 'Tinapa Pâté Crostini', 'sandwiches', 'Velvety smoked bangus fish pâté whipped with cream cheese, capers, and calamansi zest on crunchy toasted baguette rounds.', 155.00, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80', 'ARTISANAL', 4.8, '640+', true, false),

  -- 6. Desserts
  ('mango-graham-float-cup', 'Mango Graham Float Cup', 'desserts', 'Chilled dessert cup layered with sweet golden Guimaras mango slices, whipped condensed cream, and crushed honey graham crackers.', 120.00, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.5k+', true, false),
  ('biko-with-latik', 'Biko with Latik', 'desserts', 'Steamed glutinous brown rice simmered in coconut milk and muscovado sugar, blanketed with golden crunchy latik curds.', 85.00, 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80', 'HERITAGE', 4.8, '1.2k+', true, false),
  ('caramelized-turon-con-leche', 'Caramelized Turon Con Leche', 'desserts', 'Crispy spring rolls stuffed with Saba banana and ripe jackfruit (langka), glazed with crunchy brown sugar and drizzled with dulce de leche.', 90.00, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', 'CRISPY SWEET', 4.8, '1.6k+', true, false),
  ('classic-caramel-leche-flan', 'Classic Caramel Leche Flan', 'desserts', 'Velvety smooth, melt-in-your-mouth egg yolk and milk custard topped with bittersweet golden caramelized sugar syrup.', 110.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', 'CROWD FAVORITE', 4.9, '2.0k+', true, false),
  ('tablea-fudge-brownie', 'Tablea Fudge Brownie', 'desserts', 'Chewy, intensely fudgy dark brownie baked with pure Davao single-origin cacao tablea and sprinkled with coarse sea salt.', 85.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', 'CHOCOLATE HEAVEN', 4.8, '1.3k+', true, false)
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

-- 4. Sample Active Order for Instant Testing & Live Tracking
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
  240.00,
  0.00,
  0.00,
  240.00,
  'Extra hot please, ready for counter pickup'
) on conflict (order_code) do nothing;
