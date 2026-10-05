import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AssetCategory } from '../types/market';

interface CategoryNavProps {
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
}

const CATEGORIES: AssetCategory[] = [
  'Indices',
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy'
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <section className="text-center my-6 md:my-10" data-purpose="hero-header">
      {/* Title with dropdown indicator */}
      <div className="relative inline-block">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center cursor-pointer group select-none"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#131722] group-hover:text-[#2962FF] transition-colors">
            Markets, everywhere
          </h1>
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 ml-2 mt-1 text-[#131722] group-hover:text-[#2962FF] transition transform group-hover:translate-y-0.5 stroke-[2.5]" />
        </div>

        {dropdownOpen && (
          <div
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] p-2 z-30 text-left animate-in fade-in zoom-in-95 duration-100"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="text-xs font-semibold text-[#6a6d78] px-3 py-1.5 uppercase tracking-wider">
              Switch Market Category
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer flex items-center justify-between ${
                  selectedCategory === cat
                    ? 'bg-[#2962FF] text-white font-semibold'
                    : 'text-[#131722] hover:bg-[#f0f3fa]'
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categories Filter Navigation Tabs */}
      <nav
        aria-label="Market Categories"
        className="mt-8 flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 pb-2 px-2"
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-black text-white font-semibold shadow-sm'
                  : 'bg-[#f0f3fa] text-[#131722] hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          );
        })}
      </nav>
    </section>
  );
};
