import React, { useState } from 'react';
import { X, Trash2, Bell, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketAsset, PaperTradePosition } from '../types/market';
import { ALL_ASSETS } from '../data/marketData';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistIds: Set<string>;
  onRemoveFromWatchlist: (assetId: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  paperPositions: PaperTradePosition[];
  onClearPositions: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistIds,
  onRemoveFromWatchlist,
  onSelectAsset,
  paperPositions,
  onClearPositions
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  if (!isOpen) return null;

  const watchlistedAssets = ALL_ASSETS.filter(a => watchlistIds.has(a.id));

  // Compute paper portfolio value
  const startingCash = 100000;
  const portfolioHoldingsValue = paperPositions.reduce((sum, pos) => {
    const currentAsset = ALL_ASSETS.find(a => a.symbol === pos.assetSymbol);
    const curPrice = currentAsset ? currentAsset.price : pos.entryPrice;
    return sum + curPrice * pos.shares;
  }, 0);

  const totalCostBasis = paperPositions.reduce((sum, pos) => sum + pos.entryPrice * pos.shares, 0);
  const totalUnrealizedPnL = portfolioHoldingsValue - totalCostBasis;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#f0f3fa] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-black text-white'
                  : 'bg-[#f0f3fa] text-[#131722] hover:bg-slate-200'
              }`}
            >
              Watchlist ({watchlistedAssets.length})
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-[#2962FF] text-white'
                  : 'bg-[#f0f3fa] text-[#131722] hover:bg-slate-200'
              }`}
            >
              Paper Trades ({paperPositions.length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6a6d78] hover:text-[#131722] rounded-full hover:bg-[#f0f3fa] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'watchlist' ? (
            watchlistedAssets.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f3fa] text-[#6a6d78] flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#2962FF]" />
                </div>
                <h4 className="font-bold text-[#131722] text-sm">Your watchlist is empty</h4>
                <p className="text-xs text-[#6a6d78] mt-1 max-w-xs mx-auto">
                  Click on any asset card or search for stocks to track them in real time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0f3fa]">
                {watchlistedAssets.map((asset) => {
                  const isPositive = asset.changePercent >= 0;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className="py-3 flex items-center justify-between hover:bg-[#fbfcfe] px-2 rounded-xl transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                          style={{ background: asset.badgeBgColor || '#2962FF', color: asset.badgeTextColor || '#fff' }}
                        >
                          {asset.badgeText || asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition-colors">
                            {asset.symbol}
                          </div>
                          <div className="text-xs text-[#6a6d78] truncate max-w-[120px]">{asset.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right tabular-nums">
                          <div className="text-sm font-bold text-[#131722]">
                            ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div
                            className={`text-xs font-semibold px-1.5 py-0.2 rounded inline-block ${
                              isPositive ? 'text-[#089981] bg-[#e6f7f2]' : 'text-[#F23645] bg-[#feecee]'
                            }`}
                          >
                            {isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromWatchlist(asset.id);
                          }}
                          className="p-1 text-[#6a6d78] hover:text-[#F23645] transition rounded-md hover:bg-slate-100"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // Paper Trades Portfolio View
            <div className="space-y-4">
              <div className="bg-[#f8f9fd] p-4 rounded-2xl border border-[#e0e3eb]">
                <div className="flex items-center justify-between text-xs text-[#6a6d78] mb-1">
                  <span>Paper Portfolio Equity</span>
                  <span className="font-semibold text-[#131722]">$100k Simulator</span>
                </div>
                <div className="text-2xl font-black text-[#131722] tabular-nums">
                  ${(startingCash + totalUnrealizedPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold tabular-nums">
                  <span className={totalUnrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
                    {totalUnrealizedPnL >= 0 ? `+$${totalUnrealizedPnL.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnL).toFixed(2)}`}
                  </span>
                  <span className="text-[#6a6d78]">unrealized P&amp;L</span>
                </div>
              </div>

              {paperPositions.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#6a6d78]">
                  No active trades yet. Open any asset chart and use the Paper Trading ticket to place buy/sell orders!
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#6a6d78] px-1 uppercase">
                    <span>Open Positions</span>
                    <button
                      onClick={onClearPositions}
                      className="text-[#F23645] hover:underline cursor-pointer lowercase text-[11px]"
                    >
                      clear all
                    </button>
                  </div>
                  {paperPositions.map((pos) => {
                    const currentAsset = ALL_ASSETS.find(a => a.symbol === pos.assetSymbol);
                    const curPrice = currentAsset ? currentAsset.price : pos.entryPrice;
                    const pnl = (curPrice - pos.entryPrice) * pos.shares * (pos.type === 'BUY' ? 1 : -1);

                    return (
                      <div
                        key={pos.id}
                        className="p-3 bg-white border border-[#e0e3eb] rounded-xl flex items-center justify-between tabular-nums"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#131722]">{pos.assetSymbol}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${pos.type === 'BUY' ? 'bg-[#e6f7f2] text-[#089981]' : 'bg-[#feecee] text-[#F23645]'}`}>
                              {pos.type}
                            </span>
                          </div>
                          <div className="text-xs text-[#6a6d78]">
                            {pos.shares} shares @ ${pos.entryPrice.toFixed(2)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-[#6a6d78]">Cur: ${curPrice.toFixed(2)}</div>
                          <div className={`text-xs font-bold ${pnl >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                            {pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
