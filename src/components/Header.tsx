import React, { useState } from 'react';
import { Search, Globe, User, Bookmark, TrendingUp, Grid, Shield, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  activeScreen: 'overview' | 'heatmaps' | 'screener';
  onNavigateScreen: (screen: 'overview' | 'heatmaps' | 'screener') => void;
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenGetStarted: () => void;
  watchlistCount: number;
  isLiveSimulating: boolean;
  onToggleLiveSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigateScreen,
  onOpenSearch,
  onOpenWatchlist,
  onOpenGetStarted,
  watchlistCount,
  isLiveSimulating,
  onToggleLiveSimulation
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#f0f3fa]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Search & Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8 flex-1">
          {/* TradingView Logo Mark */}
          <button
            onClick={() => onNavigateScreen('overview')}
            aria-label="TradingView Home"
            className="flex items-center gap-1.5 focus:outline-none hover:opacity-85 transition group cursor-pointer"
          >
            <svg
              className="h-8 w-11 fill-current text-black group-hover:text-[#2962FF] transition-colors"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.2 0H0v28h8.2V0zM17.4 8.7h-6.2v19.3h6.2V8.7zM27.5 13.9H22v14.1h5.5V13.9zM36 4.9h-5.5v23.1H36V4.9z" />
            </svg>
          </button>

          {/* Global Search Bar (opens Ctrl+K search palette) */}
          <div
            onClick={onOpenSearch}
            className="relative w-44 md:w-64 cursor-pointer group"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6a6d78] group-hover:text-[#2962FF] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              placeholder="Search (Ctrl+K)"
              className="w-full pl-9 pr-3 py-1.5 bg-[#f0f3fa] text-xs md:text-sm font-normal rounded-full border-none focus:ring-2 focus:ring-[#2962FF] text-[#131722] placeholder-[#6a6d78] transition cursor-pointer group-hover:bg-[#e7ecf5]"
            />
          </div>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-[15px] font-medium">
            {/* Products dropdown */}
            <div className="relative">
              <button
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                className="flex items-center gap-1 text-[#131722] hover:text-[#2962FF] transition-colors cursor-pointer py-1"
              >
                <span>Products</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6a6d78]" />
              </button>
              {productsMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#e0e3eb] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setProductsMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      onNavigateScreen('overview');
                      setProductsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#131722] hover:bg-[#f0f3fa] flex items-center gap-2.5 transition"
                  >
                    <TrendingUp className="w-4 h-4 text-[#2962FF]" />
                    <span>Markets Overview</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateScreen('heatmaps');
                      setProductsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#131722] hover:bg-[#f0f3fa] flex items-center gap-2.5 transition"
                  >
                    <Grid className="w-4 h-4 text-[#089981]" />
                    <span>Stock & Crypto Heatmaps</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateScreen('screener');
                      setProductsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#131722] hover:bg-[#f0f3fa] flex items-center gap-2.5 transition"
                  >
                    <Search className="w-4 h-4 text-[#f59e0b]" />
                    <span>Market Screener</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateScreen('heatmaps')}
              className={`transition-colors cursor-pointer py-1 ${
                activeScreen === 'heatmaps'
                  ? 'text-[#2962FF] font-semibold border-b-2 border-[#2962FF] pb-0.5'
                  : 'text-[#131722] hover:text-[#2962FF]'
              }`}
            >
              Heatmaps
            </button>

            <button
              onClick={() => onNavigateScreen('overview')}
              className={`transition-colors cursor-pointer py-1 ${
                activeScreen === 'overview'
                  ? 'text-[#2962FF] font-semibold border-b-2 border-[#2962FF] pb-0.5'
                  : 'text-[#131722] hover:text-[#2962FF]'
              }`}
            >
              Markets
            </button>

            <button
              onClick={() => onNavigateScreen('screener')}
              className={`transition-colors cursor-pointer py-1 ${
                activeScreen === 'screener'
                  ? 'text-[#2962FF] font-semibold border-b-2 border-[#2962FF] pb-0.5'
                  : 'text-[#131722] hover:text-[#2962FF]'
              }`}
            >
              Screener
            </button>

            <a
              href="#brokers"
              onClick={(e) => {
                e.preventDefault();
                onOpenGetStarted();
              }}
              className="text-[#131722] hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Brokers
            </a>
          </nav>
        </div>

        {/* User Actions & Localization */}
        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
          {/* Live Feed Toggle */}
          <button
            onClick={onToggleLiveSimulation}
            title={isLiveSimulating ? "Live data is actively ticking" : "Live data is paused"}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-[#e0e3eb] hover:bg-[#f8f9fd] transition cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveSimulating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="text-[#6a6d78]">{isLiveSimulating ? 'Live Feed' : 'Paused'}</span>
          </button>

          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            aria-label="Open Watchlist"
            className="relative p-1.5 text-[#131722] hover:text-[#2962FF] rounded-full hover:bg-[#f8f9fd] transition cursor-pointer"
            title="Open Watchlist"
          >
            <Bookmark className="w-5 h-5 text-[#6a6d78] hover:text-[#2962FF]" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2962FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1.5 text-[#131722] hover:text-[#2962FF] text-sm font-medium px-2 py-1.5 rounded-md hover:bg-[#f8f9fd] transition cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#6a6d78]" />
              <span className="font-medium text-xs tracking-wide">{currentLang}</span>
            </button>
            {langMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-[#e0e3eb] py-1 z-50"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#131722] hover:bg-[#f0f3fa] flex items-center justify-between"
                  >
                    <span>{lang.name}</span>
                    {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="Account Menu"
              className="p-1.5 text-[#131722] hover:text-[#2962FF] rounded-full hover:bg-[#f8f9fd] transition cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e0e3eb] p-3 z-50 text-left"
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[#f0f3fa]">
                  <div className="w-10 h-10 rounded-full bg-[#2962FF]/10 text-[#2962FF] font-bold flex items-center justify-center text-sm">
                    TV
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#131722]">Pro Trader</div>
                    <div className="text-xs text-[#6a6d78]">Paper Account: $100,000.00</div>
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      onOpenWatchlist();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#131722] hover:bg-[#f0f3fa] rounded flex items-center justify-between"
                  >
                    <span>My Watchlist</span>
                    <span className="text-[11px] text-[#2962FF] font-semibold">{watchlistCount} saved</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateScreen('heatmaps');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#131722] hover:bg-[#f0f3fa] rounded"
                  >
                    Market Heatmap
                  </button>
                  <button
                    onClick={() => {
                      onOpenGetStarted();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#2962FF] font-semibold hover:bg-[#f0f3fa] rounded"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={onOpenGetStarted}
            className="bg-gradient-to-r from-[#2962FF] to-[#7b2cbf] text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:opacity-95 shadow-sm transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
