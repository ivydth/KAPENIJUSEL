-- ============================================================================
-- Kape Muna - Complete Seed Data for Categories, Menu Items & Customizations
-- Expanded authentic Filipino Coffee Shop Lineup
-- ============================================================================

-- 1. Categories (Kept intact and as configured)
insert into public.categories (id, name, icon, display_order) values
  ('all', 'All', 'Sparkles', 0),
  ('coffee', 'Coffee', 'Coffee', 1),
  ('cold_brew', 'Cold Brew', 'CupSoda', 2),
  ('cold-brew', 'Cold Brew', 'CupSoda', 2),
  ('non_coffee', 'Non-Coffee', 'Milk', 3),
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

-- 3. Complete Filipino Menu Items (35 Items with Exact Designated Unsplash Photos)
insert into public.menu_items (id, name, category_id, description, base_price, image_url, badge, rating, review_count, is_available, has_customization) values
  -- --- COFFEE (category_id: "coffee") ---
  ('batangas-barako-pour-over', 'Batangas Barako Pour-Over', 'coffee', 'Authentic Liberica drip coffee; bold, smoky, and deeply aromatic.', 95.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', 'SIGNATURE ORIGIN', 4.9, '1.8k+', true, true),
  ('kape-kastila-spanish-latte', 'Kape Kastila (Spanish Latte)', 'coffee', 'Double shot espresso sweetened with creamy condensed milk.', 145.00, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.4k+', true, true),
  ('kape-leche-flan', 'Kape Leche Flan', 'coffee', 'Espresso infused with house caramel syrup and rich custard notes.', 165.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', 'CHEF''S SPECIAL', 4.9, '1.1k+', true, true),
  ('salted-muscovado-latte', 'Salted Muscovado Latte', 'coffee', 'Rich espresso sweetened with native muscovado sugar and sea salt.', 150.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.8, '980+', true, true),
  ('tablea-mocha', 'Tablea Mocha', 'coffee', 'Pure artisan Davao dark cacao melted into steamed milk and espresso.', 160.00, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', 'LOCAL PRIDE', 4.8, '1.3k+', true, true),
  ('kape-pandan', 'Kape Pandan', 'coffee', 'Espresso blended with fragrant local pandan leaf essence and milk.', 155.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80', 'AROMATIC', 4.7, '760+', true, true),
  ('americano-batangueno', 'Americano Batangueño', 'coffee', 'Clean, full-bodied dark roast black coffee with dark chocolate notes.', 110.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'BOLD KICK', 4.8, '890+', true, true),
  ('hazelnut-barako-macchiato', 'Hazelnut Barako Macchiato', 'coffee', 'Concentrated local brew layered with roasted hazelnut foam.', 140.00, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.7, '910+', true, true),

  -- --- COLD BREW (category_id: "cold_brew") ---
  ('24-hour-barako-cold-brew', '24-Hour Barako Cold Brew', 'cold_brew', 'Steeped for 24 hours to bring out sweet chocolate notes with low acidity.', 130.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '1.6k+', true, true),
  ('coconut-cream-cloud-cold-brew', 'Coconut Cream Cloud Cold Brew', 'cold_brew', 'Dark cold brew crowned with salted velvety coconut milk foam.', 165.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', 'CHEF''S PICK', 4.9, '1.2k+', true, true),
  ('sweet-muscovado-vanilla-cold-brew', 'Sweet Muscovado Vanilla Cold Brew', 'cold_brew', 'Smooth cold brew sweetened with pure muscovado and real vanilla.', 150.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.8, '840+', true, true),
  ('calamansi-tonic-cold-brew', 'Calamansi Tonic Cold Brew', 'cold_brew', 'Refreshing fizzy spritz of fresh calamansi juice, tonic, and cold brew.', 160.00, 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', 'REFRESHING', 4.7, '670+', true, true),
  ('kapet-gatas-cold-brew', 'Kape''t Gatas Cold Brew', 'cold_brew', 'Nostalgic sweet blend of cold brew and evaporated whole milk over ice.', 140.00, 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=600&q=80', 'CLASSIC', 4.8, '1.0k+', true, true),

  -- --- NON-COFFEE (category_id: "non_coffee") ---
  ('davao-tablea-tsokolate-batirol', 'Davao Tablea Tsokolate Batirol', 'non_coffee', 'Traditional thick hot chocolate frothed with an authentic wooden batirol.', 130.00, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80', 'HERITAGE', 4.9, '1.4k+', true, true),
  ('halaya-ube-latte', 'Halaya Ube Latte', 'non_coffee', 'Creamy whole milk layered with real Tagaytay purple yam halaya.', 150.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.1k+', true, true),
  ('calamansi-mint-sparkler', 'Calamansi Mint Sparkler', 'non_coffee', 'Hand-squeezed calamansi, muddled fresh mint leaves, honey, and sparkling water.', 120.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'COOLER', 4.8, '820+', true, true),
  ('matcha-ube-float', 'Matcha Ube Float', 'non_coffee', 'Ceremonial Japanese matcha poured over creamy sweetened ube milk.', 170.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', 'TRENDING', 4.8, '1.5k+', true, true),
  ('guyabano-ginger-iced-tea', 'Guyabano Ginger Iced Tea', 'non_coffee', 'Tangy soursop fruit tea infused with a subtle soothing kick of ginger.', 115.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'HEALTHY', 4.7, '590+', true, true),
  ('strawberries-cream-latik-latte', 'Strawberries & Cream Latik Latte', 'non_coffee', 'Fresh Benguet strawberry compote shaken with milk and sweet toasted latik syrup.', 160.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80', 'SEASONAL', 4.8, '780+', true, true),

  -- --- PASTRIES (category_id: "pastries") ---
  ('classic-brioche-ensaymada', 'Classic Brioche Ensaymada', 'pastries', 'Fluffy buttery brioche covered with creamed butter, sugar, and aged Queso de Bola.', 95.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '1.9k+', true, false),
  ('toasted-spanish-bread', 'Toasted Spanish Bread (2 pcs)', 'pastries', 'Soft, golden rolled bread packed with warm buttery brown sugar filling.', 65.00, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80', 'HOT BAKED', 4.8, '1.1k+', true, false),
  ('ube-cheese-pandesal', 'Ube Cheese Pandesal (3 pcs)', 'pastries', 'Vibrant purple yam dinner rolls filled with melting savory cheese cubes.', 75.00, 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.9, '2.2k+', true, false),
  ('bibingka-galapong-supreme', 'Bibingka Galapong Supreme', 'pastries', 'Traditional rice cake baked in banana leaves with salted egg slices and grated coconut.', 125.00, 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80', 'TRADITIONAL', 4.9, '1.5k+', true, false),
  ('pan-de-regla', 'Pan de Regla (Red Bread)', 'pastries', 'Beloved neighborhood bakery bread roll with sweet crimson bread pudding core.', 45.00, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', 'NOSTALGIC', 4.6, '720+', true, false),
  ('kare-kare-empanada', 'Kare-Kare Empanada', 'pastries', 'Golden flaky turnover filled with savory braised beef and rich peanut stew.', 95.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 'CHEF''S SPECIAL', 4.8, '860+', true, false),

  -- --- SANDWICHES (category_id: "sandwiches") ---
  ('corned-beef-pandesal-sliders', 'Corned Beef Pandesal Sliders', 'sandwiches', 'Chunky sautéed garlic corned beef with caramelized onions in toasted jumbo pandesal.', 160.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '1.7k+', true, false),
  ('vigan-longganisa-patty-melt', 'Vigan Longganisa Patty Melt', 'sandwiches', 'Garlicky pork longganisa patty, fried egg, and melted cheddar on toasted brioche.', 180.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 'CHEF''S PICK', 4.9, '1.4k+', true, false),
  ('kesong-puti-basil-pesto-toast', 'Kesong Puti & Basil Pesto Toast', 'sandwiches', 'Sourdough toast topped with fresh carabao''s milk cheese and fragrant basil pesto.', 150.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'VEGGIE FAVORITE', 4.8, '910+', true, false),
  ('spicy-tuna-adobo-melt', 'Spicy Tuna Adobo Melt', 'sandwiches', 'Flaked tuna simmered in soy-vinegar spices toasted with mozzarella on rye.', 145.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'SAVORY & SPICY', 4.7, '790+', true, false),
  ('tinapa-pate-crostini', 'Tinapa Pâté Crostini', 'sandwiches', 'Creamy smoked fish spread on crusty garlic baguette rounds with tomato relish.', 155.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'ARTISANAL', 4.8, '640+', true, false),

  -- --- DESSERTS (category_id: "desserts") ---
  ('mango-graham-float-cup', 'Mango Graham Float Cup', 'desserts', 'Layers of sweet ripe mangoes, crushed graham biscuits, and sweetened cream.', 120.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.5k+', true, false),
  ('biko-with-toasted-latik', 'Biko with Toasted Latik', 'desserts', 'Chewy glutinous rice cooked in dark coconut caramel and topped with crispy coconut curd.', 85.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'HERITAGE', 4.8, '1.2k+', true, false),
  ('caramelized-turon-con-leche', 'Caramelized Turon Con Leche', 'desserts', 'Crispy fried banana and jackfruit rolls drizzled with rich dulce de leche.', 90.00, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 'CRISPY SWEET', 4.8, '1.6k+', true, false),
  ('classic-caramel-leche-flan', 'Classic Caramel Leche Flan', 'desserts', 'Silky-smooth steamed egg custard soaked in golden amber caramel syrup.', 110.00, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', 'CROWD FAVORITE', 4.9, '2.0k+', true, false),
  ('tablea-fudge-brownie', 'Tablea Fudge Brownie', 'desserts', 'Dense, decadent dark chocolate fudge brownie made with native Davao cacao nibs.', 85.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', 'CHOCOLATE HEAVEN', 4.8, '1.3k+', true, false)
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
  190.00,
  0.00,
  0.00,
  190.00,
  'Authentic Barako drip and fresh brioche ensaymada'
) on conflict (order_code) do nothing;
