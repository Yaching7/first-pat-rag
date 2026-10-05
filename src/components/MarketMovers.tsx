import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface MarketMoversProps {
  stocks: MarketAsset[];
  cryptos: MarketAsset[];
  futures: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  priceFlashMap: Record<string, 'up' | 'down' | null>;
  onViewCategory?: (categoryName: string) => void;
}

export const MarketMovers: React.FC<MarketMoversProps> = ({
  stocks,
  cryptos,
  futures,
  onSelectAsset,
  priceFlashMap,
  onViewCategory
}) => {
  const renderAssetRow = (asset: MarketAsset) => {
    const isPositive = asset.changePercent >= 0;
    const flash = priceFlashMap[asset.id];

    // Format price according to asset type
    let priceFormatted = '';
    if (asset.category === 'Crypto' && asset.price < 1) {
      priceFormatted = `$${asset.price.toFixed(3)}`;
    } else if (asset.currency === '%') {
      priceFormatted = `${asset.price.toFixed(3)}%`;
    } else if (asset.category === 'US stocks' || asset.category === 'Crypto') {
      priceFormatted = `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      priceFormatted = asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    }

    // Change format
    let changeFormatted = '';
    if (asset.id === 'us10y') {
      changeFormatted = `${asset.change >= 0 ? '+' : ''}${asset.change.toFixed(3)}`;
    } else {
      changeFormatted = `${isPositive ? '+' : ''}${asset.changePercent.toFixed(2)}%`;
    }

    return (
      <div
        key={asset.id}
        onClick={() => onSelectAsset(asset)}
        className={`py-3 flex items-center justify-between hover:bg-[#fbfcfe] px-1 rounded-lg transition cursor-pointer active:scale-[0.99] ${
          flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
            style={{
              background: asset.badgeBgColor || '#2962FF',
              color: asset.badgeTextColor || '#ffffff'
            }}
          >
            {asset.badgeText || asset.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="font-bold text-sm text-[#131722]">{asset.symbol}</div>
            <div className="text-xs text-[#6a6d78] truncate max-w-[130px] sm:max-w-[160px]">
              {asset.name}
            </div>
          </div>
        </div>

        <div className="text-right tabular-nums">
          <div className="text-sm font-bold text-[#131722]">{priceFormatted}</div>
          <div
            className={`text-xs font-semibold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
              isPositive ? 'text-[#089981] bg-[#e6f7f2]' : 'text-[#F23645] bg-[#feecee]'
            }`}
          >
            {changeFormatted}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mt-12 md:mt-14" data-purpose="market-movers-tables">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Column 1: Most Active Large-Cap US Stocks */}
        <div className="bg-white border border-[#f0f3fa] rounded-2xl p-5 shadow-xs hover:border-[#e0e3eb] transition">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f3fa]">
            <button
              onClick={() => onViewCategory && onViewCategory('US stocks')}
              className="font-bold text-lg text-[#131722] hover:text-[#2962FF] flex items-center group cursor-pointer"
            >
              <span>Most Active Stocks</span>
              <ChevronRight className="w-4 h-4 ml-1.5 text-[#6a6d78] group-hover:text-[#2962FF] transition transform group-hover:translate-x-0.5" />
            </button>
            <span className="text-xs text-[#6a6d78] bg-[#f8f9fd] px-2 py-1 rounded font-medium">USD</span>
          </div>
          <div className="divide-y divide-[#f0f3fa]">
            {stocks.map(renderAssetRow)}
          </div>
        </div>

        {/* Column 2: Crypto Currencies */}
        <div className="bg-white border border-[#f0f3fa] rounded-2xl p-5 shadow-xs hover:border-[#e0e3eb] transition">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f3fa]">
            <button
              onClick={() => onViewCategory && onViewCategory('Crypto')}
              className="font-bold text-lg text-[#131722] hover:text-[#2962FF] flex items-center group cursor-pointer"
            >
              <span>Top Cryptocurrencies</span>
              <ChevronRight className="w-4 h-4 ml-1.5 text-[#6a6d78] group-hover:text-[#2962FF] transition transform group-hover:translate-x-0.5" />
            </button>
            <span className="text-xs text-[#6a6d78] bg-[#f8f9fd] px-2 py-1 rounded font-medium">24h</span>
          </div>
          <div className="divide-y divide-[#f0f3fa]">
            {cryptos.map(renderAssetRow)}
          </div>
        </div>

        {/* Column 3: Futures & Commodities */}
        <div className="bg-white border border-[#f0f3fa] rounded-2xl p-5 shadow-xs hover:border-[#e0e3eb] transition">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f3fa]">
            <button
              onClick={() => onViewCategory && onViewCategory('Futures')}
              className="font-bold text-lg text-[#131722] hover:text-[#2962FF] flex items-center group cursor-pointer"
            >
              <span>Futures &amp; Commodities</span>
              <ChevronRight className="w-4 h-4 ml-1.5 text-[#6a6d78] group-hover:text-[#2962FF] transition transform group-hover:translate-x-0.5" />
            </button>
            <span className="text-xs text-[#6a6d78] bg-[#f8f9fd] px-2 py-1 rounded font-medium">Global</span>
          </div>
          <div className="divide-y divide-[#f0f3fa]">
            {futures.map(renderAssetRow)}
          </div>
        </div>
      </div>
    </section>
  );
};
