import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AssetCategory, MarketAsset } from '../types/market';
import {
  WORLD_STOCKS,
  FOREX_PAIRS,
  ETFS_LIST,
  BONDS_LIST,
  ECONOMY_INDICATORS,
  TOP_CRYPTOCURRENCIES,
  MOST_ACTIVE_STOCKS,
  FUTURES_AND_COMMODITIES
} from '../data/marketData';

interface CategorySpotlightProps {
  category: AssetCategory;
  onSelectAsset: (asset: MarketAsset) => void;
  priceFlashMap: Record<string, 'up' | 'down' | null>;
}

export const CategorySpotlight: React.FC<CategorySpotlightProps> = ({
  category,
  onSelectAsset,
  priceFlashMap
}) => {
  let assets: MarketAsset[] = [];

  switch (category) {
    case 'US stocks':
      assets = MOST_ACTIVE_STOCKS;
      break;
    case 'World stocks':
      assets = WORLD_STOCKS;
      break;
    case 'Crypto':
      assets = TOP_CRYPTOCURRENCIES;
      break;
    case 'Futures':
      assets = FUTURES_AND_COMMODITIES;
      break;
    case 'Forex':
      assets = FOREX_PAIRS;
      break;
    case 'Government bonds':
    case 'Corporate bonds':
      assets = BONDS_LIST;
      break;
    case 'ETFs':
      assets = ETFS_LIST;
      break;
    case 'Economy':
      assets = ECONOMY_INDICATORS;
      break;
    default:
      assets = MOST_ACTIVE_STOCKS;
  }

  return (
    <section className="mt-8 mb-10 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#131722] flex items-center">
          <span>{category} Overview</span>
          <ChevronRight className="w-5 h-5 ml-1 text-[#6a6d78]" />
        </h2>
        <span className="text-xs text-[#6a6d78] font-medium bg-[#f0f3fa] px-3 py-1 rounded-full">
          {assets.length} items tracked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const isPositive = asset.changePercent >= 0;
          const flash = priceFlashMap[asset.id];

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`bg-white border border-[#e0e3eb] hover:border-[#2962FF] rounded-2xl p-4 flex items-center justify-between transition cursor-pointer shadow-xs active:scale-[0.99] ${
                flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    background: asset.badgeBgColor || '#2962FF',
                    color: asset.badgeTextColor || '#fff'
                  }}
                >
                  {asset.badgeText || asset.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#131722]">{asset.symbol}</div>
                  <div className="text-xs text-[#6a6d78] truncate max-w-[140px]">{asset.name}</div>
                  <div className="text-[11px] text-[#9ca3af]">{asset.exchange}</div>
                </div>
              </div>

              <div className="text-right tabular-nums">
                <div className="text-sm font-bold text-[#131722]">
                  {asset.category === 'Crypto' && asset.price < 1
                    ? `$${asset.price.toFixed(3)}`
                    : asset.currency === '%'
                    ? `${asset.price.toFixed(3)}%`
                    : `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
                <div
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                    isPositive ? 'text-[#089981] bg-[#e6f7f2]' : 'text-[#F23645] bg-[#feecee]'
                  }`}
                >
                  {isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
