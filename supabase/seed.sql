-- ============================================================================
-- Kape Muna - Complete Seed Data for Categories, Menu Items & Customizations
-- Complete 60-Item Authentic Filipino Coffee Shop Lineup (Abot-Kaya)
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

-- 3. Complete Filipino Menu Items (60 Items with Exact Descriptions & Designated Photos)
delete from public.menu_items;
insert into public.menu_items (id, name, category_id, description, base_price, image_url, badge, rating, review_count, is_available, has_customization) values
  -- --- SECTION 1: COFFEE (HOT & ICED) (10 Items) ---
  ('kapeng-barako-pour-over', 'Kapeng Barako Pour-Over', 'coffee', 'Pure Batangas Liberica drip brew with deep smoky anise notes', 50.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', 'SIGNATURE ORIGIN', 4.9, '1.9k+', true, true),
  ('benguet-arabica-americano', 'Benguet Arabica Americano', 'coffee', 'High-altitude single-origin black coffee with mild cocoa acidity', 55.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'LOCAL PRIDE', 4.8, '1.2k+', true, true),
  ('muscovado-caramel-cortado', 'Muscovado Caramel Cortado', 'coffee', 'Equal parts espresso & textured milk with unrefined muscovado syrup', 70.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'BARISTA PICK', 4.8, '850+', true, true),
  ('barako-flat-white', 'Barako Flat White', 'coffee', 'Strong Liberica double shot with velvety microfoam', 75.00, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', 'VELVETY', 4.9, '1.4k+', true, true),
  ('kape-kastila-spanish-latte', 'Kape Kastila (Spanish Latte)', 'coffee', 'Espresso with sweetened condensed milk and fresh milk', 85.00, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 5.0, '2.8k+', true, true),
  ('pandan-vanilla-latte', 'Pandan Vanilla Latte', 'coffee', 'Espresso with aromatic screwpine (pandan) infused milk', 90.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80', 'AROMATIC', 4.8, '930+', true, true),
  ('buko-sea-salt-latte', 'Buko Sea Salt Latte', 'coffee', 'Coconut milk latte crowned with savory sea-salt foam', 95.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', 'HOUSE SPECIAL', 4.9, '1.5k+', true, true),
  ('ube-halaya-latte', 'Ube Halaya Latte', 'coffee', 'Layered espresso over purple yam puree and sweet cream', 95.00, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', 'FAVORITE', 4.9, '2.1k+', true, true),
  ('auro-tsokolate-mocha', 'Auro Tsokolate Mocha', 'coffee', 'Espresso fused with melted single-origin dark tablea chocolate', 100.00, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', 'DECADENT', 4.9, '1.7k+', true, true),
  ('kape-leche-flan', 'Kape Leche Flan', 'coffee', 'Caramel espresso latte topped with custard cream', 100.00, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', 'CHEF''S PICK', 4.9, '1.6k+', true, true),

  -- --- SECTION 2: COLD BREW (16 OZ) (10 Items) ---
  ('classic-barako-cold-brew', 'Classic Barako Cold Brew', 'cold-brew', '18-hour slow-steeped Liberica on ice', 65.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 'SIGNATURE COLD', 4.9, '1.8k+', true, true),
  ('calamansi-cold-brew-fizz', 'Calamansi Cold Brew Fizz', 'cold-brew', 'Cold brew with fresh calamansi and soda water', 75.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'REFRESHING', 4.8, '910+', true, true),
  ('condensada-cold-brew', 'Condensada Cold Brew', 'cold-brew', 'Layered slow-brew poured over sweet condensed milk', 75.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.3k+', true, true),
  ('honey-calamansi-cascara-brew', 'Honey-Calamansi Cascara Brew', 'cold-brew', 'Brewed coffee cherry tea with raw honey and citrus', 80.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'ANTIOXIDANT', 4.7, '620+', true, true),
  ('pandan-coconut-tonic', 'Pandan & Coconut Tonic', 'cold-brew', 'Cold brew tonic infused with natural pandan and coconut', 85.00, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', 'TROPICAL', 4.8, '780+', true, true),
  ('tablea-infused-cold-brew', 'Tablea-Infused Cold Brew', 'cold-brew', 'Cold brew steeped with roasted Philippine cacao nibs', 85.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', 'CACAO INFUSION', 4.8, '890+', true, true),
  ('brown-sugar-coffee-jelly-cold-brew', 'Brown Sugar Coffee Jelly Cold Brew', 'cold-brew', 'Crisp cold brew over chewy handmade coffee jelly', 85.00, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80', 'CHEWY FAVORITE', 4.9, '1.7k+', true, true),
  ('langka-jackfruit-cold-brew', 'Langka (Jackfruit) Cold Brew', 'cold-brew', 'Cold brew infused with sweet jackfruit nectar', 90.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', 'EXOTIC', 4.7, '540+', true, true),
  ('ube-cream-cold-foam', 'Ube Cream Cold Foam', 'cold-brew', 'Bold cold brew topped with thick whipped ube cream', 95.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 5.0, '2.5k+', true, true),
  ('salted-cream-nitro-style-cold-brew', 'Salted Cream Nitro-Style Cold Brew', 'cold-brew', 'Nitrogen-smooth cold brew finished with salted cheese foam', 95.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'VELVET SMOOTH', 4.9, '1.9k+', true, true),

  -- --- SECTION 3: NON-COFFEE REFRESHERS & MILK DRINKS (10 Items) ---
  ('warm-salabat-lemon-honey', 'Warm Salabat with Lemon Honey', 'non-coffee', 'Brewed native ginger tea with honey and fresh lemon', 45.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 'SOOTHING', 4.8, '670+', true, true),
  ('fresh-calamansi-honey-sparkler', 'Fresh Calamansi Honey Sparkler', 'non-coffee', 'Hand-squeezed calamansi, wild honey, and soda water', 55.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'REFRESHING', 4.8, '890+', true, true),
  ('pandan-green-tea-refresher', 'Pandan Green Tea Refresher', 'non-coffee', 'Chilled green tea steeped with bruised pandan leaves', 60.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'ZEN HERBAL', 4.7, '540+', true, true),
  ('creamy-sagot-gulaman-latte', 'Creamy Sago''t Gulaman Latte', 'non-coffee', 'Fresh milk cooler with brown sugar arnibal, gulaman, and pearls', 65.00, 'https://images.unsplash.com/photo-1558857563-b37df1dd52c2?auto=format&fit=crop&w=600&q=80', 'PINOY CLASSIC', 4.9, '1.8k+', true, true),
  ('milo-dinosaur-espresso-free', 'Milo Dinosaur Espresso-Free', 'non-coffee', 'Ice-cold malted chocolate drink heaped with raw Milo powder', 70.00, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', 'KIDS & ADULTS', 4.9, '2.2k+', true, true),
  ('classic-tsokolate-de-batirol', 'Classic Tsokolate de Batirol', 'non-coffee', 'Pure cacao tablea frothed with a traditional wooden batirol', 75.00, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80', 'HERITAGE', 5.0, '1.9k+', true, true),
  ('iced-buko-pandan-cooler', 'Iced Buko Pandan Cooler', 'non-coffee', 'Shredded young coconut, pandan agar jelly, and evaporated milk', 75.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'FAVORITE', 4.9, '1.4k+', true, true),
  ('guyabano-mint-cooler', 'Guyabano Mint Cooler', 'non-coffee', 'Tangy soursop juice shaken with crushed ice and fresh mint', 75.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80', 'TROPICAL TART', 4.7, '680+', true, true),
  ('iced-ube-cheese-milk', 'Iced Ube Cheese Milk', 'non-coffee', 'Purple yam milk topped with sweet-and-savory cheese foam', 90.00, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', 'SWEET & SAVORY', 4.9, '1.7k+', true, true),
  ('mango-graham-shaken-milk', 'Mango Graham Shaken Milk', 'non-coffee', 'Sweet carabao mango puree shaken with milk and graham crumb', 95.00, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 5.0, '2.6k+', true, true),

  -- --- SECTION 4: PASTRIES & BAKED GOODS (10 Items) ---
  ('pan-de-regla-kalihim', 'Pan de Regla (Kalihim)', 'pastries', 'Classic red pudding stuffed bakery bun', 25.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'BAKERY NOSTALGIA', 4.8, '1.1k+', true, true),
  ('spanish-bread', 'Spanish Bread', 'pastries', 'Soft rolled bread filled with sweet butter-breadcrumb paste', 28.00, 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80', 'MERIENDA STAPLE', 4.9, '2.1k+', true, true),
  ('pandan-chiffon-slice', 'Pandan Chiffon Slice', 'pastries', 'Light, fluffy green sponge cake slice dusted with sugar', 45.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', 'AIRY & LIGHT', 4.8, '820+', true, true),
  ('ube-cheese-pandesal-pair', 'Ube & Cheese Pandesal (Pair / 2 pcs)', 'pastries', 'Soft purple bread stuffed with melted cheddar and ube halaya', 50.00, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 5.0, '3.2k+', true, true),
  ('classic-butter-ensaymada', 'Classic Butter Ensaymada', 'pastries', 'Brioche bun coated in whipped butter, sugar, and grated queso', 55.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 'HOUSE SPECIAL', 4.9, '2.4k+', true, true),
  ('bibingka-galapong-muffin', 'Bibingka Galapong Muffin', 'pastries', 'Banana-leaf-baked rice cake with salted egg and coconut', 60.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'TRADITIONAL', 4.9, '1.5k+', true, true),
  ('caramelized-otap-croissant', 'Caramelized Otap Croissant', 'pastries', 'Flaky laminated pastry rolled in crispy sugar crystals', 60.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 'CRISPY & FLAKY', 4.8, '940+', true, true),
  ('queso-de-bola-scone', 'Queso de Bola Scone', 'pastries', 'Savory Edam cheese scone served with whipped guava butter', 65.00, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', 'CHEF''S CREATION', 4.8, '780+', true, true),
  ('buko-pie-danish', 'Buko Pie Danish', 'pastries', 'Flaky puff pastry filled with creamy young coconut custard', 70.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'LAGUNA PRIDE', 4.9, '1.6k+', true, true),
  ('pili-nut-cruffin', 'Pili Nut Cruffin', 'pastries', 'Croissant-muffin filled with caramelized pili nut praline', 85.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 'BICOL PRIDE', 4.9, '1.3k+', true, true),

  -- --- SECTION 5: SANDWICHES & SAVORY TOAST (10 Items) ---
  ('corned-beef-cheese-pandesal', 'Corned Beef & Cheese Pandesal', 'sandwiches', 'Sautéed garlic corned beef hash in toasted jumbo pandesal', 70.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 4.9, '2.2k+', true, true),
  ('longganisa-breakfast-sliders', 'Longganisa Breakfast Sliders (2 pcs)', 'sandwiches', 'Vigan or Lucban sausage patties with sunny egg in mini pandesal', 85.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 'HEARTY BREAKFAST', 4.9, '1.8k+', true, true),
  ('tuyo-kesong-puti-open-toast', 'Tuyo & Kesong Puti Open Toast', 'sandwiches', 'Crispy dried fish flakes and native carabao cheese with honey', 85.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'ARTISAN TOAST', 4.8, '930+', true, true),
  ('spam-egg-musubi-panini', 'Spam & Egg Musubi-Panini', 'sandwiches', 'Pan-seared luncheon meat and egg patty with sweet soy glaze', 90.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'COMFORT FOOD', 4.9, '1.7k+', true, true),
  ('tinapa-cream-cheese-toast', 'Tinapa & Cream Cheese Toast', 'sandwiches', 'Smoked fish flakes whipped into cream cheese with capers', 95.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'SAVORY LUXE', 4.8, '1.1k+', true, true),
  ('tocino-blt', 'Tocino BLT', 'sandwiches', 'Sweet cured tocino, fresh lettuce, tomato, and calamansi mayo', 110.00, 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=600&q=80', 'POPULAR', 4.9, '1.9k+', true, true),
  ('chicken-pastel-melt', 'Chicken Pastel Melt', 'sandwiches', 'Creamy chicken, chorizo, and peas baked with melted gouda', 115.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'CHEESY MELT', 4.8, '870+', true, true),
  ('sisig-grilled-cheese', 'Sisig Grilled Cheese', 'sandwiches', 'Spicy crispy sisig and melted cheddar-mozzarella on sourdough', 120.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'ULTIMATE CRUNCH', 5.0, '2.7k+', true, true),
  ('adobo-flakes-panini', 'Adobo Flakes Panini', 'sandwiches', 'Shredded crispy pork/chicken adobo with pickled onions & aioli', 120.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'SIGNATURE PANINI', 4.9, '1.6k+', true, true),
  ('kaldereta-pot-roast-sandwich', 'Kaldereta Pot Roast Sandwich', 'sandwiches', 'Slow-braised beef shank in tomato-liver gravy with provolone', 150.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 'CHEF''S SPECIAL', 5.0, '2.1k+', true, true),

  -- --- SECTION 6: DESSERTS (10 Items) ---
  ('cassava-cake-bruleed-custard', 'Cassava Cake with Bruleed Custard', 'desserts', 'Baked cassava topped with caramelized condensed milk', 45.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', 'GOLDEN CUSTARD', 4.8, '1.2k+', true, true),
  ('buko-pandan-jelly-panna-cotta', 'Buko Pandan Jelly Panna Cotta', 'desserts', 'Coconut cream panna cotta with pandan cubes & toasted pinipig', 55.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', 'SILKY COLD', 4.9, '1.4k+', true, true),
  ('keso-ice-cream-sandwich', 'Keso Ice Cream Sandwich', 'desserts', 'Cheddar cheese ice cream scoop inside warm butter pandesal', 60.00, 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=600&q=80', 'DIRTY ICE CREAM', 4.9, '2.0k+', true, true),
  ('calamansi-curd-tart', 'Calamansi Curd Tart', 'desserts', 'Buttery pastry shell with tart citrus curd and toasted meringue', 75.00, 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80', 'TART & SWEET', 4.8, '910+', true, true),
  ('classic-halo-halo-parfait', 'Classic Halo-Halo Parfait', 'desserts', 'Layered shaved ice, sweet beans, fruits, nata, and ube scoop', 85.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80', 'SUMMER ICON', 5.0, '3.5k+', true, true),
  ('ube-tres-leches-cake', 'Ube Tres Leches Cake', 'desserts', 'Purple yam sponge soaked in three milks with chantilly cream', 90.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80', 'ULTRA MOIST', 4.9, '2.3k+', true, true),
  ('tablea-lava-cake', 'Tablea Lava Cake', 'desserts', 'Warm molten dark chocolate cake with coconut cream', 95.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', 'MOLTEN CACAO', 4.9, '1.7k+', true, true),
  ('leche-flan-cheesecake-slice', 'Leche Flan Cheesecake (Slice)', 'desserts', 'New York cheesecake topped with a thick slab of caramel flan', 95.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80', 'BESTSELLER', 5.0, '2.8k+', true, true),
  ('sans-rival-slice', 'Sans Rival Slice', 'desserts', 'Cashew dacquoise layers with French buttercream', 105.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', 'FILIPINO ROYALTY', 4.9, '1.9k+', true, true),
  ('mango-bravo-torte-slice', 'Mango Bravo Torte (Slice)', 'desserts', 'Crispy wafer meringue, fresh mango slices, and fudge drizzle', 115.00, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=600&q=80', 'QUEEN OF DESSERTS', 5.0, '3.8k+', true, true)
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
