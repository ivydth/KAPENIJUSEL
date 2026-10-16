import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import PromoCarousel from './components/PromoCarousel';
import CategoryChips from './components/CategoryChips';
import MenuItemCard from './components/MenuItemCard';
import CustomizationModal from './components/CustomizationModal';
import CartDrawer from './components/CartDrawer';
import LiveOrderTracker from './components/LiveOrderTracker';
import BottomNav from './components/BottomNav';
import NotificationsModal from './components/NotificationsModal';
import MenuTab from './components/MenuTab';
import ProfileTab from './components/ProfileTab';
import { CATEGORIES, MENU_ITEMS } from './data/menuData';
import { CartProvider, useCart } from './context/CartContext';
import {
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Coffee
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function MainApp() {
  // Application View: 'landing' | 'auth' | 'portal'
  const [viewState, setViewState] = useState(() => {
    // If user has not yet entered session, show landing page first
    return 'landing';
  });

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  // Current logged in customer state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kape_muna_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Portal tab states: 'home' | 'menu' | 'tracking' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState(CATEGORIES);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const {
    activeOrderCode,
    setActiveOrderCode,
    setIsCartOpen,
    cartCount,
  } = useCart();

  // Load menu data from backend or local fallback
  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch(`${API_BASE}/menu`);
        const data = await res.json();
        if (data.success && data.menu_items?.length) {
          setCategories(data.categories || CATEGORIES);
          setMenuItems(data.menu_items || MENU_ITEMS);
        }
      } catch (err) {
        console.warn('API fetch menu warning, utilizing local fallback dataset:', err);
        setCategories(CATEGORIES);
        setMenuItems(MENU_ITEMS);
      }
    }
    loadMenu();
  }, []);

  // Handlers for Landing & Auth Flow
  const handleGetStarted = () => {
    setAuthMode('signup');
    setViewState('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInClick = () => {
    setAuthMode('signin');
    setViewState('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setViewState('portal');
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    localStorage.removeItem('kape_muna_user');
    setCurrentUser(null);
    setViewState('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCreated = (newCode) => {
    setActiveTab('tracking');
  };

  const handleSelectTab = (tabId) => {
    if (tabId === 'order') {
      setIsCartOpen(true);
    } else {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickOrderNow = (targetCategory) => {
    if (targetCategory) setSelectedCategory(targetCategory);
    setActiveTab('menu');
  };

  // Popular picks for Home tab
  const popularPicks = menuItems.filter((m) =>
    [
      'batangas-barako-pour-over',
      'kape-kastila-spanish-latte',
      'classic-brioche-ensaymada',
      'corned-beef-pandesal-sliders',
      'halaya-ube-latte',
      'mango-graham-float-cup'
    ].includes(m.id)
  );

  // 1. RENDER LANDING PAGE
  if (viewState === 'landing') {
    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        onSignInClick={handleSignInClick}
      />
    );
  }

  // 2. RENDER LOGIN & SIGN UP PAGE
  if (viewState === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onBackToLanding={() => setViewState('landing')}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // 3. RENDER MAIN CUSTOMER-FACING ORDERING PORTAL
  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#221610] w-full flex flex-col justify-start">
      {/* Centered responsive container */}
      <div className="w-full max-w-2xl sm:max-w-4xl mx-auto min-h-screen bg-[#F8F4EE] sm:shadow-cafe-sm sm:border-x sm:border-[#ECE2D3] flex flex-col relative transition-all duration-300">
        
        {/* Global Responsive Header with User Context */}
        <Header
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q && activeTab === 'home') setActiveTab('menu');
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenFilter={() => setActiveTab('menu')}
          onToggleSideMenu={() => setActiveTab('profile')}
        />

        {/* Main Tab Content */}
        <main className="relative z-10 flex-1">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4 pb-28 pt-1">
              {/* Promo Banner Carousel */}
              <PromoCarousel onOrderNow={handleQuickOrderNow} />

              {/* Category Chips */}
              <CategoryChips
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  setActiveTab('menu');
                }}
              />

              {/* Popular Picks Section */}
              <div className="px-4 sm:px-6 pt-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[#221610] tracking-tight">
                    Popular Picks
                  </h2>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="text-xs font-bold text-caramel hover:text-caramel-hover flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(popularPicks.length > 0 ? popularPicks : menuItems.slice(0, 3)).map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onSelect={(it) => setCustomizingItem(it)}
                    />
                  ))}
                </div>
              </div>

              {/* Weekend Special Promo Card */}
              <div className="px-4 sm:px-6 pt-2">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F4ECE1] to-[#EAE0D1] border border-[#E0D2C0] p-4 sm:p-5 flex items-center justify-between shadow-cafe-sm">
                  {/* Left Column: Promo Details */}
                  <div className="flex-1 max-w-[65%] z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-caramel">
                      Weekend Special
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#221610] tracking-tight leading-none mt-1 mb-1">
                      20% OFF
                    </h3>
                    <p className="text-xs text-[#221610]/70 font-medium mb-3">
                      On all iced coffee & cold brew orders
                    </p>
                    <button
                      onClick={() => handleQuickOrderNow('cold-brew')}
                      className="inline-flex items-center gap-1.5 bg-[#221610] hover:bg-caramel text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all shadow-cafe-sm active:scale-95"
                    >
                      <span>ORDER NOW</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Right Column: Visual with 20% OFF Badge */}
                  <div className="relative w-[35%] flex items-center justify-end">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                      <img
                        src="/images/spanish_latte.png"
                        alt="Special drink"
                        className="w-full h-full object-cover rounded-2xl shadow-md transform rotate-2"
                      />
                      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#221610] text-[#FAF6F0] flex flex-col items-center justify-center shadow-cafe-sm border-2 border-white">
                        <span className="text-[11px] font-extrabold leading-none">20%</span>
                        <span className="text-[7px] font-bold uppercase tracking-tighter">OFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENU */}
          {activeTab === 'menu' && (
            <div className="pt-2 pb-28">
              <MenuTab
                categories={categories}
                menuItems={menuItems}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectItem={(item) => setCustomizingItem(item)}
              />
            </div>
          )}

          {/* TAB 3: TRACKING */}
          {activeTab === 'tracking' && (
            <div className="pt-2 pb-28">
              <LiveOrderTracker
                orderCode={activeOrderCode}
                onBackToMenu={() => setActiveTab('menu')}
              />
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="pt-2 pb-28">
              <ProfileTab
                currentUser={currentUser}
                onTrackOrder={(code) => {
                  setActiveOrderCode(code);
                  setActiveTab('tracking');
                }}
                onSignOut={handleSignOut}
              />
            </div>
          )}
        </main>

        {/* Drink & Bakery Customization Modal */}
        <CustomizationModal
          item={customizingItem}
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
        />

        {/* Cart & Checkout Drawer */}
        <CartDrawer onOrderCreated={handleOrderCreated} />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        {/* Responsive Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
