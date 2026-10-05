import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  return (
    <>
      <footer className="border-t border-[#f0f3fa] bg-white py-6 text-xs text-[#6a6d78]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-[#131722]">© 2024 TradingView</span>
            <button
              onClick={() => setModalContent('Privacy Policy: All market data transmission complies with standard enterprise security protocols. We do not sell personal financial information.')}
              className="hover:underline hover:text-[#131722] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalContent('Terms of Service: Market quotes displayed are delayed or real-time depending on exchange specifications. Informational use only.')}
              className="hover:underline hover:text-[#131722] cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setModalContent('Market Data Coverage: Direct market data feeds from CBOE, NASDAQ, NYSE, COMEX, NYMEX, XETRA, LSE, EURONEXT, and HKEX.')}
              className="hover:underline hover:text-[#131722] cursor-pointer"
            >
              Market data
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-medium text-[#131722]">
            <span className="w-2 h-2 rounded-full bg-[#089981] inline-block animate-pulse"></span>
            <span>Markets are open</span>
          </div>
        </div>
      </footer>

      {/* Info notice dialog */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e0e3eb] animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-[#131722] mb-2">TradingView Information</h4>
            <p className="text-sm text-[#6a6d78] mb-5 leading-relaxed">{modalContent}</p>
            <button
              onClick={() => setModalContent(null)}
              className="w-full py-2 bg-[#2962FF] hover:bg-[#1e53e5] text-white rounded-xl text-sm font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
