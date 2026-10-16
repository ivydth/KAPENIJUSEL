import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import CategoryChips from './CategoryChips';

export default function MenuTab({
  categories = [],
  menuItems = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSelectItem,
  favorites = [],
  onToggleFavorite,
}) {
  const [filterTag, setFilterTag] = useState('all'); // 'all' | 'bestseller' | 'chef' | 'popular'

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter (supports both cold_brew / cold-brew and non_coffee / non-coffee)
      if (selectedCategory && selectedCategory !== 'all') {
        const normSelected = selectedCategory.replace(/-/g, '_');
        const normItemCat = (item.category_id || '').replace(/-/g, '_');
        if (normItemCat !== normSelected) return false;
      }

      // Tag filter
      if (filterTag === 'bestseller' && item.badge !== 'BESTSELLER') return false;
      if (filterTag === 'chef' && item.badge !== "CHEF'S PICK") return false;
      if (filterTag === 'popular' && item.badge !== 'POPULAR') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, filterTag, searchQuery]);

  return (
    <div className="space-y-4 pb-24">
      {/* Category Icons Row */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Filter Badges Filter (Bestsellers / Chef's Pick / Popular) */}
      <div className="px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-roast/50 uppercase tracking-wider flex-shrink-0">
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Items' },
          { id: 'bestseller', label: '★ Bestsellers' },
          { id: 'chef', label: "👨‍🍳 Chef's Pick" },
          { id: 'popular', label: '🔥 Popular' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTag(tab.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              filterTag === tab.id
                ? 'bg-roast text-white shadow-sm'
                : 'bg-white border border-[#EDE3D5] text-roast/70 hover:border-caramel/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-roast uppercase tracking-wider">
            {selectedCategory === 'all'
              ? 'Our Full Menu'
              : `${categories.find((c) => c.id === selectedCategory)?.name || 'Category'} Menu`}
          </h2>
          <span className="text-xs text-roast/50 font-medium">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#EDE3D5] p-6">
            <Sparkles className="w-8 h-8 text-caramel mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-roast">No items found</p>
            <p className="text-xs text-roast/60 mt-1">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
