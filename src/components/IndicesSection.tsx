import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface IndicesSectionProps {
  majorIndices: MarketAsset[];
  secondaryIndices: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  priceFlashMap: Record<string, 'up' | 'down' | null>;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  majorIndices,
  secondaryIndices,
  onSelectAsset,
  priceFlashMap
}) => {
  return (
    <section className="mt-8 md:mt-10" data-purpose="major-indices">
      {/* Section Title Link */}
      <button
        onClick={() => onSelectAsset(majorIndices[0])}
        className="inline-flex items-center group text-2xl font-bold text-[#131722] hover:text-[#2962FF] mb-5 cursor-pointer"
      >
        <span>Indices</span>
        <ChevronRight className="w-5 h-5 ml-1 text-[#6a6d78] group-hover:text-[#2962FF] transition transform group-hover:translate-x-1 stroke-[2.5]" />
      </button>

      {/* Quick Index Pill Cards (Exact screenshot replica) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {majorIndices.map((index) => {
          const isPositive = index.changePercent >= 0;
          const flash = priceFlashMap[index.id];

          return (
            <div
              key={index.id}
              onClick={() => onSelectAsset(index)}
              className={`bg-[#f0f3fa]/70 hover:bg-[#f0f3fa] transition-all rounded-full p-2.5 pr-6 flex items-center justify-between border border-transparent hover:border-[#e0e3eb] cursor-pointer shadow-sm active:scale-[0.99] ${
                flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0"
                  style={{ backgroundColor: index.badgeBgColor || '#2962FF' }}
                >
                  {index.badgeText || index.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#131722]">{index.name}</div>
                  <div className="text-xs text-[#6a6d78]">{index.symbol} • {index.exchange}</div>
                </div>
              </div>

              <div className="text-right tabular-nums">
                <div className="text-sm font-bold text-[#131722]">
                  {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-semibold flex items-center justify-end ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  <span>{isPositive ? `+${index.changePercent.toFixed(2)}%` : `${index.changePercent.toFixed(2)}%`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Global Indices Compact Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {secondaryIndices.map((index) => {
          const isPositive = index.changePercent >= 0;
          const flash = priceFlashMap[index.id];

          return (
            <div
              key={index.id}
              onClick={() => onSelectAsset(index)}
              className={`p-3 bg-white border border-[#f0f3fa] hover:border-[#e0e3eb] rounded-xl transition cursor-pointer hover:shadow-xs active:scale-95 ${
                flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="text-xs text-[#6a6d78] font-medium truncate">{index.name}</div>
              <div className="text-sm font-bold mt-1 tabular-nums text-[#131722]">
                {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-semibold mt-0.5 tabular-nums ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? `+${index.changePercent.toFixed(2)}%` : `${index.changePercent.toFixed(2)}%`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
