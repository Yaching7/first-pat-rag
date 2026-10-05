import React, { useState } from 'react';
import { ArrowLeft, Filter, Layers, Info } from 'lucide-react';
import { S_AND_P_HEATMAP_DATA, ALL_ASSETS } from '../data/marketData';
import { MarketAsset } from '../types/market';

interface HeatmapViewProps {
  onBackToOverview: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  onBackToOverview,
  onSelectAsset
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');

  const cryptoHeatmapData = [
    { symbol: 'BTCUSD', name: 'Bitcoin', sector: 'Layer 1', weight: 48, change: 2.45, price: 68412.00 },
    { symbol: 'ETHUSD', name: 'Ethereum', sector: 'Smart Contracts', weight: 24, change: 1.82, price: 2642.50 },
    { symbol: 'SOLUSD', name: 'Solana', sector: 'Layer 1', weight: 12, change: 4.12, price: 156.40 },
    { symbol: 'BNBUSD', name: 'BNB', sector: 'Exchange Token', weight: 8, change: -0.15, price: 596.10 },
    { symbol: 'XRPUSD', name: 'XRP', sector: 'Payments', weight: 5, change: 0.95, price: 0.548 },
    { symbol: 'DOGE', name: 'Dogecoin', sector: 'Meme', weight: 3, change: 5.40, price: 0.142 }
  ];

  const rawData = heatmapType === 'stocks' ? S_AND_P_HEATMAP_DATA : cryptoHeatmapData;

  const sectors = ['All', ...Array.from(new Set(rawData.map(item => item.sector)))];

  const filteredData = selectedSector === 'All' 
    ? rawData 
    : rawData.filter(item => item.sector === selectedSector);

  // Helper function to calculate background color based on change percent
  const getChangeBg = (change: number) => {
    if (change >= 3) return 'bg-[#089981] text-white';
    if (change >= 1.5) return 'bg-[#10b981] text-white';
    if (change > 0) return 'bg-[#34d399] text-gray-900';
    if (change === 0) return 'bg-gray-400 text-white';
    if (change > -1.5) return 'bg-[#f87171] text-white';
    return 'bg-[#F23645] text-white';
  };

  const handleTileClick = (symbol: string) => {
    const asset = ALL_ASSETS.find(a => a.symbol === symbol);
    if (asset) {
      onSelectAsset(asset);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
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
              Market Heatmap
            </h1>
            <p className="text-xs text-[#6a6d78]">
              Visual breakdown of market performance, sized by capital weight.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex bg-[#f0f3fa] p-1 rounded-xl">
            <button
              onClick={() => setHeatmapType('stocks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                heatmapType === 'stocks' ? 'bg-white shadow-xs text-[#2962FF]' : 'text-[#6a6d78]'
              }`}
            >
              S&amp;P 500 Stocks
            </button>
            <button
              onClick={() => setHeatmapType('crypto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                heatmapType === 'crypto' ? 'bg-white shadow-xs text-[#2962FF]' : 'text-[#6a6d78]'
              }`}
            >
              Top Cryptos
            </button>
          </div>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-[#6a6d78] flex items-center gap-1 uppercase tracking-wider mr-1">
          <Filter className="w-3.5 h-3.5" /> Sector:
        </span>
        {sectors.map(sector => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedSector === sector
                ? 'bg-black text-white font-semibold'
                : 'bg-[#f0f3fa] text-[#131722] hover:bg-slate-200'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Treemap Container */}
      <div className="bg-[#131722] rounded-3xl p-4 md:p-6 shadow-xl border border-gray-800">
        
        {/* Heatmap Legend */}
        <div className="flex items-center justify-between text-xs text-gray-300 pb-4 mb-2 border-b border-gray-800 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#2962FF]" />
            <span className="font-semibold">{heatmapType === 'stocks' ? 'S&P 500 Constituents' : 'Crypto Market Dominance'}</span>
            <span className="text-gray-400">· Click any tile to inspect chart</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-gray-400 mr-1">-3%</span>
            <span className="w-4 h-4 rounded-xs bg-[#F23645]" title="< -3%"></span>
            <span className="w-4 h-4 rounded-xs bg-[#f87171]" title="-1.5%"></span>
            <span className="w-4 h-4 rounded-xs bg-gray-500" title="0%"></span>
            <span className="w-4 h-4 rounded-xs bg-[#34d399]" title="+1.5%"></span>
            <span className="w-4 h-4 rounded-xs bg-[#089981]" title="> +3%"></span>
            <span className="text-[11px] text-gray-400 ml-1">+3%</span>
          </div>
        </div>

        {/* Heatmap Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 min-h-[460px]">
          {filteredData.map((item) => {
            const isLarge = item.weight >= 4;
            const isMedium = item.weight >= 2 && item.weight < 4;

            return (
              <div
                key={item.symbol}
                onClick={() => handleTileClick(item.symbol)}
                className={`rounded-xl p-3 flex flex-col justify-between transition-transform duration-150 hover:scale-[1.02] cursor-pointer shadow-md relative group select-none ${getChangeBg(item.change)} ${
                  isLarge
                    ? 'col-span-2 row-span-2'
                    : isMedium
                    ? 'col-span-1 md:col-span-2 row-span-1'
                    : 'col-span-1 row-span-1'
                }`}
              >
                {/* Symbol & Name */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-black tracking-tight ${isLarge ? 'text-xl' : 'text-sm'}`}>
                      {item.symbol}
                    </div>
                    <div className="text-[11px] opacity-85 truncate max-w-[120px]">
                      {item.name}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {item.sector}
                  </span>
                </div>

                {/* Price & Change */}
                <div className="mt-2 tabular-nums">
                  <div className={`font-bold ${isLarge ? 'text-lg' : 'text-xs'}`}>
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`font-extrabold ${isLarge ? 'text-sm' : 'text-[11px]'}`}>
                    {item.change >= 0 ? `+${item.change.toFixed(2)}%` : `${item.change.toFixed(2)}%`}
                  </div>
                </div>

                {/* Subtle Hover Overlay indicator */}
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/40"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
