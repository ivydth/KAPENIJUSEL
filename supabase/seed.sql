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
  ('kapeng-barako-pour-over', 'Kapeng Barako Pour-Over', 'coffee', 'Pure Batangas Liberica drip brew with deep smoky anise notes', 50.00, '/images/menu/kapeng-barako-pour-over.jpg', 'SIGNATURE ORIGIN', 4.9, '1.9k+', true, true),
  ('benguet-arabica-americano', 'Benguet Arabica Americano', 'coffee', 'High-altitude single-origin black coffee with mild cocoa acidity', 55.00, '/images/menu/benguet-arabica-americano.jpg', 'LOCAL PRIDE', 4.8, '1.2k+', true, true),
  ('muscovado-caramel-cortado', 'Muscovado Caramel Cortado', 'coffee', 'Equal parts espresso & textured milk with unrefined muscovado syrup', 70.00, '/images/menu/muscovado-caramel-cortado.jpg', 'BARISTA PICK', 4.8, '850+', true, true),
  ('barako-flat-white', 'Barako Flat White', 'coffee', 'Strong Liberica double shot with velvety microfoam', 75.00, '/images/menu/barako-flat-white.jpg', 'VELVETY', 4.9, '1.4k+', true, true),
  ('kape-kastila-spanish-latte', 'Kape Kastila (Spanish Latte)', 'coffee', 'Espresso with sweetened condensed milk and fresh milk', 85.00, '/images/menu/kape-kastila-spanish-latte.jpg', 'BESTSELLER', 5.0, '2.8k+', true, true),
  ('pandan-vanilla-latte', 'Pandan Vanilla Latte', 'coffee', 'Espresso with aromatic screwpine (pandan) infused milk', 90.00, '/images/menu/pandan-vanilla-latte.jpg', 'AROMATIC', 4.8, '930+', true, true),
  ('buko-sea-salt-latte', 'Buko Sea Salt Latte', 'coffee', 'Coconut milk latte crowned with savory sea-salt foam', 95.00, '/images/menu/buko-sea-salt-latte.jpg', 'HOUSE SPECIAL', 4.9, '1.5k+', true, true),
  ('ube-halaya-latte', 'Ube Halaya Latte', 'coffee', 'Layered espresso over purple yam puree and sweet cream', 95.00, '/images/menu/ube-halaya-latte.jpg', 'FAVORITE', 4.9, '2.1k+', true, true),
  ('auro-tsokolate-mocha', 'Auro Tsokolate Mocha', 'coffee', 'Espresso fused with melted single-origin dark tablea chocolate', 100.00, '/images/menu/auro-tsokolate-mocha.jpg', 'DECADENT', 4.9, '1.7k+', true, true),
  ('kape-leche-flan', 'Kape Leche Flan', 'coffee', 'Caramel espresso latte topped with custard cream', 100.00, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', 'CHEF''S PICK', 4.9, '1.6k+', true, true),

  -- --- SECTION 2: COLD BREW (16 OZ) (10 Items) ---
  ('classic-barako-cold-brew', 'Classic Barako Cold Brew', 'cold-brew', '18-hour slow-steeped Liberica on ice', 65.00, '/images/menu/classic-barako-cold-brew.jpg', 'SIGNATURE COLD', 4.9, '1.8k+', true, true),
  ('calamansi-cold-brew-fizz', 'Calamansi Cold Brew Fizz', 'cold-brew', 'Cold brew with fresh calamansi and soda water', 75.00, '/images/menu/calamansi-cold-brew-fizz.jpg', 'REFRESHING', 4.8, '910+', true, true),
  ('condensada-cold-brew', 'Condensada Cold Brew', 'cold-brew', 'Layered slow-brew poured over sweet condensed milk', 75.00, '/images/menu/condensada-cold-brew.jpg', 'BESTSELLER', 4.9, '2.3k+', true, true),
  ('honey-calamansi-cascara-brew', 'Honey-Calamansi Cascara Brew', 'cold-brew', 'Brewed coffee cherry tea with raw honey and citrus', 80.00, '/images/menu/honey-calamansi-cascara-brew.jpg', 'ANTIOXIDANT', 4.7, '620+', true, true),
  ('pandan-coconut-tonic', 'Pandan & Coconut Tonic', 'cold-brew', 'Cold brew tonic infused with natural pandan and coconut', 85.00, '/images/menu/pandan-coconut-tonic.jpg', 'TROPICAL', 4.8, '780+', true, true),
  ('tablea-infused-cold-brew', 'Tablea-Infused Cold Brew', 'cold-brew', 'Cold brew steeped with roasted Philippine cacao nibs', 85.00, '/images/menu/tablea-infused-cold-brew.jpg', 'CACAO INFUSION', 4.8, '890+', true, true),
  ('brown-sugar-coffee-jelly-cold-brew', 'Brown Sugar Coffee Jelly Cold Brew', 'cold-brew', 'Crisp cold brew over chewy handmade coffee jelly', 85.00, '/images/menu/brown-sugar-coffee-jelly-cold-brew.jpg', 'CHEWY FAVORITE', 4.9, '1.7k+', true, true),
  ('langka-jackfruit-cold-brew', 'Langka (Jackfruit) Cold Brew', 'cold-brew', 'Cold brew infused with sweet jackfruit nectar', 90.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', 'EXOTIC', 4.7, '540+', true, true),
  ('ube-cream-cold-foam', 'Ube Cream Cold Foam', 'cold-brew', 'Bold cold brew topped with thick whipped ube cream', 95.00, '/images/menu/ube-cream-cold-foam.jpg', 'BESTSELLER', 5.0, '2.5k+', true, true),
  ('salted-cream-nitro-style-cold-brew', 'Salted Cream Nitro-Style Cold Brew', 'cold-brew', 'Nitrogen-smooth cold brew finished with salted cheese foam', 95.00, '/images/menu/salted-cream-nitro-style-cold-brew.jpg', 'VELVET SMOOTH', 4.9, '1.9k+', true, true),

  -- --- SECTION 3: NON-COFFEE REFRESHERS & MILK DRINKS (10 Items) ---
  ('warm-salabat-lemon-honey', 'Warm Salabat with Lemon Honey', 'non-coffee', 'Brewed native ginger tea with honey and fresh lemon', 45.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 'SOOTHING', 4.8, '670+', true, true),
  ('fresh-calamansi-honey-sparkler', 'Fresh Calamansi Honey Sparkler', 'non-coffee', 'Hand-squeezed calamansi, wild honey, and soda water', 55.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'REFRESHING', 4.8, '890+', true, true),
  ('pandan-green-tea-refresher', 'Pandan Green Tea Refresher', 'non-coffee', 'Chilled green tea steeped with bruised pandan leaves', 60.00, '/images/menu/pandan-green-tea-refresher.jpg', 'ZEN HERBAL', 4.7, '540+', true, true),
  ('creamy-sagot-gulaman-latte', 'Creamy Sago''t Gulaman Latte', 'non-coffee', 'Fresh milk cooler with brown sugar arnibal, gulaman, and pearls', 65.00, '/images/menu/creamy-sagot-gulaman-latte.jpg', 'PINOY CLASSIC', 4.9, '1.8k+', true, true),
  ('milo-dinosaur-espresso-free', 'Milo Dinosaur Espresso-Free', 'non-coffee', 'Ice-cold malted chocolate drink heaped with raw Milo powder', 70.00, '/images/menu/milo-dinosaur-espresso-free.jpg', 'KIDS & ADULTS', 4.9, '2.2k+', true, true),
  ('classic-tsokolate-de-batirol', 'Classic Tsokolate de Batirol', 'non-coffee', 'Pure cacao tablea frothed with a traditional wooden batirol', 75.00, '/images/menu/classic-tsokolate-de-batirol.jpg', 'HERITAGE', 5.0, '1.9k+', true, true),
  ('iced-buko-pandan-cooler', 'Iced Buko Pandan Cooler', 'non-coffee', 'Shredded young coconut, pandan agar jelly, and evaporated milk', 75.00, '/images/menu/iced-buko-pandan-cooler.jpg', 'FAVORITE', 4.9, '1.4k+', true, true),
  ('guyabano-mint-cooler', 'Guyabano Mint Cooler', 'non-coffee', 'Tangy soursop juice shaken with crushed ice and fresh mint', 75.00, '/images/menu/guyabano-mint-cooler.jpg', 'TROPICAL TART', 4.7, '680+', true, true),
  ('iced-ube-cheese-milk', 'Iced Ube Cheese Milk', 'non-coffee', 'Purple yam milk topped with sweet-and-savory cheese foam', 90.00, '/images/menu/iced-ube-cheese-milk.jpg', 'SWEET & SAVORY', 4.9, '1.7k+', true, true),
  ('mango-graham-shaken-milk', 'Mango Graham Shaken Milk', 'non-coffee', 'Sweet carabao mango puree shaken with milk and graham crumb', 95.00, '/images/menu/mango-graham-shaken-milk.jpg', 'BESTSELLER', 5.0, '2.6k+', true, true),

  -- --- SECTION 4: PASTRIES & BAKED GOODS (10 Items) ---
  ('pan-de-regla-kalihim', 'Pan de Regla (Kalihim)', 'pastries', 'Classic red pudding stuffed bakery bun', 25.00, '/images/menu/pan-de-regla-kalihim.jpg', 'BAKERY NOSTALGIA', 4.8, '1.1k+', true, true),
  ('spanish-bread', 'Spanish Bread', 'pastries', 'Soft rolled bread filled with sweet butter-breadcrumb paste', 28.00, '/images/menu/spanish-bread.jpg', 'MERIENDA STAPLE', 4.9, '2.1k+', true, true),
  ('pandan-chiffon-slice', 'Pandan Chiffon Slice', 'pastries', 'Light, fluffy green sponge cake slice dusted with sugar', 45.00, '/images/menu/pandan-chiffon-slice.jpg', 'AIRY & LIGHT', 4.8, '820+', true, true),
  ('ube-cheese-pandesal-pair', 'Ube & Cheese Pandesal (Pair / 2 pcs)', 'pastries', 'Soft purple bread stuffed with melted cheddar and ube halaya', 50.00, '/images/menu/ube-cheese-pandesal-pair.jpg', 'BESTSELLER', 5.0, '3.2k+', true, true),
  ('classic-butter-ensaymada', 'Classic Butter Ensaymada', 'pastries', 'Brioche bun coated in whipped butter, sugar, and grated queso', 55.00, '/images/menu/classic-butter-ensaymada.jpg', 'HOUSE SPECIAL', 4.9, '2.4k+', true, true),
  ('bibingka-galapong-muffin', 'Bibingka Galapong Muffin', 'pastries', 'Banana-leaf-baked rice cake with salted egg and coconut', 60.00, '/images/menu/bibingka-galapong-muffin.jpg', 'TRADITIONAL', 4.9, '1.5k+', true, true),
  ('caramelized-otap-croissant', 'Caramelized Otap Croissant', 'pastries', 'Flaky laminated pastry rolled in crispy sugar crystals', 60.00, '/images/menu/caramelized-otap-croissant.jpg', 'CRISPY & FLAKY', 4.8, '940+', true, true),
  ('queso-de-bola-scone', 'Queso de Bola Scone', 'pastries', 'Savory Edam cheese scone served with whipped guava butter', 65.00, '/images/menu/queso-de-bola-scone.jpg', 'CHEF''S CREATION', 4.8, '780+', true, true),
  ('buko-pie-danish', 'Buko Pie Danish', 'pastries', 'Flaky puff pastry filled with creamy young coconut custard', 70.00, '/images/menu/buko-pie-danish.jpg', 'LAGUNA PRIDE', 4.9, '1.6k+', true, true),
  ('pili-nut-cruffin', 'Pili Nut Cruffin', 'pastries', 'Croissant-muffin filled with caramelized pili nut praline', 85.00, '/images/menu/pili-nut-cruffin.jpg', 'BICOL PRIDE', 4.9, '1.3k+', true, true),

  -- --- SECTION 5: SANDWICHES & SAVORY TOAST (10 Items) ---
  ('corned-beef-cheese-pandesal', 'Corned Beef & Cheese Pandesal', 'sandwiches', 'Sautéed garlic corned beef hash in toasted jumbo pandesal', 70.00, '/images/menu/corned-beef-cheese-pandesal.jpg', 'BESTSELLER', 4.9, '2.2k+', true, true),
  ('longganisa-breakfast-sliders', 'Longganisa Breakfast Sliders (2 pcs)', 'sandwiches', 'Vigan or Lucban sausage patties with sunny egg in mini pandesal', 85.00, '/images/menu/longganisa-breakfast-sliders.jpg', 'HEARTY BREAKFAST', 4.9, '1.8k+', true, true),
  ('tuyo-kesong-puti-open-toast', 'Tuyo & Kesong Puti Open Toast', 'sandwiches', 'Crispy dried fish flakes and native carabao cheese with honey', 85.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'ARTISAN TOAST', 4.8, '930+', true, true),
  ('spam-egg-musubi-panini', 'Spam & Egg Musubi-Panini', 'sandwiches', 'Pan-seared luncheon meat and egg patty with sweet soy glaze', 90.00, '/images/menu/spam-egg-musubi-panini.jpg', 'COMFORT FOOD', 4.9, '1.7k+', true, true),
  ('tinapa-cream-cheese-toast', 'Tinapa & Cream Cheese Toast', 'sandwiches', 'Smoked fish flakes whipped into cream cheese with capers', 95.00, '/images/menu/tinapa-cream-cheese-toast.webp', 'SAVORY LUXE', 4.8, '1.1k+', true, true),
  ('tocino-blt', 'Tocino BLT', 'sandwiches', 'Sweet cured tocino, fresh lettuce, tomato, and calamansi mayo', 110.00, '/images/menu/tocino-blt.jpg', 'POPULAR', 4.9, '1.9k+', true, true),
  ('chicken-pastel-melt', 'Chicken Pastel Melt', 'sandwiches', 'Creamy chicken, chorizo, and peas baked with melted gouda', 115.00, '/images/menu/chicken-pastel-melt.jpg', 'CHEESY MELT', 4.8, '870+', true, true),
  ('sisig-grilled-cheese', 'Sisig Grilled Cheese', 'sandwiches', 'Spicy crispy sisig and melted cheddar-mozzarella on sourdough', 120.00, '/images/menu/sisig-grilled-cheese.jpg', 'ULTIMATE CRUNCH', 5.0, '2.7k+', true, true),
  ('adobo-flakes-panini', 'Adobo Flakes Panini', 'sandwiches', 'Shredded crispy pork/chicken adobo with pickled onions & aioli', 120.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'SIGNATURE PANINI', 4.9, '1.6k+', true, true),
  ('kaldereta-pot-roast-sandwich', 'Kaldereta Pot Roast Sandwich', 'sandwiches', 'Slow-braised beef shank in tomato-liver gravy with provolone', 150.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 'CHEF''S SPECIAL', 5.0, '2.1k+', true, true),

  -- --- SECTION 6: DESSERTS (10 Items) ---
  ('cassava-cake-bruleed-custard', 'Cassava Cake with Bruleed Custard', 'desserts', 'Baked cassava topped with caramelized condensed milk', 45.00, '/images/menu/cassava-cake-bruleed-custard.jpg', 'GOLDEN CUSTARD', 4.8, '1.2k+', true, true),
  ('buko-pandan-jelly-panna-cotta', 'Buko Pandan Jelly Panna Cotta', 'desserts', 'Coconut cream panna cotta with pandan cubes & toasted pinipig', 55.00, '/images/menu/buko-pandan-jelly-panna-cotta.jpg', 'SILKY COLD', 4.9, '1.4k+', true, true),
  ('keso-ice-cream-sandwich', 'Keso Ice Cream Sandwich', 'desserts', 'Cheddar cheese ice cream scoop inside warm butter pandesal', 60.00, '/images/menu/keso-ice-cream-sandwich.jpg', 'DIRTY ICE CREAM', 4.9, '2.0k+', true, true),
  ('calamansi-curd-tart', 'Calamansi Curd Tart', 'desserts', 'Buttery pastry shell with tart citrus curd and toasted meringue', 75.00, '/images/menu/calamansi-curd-tart.jpg', 'TART & SWEET', 4.8, '910+', true, true),
  ('classic-halo-halo-parfait', 'Classic Halo-Halo Parfait', 'desserts', 'Layered shaved ice, sweet beans, fruits, nata, and ube scoop', 85.00, '/images/menu/classic-halo-halo-parfait.jpg', 'SUMMER ICON', 5.0, '3.5k+', true, true),
  ('ube-tres-leches-cake', 'Ube Tres Leches Cake', 'desserts', 'Purple yam sponge soaked in three milks with chantilly cream', 90.00, '/images/menu/ube-tres-leches-cake.jpg', 'ULTRA MOIST', 4.9, '2.3k+', true, true),
  ('tablea-lava-cake', 'Tablea Lava Cake', 'desserts', 'Warm molten dark chocolate cake with coconut cream', 95.00, '/images/menu/tablea-lava-cake.jpg', 'MOLTEN CACAO', 4.9, '1.7k+', true, true),
  ('leche-flan-cheesecake-slice', 'Leche Flan Cheesecake (Slice)', 'desserts', 'New York cheesecake topped with a thick slab of caramel flan', 95.00, '/images/menu/leche-flan-cheesecake-slice.jpg', 'BESTSELLER', 5.0, '2.8k+', true, true),
  ('sans-rival-slice', 'Sans Rival Slice', 'desserts', 'Cashew dacquoise layers with French buttercream', 105.00, '/images/menu/sans-rival-slice.jpg', 'FILIPINO ROYALTY', 4.9, '1.9k+', true, true),
  ('mango-bravo-torte-slice', 'Mango Bravo Torte (Slice)', 'desserts', 'Crispy wafer meringue, fresh mango slices, and fudge drizzle', 115.00, '/images/menu/mango-bravo-torte-slice.jpg', 'QUEEN OF DESSERTS', 5.0, '3.8k+', true, true)
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
