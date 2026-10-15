import React from 'react';
import { Search, SlidersHorizontal, Bell, ShoppingBag, X, Coffee, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header({
  currentUser,
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  onOpenFilter,
  onToggleSideMenu,
  unreadCount = 3,
  selectedCategory,
  onSelectCategory
}) {
  const { cartCount, setIsCartOpen } = useCart();

  // Dynamic greeting based on current local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const customerName = currentUser?.full_name || 'Jusselle';
  const firstName = customerName.split(' ')[0] || 'Customer';
  const branchName = currentUser?.branch_name || 'Kape Muna — Main Branch';
  const initials = customerName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'KM';

  return (
    <header className="w-full bg-[#F8F4EE] pt-3 sm:pt-4 pb-2 px-4 sm:px-6 sticky top-0 z-30 transition-all border-b border-[#EDE3D5]/60 backdrop-blur-md bg-[#F8F4EE]/95">
      {/* Top Utility & Brand Bar */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        {/* Left: Mobile Menu / Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onToggleSideMenu}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-card border border-cream-border flex items-center justify-center text-roast hover:bg-cream-chip transition-all shadow-cafe-sm"
            aria-label="Open profile menu"
          >
            <div className="space-y-1">
              <span className="block w-4 h-0.5 bg-roast rounded-full"></span>
              <span className="block w-5 h-0.5 bg-roast rounded-full"></span>
              <span className="block w-3 h-0.5 bg-roast rounded-full"></span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-caramel to-caramel-light text-white font-bold text-xs flex items-center justify-center shadow-sm border border-white/50">
              {initials}
            </div>
            <div>
              <p className="text-[11px] text-roast/60 font-medium leading-none mb-0.5 flex items-center gap-1">
                <span>{greeting}, {firstName}!</span>
              </p>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-roast">
                <MapPin className="w-3 h-3 text-caramel flex-shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[220px]">{branchName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Brand Typography (for wider screens) */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-caramel">
            <Coffee className="w-4 h-4 fill-caramel/20" />
            <span className="font-display font-bold text-xl tracking-wider text-roast">Kape Muna</span>
          </div>
          <span className="text-[11px] tracking-wide text-roast/70 font-medium italic">
            "Your daily pause in a cup."
          </span>
        </div>

        {/* Right: Notification Bell & Quick Cart */}
        <div className="flex items-center gap-2">
          {/* Notification Bell with Badge */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-card border border-cream-border flex items-center justify-center text-roast hover:bg-cream-chip transition-all shadow-cafe-sm"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-roast/80" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-caramel text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-roast text-white flex items-center justify-center hover:bg-roast-light transition-all shadow-cafe-sm"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-cream-card" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-caramel-gold text-roast-dark text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#F8F4EE] shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Brand Header for Mobile: Title + Requested Tagline */}
      <div className="flex md:hidden flex-col items-center justify-center my-1.5 mb-2.5">
        <div className="flex items-center gap-1.5 text-caramel">
          <Coffee className="w-4 h-4 text-caramel fill-caramel/20" />
          <h1 className="font-display font-bold text-xl tracking-wide text-roast">
            Kape Muna
          </h1>
        </div>
        <p className="text-xs text-roast/70 font-medium italic mt-0.5">
          "Your daily pause in a cup."
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coffee, pastry, or drinks..."
            className="w-full bg-cream-card border border-cream-border pl-10 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-roast/45 shadow-cafe-sm focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-roast/40 hover:text-roast"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={onOpenFilter}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center transition-all shadow-cafe-sm ${
            selectedCategory !== 'all'
              ? 'bg-caramel text-white border-caramel'
              : 'bg-cream-card border-cream-border text-roast hover:bg-cream-chip'
          }`}
          aria-label="Filter menu"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
