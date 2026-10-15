import React from 'react';
import { Home, BookOpen, Coffee, Gift, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNav({ activeTab, onSelectTab }) {
  const { cartCount, activeOrderCode } = useCart();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'order', label: 'Order', icon: Coffee, isCenter: true },
    { id: 'tracking', label: 'Track', icon: Gift, hasActiveBadge: Boolean(activeOrderCode) },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none px-0 sm:px-4 sm:pb-3">
      <div className="w-full max-w-2xl pointer-events-auto">
        <div
          className="glass-nav border-t sm:border border-[#ECE2D3] rounded-t-3xl sm:rounded-3xl shadow-cafe-float px-2 sm:px-6 py-2 flex items-center justify-around"
          style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))' }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <div key={item.id} className="relative -top-4 sm:-top-5 flex flex-col items-center">
                  <button
                    onClick={() => onSelectTab(item.id)}
                    className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-cafe-lg transition-all duration-300 active:scale-90 ${
                      isActive
                        ? 'bg-[#2A1810] text-[#FAF6F0] ring-4 ring-caramel/30 scale-105'
                        : 'bg-[#2A1810] text-[#FAF6F0] hover:bg-caramel hover:scale-105'
                    }`}
                    aria-label="Order & Cart"
                  >
                    <Icon className="w-6 h-6 text-caramel-gold" strokeWidth={2} />

                    {/* Cart Item Badge */}
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-caramel-gold text-[#221610] text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold mt-1 tracking-tight ${
                      isActive ? 'text-caramel' : 'text-[#221610]/70'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="group relative flex flex-col items-center py-1 px-2.5 sm:px-4 focus:outline-none transition-all active:scale-95"
              >
                {/* Active Indicator Top Pill */}
                <span
                  className={`absolute -top-2 w-7 sm:w-8 h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-caramel' : 'bg-transparent'
                  }`}
                />

                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? 'text-caramel scale-110'
                        : 'text-[#221610]/50 group-hover:text-[#221610]'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />

                  {/* Active order notification dot */}
                  {item.hasActiveBadge && item.id === 'tracking' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>

                <span
                  className={`text-[10px] sm:text-[11px] font-semibold mt-1 transition-colors ${
                    isActive
                      ? 'text-caramel font-bold'
                      : 'text-[#221610]/60 group-hover:text-[#221610]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
