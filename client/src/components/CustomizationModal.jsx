import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Check,
  Sparkles,
  Flame,
  Utensils,
  Coffee,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FALLBACK_IMAGE } from '../data/menuData';

export default function CustomizationModal({ item, isOpen, onClose }) {
  const { addToCart, setIsCartOpen } = useCart();

  // Drink customization states
  const [selectedSize, setSelectedSize] = useState('12oz (Regular)');
  const [selectedSweetness, setSelectedSweetness] = useState('100% (Standard)');
  const [selectedMilk, setSelectedMilk] = useState('Whole Milk');
  const [selectedShots, setSelectedShots] = useState('Single Shot');

  // Food / Bakery customization states
  const [servingTemp, setServingTemp] = useState('Warm & Toasted ♨️'); // 'Warm & Toasted ♨️' | 'Room Temperature ❄️'
  const [selectedFoodAddons, setSelectedFoodAddons] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);

  // Common states
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Check if item is a drink or food
  const isDrink = !['pastries', 'sandwiches', 'desserts'].includes(item?.category_id);

  // Food specific add-on options based on item type
  const foodAddonChoices = useMemo(() => {
    if (!item) return [];
    if (item.category_id === 'sandwiches') {
      return [
        { id: 'add-cheese', label: 'Extra Kesong Puti', addPrice: 25 },
        { id: 'add-aioli', label: 'Garlic Herb Aioli Dip', addPrice: 15 },
      ];
    }
    // Pastries & Desserts (e.g. Chocolate Muffin, Croissant, Cheesecake)
    return [
      { id: 'add-ganache', label: 'Warm Chocolate Ganache Drizzle', addPrice: 15 },
      { id: 'add-cream', label: 'Vanilla Sweet Whipped Cream', addPrice: 20 },
      { id: 'add-butter', label: 'Artisan French Butter Pat', addPrice: 15 },
    ];
  }, [item]);

  // Quick notes pills for seamless mobile one-tap selection
  const quickNoteChips = useMemo(() => {
    if (isDrink) {
      return ['Extra hot ♨️', 'Less ice 🧊', 'Sugar on the side 🧂', 'Extra cup sleeve ☕'];
    }
    return ['Warm it up please ♨️', 'Include fork & napkin 🍴', 'Separate takeout bag 🥡', 'Slice in half ✂️'];
  }, [isDrink]);

  // Reset defaults when item changes
  useEffect(() => {
    if (item) {
      setSelectedSize('12oz (Regular)');
      setSelectedSweetness('100% (Standard)');
      setSelectedMilk('Whole Milk');
      setSelectedShots('Single Shot');
      setServingTemp('Warm & Toasted ♨️');
      setSelectedFoodAddons([]);
      setQuickNotes([]);
      setQuantity(1);
      setSpecialNotes('');
      setIsSuccessToast(false);
    }
  }, [item]);

  // Toggle food addon
  const toggleFoodAddon = (addon) => {
    setSelectedFoodAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  // Toggle quick note chip
  const toggleQuickNote = (note) => {
    setQuickNotes((prev) => {
      if (prev.includes(note)) {
        return prev.filter((n) => n !== note);
      }
      return [...prev, note];
    });
  };

  // Drink Options
  const SIZES = [
    { id: 'size-12oz', label: '12oz', desc: 'Regular', addPrice: 0 },
    { id: 'size-16oz', label: '16oz', desc: 'Large', addPrice: 20 },
  ];

  const SWEETNESS = [
    { id: 'sweet-0', label: '0%', desc: 'Unsweetened' },
    { id: 'sweet-50', label: '50%', desc: 'Less Sweet' },
    { id: 'sweet-100', label: '100%', desc: 'Standard' },
  ];

  const MILK_CHOICES = [
    { id: 'milk-whole', label: 'Whole Milk', desc: 'Rich Dairy', addPrice: 0 },
    { id: 'milk-oat', label: 'Oat Milk (+₱30)', desc: 'Oatly Plant-based', addPrice: 30 },
    { id: 'milk-almond', label: 'Almond Milk (+₱30)', desc: 'Nutty & Light', addPrice: 30 },
  ];

  const SHOTS = [
    { id: 'shot-single', label: 'Single Shot', desc: 'Balanced', addPrice: 0 },
    { id: 'shot-double', label: 'Double Shot (+₱25)', desc: 'Extra Bold', addPrice: 25 },
    { id: 'shot-decaf', label: 'Decaf', desc: 'Arabica', addPrice: 0 },
  ];

  // Dynamic real-time price calculation
  const pricing = useMemo(() => {
    if (!item) return { unitPrice: 0, addonTotal: 0, lineTotal: 0 };

    let addons = 0;
    if (isDrink) {
      if (selectedSize.includes('16oz')) addons += 20;
      if (selectedMilk.includes('Oat') || selectedMilk.includes('Almond')) addons += 30;
      if (selectedShots.includes('Double')) addons += 25;
    } else {
      selectedFoodAddons.forEach((a) => {
        addons += Number(a.addPrice || 0);
      });
    }

    const base = Number(item.base_price) || 0;
    const unit = base + addons;
    return {
      unitPrice: unit,
      addonTotal: addons,
      lineTotal: unit * quantity,
    };
  }, [item, selectedSize, selectedMilk, selectedShots, selectedFoodAddons, quantity, isDrink]);

  if (!isOpen || !item) return null;

  const handleAddToCart = () => {
    // Combine quick chips and custom notes
    const combinedNotes = [
      ...quickNotes,
      specialNotes.trim(),
    ].filter(Boolean).join(' • ');

    addToCart({
      menu_item_id: item.id,
      item_name: item.name,
      item_price: Number(item.base_price),
      image_url: item.image_url,
      quantity,
      selected_size: isDrink ? selectedSize : servingTemp,
      selected_sweetness: isDrink ? selectedSweetness : 'Standard',
      selected_milk: isDrink ? selectedMilk : 'None',
      selected_shots: isDrink ? selectedShots : 'None',
      selected_addons: isDrink ? [] : selectedFoodAddons.map((a) => `${a.label} (+₱${a.addPrice})`),
      customization_total: pricing.addonTotal,
      unit_price: pricing.unitPrice,
      line_total: pricing.lineTotal,
      special_notes: combinedNotes,
    });

    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
      onClose();
      setIsCartOpen(true);
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      {/* Modal Sheet / Card */}
      <div
        className="w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-300 border border-[#EAE1D3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact, Appetizing Photo Banner */}
        <div className="relative h-36 sm:h-44 w-full bg-[#2A1810] flex-shrink-0">
          <img
            src={item.image_url || FALLBACK_IMAGE}
            alt={item.name}
            onError={(e) => {
              if (e.target.src !== FALLBACK_IMAGE) {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }
            }}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#221610] via-black/30 to-black/50" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all backdrop-blur-md shadow-md z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Item Info Overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-caramel-gold bg-black/40 px-2 py-0.5 rounded-full border border-caramel-gold/30">
                {isDrink ? 'Artisan Beverage' : 'Fresh Kitchen & Bakery'}
              </span>
              {item.badge && (
                <span className="text-[9px] uppercase font-extrabold tracking-wider bg-caramel text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans drop-shadow-sm leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-normal">
              {item.description}
            </p>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 no-scrollbar">
          
          {/* A. FOOD & BAKERY CUSTOMIZATION (Best UX for Picture 2) */}
          {!isDrink ? (
            <div className="space-y-4">
              {/* 1. Serving Temperature Selection */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Serving Temperature
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'warm', label: 'Warm & Toasted ♨️', desc: 'Fresh & melty (Recommended)' },
                    { id: 'room', label: 'Room Temperature ❄️', desc: 'Standard bakery serving' },
                  ].map((temp) => {
                    const isSelected = servingTemp.includes(temp.id === 'warm' ? 'Warm' : 'Room');
                    return (
                      <button
                        key={temp.id}
                        type="button"
                        onClick={() => setServingTemp(temp.label)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#2A1810] text-[#FAF6F0] border-[#2A1810] shadow-cafe-sm ring-1 ring-caramel'
                            : 'bg-white text-[#221610] border-[#EAE1D3] hover:border-caramel/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm">{temp.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-caramel-gold" />}
                        </div>
                        <p className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#221610]/60'}`}>
                          {temp.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Bakery Pairing Add-ons */}
              {foodAddonChoices.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#221610] uppercase tracking-wider">
                      Add-on Pairings & Drizzles
                    </label>
                    <span className="text-[10px] text-roast/50">Optional</span>
                  </div>
                  <div className="space-y-2">
                    {foodAddonChoices.map((addon) => {
                      const isSelected = selectedFoodAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleFoodAddon(addon)}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#2A1810] text-white border-[#2A1810] shadow-sm'
                              : 'bg-white text-[#221610] border-[#EAE1D3] hover:border-caramel/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-caramel-gold bg-caramel-gold' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-[#221610]" strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-bold">{addon.label}</span>
                          </div>
                          <span className={`text-xs font-semibold ${isSelected ? 'text-caramel-gold' : 'text-caramel'}`}>
                            +₱{addon.addPrice.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* B. BEVERAGE CUSTOMIZATION */
            <div className="space-y-4">
              {/* 1. Size Options: 12oz (Base), 16oz (+₱20) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#221610] uppercase tracking-wider">
                    Select Size
                  </label>
                  <span className="text-[10px] text-caramel font-semibold">Required</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {SIZES.map((size) => {
                    const isSelected = selectedSize.includes(size.label);
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(`${size.label} (${size.desc})`)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#2A1810] text-[#FAF6F0] border-[#2A1810] shadow-cafe-sm ring-1 ring-caramel'
                            : 'bg-white text-[#221610] border-[#EAE1D3] hover:border-caramel/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm">{size.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-caramel-gold" />}
                        </div>
                        <p className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-[#221610]/60'}`}>
                          {size.desc}
                        </p>
                        <p className={`text-xs font-semibold mt-1 ${isSelected ? 'text-caramel-gold' : 'text-caramel'}`}>
                          {size.addPrice === 0 ? 'Base Price' : `+₱${size.addPrice}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sweetness Level: 0%, 50%, 100% */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Sweetness Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SWEETNESS.map((sw) => {
                    const isSelected = selectedSweetness.includes(sw.label);
                    return (
                      <button
                        key={sw.id}
                        type="button"
                        onClick={() => setSelectedSweetness(`${sw.label} (${sw.desc})`)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-caramel text-white border-caramel shadow-sm'
                            : 'bg-white text-[#221610] border-[#EAE1D3] hover:border-caramel/40'
                        }`}
                      >
                        <span className="block font-bold text-xs">{sw.label}</span>
                        <span className={`block text-[10px] ${isSelected ? 'text-white/80' : 'text-[#221610]/50'}`}>
                          {sw.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Milk Choices: Whole Milk, Oat Milk (+₱30), Almond Milk (+₱30) */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Milk Preference
                </label>
                <div className="space-y-2">
                  {MILK_CHOICES.map((milk) => {
                    const isSelected = selectedMilk.includes(milk.label);
                    return (
                      <div
                        key={milk.id}
                        onClick={() => setSelectedMilk(milk.label)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#2A1810] text-white border-[#2A1810]'
                            : 'bg-white text-[#221610] border-[#EAE1D3] hover:border-caramel/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-caramel-gold bg-caramel-gold' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{milk.label}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#221610]/50'}`}>
                              {milk.desc}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-caramel-gold' : 'text-caramel'}`}>
                          {milk.addPrice === 0 ? 'Included' : `+₱${milk.addPrice}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Espresso Shots: Single, Double (+₱25), Decaf */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Espresso Shots
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SHOTS.map((shot) => {
                    const isSelected = selectedShots.includes(shot.label);
                    return (
                      <button
                        key={shot.id}
                        type="button"
                        onClick={() => setSelectedShots(shot.label)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#2A1810] text-white border-[#2A1810] shadow-sm'
                            : 'bg-white text-[#221610] border-[#EAE1D3] hover:border-caramel/40'
                        }`}
                      >
                        <span className="block font-bold text-xs">{shot.label}</span>
                        <span className={`block text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-caramel-gold' : 'text-caramel'}`}>
                          {shot.addPrice === 0 ? '₱0' : `+₱${shot.addPrice}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* C. ONE-TAP QUICK REQUEST CHIPS (Delightful Mobile UX) */}
          <div>
            <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-1.5">
              Quick Requests
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickNoteChips.map((chip) => {
                const isSelected = quickNotes.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleQuickNote(chip)}
                    className={`py-1 px-2.5 rounded-full text-[11px] font-semibold transition-all border ${
                      isSelected
                        ? 'bg-caramel text-white border-caramel shadow-xs'
                        : 'bg-white text-roast/80 border-[#EAE1D3] hover:border-caramel/40'
                    }`}
                  >
                    {chip} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. CUSTOM SPECIAL REQUESTS */}
          <div>
            <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-1">
              Custom Barista / Kitchen Notes
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Any specific requests or preferences..."
              rows={2}
              className="w-full bg-white border border-[#EAE1D3] p-2.5 rounded-2xl text-xs text-[#221610] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
            />
          </div>
        </div>

        {/* Dynamic Footer with Realtime Price Counter */}
        <div
          className="p-3.5 sm:p-4 bg-white border-t border-[#EAE1D3] flex items-center justify-between gap-3 shadow-lg"
          style={{ paddingBottom: 'max(0.9rem, env(safe-area-inset-bottom, 0.9rem))' }}
        >
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#EAE1D3] rounded-2xl p-1 bg-[#FAF7F2]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-roast hover:bg-cream-chip disabled:opacity-30 transition-all active:scale-90"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-xs sm:text-sm text-[#221610]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-roast hover:bg-cream-chip transition-all active:scale-90"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary CTA: Add to Order with Dynamic Price */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-[#221610] to-caramel hover:from-[#160E0A] hover:to-caramel-hover text-white py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-cafe-md active:scale-95 transition-all"
          >
            <span>{isSuccessToast ? 'Added to Order! ✓' : 'Add to Order'}</span>
            <span className="text-caramel-gold font-extrabold tracking-tight">
              ₱{pricing.lineTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
