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

const menuItemsData = require('./menu_data.json');

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
// Customer Authentication Endpoints with Persistent Disk Storage
// ----------------------------------------------------------------------------
const USERS_FILE = path.join(__dirname, 'users_store.json');
const usersMap = new Map();

function saveUsersToDisk() {
  try {
    const list = Array.from(usersMap.entries());
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save users to disk:', e);
  }
}

function loadUsersFromDisk() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        data.forEach(([k, v]) => {
          if (k && v) {
            usersMap.set(String(k).toLowerCase().trim(), v);
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to load users from disk:', e);
  }

  // Ensure default demo customer is always available
  if (!usersMap.has('jusselle@kapemuna.local')) {
    usersMap.set('jusselle@kapemuna.local', {
      id: 'usr-jusselle-1',
      full_name: 'Jusselle Surio',
      email: 'jusselle@kapemuna.local',
      phone: '0917-888-2468',
      password: 'password123',
      branch_name: 'Kape Muna — Main Branch'
    });
    saveUsersToDisk();
  }
}

// Load persisted accounts on server launch
loadUsersFromDisk();

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
      const existing = usersMap.get(normalizedEmail);
      // If same password provided, treat as safe profile update/sync
      if (existing.password === password) {
        existing.full_name = full_name.trim();
        if (phone) existing.phone = phone.trim();
        if (branch_name) existing.branch_name = branch_name;
        usersMap.set(normalizedEmail, existing);
        saveUsersToDisk();
        const { password: _, ...userProfile } = existing;
        return res.status(200).json({ success: true, user: userProfile, message: 'Account updated successfully' });
      }
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
    saveUsersToDisk();

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

    // Also allow login with phone number (stripping formatting spaces/dashes)
    if (!user) {
      const cleanInputPhone = email.trim().replace(/[\s-]/g, '');
      for (const u of usersMap.values()) {
        const uPhone = (u.phone || '').trim().replace(/[\s-]/g, '');
        if (uPhone && (uPhone === cleanInputPhone || u.phone === email.trim())) {
          user = u;
          break;
        }
      }
    }

    // Also check case-insensitive match on user email property
    if (!user) {
      for (const [k, u] of usersMap.entries()) {
        if (k.toLowerCase().trim() === normalized || (u.email && u.email.toLowerCase().trim() === normalized)) {
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
 * Auth: POST /api/auth/update
 * Updates user profile details (full_name, phone, branch_name, password)
 */
app.post('/api/auth/update', (req, res) => {
  try {
    const { email, full_name, phone, branch_name, new_password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required to update profile' });
    }

    const normalized = email.toLowerCase().trim();
    let user = usersMap.get(normalized);

    if (!user) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    if (full_name) user.full_name = full_name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (branch_name) user.branch_name = branch_name;
    if (new_password) user.password = new_password;

    usersMap.set(normalized, user);
    saveUsersToDisk();

    const { password: _, ...userProfile } = user;
    return res.json({ success: true, user: userProfile });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ success: false, error: 'Server profile update error' });
  }
});

/**
 * Auth: GET /api/auth/me
 */
app.get('/api/auth/me', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ success: false, error: 'Email parameter required' });
  const user = usersMap.get(email);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  const { password: _, ...userProfile } = user;
  return res.json({ success: true, user: userProfile });
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
