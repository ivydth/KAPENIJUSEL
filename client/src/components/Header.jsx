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
      <div className="flex items-center justify-between gap-3 mb-2">
        {/* Left: User Profile Avatar & Greeting (Adjusted for clear view) */}
        <button
          onClick={onToggleSideMenu}
          className="flex items-center gap-3 text-left focus:outline-none group active:scale-95 transition-all"
          aria-label="User Profile"
        >
          <div className="w-11 h-11 rounded-full bg-[#381F12] text-[#FAF6F0] font-bold text-sm flex items-center justify-center shadow-md border-2 border-white/90 group-hover:scale-105 transition-transform flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-caramel">
              Welcome back
            </span>
            <span className="text-sm sm:text-base font-extrabold text-roast leading-snug">
              {greeting}, <span className="capitalize text-[#2A1810]">{firstName}!</span>
            </span>
          </div>
        </button>

        {/* Center: Brand Typography with New Illustrated Logo (for wider screens) */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img
              src="/images/kape_muna_logo.png"
              alt="Kape Muna Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-bold text-xl tracking-wider text-roast">Kape Muna</span>
          </div>
          <span className="text-[11px] tracking-wide text-roast/70 font-medium italic">
            "Your daily pause in a cup."
          </span>
        </div>

        {/* Right: Notification Bell Only (Cart removed as requested since Order button is in bottom nav) */}
        <div className="flex items-center">
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full bg-cream-card border border-cream-border flex items-center justify-center text-roast hover:bg-cream-chip transition-all shadow-cafe-sm active:scale-90"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-roast/80" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-caramel text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Brand Header for Mobile: Illustrated Logo + Title + Requested Tagline */}
      <div className="flex md:hidden flex-col items-center justify-center my-1 mb-2.5">
        <div className="flex items-center gap-2">
          <img
            src="/images/kape_muna_logo.png"
            alt="Kape Muna Logo"
            className="w-8 h-8 object-contain drop-shadow-sm"
          />
          <h1 className="font-display font-bold text-xl tracking-wide text-roast">
            Kape Muna
          </h1>
        </div>
        <p className="text-xs text-roast/70 font-medium italic mt-0.5">
          "Your daily pause in a cup."
        </p>
      </div>

      {/* Search Bar (Full Width with Filter Icon Removed as requested) */}
      <div className="w-full">
        <div className="relative w-full">
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
      </div>
    </header>
  );
}
