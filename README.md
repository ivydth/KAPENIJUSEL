# ☕ Kape Muna — Customer-Facing Coffee Shop Ordering System

Event-driven, full-stack local coffee shop web application built with **React**, **Node.js / Express**, **Tailwind CSS**, and **Supabase (PostgreSQL + Realtime)**.

---

## 🌟 Features Implemented

1. **Design System & Layout (Mobile-First & Responsive)**:
   - **Header / Top Bar**: Customer avatar (`JS`), dynamic greeting (*"Good day, Jusselle!"*), branch indicator (*"Kape Muna — Main Branch"*), interactive Notification Bell with unread badge counter, and rounded search bar with category filter.
   - **Promo Carousel**: Dark roast card (`#1F140E`), elegant typography (*"Good Coffee Good Vibes"*), subtext, *"ORDER NOW ➔"* button, realistic ceramic coffee cup with latte art on wooden saucer, and carousel pagination dots.
   - **Category Chips**: Horizontally scrollable circular icons for All, Coffee, Cold Brew, Pastries, Sandwiches, Desserts, Non-Coffee.
   - **Item Cards**: Warm-ivory background (`#FDFBF7`), high-res photography, tags (`BESTSELLER`, `CHEF'S PICK`, `POPULAR`), star ratings, price in Philippine Pesos (₱), and direct `+` customize button.
   - **Weekend Special Promo**: Dedicated bottom promo card matching reference: *"WEEKEND SPECIAL 20% OFF On all coffee orders"* with circular 20% OFF badge.
   - **Sticky Bottom Navigation**: Elevated center coffee cup button matching reference mockup, with cart counter badge and active caramel highlight line.

2. **Customer Flow & Modals**:
   - **Drink Customization Modal**: Size options (12oz Base, 16oz +₱20), Sweetness level (0%, 50%, 100%), Milk choices (Whole Milk, Oat Milk +₱30, Almond Milk +₱30), Espresso shots (Single, Double +₱25, Decaf), dynamic real-time price counter, quantity stepper, and special notes.
   - **Cart & Checkout Drawer**: Order Type Switch between **"Remote Pre-Order"** (strictly requires GCash/Maya reference) and **"In-Store Walk-in"** (choice between Pay at Counter or Full Online Payment). Pickup time slot selector, customer name & phone inputs, and clear price breakdown.
   - **Live Order Tracking**: Alphanumeric Order Code (`#KM-108`), auto-generated scannable QR Code, step progress indicator tracking real-time status (`Pending Payment ➔ Queued ➔ Preparing ➔ Ready for Pickup ➔ Completed`), dynamic alert banners (counter payment notice, barista crafting notice, ready for pickup with confetti celebration), and **strict Cancel Order button** (active only when Pending Payment or Queued; strictly disabled/rejected with HTTP 400 once Preparing).
   - **Interactive Barista Simulator**: Built-in control bar to simulate barista transitions directly from the UI to witness real-time event updates!

3. **Backend & Supabase Architecture**:
   - **Supabase PostgreSQL Schema & Migrations**: `schema.sql` and `seed.sql` with tables for `profiles`, `categories`, `menu_items`, `customization_options`, `orders`, and `order_items`, with Row-Level Security (RLS) policies and Realtime replication enabled on the `orders` table.
   - **Node.js / Express Server**:
     - `GET /api/menu`: Fetch active categories, products, and customization options.
     - `POST /api/orders`: Server-side price calculation and verification.
     - `GET /api/orders/:code`: Live order details and itemized summary.
     - `PATCH /api/orders/:code/cancel`: Strict status verification (cancellation allowed only for Pending Payment and Queued; rejected with HTTP 400 if Preparing).
     - `PATCH /api/orders/:code/status`: Barista state transition handler.
     - `GET /api/orders/:code/stream`: Server-Sent Events (SSE) live event fallback.
   - **React State & Realtime Hook**: `useOrderTracker(orderCode)` subscribing to `supabase.channel('orders')` and live fallback streaming.

---

## 🚀 Running the Project

### Start both Frontend & Backend:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Build for Production:
```bash
npm run build
```
