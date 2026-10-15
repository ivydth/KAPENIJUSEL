import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const PROMO_SLIDES = [
  {
    id: 1,
    tag: 'FEATURED BLEND',
    titleLine1: 'Good Coffee',
    titleLine2: 'Good Vibes',
    subtitle: 'Freshly brewed coffee made to brighten your day.',
    buttonText: 'ORDER NOW',
    image: '/images/hero_coffee.png',
    bgGradient: 'from-[#23150D] via-[#2A1910] to-[#180E09]',
    categoryTarget: 'espresso'
  },
  {
    id: 2,
    tag: 'BATANGAS ORIGIN',
    titleLine1: 'Pure Barako',
    titleLine2: 'Cold Brew',
    subtitle: '16-hour slow steep with rich cacao notes & bold kick.',
    buttonText: 'TRY COLD BREW',
    image: '/images/cold_brew.png',
    bgGradient: 'from-[#1E1610] via-[#291C14] to-[#120B07]',
    categoryTarget: 'cold-brew'
  },
  {
    id: 3,
    tag: 'PASTRY COMBO',
    titleLine1: 'Morning Melt',
    titleLine2: '& Croissant',
    subtitle: 'Flaky French butter croissants fresh from our bakery.',
    buttonText: 'EXPLORE PASTRY',
    image: '/images/croissant.png',
    bgGradient: 'from-[#26170E] via-[#331E12] to-[#170C06]',
    categoryTarget: 'pastries'
  }
];

export default function PromoCarousel({ onOrderNow }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = PROMO_SLIDES[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  };

  return (
    <div className="px-4 sm:px-6 pt-1 pb-4">
      <div
        className={`relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-r ${slide.bgGradient} p-5 sm:p-7 text-white shadow-cafe-lg transition-all duration-700`}
      >
        {/* Subtle decorative coffee bean watermarks */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-caramel-gold/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3 min-h-[175px] sm:min-h-[200px]">
          {/* Left Column: Text & CTA */}
          <div className="flex-1 max-w-[62%] sm:max-w-[58%] z-10">
            {/* Tag */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-caramel-gold bg-caramel-gold/15 border border-caramel-gold/25 uppercase mb-2">
              <Sparkles className="w-2.5 h-2.5" />
              {slide.tag}
            </span>

            {/* Headline */}
            <div className="mb-2">
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight text-[#F7F4EE] leading-tight">
                {slide.titleLine1}
              </h2>
              <h3 className="text-2xl sm:text-3xl font-display italic font-bold text-caramel-light leading-tight">
                {slide.titleLine2}
              </h3>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-white/70 line-clamp-2 mb-4 leading-relaxed font-normal">
              {slide.subtitle}
            </p>

            {/* Action Button */}
            <button
              onClick={() => onOrderNow?.(slide.categoryTarget)}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-caramel to-caramel-light hover:from-caramel-hover hover:to-caramel text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-cafe-sm hover:shadow-cafe-md transition-all active:scale-95"
            >
              <span>{slide.buttonText}</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </button>
          </div>

          {/* Right Column: Hero Image with soft glow & drop shadow */}
          <div className="relative w-[38%] sm:w-[42%] flex items-center justify-end">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              {/* Soft back aura */}
              <div className="absolute inset-0 rounded-full bg-caramel/20 blur-xl transform scale-90" />
              <img
                src={slide.image}
                alt={slide.titleLine1}
                className="relative z-10 w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 mt-3 pt-1">
          {PROMO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-caramel-light'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
