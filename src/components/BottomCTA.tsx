import React from 'react';

interface BottomCTAProps {
  onExploreHeatmaps: () => void;
  onStartFreeTrial: () => void;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({
  onExploreHeatmaps,
  onStartFreeTrial
}) => {
  return (
    <section
      className="mt-14 mb-8 bg-[#f8f9fd] border border-[#f0f3fa] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs"
      data-purpose="bottom-cta-banner"
    >
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-[#131722]">
          Build your watchlist and chart without limits
        </h3>
        <p className="text-sm text-[#6a6d78] mt-1">
          Join over 60 million traders and investors scanning global real-time financial markets.
        </p>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onExploreHeatmaps}
          className="bg-white border border-[#e0e3eb] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition shadow-xs cursor-pointer active:scale-95 text-[#131722]"
        >
          Explore Heatmaps
        </button>

        <button
          onClick={onStartFreeTrial}
          className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-xs cursor-pointer active:scale-95"
        >
          Start Free Trial
        </button>
      </div>
    </section>
  );
};
