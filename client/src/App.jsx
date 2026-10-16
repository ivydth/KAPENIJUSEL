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
import FavoritesTab from './components/FavoritesTab';
import ProfileTab from './components/ProfileTab';
import { CATEGORIES, MENU_ITEMS } from './data/menuData';
import { CartProvider, useCart } from './context/CartContext';
import {
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Coffee,
  Heart
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function MainApp() {
  // Current logged in customer state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kape_muna_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Application View: 'landing' | 'auth' | 'portal'
  // When page is refreshed, stay in portal if user is already authenticated
  const [viewState, setViewState] = useState(() => {
    try {
      const saved = localStorage.getItem('kape_muna_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.email || u.id)) {
          return 'portal';
        }
      }
    } catch {}
    return 'landing';
  });

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  // Update user profile handler across state and localStorage
  const handleUpdateUser = (updatedProfile) => {
    setCurrentUser(updatedProfile);
    try {
      localStorage.setItem('kape_muna_user', JSON.stringify(updatedProfile));
      const rawAccounts = localStorage.getItem('kape_muna_accounts');
      if (rawAccounts) {
        const accounts = JSON.parse(rawAccounts);
        const emailKey = updatedProfile.email?.toLowerCase().trim();
        if (emailKey && accounts[emailKey]) {
          accounts[emailKey] = { ...accounts[emailKey], ...updatedProfile };
          localStorage.setItem('kape_muna_accounts', JSON.stringify(accounts));
        }
      }
    } catch {}
  };

  // Portal tab states: 'home' | 'favorites' | 'tracking' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState(CATEGORIES);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterTag, setFilterTag] = useState('all'); // 'all' | 'bestseller' | 'chef' | 'popular'
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      const isRead = localStorage.getItem('kape_muna_notifications_read');
      return isRead === 'true' ? 0 : 3;
    } catch {
      return 0;
    }
  });

  // Customer Favorites state with local persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('kape_muna_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const next = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      try {
        localStorage.setItem('kape_muna_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

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
    setActiveTab('home');
  };

  // Filtered menu items for Home tab
  const filteredHomeItems = React.useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
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
            if (q && activeTab !== 'home') setActiveTab('home');
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          unreadCount={unreadCount}
          onOpenNotifications={() => {
            setIsNotificationsOpen(true);
            setUnreadCount(0);
            try {
              localStorage.setItem('kape_muna_notifications_read', 'true');
            } catch {}
          }}
          onToggleSideMenu={() => setActiveTab('profile')}
        />

        {/* Main Tab Content */}
        <main className="relative z-10 flex-1">
          {/* TAB 1: HOME (Includes Promo Carousel + Category Chips + Full Scrollable Menu List) */}
          {activeTab === 'home' && (
            <div className="space-y-4 pb-28 pt-1">
              {/* Promo Banner Carousel */}
              <PromoCarousel onOrderNow={handleQuickOrderNow} />

              {/* Category Chips (Smooth non-clipping circular pills) */}
              <CategoryChips
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                }}
              />

              {/* Filter Badges Filter (All Items / ★ Bestsellers / 👨‍🍳 Chef's Pick / 🔥 Popular) */}
              <div className="px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
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

              {/* Full Scrollable Menu List replacing the 20% off card */}
              <div className="px-4 sm:px-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-roast uppercase tracking-wider">
                    {selectedCategory === 'all'
                      ? 'Our Full Menu'
                      : `${categories.find((c) => c.id === selectedCategory)?.name || 'Category'} Menu`}
                  </h2>
                  <span className="text-xs text-roast/50 font-medium">
                    {filteredHomeItems.length} {filteredHomeItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {filteredHomeItems.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-[#EDE3D5] p-6">
                    <Sparkles className="w-8 h-8 text-caramel mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-roast">No items found</p>
                    <p className="text-xs text-roast/60 mt-1">
                      Try adjusting your search query or category filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {filteredHomeItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onSelect={(it) => setCustomizingItem(it)}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FAVORITES (Customer Saved Items with Heart Toggle) */}
          {activeTab === 'favorites' && (
            <FavoritesTab
              menuItems={menuItems}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectItem={(item) => setCustomizingItem(item)}
              onExploreMenu={() => {
                setActiveTab('home');
                setSelectedCategory('all');
              }}
            />
          )}

          {/* TAB 3: TRACKING */}
          {activeTab === 'tracking' && (
            <div className="pt-2 pb-28">
              <LiveOrderTracker
                orderCode={activeOrderCode}
                onBackToMenu={() => setActiveTab('home')}
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
                onUpdateUser={handleUpdateUser}
              />
            </div>
          )}
        </main>

        {/* Drink & Bakery Customization Modal */}
        <CustomizationModal
          item={customizingItem}
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
          isFavorite={Boolean(customizingItem && favorites.includes(customizingItem.id))}
          onToggleFavorite={toggleFavorite}
        />

        {/* Cart & Checkout Drawer */}
        <CartDrawer
          onOrderCreated={handleOrderCreated}
          currentUser={currentUser}
        />

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
