import React from 'react';
import { Heart, Sparkles, ArrowRight, Coffee } from 'lucide-react';
import MenuItemCard from './MenuItemCard';

export default function FavoritesTab({
  menuItems = [],
  favorites = [],
  onToggleFavorite,
  onSelectItem,
  onExploreMenu,
}) {
  const favoriteItems = menuItems.filter((item) => favorites.includes(item.id));

  return (
    <div className="space-y-4 pb-28 pt-2 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 shadow-sm">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-sans text-roast tracking-tight">
              My Favorites
            </h1>
            <p className="text-xs text-roast/60">
              Your handcrafted go-to drinks and Merienda treats
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-white rounded-full border border-[#EDE3D5] text-roast/70 shadow-sm">
          {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Content */}
      {favoriteItems.length === 0 ? (
        <div className="text-center py-14 px-6 bg-white/90 rounded-3xl border border-[#EDE3D5] shadow-cafe-sm mt-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
            <Heart className="w-8 h-8 fill-rose-200 text-rose-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-roast mb-1.5">
            No Favorites Saved Yet
          </h2>
          <p className="text-xs sm:text-sm text-roast/65 max-w-sm mx-auto leading-relaxed mb-6">
            Tap the heart icon on any coffee, cold brew, or pastry to save your favorite picks here for instant ordering.
          </p>
          <button
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2 bg-roast hover:bg-caramel text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-cafe-sm active:scale-95"
          >
            <Coffee className="w-4 h-4 text-caramel-gold" />
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
          {favoriteItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
