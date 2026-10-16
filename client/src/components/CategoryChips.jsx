import React from 'react';
import {
  Coffee,
  Sparkles,
  CupSoda,
  Croissant,
  Layers,
  Cake,
  Milk,
  UtensilsCrossed
} from 'lucide-react';

// Icon mapping dictionary
const ICON_MAP = {
  all: Sparkles,
  coffee: Coffee,
  espresso: Coffee,
  'cold-brew': CupSoda,
  'non-coffee': Milk,
  pastries: Croissant,
  sandwiches: Layers,
  desserts: Cake,
  breakfast: UtensilsCrossed,
};

export default function CategoryChips({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="w-full px-4 sm:px-6 py-2">
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 -my-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const IconComponent = ICON_MAP[cat.id] || Coffee;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col items-center gap-1.5 flex-shrink-0 focus:outline-none transition-all active:scale-95"
            >
              {/* Circular Icon Container matching reference mockup */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-all duration-300 shadow-cafe-sm ${
                  isSelected
                    ? 'bg-[#2A1810] text-[#FAF6F0] border-[#2A1810] shadow-cafe-md scale-105 ring-2 ring-caramel/40'
                    : 'bg-[#FDFBF7] text-[#2A1810] border-[#EAE1D3] hover:border-caramel/50 hover:bg-[#F7EFE4]'
                }`}
              >
                <IconComponent
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isSelected ? 'scale-110 text-caramel-gold' : 'group-hover:scale-105'
                  }`}
                  strokeWidth={1.75}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[12px] sm:text-[13px] font-semibold tracking-tight transition-colors ${
                  isSelected ? 'text-[#2A1810] font-bold' : 'text-[#2A1810]/70 group-hover:text-[#2A1810]'
                }`}
              >
                {cat.name}
              </span>

              {/* Active Indicator Dot */}
              <span
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  isSelected ? 'bg-caramel scale-100' : 'bg-transparent scale-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
