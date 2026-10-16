import React from 'react';
import { ArrowRight, Sparkles, Coffee, Heart } from 'lucide-react';

export default function LandingPage({ onGetStarted, onSignInClick }) {
  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#221610] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Decorative Organic Backdrop Blobs & Floating Leaves */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#EBDBC6]/50 blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-[#E5D2B8]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 rounded-full bg-[#DFCEB7]/30 blur-2xl pointer-events-none" />

      {/* Decorative Floating Coffee Bean Accents (Matching Inspiration) */}
      <div className="absolute top-28 right-6 w-7 h-9 rounded-full bg-gradient-to-br from-[#452715] to-[#1E1108] transform rotate-45 shadow-sm opacity-80 pointer-events-none hidden sm:block">
        <div className="w-0.5 h-7 bg-[#2E180B] mx-auto mt-1 rounded-full" />
      </div>
      <div className="absolute top-1/2 left-4 w-6 h-8 rounded-full bg-gradient-to-br from-[#452715] to-[#1E1108] transform -rotate-25 shadow-sm opacity-80 pointer-events-none hidden sm:block">
        <div className="w-0.5 h-6 bg-[#2E180B] mx-auto mt-1 rounded-full" />
      </div>

      {/* 1. Header / Brand Bar */}
      <header className="relative z-10 pt-6 sm:pt-8 px-6 flex flex-col items-center text-center">
        {/* Coffee Logo Icon */}
        <div className="w-14 h-14 rounded-full bg-white border border-[#DFCBB5] flex items-center justify-center shadow-cafe-sm mb-2 transform hover:scale-105 transition-transform overflow-hidden p-1.5">
          <img src="/images/kape_muna_logo.png" alt="Kape Muna Logo" className="w-full h-full object-contain" />
        </div>

        {/* Brand Name */}
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#221610]">
          Kape Muna
        </h1>

        {/* Tagline Requested by User */}
        <p className="text-[11px] sm:text-xs tracking-[0.18em] text-[#221610]/70 uppercase font-bold mt-0.5">
          Your daily pause in a cup
        </p>
      </header>

      {/* 2. Middle Hero: Slogan & Coffee Imagery */}
      <div className="relative z-10 px-5 sm:px-8 py-2 flex flex-col items-center text-center flex-1 justify-center max-w-xl mx-auto w-full">
        {/* Slogan Requested by User: "Pause. Sip. Kape Muna." */}
        <div className="mb-4 relative">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#221610] tracking-tight leading-tight">
            Pause. Sip.
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-3xl sm:text-4xl font-display italic font-bold text-caramel leading-tight">
              Kape Muna.
            </span>
            <Sparkles className="w-4 h-4 text-caramel-gold animate-pulse" />
          </div>
        </div>

        {/* Hero Coffee Composition (Glass of Iced Latte & Hot Speckled Ceramic Mug) */}
        <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center my-1">
          {/* Soft back aura circles matching inspo */}
          <div className="absolute w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-[#EBDBC6] to-[#E3CEB4] shadow-inner" />
          <div className="absolute w-[80%] h-[80%] rounded-full border border-[#D5BEA1]/50 transform scale-95" />

          {/* High-res authentic coffee duo photography */}
          <div className="relative z-10 w-[88%] h-[88%] rounded-full overflow-hidden shadow-2xl border-4 border-white/80 p-0.5 bg-[#FAF7F2]">
            <img
              src="/images/landing_hero.png"
              alt="Kape Muna signature iced and hot coffees"
              className="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Action Bar: "Get Started" CTA */}
      <footer className="relative z-10 px-6 sm:px-8 pb-8 sm:pb-10 pt-3 max-w-md mx-auto w-full flex flex-col items-center">
        {/* Primary "Get Started" Button (Replaces bottom navigation as requested) */}
        <button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-[#221610] via-[#2E1A11] to-caramel hover:from-[#170D08] hover:to-caramel-hover text-white py-4 px-6 rounded-3xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-cafe-lg active:scale-95 transition-all group"
        >
          <span>Get Started</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>

        {/* Secondary Sign In Option */}
        <div className="mt-3.5 flex items-center gap-1 text-xs text-[#221610]/70">
          <span>Already have an account?</span>
          <button
            onClick={onSignInClick}
            className="font-bold text-caramel hover:text-caramel-hover underline underline-offset-2 ml-1"
          >
            Sign In
          </button>
        </div>
      </footer>
    </div>
  );
}
