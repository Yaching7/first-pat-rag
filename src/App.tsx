import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { IndicesSection } from './components/IndicesSection';
import { MarketMovers } from './components/MarketMovers';
import { CategorySpotlight } from './components/CategorySpotlight';
import { BottomCTA } from './components/BottomCTA';
import { Footer } from './components/Footer';
import { ChartModal } from './components/ChartModal';
import { HeatmapView } from './components/HeatmapView';
import { ScreenerView } from './components/ScreenerView';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import {
  MAJOR_INDICES as INITIAL_MAJOR_INDICES,
  SECONDARY_INDICES as INITIAL_SECONDARY_INDICES,
  MOST_ACTIVE_STOCKS as INITIAL_STOCKS,
  TOP_CRYPTOCURRENCIES as INITIAL_CRYPTOS,
  FUTURES_AND_COMMODITIES as INITIAL_FUTURES,
  ALL_ASSETS
} from './data/marketData';
import { AssetCategory, MarketAsset, PaperTradePosition } from './types/market';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'overview' | 'heatmaps' | 'screener'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('Indices');
  
  // Dynamic market data states to support live updates
  const [majorIndices, setMajorIndices] = useState<MarketAsset[]>(INITIAL_MAJOR_INDICES);
  const [secondaryIndices, setSecondaryIndices] = useState<MarketAsset[]>(INITIAL_SECONDARY_INDICES);
  const [stocks, setStocks] = useState<MarketAsset[]>(INITIAL_STOCKS);
  const [cryptos, setCryptos] = useState<MarketAsset[]>(INITIAL_CRYPTOS);
  const [futures, setFutures] = useState<MarketAsset[]>(INITIAL_FUTURES);

  // Price flash tracker: { assetId: 'up' | 'down' | null }
  const [priceFlashMap, setPriceFlashMap] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Modals & Drawers state
  const [selectedAssetForChart, setSelectedAssetForChart] = useState<MarketAsset | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);

  // User Watchlist & Paper Portfolio state
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set(['sp500', 'nvda', 'aapl', 'btcusd', 'gold']));
  const [paperPositions, setPaperPositions] = useState<PaperTradePosition[]>([
    {
      id: 'trade-1',
      assetSymbol: 'NVDA',
      assetName: 'NVIDIA Corp',
      type: 'BUY',
      shares: 20,
      entryPrice: 135.50,
      timestamp: new Date().toISOString()
    }
  ]);

  // Live price simulator: subtly updates 1-2 random asset prices every ~3.5 seconds
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Pick a random group: 0 = major index, 1 = stocks, 2 = crypto, 3 = futures
      const group = Math.floor(Math.random() * 4);
      const isUp = Math.random() > 0.45; // slight positive drift
      const deltaPercent = (Math.random() * 0.18 + 0.02) * (isUp ? 1 : -1);

      if (group === 0) {
        setMajorIndices(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const target = prev[idx];
          const newPrice = target.price * (1 + deltaPercent / 100);
          const newChangePercent = target.changePercent + deltaPercent;

          setPriceFlashMap(m => ({ ...m, [target.id]: isUp ? 'up' : 'down' }));
          setTimeout(() => {
            setPriceFlashMap(m => ({ ...m, [target.id]: null }));
          }, 900);

          return prev.map((item, i) => i === idx ? {
            ...item,
            price: Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2))
          } : item);
        });
      } else if (group === 1) {
        setStocks(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const target = prev[idx];
          const newPrice = target.price * (1 + deltaPercent / 100);
          const newChangePercent = target.changePercent + deltaPercent;

          setPriceFlashMap(m => ({ ...m, [target.id]: isUp ? 'up' : 'down' }));
          setTimeout(() => {
            setPriceFlashMap(m => ({ ...m, [target.id]: null }));
          }, 900);

          return prev.map((item, i) => i === idx ? {
            ...item,
            price: Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2))
          } : item);
        });
      } else if (group === 2) {
        setCryptos(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const target = prev[idx];
          const cryptoDelta = deltaPercent * 1.5;
          const newPrice = target.price * (1 + cryptoDelta / 100);
          const newChangePercent = target.changePercent + cryptoDelta;

          setPriceFlashMap(m => ({ ...m, [target.id]: isUp ? 'up' : 'down' }));
          setTimeout(() => {
            setPriceFlashMap(m => ({ ...m, [target.id]: null }));
          }, 900);

          return prev.map((item, i) => i === idx ? {
            ...item,
            price: target.price < 1 ? Number(newPrice.toFixed(3)) : Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2))
          } : item);
        });
      } else {
        setFutures(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const target = prev[idx];
          const newPrice = target.price * (1 + deltaPercent / 100);
          const newChangePercent = target.changePercent + deltaPercent;

          setPriceFlashMap(m => ({ ...m, [target.id]: isUp ? 'up' : 'down' }));
          setTimeout(() => {
            setPriceFlashMap(m => ({ ...m, [target.id]: null }));
          }, 900);

          return prev.map((item, i) => i === idx ? {
            ...item,
            price: target.id === 'us10y' || target.id === 'naturalgas' ? Number(newPrice.toFixed(3)) : Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2))
          } : item);
        });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Watchlist handlers
  const handleToggleWatchlist = useCallback((asset: MarketAsset) => {
    setWatchlistIds(prev => {
      const next = new Set(prev);
      if (next.has(asset.id)) {
        next.delete(asset.id);
      } else {
        next.add(asset.id);
      }
      return next;
    });
  }, []);

  const handleRemoveFromWatchlist = useCallback((assetId: string) => {
    setWatchlistIds(prev => {
      const next = new Set(prev);
      next.delete(assetId);
      return next;
    });
  }, []);

  // Paper Trade execution handler
  const handleExecuteTrade = useCallback((trade: Omit<PaperTradePosition, 'id' | 'timestamp'>) => {
    const newPosition: PaperTradePosition = {
      ...trade,
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setPaperPositions(prev => [newPosition, ...prev]);
  }, []);

  const handleClearPositions = useCallback(() => {
    setPaperPositions([]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#131722] selection:bg-[#2962FF]/10 selection:text-[#2962FF]">
      
      {/* Top Header */}
      <Header
        activeScreen={activeScreen}
        onNavigateScreen={setActiveScreen}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        watchlistCount={watchlistIds.size}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(!isLiveSimulating)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1440px] mx-auto px-4 lg:px-8 py-4 md:py-8 w-full">
        {activeScreen === 'overview' && (
          <>
            {/* Hero Category Navigation Bar */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* If Indices category is active, render the exact screenshot layout */}
            {selectedCategory === 'Indices' ? (
              <>
                {/* Major Indices Cards */}
                <IndicesSection
                  majorIndices={majorIndices}
                  secondaryIndices={secondaryIndices}
                  onSelectAsset={setSelectedAssetForChart}
                  priceFlashMap={priceFlashMap}
                />

                {/* Market Movers: 3 Columns */}
                <MarketMovers
                  stocks={stocks}
                  cryptos={cryptos}
                  futures={futures}
                  onSelectAsset={setSelectedAssetForChart}
                  priceFlashMap={priceFlashMap}
                  onViewCategory={(cat) => setSelectedCategory(cat as AssetCategory)}
                />
              </>
            ) : (
              /* If another category tab is selected (e.g. US stocks, Crypto, Forex, etc.) */
              <>
                <CategorySpotlight
                  category={selectedCategory}
                  onSelectAsset={setSelectedAssetForChart}
                  priceFlashMap={priceFlashMap}
                />

                {/* Related Market Movers columns beneath */}
                <MarketMovers
                  stocks={stocks}
                  cryptos={cryptos}
                  futures={futures}
                  onSelectAsset={setSelectedAssetForChart}
                  priceFlashMap={priceFlashMap}
                  onViewCategory={(cat) => setSelectedCategory(cat as AssetCategory)}
                />
              </>
            )}

            {/* Bottom Call-To-Action Banner */}
            <BottomCTA
              onExploreHeatmaps={() => setActiveScreen('heatmaps')}
              onStartFreeTrial={() => setIsGetStartedOpen(true)}
            />
          </>
        )}

        {/* Heatmaps Screen View */}
        {activeScreen === 'heatmaps' && (
          <HeatmapView
            onBackToOverview={() => setActiveScreen('overview')}
            onSelectAsset={setSelectedAssetForChart}
          />
        )}

        {/* Screener Screen View */}
        {activeScreen === 'screener' && (
          <ScreenerView
            onBackToOverview={() => setActiveScreen('overview')}
            onSelectAsset={setSelectedAssetForChart}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}
      </main>

      {/* Main Footer */}
      <Footer />

      {/* Interactive Chart & Asset Details Modal */}
      {selectedAssetForChart && (
        <ChartModal
          asset={selectedAssetForChart}
          onClose={() => setSelectedAssetForChart(null)}
          isWatchlisted={watchlistIds.has(selectedAssetForChart.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onExecuteTrade={handleExecuteTrade}
        />
      )}

      {/* Watchlist & Paper Portfolio Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistIds={watchlistIds}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onSelectAsset={(asset) => {
          setSelectedAssetForChart(asset);
          setIsWatchlistOpen(false);
        }}
        paperPositions={paperPositions}
        onClearPositions={handleClearPositions}
      />

      {/* Global Quick Search (Ctrl+K) Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAsset={(asset) => setSelectedAssetForChart(asset)}
      />

      {/* Get Started / Pricing Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

    </div>
  );
}
