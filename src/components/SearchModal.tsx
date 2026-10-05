import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { ALL_ASSETS } from '../data/marketData';
import { MarketAsset } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? ALL_ASSETS.slice(0, 8)
    : ALL_ASSETS.filter(a =>
        a.symbol.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-[#f0f3fa] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6a6d78]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols, companies, crypto, indices... (e.g. NVDA, BTC, S&P 500)"
            className="w-full text-base text-[#131722] placeholder-[#6a6d78] outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#6a6d78] hover:text-[#131722] rounded-lg hover:bg-[#f0f3fa] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#f0f3fa]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#6a6d78]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((asset) => {
              const isPositive = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="p-3 hover:bg-[#f8f9fd] rounded-xl flex items-center justify-between cursor-pointer transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                      style={{ background: asset.badgeBgColor || '#2962FF', color: asset.badgeTextColor || '#fff' }}
                    >
                      {asset.badgeText || asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] font-semibold text-[#6a6d78] bg-[#f0f3fa] px-1.5 py-0.2 rounded">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#6a6d78]">{asset.name} • {asset.exchange}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 tabular-nums">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722]">
                        {asset.category === 'Crypto' && asset.price < 1
                          ? `$${asset.price.toFixed(3)}`
                          : asset.currency === '%'
                          ? `${asset.price.toFixed(3)}%`
                          : `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6a6d78] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[#f8f9fd] border-t border-[#f0f3fa] flex items-center justify-between text-xs text-[#6a6d78]">
          <span>Tip: Click any asset to launch real-time chart</span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white border border-[#e0e3eb] rounded text-[10px] font-mono shadow-xs">ESC</kbd>
            <span>to close</span>
          </div>
        </div>

      </div>
    </div>
  );
};
