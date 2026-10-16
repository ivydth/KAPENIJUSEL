import React from 'react';
import { Plus, Star } from 'lucide-react';
import { FALLBACK_IMAGE } from '../data/menuData';

export default function MenuItemCard({ item, onSelect }) {
  const {
    name,
    description,
    base_price,
    price,
    image_url,
    badge,
    rating = 4.8,
    review_count = '1.2k+',
  } = item;

  const displayPrice = Number(base_price ?? price ?? 0).toFixed(2);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-3 sm:p-3.5 shadow-cafe-sm hover:shadow-cafe-md transition-all duration-300 cursor-pointer active:scale-[0.98] hover:border-caramel/40"
    >
      <div>
        {/* Product Photo Container */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F3EDE2] mb-3">
          <img
            src={image_url || FALLBACK_IMAGE}
            alt={name}
            onError={(e) => {
              if (e.target.src !== FALLBACK_IMAGE) {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badge (BESTSELLER / CHEF'S PICK / POPULAR) */}
          {badge && (
            <div className="absolute top-2 left-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-[#221610]/85 text-[#FAF6F0] backdrop-blur-md shadow-sm border border-white/10">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-sm sm:text-base text-[#221610] line-clamp-1 group-hover:text-caramel transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-[#221610]/60 line-clamp-2 mt-0.5 leading-relaxed min-h-[32px]">
          {description}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mt-2 text-[11px] text-[#221610]/70">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
          <span className="font-bold text-[#221610]">{rating}</span>
          <span className="text-[#221610]/50">({review_count})</span>
        </div>
      </div>

      {/* Footer: Price & Direct '+' Button */}
      <div className="flex items-center justify-between mt-3 pt-1 border-t border-[#F2ECE2]/80">
        <div>
          <span className="text-xs text-[#221610]/50 font-medium">From</span>
          <p className="font-bold text-sm sm:text-base text-[#221610] tracking-tight">
            ₱{displayPrice}
          </p>
        </div>

        {/* Round '+' Button matching reference layout */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#221610] text-white flex items-center justify-center hover:bg-caramel active:scale-90 transition-all shadow-cafe-sm group-hover:shadow"
          aria-label={`Customize ${name}`}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
