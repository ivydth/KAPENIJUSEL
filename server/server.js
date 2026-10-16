const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client if credentials exist
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase] Initialized client connected to:', supabaseUrl);
  } catch (err) {
    console.warn('[Supabase] Initialization error, falling back to local store:', err.message);
  }
} else {
  console.log('[Info] Supabase credentials not found in env. Running with built-in high-fidelity local database.');
}

// ----------------------------------------------------------------------------
// Local In-Memory Data Store (Used if Supabase is offline or not configured)
// ----------------------------------------------------------------------------
const categoriesData = [
  { id: 'all', name: 'All', icon: 'Sparkles', display_order: 0 },
  { id: 'coffee', name: 'Coffee', icon: 'Coffee', display_order: 1 },
  { id: 'cold-brew', name: 'Cold Brew', icon: 'CupSoda', display_order: 2 },
  { id: 'non-coffee', name: 'Non-Coffee', icon: 'Milk', display_order: 3 },
  { id: 'pastries', name: 'Pastries', icon: 'Croissant', display_order: 4 },
  { id: 'sandwiches', name: 'Sandwiches', icon: 'Layers', display_order: 5 },
  { id: 'desserts', name: 'Desserts', icon: 'Cake', display_order: 6 }
];

const customizationOptionsData = [
  // Sizes
  { id: 'size-12oz', group_type: 'size', name: '12oz (Regular)', price_modifier: 0.00, is_default: true },
  { id: 'size-16oz', group_type: 'size', name: '16oz (Large)', price_modifier: 20.00, is_default: false },
  // Sweetness
  { id: 'sweet-0', group_type: 'sweetness', name: '0% (Unsweetened)', price_modifier: 0.00, is_default: false },
  { id: 'sweet-50', group_type: 'sweetness', name: '50% (Less Sweet)', price_modifier: 0.00, is_default: false },
  { id: 'sweet-100', group_type: 'sweetness', name: '100% (Standard Sweet)', price_modifier: 0.00, is_default: true },
  // Milk Choices
  { id: 'milk-whole', group_type: 'milk', name: 'Whole Milk', price_modifier: 0.00, is_default: true },
  { id: 'milk-oat', group_type: 'milk', name: 'Oat Milk (+₱30)', price_modifier: 30.00, is_default: false },
  { id: 'milk-almond', group_type: 'milk', name: 'Almond Milk (+₱30)', price_modifier: 30.00, is_default: false },
  // Espresso Shots
  { id: 'shot-single', group_type: 'shots', name: 'Single Shot', price_modifier: 0.00, is_default: true },
  { id: 'shot-double', group_type: 'shots', name: 'Double Shot (+₱25)', price_modifier: 25.00, is_default: false },
  { id: 'shot-decaf', group_type: 'shots', name: 'Decaf', price_modifier: 0.00, is_default: false }
];

const menuItemsData = [
  // 1. COFFEE (Batangas & Artisanal Brews)
  {
    id: 'batangas-barako-pour-over',
    name: 'Batangas Barako Pour-Over',
    category_id: 'coffee',
    price: 95.00,
    base_price: 95.00,
    description: 'Artisanal single-origin Batangas Liberica hand-poured through slow drip, releasing bold earthy aromatics and cacao sweetness.',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    badge: 'SIGNATURE ORIGIN',
    rating: 4.9,
    review_count: '1.8k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'kape-kastila-spanish-latte',
    name: 'Kape Kastila / Spanish Latte',
    category_id: 'coffee',
    price: 145.00,
    base_price: 145.00,
    description: 'Signature rich espresso layered over silky sweetened condensed milk and topped with fresh microfoam.',
    image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER',
    rating: 4.9,
    review_count: '2.4k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'kape-leche-flan',
    name: 'Kape Leche Flan',
    category_id: 'coffee',
    price: 165.00,
    base_price: 165.00,
    description: 'Decadent double espresso poured over rich caramel flan custard, condensed cream, and golden amber syrup.',
    image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    badge: "CHEF'S SPECIAL",
    rating: 4.9,
    review_count: '1.1k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'salted-muscovado-latte',
    name: 'Salted Muscovado Latte',
    category_id: 'coffee',
    price: 150.00,
    base_price: 150.00,
    description: 'Espresso combined with natural Antique muscovado raw cane syrup, steamed whole milk, and a pinch of Pangasinan sea salt.',
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    badge: 'POPULAR',
    rating: 4.8,
    review_count: '980+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'tablea-mocha',
    name: 'Tablea Mocha',
    category_id: 'coffee',
    price: 160.00,
    base_price: 160.00,
    description: 'Pure melted Davao heirloom tablea cacao blended with double shot espresso and velvety textured milk.',
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    badge: 'LOCAL PRIDE',
    rating: 4.8,
    review_count: '1.3k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'kape-pandan',
    name: 'Kape Pandan',
    category_id: 'coffee',
    price: 155.00,
    base_price: 155.00,
    description: 'Smooth espresso infused with fragrant, house-simmered screwpine pandan leaf syrup and creamy milk.',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    badge: 'AROMATIC',
    rating: 4.7,
    review_count: '760+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'americano-batangueno',
    name: 'Americano Batangueño',
    category_id: 'coffee',
    price: 110.00,
    base_price: 110.00,
    description: 'Bold, smoky double shot of Barako espresso stretched over piping hot pure water with dense golden crema.',
    image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80',
    badge: 'BOLD KICK',
    rating: 4.8,
    review_count: '890+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'hazelnut-barako-macchiato',
    name: 'Hazelnut Barako Macchiato',
    category_id: 'coffee',
    price: 140.00,
    base_price: 140.00,
    description: 'Steamed milk stained with robust Barako espresso and finished with aromatic roasted hazelnut drizzle.',
    image_url: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
    badge: 'POPULAR',
    rating: 4.7,
    review_count: '910+',
    is_available: true,
    has_customization: true
  },

  // 2. COLD BREW
  {
    id: '24-hour-barako-cold-brew',
    name: '24-Hour Barako Cold Brew',
    category_id: 'cold-brew',
    price: 130.00,
    base_price: 130.00,
    description: 'Coarse-ground Batangas Liberica steeped in cold filtered spring water for 24 full hours for a low-acid, intense dark chocolate profile.',
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER',
    rating: 4.9,
    review_count: '1.6k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'coconut-cream-cloud-cold-brew',
    name: 'Coconut Cream Cloud Cold Brew',
    category_id: 'cold-brew',
    price: 165.00,
    base_price: 165.00,
    description: 'Slow-steeped Barako cold brew topped with a thick, velvety blanket of whipped fresh coconut cream cold foam.',
    image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    badge: "CHEF'S PICK",
    rating: 4.9,
    review_count: '1.2k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'sweet-muscovado-vanilla-cold-brew',
    name: 'Sweet Muscovado Vanilla Cold Brew',
    category_id: 'cold-brew',
    price: 150.00,
    base_price: 150.00,
    description: 'Smooth cold brew sweetened with molasses-rich muscovado and Madagascar vanilla bean essence.',
    image_url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
    badge: 'POPULAR',
    rating: 4.8,
    review_count: '840+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'calamansi-tonic-cold-brew',
    name: 'Calamansi Tonic Cold Brew',
    category_id: 'cold-brew',
    price: 160.00,
    base_price: 160.00,
    description: 'Effervescent craft tonic water poured over fresh Philippine calamansi citrus juice and floating cold brew coffee.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    badge: 'REFRESHING',
    rating: 4.7,
    review_count: '670+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'kapet-gatas-cold-brew',
    name: "Kape't Gatas Cold Brew",
    category_id: 'cold-brew',
    price: 140.00,
    base_price: 140.00,
    description: 'Traditional roadside Filipino cold brew softened with creamy evaporated and condensed farm fresh milk.',
    image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80',
    badge: 'CLASSIC',
    rating: 4.8,
    review_count: '1.0k+',
    is_available: true,
    has_customization: true
  },

  // 3. NON-COFFEE
  {
    id: 'davao-tablea-tsokolate-batirol',
    name: 'Davao Tablea Tsokolate Batirol',
    category_id: 'non-coffee',
    price: 130.00,
    base_price: 130.00,
    description: 'Heirloom roasted cacao nibs hand-whisked to a frothy perfection using an authentic wooden molinillo batirol.',
    image_url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    badge: 'HERITAGE',
    rating: 4.9,
    review_count: '1.4k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'halaya-ube-latte',
    name: 'Halaya Ube Latte',
    category_id: 'non-coffee',
    price: 150.00,
    base_price: 150.00,
    description: 'Creamy purple yam slow-cooked with coconut milk, layered under fresh dairy and dusted with ube velvet powder.',
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER',
    rating: 4.9,
    review_count: '2.1k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'calamansi-mint-sparkler',
    name: 'Calamansi Mint Sparkler',
    category_id: 'non-coffee',
    price: 120.00,
    base_price: 120.00,
    description: 'Muddled fresh calamansi lime, crisp garden spearmint leaves, pure wild honey, and sparkling mineral soda.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    badge: 'COOLER',
    rating: 4.8,
    review_count: '820+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'matcha-ube-float',
    name: 'Matcha Ube Float',
    category_id: 'non-coffee',
    price: 170.00,
    base_price: 170.00,
    description: 'Premium ceremonial Japanese Uji matcha poured over sweet purple ube puree and crowned with creamy vanilla float.',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    badge: 'TRENDING',
    rating: 4.8,
    review_count: '1.5k+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'guyabano-ginger-iced-tea',
    name: 'Guyabano Ginger Iced Tea',
    category_id: 'non-coffee',
    price: 115.00,
    base_price: 115.00,
    description: 'Tangy soursop (guyabano) nectar brewed with organic black tea, a gentle hint of native ginger root, and crushed ice.',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    badge: 'HEALTHY',
    rating: 4.7,
    review_count: '590+',
    is_available: true,
    has_customization: true
  },
  {
    id: 'strawberries-cream-latik-latte',
    name: 'Strawberries & Cream Latik Latte',
    category_id: 'non-coffee',
    price: 160.00,
    base_price: 160.00,
    description: 'La Trinidad highland crushed strawberries swirled with fresh cream and topped with fragrant toasted caramelized coconut latik.',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    badge: 'SEASONAL',
    rating: 4.8,
    review_count: '780+',
    is_available: true,
    has_customization: true
  },

  // 4. PASTRIES
  {
    id: 'classic-brioche-ensaymada',
    name: 'Classic Brioche Ensaymada',
    category_id: 'pastries',
    price: 95.00,
    base_price: 95.00,
    description: 'Ultra-fluffy French brioche bun lathered with creamy golden butter cream and piled high with aged Queso de Bola.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER',
    rating: 4.9,
    review_count: '1.9k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'toasted-spanish-bread',
    name: 'Toasted Spanish Bread',
    category_id: 'pastries',
    price: 65.00,
    base_price: 65.00,
    description: 'Warm bakery roll stuffed with rich caramelized buttery breadcrumbs, toasted sugar, and served with a golden crust.',
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    badge: 'HOT BAKED',
    rating: 4.8,
    review_count: '1.1k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'ube-cheese-pandesal',
    name: 'Ube Cheese Pandesal',
    category_id: 'pastries',
    price: 75.00,
    base_price: 75.00,
    description: 'Soft purple halaya ube dough filled with a savory block of melting quickmelt cheese, dusted in toasted breadcrumbs.',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    badge: 'POPULAR',
    rating: 4.9,
    review_count: '2.2k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'bibingka-galapong-supreme',
    name: 'Bibingka Galapong Supreme',
    category_id: 'pastries',
    price: 125.00,
    base_price: 125.00,
    description: 'Traditional clay-oven baked rice cake on banana leaves topped with native salted egg slices, grated fresh coconut, and melting butter.',
    image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
    badge: 'TRADITIONAL',
    rating: 4.9,
    review_count: '1.5k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'pan-de-regla',
    name: 'Pan de Regla',
    category_id: 'pastries',
    price: 45.00,
    base_price: 45.00,
    description: 'Nostalgic local panaderia crimson bread pastry loaded with sweet and rich red bread pudding filling.',
    image_url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80',
    badge: 'NOSTALGIC',
    rating: 4.6,
    review_count: '720+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'kare-kare-empanada',
    name: 'Kare-Kare Empanada',
    category_id: 'pastries',
    price: 95.00,
    base_price: 95.00,
    description: 'Flaky baked crust pastry packed with savory beef stewed in creamy roasted peanut sauce, string beans, and a dab of bagoong.',
    image_url: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=600&q=80',
    badge: "CHEF'S SPECIAL",
    rating: 4.8,
    review_count: '860+',
    is_available: true,
    has_customization: false
  },

  // 5. SANDWICHES
  {
    id: 'corned-beef-pandesal-sliders',
    name: 'Corned Beef Pandesal Sliders',
    category_id: 'sandwiches',
    price: 160.00,
    base_price: 160.00,
    description: 'Three freshly baked artisan pandesal buns packed with slow-cooked shredded garlic corned beef brisket and caramelized onions.',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER',
    rating: 4.9,
    review_count: '1.7k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'vigan-longganisa-patty-melt',
    name: 'Vigan Longganisa Patty Melt',
    category_id: 'sandwiches',
    price: 180.00,
    base_price: 180.00,
    description: 'Garlicky Vigan longganisa pork patty, melted cheddar cheese, fried sunny-side egg, and spiced vinegar mayo on toasted sourdough.',
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    badge: "CHEF'S PICK",
    rating: 4.9,
    review_count: '1.4k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'kesong-puti-basil-pesto-toast',
    name: 'Kesong Puti & Basil Pesto Toast',
    category_id: 'sandwiches',
    price: 150.00,
    base_price: 150.00,
    description: 'Fresh carabao white cheese grilled golden on thick crusty country bread with aromatic basil cashew pesto and ripe tomatoes.',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    badge: 'VEGGIE FAVORITE',
    rating: 4.8,
    review_count: '910+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'spicy-tuna-adobo-melt',
    name: 'Spicy Tuna Adobo Melt',
    category_id: 'sandwiches',
    price: 145.00,
    base_price: 145.00,
    description: 'Flaked yellowfin tuna braised in spicy garlic-peppercorn adobo glaze, toasted with sharp cheddar and mozzarella on brioche.',
    image_url: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&w=600&q=80',
    badge: 'SAVORY & SPICY',
    rating: 4.7,
    review_count: '790+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'tinapa-pate-crostini',
    name: 'Tinapa Pâté Crostini',
    category_id: 'sandwiches',
    price: 155.00,
    base_price: 155.00,
    description: 'Velvety smoked bangus fish pâté whipped with cream cheese, capers, and calamansi zest on crunchy toasted baguette rounds.',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    badge: 'ARTISANAL',
    rating: 4.8,
    review_count: '640+',
    is_available: true,
    has_customization: false
  },

  // 6. DESSERTS
  {
    id: 'mango-graham-float-cup',
    name: 'Mango Graham Float Cup',
    category_id: 'desserts',
    price: 120.00,
    base_price: 120.00,
    description: 'Chilled dessert cup layered with sweet golden Guimaras mango slices, whipped condensed cream, and crushed honey graham crackers.',
    image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER',
    rating: 4.9,
    review_count: '2.5k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'biko-with-latik',
    name: 'Biko with Latik',
    category_id: 'desserts',
    price: 85.00,
    base_price: 85.00,
    description: 'Steamed glutinous brown rice simmered in coconut milk and muscovado sugar, blanketed with golden crunchy latik curds.',
    image_url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
    badge: 'HERITAGE',
    rating: 4.8,
    review_count: '1.2k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'caramelized-turon-con-leche',
    name: 'Caramelized Turon Con Leche',
    category_id: 'desserts',
    price: 90.00,
    base_price: 90.00,
    description: 'Crispy spring rolls stuffed with Saba banana and ripe jackfruit (langka), glazed with crunchy brown sugar and drizzled with dulce de leche.',
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    badge: 'CRISPY SWEET',
    rating: 4.8,
    review_count: '1.6k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'classic-caramel-leche-flan',
    name: 'Classic Caramel Leche Flan',
    category_id: 'desserts',
    price: 110.00,
    base_price: 110.00,
    description: 'Velvety smooth, melt-in-your-mouth egg yolk and milk custard topped with bittersweet golden caramelized sugar syrup.',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    badge: 'CROWD FAVORITE',
    rating: 4.9,
    review_count: '2.0k+',
    is_available: true,
    has_customization: false
  },
  {
    id: 'tablea-fudge-brownie',
    name: 'Tablea Fudge Brownie',
    category_id: 'desserts',
    price: 85.00,
    base_price: 85.00,
    description: 'Chewy, intensely fudgy dark brownie baked with pure Davao single-origin cacao tablea and sprinkled with coarse sea salt.',
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    badge: 'CHOCOLATE HEAVEN',
    rating: 4.8,
    review_count: '1.3k+',
    is_available: true,
    has_customization: false
  }
];

const fs = require('fs');
const path = require('path');
const ORDERS_FILE = path.join(__dirname, 'orders_store.json');

// Active Orders in-memory cache with disk persistence
const ordersMap = new Map();

function saveOrdersToDisk() {
  try {
    const list = Array.from(ordersMap.entries());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {}
}

function loadOrdersFromDisk() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
      data.forEach(([k, v]) => ordersMap.set(k, v));
    }
  } catch (e) {}
}

loadOrdersFromDisk();

// Ensure initial sample order KM-108 exists if not loaded
if (!ordersMap.has('KM-108')) {
ordersMap.set('KM-108', {
  id: 'km-uuid-108',
  order_code: 'KM-108',
  customer_name: 'Jusselle Surio',
  customer_phone: '0917-888-2468',
  branch_name: 'Kape Muna — Main Branch',
  order_type: 'In-Store Walk-in',
  payment_method: 'Pay at Counter',
  payment_status: 'pending',
  payment_reference: null,
  pickup_time: 'ASAP (10-15 mins)',
  status: 'Pending Payment',
  subtotal: 210.00,
  service_fee: 0.00,
  discount: 0.00,
  total_price: 210.00,
  notes: 'Extra hot please, ready for counter pickup',
  created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
  items: [
    {
      id: 'item-108-1',
      menu_item_id: 'batangas-barako-pour-over',
      item_name: 'Batangas Barako Pour-Over',
      item_price: 95.00,
      quantity: 1,
      selected_size: '16oz (Large)',
      selected_sweetness: '100% (Standard Sweet)',
      selected_milk: 'Whole Milk',
      selected_shots: 'Single Shot',
      customization_total: 20.00,
      line_total: 115.00,
      special_notes: 'Extra hot please'
    },
    {
      id: 'item-108-2',
      menu_item_id: 'classic-brioche-ensaymada',
      item_name: 'Classic Brioche Ensaymada',
      item_price: 95.00,
      quantity: 1,
      selected_size: 'Standard',
      selected_sweetness: 'Default',
      selected_milk: 'None',
      selected_shots: 'None',
      customization_total: 0.00,
      line_total: 95.00,
      special_notes: 'Warm and toasted'
    }
  ]
});
  saveOrdersToDisk();
}

// Realtime SSE Clients listening to order changes
const sseClients = new Map(); // order_code -> Set of response objects

function broadcastOrderUpdate(orderCode, order) {
  const clients = sseClients.get(orderCode);
  if (clients && clients.size > 0) {
    const payload = JSON.stringify({ type: 'UPDATE', data: order });
    clients.forEach(res => {
      res.write(`data: ${payload}\n\n`);
    });
  }
}

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

/**
 * 1. GET /api/menu
 * Fetch active categories, products, and available customizations.
 */
app.get('/api/menu', async (req, res) => {
  try {
    if (supabase) {
      const [{ data: categories }, { data: menu_items }, { data: customizations }] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('menu_items').select('*').eq('is_available', true).order('name', { ascending: true }),
        supabase.from('customization_options').select('*').order('display_order', { ascending: true })
      ]);

      if (categories && menu_items && customizations) {
        return res.json({
          success: true,
          categories,
          menu_items,
          customization_options: customizations
        });
      }
    }

    // Fallback to local high-fidelity dataset
    return res.json({
      success: true,
      categories: categoriesData,
      menu_items: menuItemsData,
      customization_options: customizationOptionsData
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch menu' });
  }
});

// ----------------------------------------------------------------------------
// Customer Authentication Endpoints
// ----------------------------------------------------------------------------
const usersMap = new Map();

// Default demo customer
usersMap.set('jusselle@kapemuna.local', {
  id: 'usr-jusselle-1',
  full_name: 'Jusselle Surio',
  email: 'jusselle@kapemuna.local',
  phone: '0917-888-2468',
  password: 'password123',
  branch_name: 'Kape Muna — Main Branch'
});

/**
 * Auth: POST /api/auth/register
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const { full_name, email, phone, password, branch_name } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (usersMap.has(normalizedEmail)) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      full_name: full_name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      password,
      branch_name: branch_name || 'Kape Muna — Main Branch'
    };

    usersMap.set(normalizedEmail, newUser);

    const { password: _, ...userProfile } = newUser;
    return res.status(201).json({ success: true, user: userProfile });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ success: false, error: 'Server registration error' });
  }
});

/**
 * Auth: POST /api/auth/login
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalized = email.toLowerCase().trim();
    let user = usersMap.get(normalized);

    // Also allow login with phone number
    if (!user) {
      for (const u of usersMap.values()) {
        if (u.phone && u.phone === email.trim()) {
          user = u;
          break;
        }
      }
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email/phone or password' });
    }

    const { password: _, ...userProfile } = user;
    return res.json({ success: true, user: userProfile });
  } catch (err) {
    console.error('Error logging in user:', err);
    return res.status(500).json({ success: false, error: 'Server login error' });
  }
});

/**
 * Server-side Price Validator
 */
function calculateItemPricing(item) {
  const menuItem = menuItemsData.find(m => m.id === item.menu_item_id);
  const basePrice = menuItem ? Number(menuItem.base_price) : Number(item.item_price || 0);

  let addonPrice = 0;
  // Size add-on
  if (item.selected_size && item.selected_size.includes('16oz')) {
    addonPrice += 20.00;
  }
  // Milk add-on
  if (item.selected_milk && (item.selected_milk.includes('Oat') || item.selected_milk.includes('Almond'))) {
    addonPrice += 30.00;
  }
  // Espresso Shots
  if (item.selected_shots && item.selected_shots.includes('Double')) {
    addonPrice += 25.00;
  }
  // Food & Pastry Add-ons (e.g. Butter +₱15, Ganache +₱15, Whipped Cream +₱20, Cheese +₱25)
  if (Array.isArray(item.selected_addons)) {
    item.selected_addons.forEach(add => {
      if (typeof add === 'string') {
        if (add.includes('25')) addonPrice += 25.00;
        else if (add.includes('20')) addonPrice += 20.00;
        else if (add.includes('15')) addonPrice += 15.00;
      }
    });
  } else if (item.customization_total && Number(item.customization_total) > 0 && !item.selected_size?.includes('16oz') && !item.selected_milk?.includes('Oat') && !item.selected_milk?.includes('Almond') && !item.selected_shots?.includes('Double')) {
    addonPrice += Number(item.customization_total);
  }

  const unitPrice = basePrice + addonPrice;
  const quantity = Math.max(1, parseInt(item.quantity || 1, 10));
  const lineTotal = unitPrice * quantity;

  return {
    basePrice,
    addonPrice,
    unitPrice,
    quantity,
    lineTotal
  };
}

/**
 * 2. POST /api/orders
 * Validate price calculation on the server and insert new order.
 */
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      branch_name = 'Kape Muna — Main Branch',
      order_type,
      payment_method,
      payment_reference,
      pickup_time = 'ASAP (10-15 mins)',
      items = [],
      notes = '',
      applied_discount = 0
    } = req.body;

    if (!customer_name || !order_type || !payment_method || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order fields (customer_name, order_type, payment_method, items)'
      });
    }

    // Server-side Price Verification
    let calculatedSubtotal = 0;
    const verifiedItems = items.map((item, index) => {
      const pricing = calculateItemPricing(item);
      calculatedSubtotal += pricing.lineTotal;

      return {
        id: `item-${Date.now()}-${index}`,
        menu_item_id: item.menu_item_id,
        item_name: item.item_name,
        item_price: pricing.basePrice,
        quantity: pricing.quantity,
        selected_size: item.selected_size || '12oz (Regular)',
        selected_sweetness: item.selected_sweetness || '100% (Standard Sweet)',
        selected_milk: item.selected_milk || 'Whole Milk',
        selected_shots: item.selected_shots || 'Single Shot',
        customization_total: pricing.addonPrice,
        line_total: pricing.lineTotal,
        special_notes: item.special_notes || ''
      };
    });

    const discount = Number(applied_discount) || 0;
    const serviceFee = 0; // standard counter pick-up
    const totalPrice = Math.max(0, calculatedSubtotal - discount + serviceFee);

    // Initial status determined by payment
    let initialStatus = 'Pending Payment';
    let paymentStatus = 'pending';

    if (order_type === 'Remote Pre-Order' && payment_reference) {
      paymentStatus = 'paid';
      initialStatus = 'Queued';
    } else if (order_type === 'In-Store Walk-in' && payment_method === 'Online Payment' && payment_reference) {
      paymentStatus = 'paid';
      initialStatus = 'Queued';
    } else {
      // In-Store Pay at counter or awaiting reference
      paymentStatus = 'pending';
      initialStatus = 'Pending Payment';
    }

    // Generate unique order code (e.g., KM-109, KM-234)
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const orderCode = `KM-${randomDigits}`;

    const newOrder = {
      id: `km-${Date.now()}`,
      order_code: orderCode,
      customer_name,
      customer_phone: customer_phone || 'N/A',
      branch_name,
      order_type,
      payment_method,
      payment_status: paymentStatus,
      payment_reference: payment_reference || null,
      pickup_time,
      status: initialStatus,
      subtotal: calculatedSubtotal,
      service_fee: serviceFee,
      discount,
      total_price: totalPrice,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: verifiedItems
    };

    // Store in local map
    ordersMap.set(orderCode, newOrder);
    saveOrdersToDisk();

    // If Supabase is active, persist to PostgreSQL
    if (supabase) {
      try {
        const { data: insertedOrder, error: orderErr } = await supabase
          .from('orders')
          .insert({
            order_code: newOrder.order_code,
            customer_name: newOrder.customer_name,
            customer_phone: newOrder.customer_phone,
            branch_name: newOrder.branch_name,
            order_type: newOrder.order_type,
            payment_method: newOrder.payment_method,
            payment_status: newOrder.payment_status,
            payment_reference: newOrder.payment_reference,
            pickup_time: newOrder.pickup_time,
            status: newOrder.status,
            subtotal: newOrder.subtotal,
            service_fee: newOrder.service_fee,
            discount: newOrder.discount,
            total_price: newOrder.total_price,
            notes: newOrder.notes
          })
          .select()
          .single();

        if (orderErr) {
          console.warn('[Supabase] Warning inserting order:', orderErr.message);
        } else if (insertedOrder) {
          newOrder.id = insertedOrder.id;
          const orderItemsPayload = verifiedItems.map(it => ({
            order_id: insertedOrder.id,
            menu_item_id: it.menu_item_id,
            item_name: it.item_name,
            item_price: it.item_price,
            quantity: it.quantity,
            selected_size: it.selected_size,
            selected_sweetness: it.selected_sweetness,
            selected_milk: it.selected_milk,
            selected_shots: it.selected_shots,
            customization_total: it.customization_total,
            line_total: it.line_total,
            special_notes: it.special_notes
          }));
          await supabase.from('order_items').insert(orderItemsPayload);
        }
      } catch (err) {
        console.warn('[Supabase] Error saving order to database:', err.message);
      }
    }

    broadcastOrderUpdate(orderCode, newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, error: 'Server error processing order' });
  }
});

/**
 * 3. GET /api/orders/:code
 * Retrieve live order status and itemized summary.
 */
app.get('/api/orders/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();

    // Check Supabase first if connected
    if (supabase) {
      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('order_code', code)
          .single();

        if (orderData && !error) {
          const formatted = {
            ...orderData,
            items: orderData.order_items || []
          };
          ordersMap.set(code, formatted);
          return res.json({ success: true, order: formatted });
        }
      } catch (e) {
        console.warn('[Supabase] Read failed, checking local store:', e.message);
      }
    }

    // Check local store
    const localOrder = ordersMap.get(code);
    if (!localOrder) {
      return res.status(404).json({ success: false, error: `Order ${code} not found` });
    }

    return res.json({ success: true, order: localOrder });
  } catch (error) {
    console.error('Error retrieving order:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve order' });
  }
});

/**
 * 4. PATCH /api/orders/:code/cancel
 * Verify current status; allow cancellation if 'Pending Payment' or 'Queued',
 * reject with HTTP 400 if already 'Preparing' or later.
 */
app.patch('/api/orders/:code/cancel', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    let order = ordersMap.get(code);

    if (supabase) {
      try {
        const { data: dbOrder } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('order_code', code)
          .single();
        if (dbOrder) {
          order = { ...dbOrder, items: dbOrder.order_items || [] };
          ordersMap.set(code, order);
        }
      } catch (e) {}
    }

    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${code} not found` });
    }

    const currentStatus = order.status;

    // Strict cancellation rule:
    // ONLY allowed when status is 'Pending Payment' or 'Queued'
    if (currentStatus !== 'Pending Payment' && currentStatus !== 'Queued') {
      return res.status(400).json({
        success: false,
        error: `Cancellation rejected: Order is already '${currentStatus}'. Orders currently preparing or completed cannot be cancelled.`
      });
    }

    order.status = 'Cancelled';
    order.updated_at = new Date().toISOString();
    ordersMap.set(code, order);
    saveOrdersToDisk();

    if (supabase) {
      await supabase
        .from('orders')
        .update({ status: 'Cancelled', updated_at: order.updated_at })
        .eq('order_code', code);
    }

    broadcastOrderUpdate(code, order);

    return res.json({
      success: true,
      message: `Order ${code} was successfully cancelled.`,
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ success: false, error: 'Failed to cancel order' });
  }
});

/**
 * 5. PATCH /api/orders/:code/status
 * Barista / Admin helper to transition status and trigger live Realtime updates.
 */
app.patch('/api/orders/:code/status', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { status, payment_status } = req.body;

    const validStatuses = ['Pending Payment', 'Queued', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status '${status}'` });
    }

    let order = ordersMap.get(code);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${code} not found` });
    }

    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    order.updated_at = new Date().toISOString();

    ordersMap.set(code, order);
    saveOrdersToDisk();

    if (supabase) {
      const updates = { updated_at: order.updated_at };
      if (status) updates.status = status;
      if (payment_status) updates.payment_status = payment_status;
      await supabase.from('orders').update(updates).eq('order_code', code);
    }

    broadcastOrderUpdate(code, order);

    return res.json({
      success: true,
      message: `Order ${code} status updated to ${order.status}`,
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

/**
 * 6. GET /api/orders/:code/stream
 * Server-Sent Events (SSE) Realtime Stream for Instant Local Updates
 */
app.get('/api/orders/:code/stream', (req, res) => {
  const code = req.params.code.toUpperCase();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(code)) {
    sseClients.set(code, new Set());
  }
  const clientSet = sseClients.get(code);
  clientSet.add(res);

  // Send initial state immediately
  const existingOrder = ordersMap.get(code);
  if (existingOrder) {
    res.write(`data: ${JSON.stringify({ type: 'INITIAL', data: existingOrder })}\n\n`);
  }

  req.on('close', () => {
    clientSet.delete(res);
    if (clientSet.size === 0) {
      sseClients.delete(code);
    }
  });
});

app.listen(PORT, () => {
  console.log(`☕ Kape Muna Backend Server running on http://localhost:${PORT}`);
});
