import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ArrowUpDown, Bookmark, BookmarkCheck } from 'lucide-react';
import { ALL_ASSETS } from '../data/marketData';
import { MarketAsset } from '../types/market';

interface ScreenerViewProps {
  onBackToOverview: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  watchlistIds: Set<string>;
  onToggleWatchlist: (asset: MarketAsset) => void;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({
  onBackToOverview,
  onSelectAsset,
  watchlistIds,
  onToggleWatchlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<'symbol' | 'price' | 'changePercent'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = ['All', 'Indices', 'US stocks', 'World stocks', 'Crypto', 'Futures', 'Forex', 'Government bonds', 'ETFs'];

  const filteredAssets = useMemo(() => {
    return ALL_ASSETS.filter((asset) => {
      const matchesSearch = asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string') valA = (valA as string).toLowerCase();
      if (typeof valB === 'string') valB = (valB as string).toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchQuery, categoryFilter, sortKey, sortOrder]);

  const toggleSort = (key: 'symbol' | 'price' | 'changePercent') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f3fa]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToOverview}
            className="p-2 rounded-full border border-[#e0e3eb] hover:bg-[#f0f3fa] text-[#131722] transition cursor-pointer"
            title="Back to Overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#131722]">
              Market Screener
            </h1>
            <p className="text-xs text-[#6a6d78]">
              Scan and filter across global indices, equities, crypto, and commodities.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6a6d78]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter symbols or names..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f3fa] text-xs md:text-sm font-normal rounded-xl border border-transparent focus:border-[#2962FF] focus:bg-white text-[#131722] transition outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              categoryFilter === cat
                ? 'bg-black text-white font-semibold'
                : 'bg-[#f0f3fa] text-[#131722] hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#e0e3eb] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#131722]">
            <thead className="bg-[#f8f9fd] border-b border-[#e0e3eb] text-xs text-[#6a6d78] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">
                  <button
                    onClick={() => toggleSort('symbol')}
                    className="flex items-center gap-1 hover:text-[#131722] cursor-pointer"
                  >
                    <span>Symbol / Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => toggleSort('price')}
                    className="inline-flex items-center gap-1 hover:text-[#131722] cursor-pointer ml-auto"
                  >
                    <span>Last Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => toggleSort('changePercent')}
                    className="inline-flex items-center gap-1 hover:text-[#131722] cursor-pointer ml-auto"
                  >
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">Trend</th>
                <th className="py-3.5 px-4 text-right">Market Cap / Vol</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa] tabular-nums">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6a6d78]">
                    No market assets matching &ldquo;{searchQuery}&rdquo; in this category.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isPositive = asset.changePercent >= 0;
                  const isWatchlisted = watchlistIds.has(asset.id);

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-[#fbfcfe] transition cursor-pointer group"
                      onClick={() => onSelectAsset(asset)}
                    >
                      <td className="py-3.5 px-4">
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
                            <div className="text-xs text-[#6a6d78] truncate max-w-[150px]">{asset.name}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-[#6a6d78] font-medium">
                        {asset.category}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-sm">
                        {asset.category === 'Crypto' && asset.price < 1
                          ? `$${asset.price.toFixed(3)}`
                          : asset.currency === '%'
                          ? `${asset.price.toFixed(3)}%`
                          : `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded inline-block ${
                            isPositive ? 'text-[#089981] bg-[#e6f7f2]' : 'text-[#F23645] bg-[#feecee]'
                          }`}
                        >
                          {isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                        </span>
                      </td>

                      {/* Sparkline column */}
                      <td className="py-3.5 px-4 text-center hidden md:table-cell">
                        <svg className="w-20 h-6 mx-auto overflow-visible" viewBox="0 0 80 24">
                          <polyline
                            fill="none"
                            stroke={isPositive ? '#089981' : '#F23645'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={asset.sparkline.map((val, i) => {
                              const min = Math.min(...asset.sparkline);
                              const max = Math.max(...asset.sparkline);
                              const range = max - min || 1;
                              const x = (i / (asset.sparkline.length - 1)) * 80;
                              const y = 22 - ((val - min) / range) * 20;
                              return `${x},${y}`;
                            }).join(' ')}
                          />
                        </svg>
                      </td>

                      <td className="py-3.5 px-4 text-right text-xs text-[#6a6d78] font-medium">
                        {asset.marketCap || asset.volume24h || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleWatchlist(asset)}
                          className={`p-1.5 rounded-full transition cursor-pointer ${
                            isWatchlisted ? 'text-[#2962FF] bg-[#2962FF]/10' : 'text-[#6a6d78] hover:text-[#131722] hover:bg-[#f0f3fa]'
                          }`}
                          title={isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                        >
                          {isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
