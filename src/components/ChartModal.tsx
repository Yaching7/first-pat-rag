import React, { useState, useMemo } from 'react';
import { X, Bookmark, BookmarkCheck, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3, LineChart, ShieldCheck } from 'lucide-react';
import { MarketAsset, PaperTradePosition } from '../types/market';

interface ChartModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (asset: MarketAsset) => void;
  onExecuteTrade: (trade: Omit<PaperTradePosition, 'id' | 'timestamp'>) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';
type ChartType = 'area' | 'candles';

export const ChartModal: React.FC<ChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [hoveredPoint, setHoveredPoint] = useState<{ price: number; date: string; index: number } | null>(null);
  
  // Paper trade form
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  const isPositive = asset.changePercent >= 0;

  // Generate deterministic chart points based on asset and timeframe
  const chartData = useMemo(() => {
    const pointsCount = timeframe === '1D' ? 24 : timeframe === '5D' ? 40 : timeframe === '1M' ? 30 : 60;
    const basePrice = asset.price;
    const volatility = asset.category === 'Crypto' ? 0.035 : asset.category === 'Futures' ? 0.02 : 0.015;
    
    const points: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }> = [];
    let current = basePrice * (1 - (isPositive ? 0.05 : -0.05));

    for (let i = 0; i < pointsCount; i++) {
      const seed = Math.sin(i * 1.7 + asset.price % 10) * volatility;
      const trend = (i / pointsCount) * (asset.changePercent / 100);
      const open = current;
      const change = current * (seed + trend * 0.3);
      const close = i === pointsCount - 1 ? asset.price : Math.max(open * 0.8, open + change);
      const high = Math.max(open, close) + Math.abs(change) * 0.6;
      const low = Math.min(open, close) - Math.abs(change) * 0.5;
      const volume = Math.floor(100000 + Math.abs(Math.sin(i)) * 400000);

      const d = new Date();
      d.setDate(d.getDate() - (pointsCount - i));
      const dateStr = timeframe === '1D' 
        ? `${String(i).padStart(2, '0')}:00` 
        : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

      points.push({ date: dateStr, open, high, low, close, volume });
      current = close;
    }

    return points;
  }, [asset, timeframe, isPositive]);

  // Min and max for chart scaling
  const minPrice = Math.min(...chartData.map(d => d.low)) * 0.995;
  const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...chartData.map(d => d.volume)) || 1;

  // SVG chart sizing
  const width = 800;
  const height = 340;
  const chartHeight = 240;
  const volumeHeight = 60;

  // Build area path and line path
  const pointsCoords = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * (width - 40) + 20;
    const y = chartHeight - ((d.close - minPrice) / priceRange) * (chartHeight - 40) - 20;
    return { x, y, data: d };
  });

  const linePath = pointsCoords.reduce((acc, curr, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${pointsCoords[pointsCoords.length - 1].x} ${chartHeight} L ${pointsCoords[0].x} ${chartHeight} Z`;

  const handleBuy = () => {
    if (tradeShares <= 0) return;
    onExecuteTrade({
      assetSymbol: asset.symbol,
      assetName: asset.name,
      type: 'BUY',
      shares: tradeShares,
      entryPrice: asset.price
    });
    setTradeSuccessMsg(`Executed: BUY ${tradeShares} shares of ${asset.symbol} @ $${asset.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const handleSell = () => {
    if (tradeShares <= 0) return;
    onExecuteTrade({
      assetSymbol: asset.symbol,
      assetName: asset.name,
      type: 'SELL',
      shares: tradeShares,
      entryPrice: asset.price
    });
    setTradeSuccessMsg(`Executed: SELL ${tradeShares} shares of ${asset.symbol} @ $${asset.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const activeDisplayPrice = hoveredPoint ? hoveredPoint.price : asset.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-[#e0e3eb] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#f0f3fa] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-4">
            <div
              className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm"
              style={{
                background: asset.badgeBgColor || '#2962FF',
                color: asset.badgeTextColor || '#ffffff'
              }}
            >
              {asset.badgeText || asset.symbol.slice(0, 3)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722]">{asset.symbol}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f0f3fa] text-[#6a6d78]">
                  {asset.exchange}
                </span>
                <span className="text-xs font-medium text-[#6a6d78]">
                  {asset.category}
                </span>
              </div>
              <p className="text-xs text-[#6a6d78]">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleWatchlist(asset)}
              className={`p-2 rounded-full border transition cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                isWatchlisted
                  ? 'bg-[#2962FF]/10 border-[#2962FF] text-[#2962FF]'
                  : 'border-[#e0e3eb] text-[#6a6d78] hover:bg-[#f8f9fd]'
              }`}
              title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 text-[#6a6d78] hover:text-[#131722] hover:bg-[#f0f3fa] rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Price & Metrics Row */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#f0f3fa]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-extrabold text-[#131722] tabular-nums">
                  {asset.category === 'Crypto' && activeDisplayPrice < 1
                    ? `$${activeDisplayPrice.toFixed(4)}`
                    : asset.currency === '%'
                    ? `${activeDisplayPrice.toFixed(3)}%`
                    : `$${activeDisplayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  }
                </span>
                <span
                  className={`text-sm md:text-base font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-md ${
                    isPositive ? 'text-[#089981] bg-[#e6f7f2]' : 'text-[#F23645] bg-[#feecee]'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}</span>
                  <span className="text-xs font-normal">
                    ({asset.change >= 0 ? `+${asset.change.toFixed(2)}` : asset.change.toFixed(2)})
                  </span>
                </span>
              </div>
              <p className="text-xs text-[#6a6d78] mt-1">
                {hoveredPoint ? `Inspecting: ${hoveredPoint.date}` : 'Real-time market quote • Currency in USD'}
              </p>
            </div>

            {/* Timeframe & Chart Style Selectors */}
            <div className="flex items-center gap-3">
              {/* Chart type toggle */}
              <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg">
                <button
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                    chartType === 'area' ? 'bg-white shadow-xs text-[#2962FF]' : 'text-[#6a6d78]'
                  }`}
                  title="Line/Area Chart"
                >
                  <LineChart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('candles')}
                  className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                    chartType === 'candles' ? 'bg-white shadow-xs text-[#2962FF]' : 'text-[#6a6d78]'
                  }`}
                  title="Candlestick Chart"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              {/* Timeframe pills */}
              <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg gap-1">
                {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white text-[#131722] shadow-xs'
                        : 'text-[#6a6d78] hover:text-[#131722]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas / SVG */}
          <div className="bg-[#fbfcfe] rounded-2xl border border-[#f0f3fa] p-4 relative select-none">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-64 md:h-80 overflow-visible"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = 20 + ratio * (chartHeight - 40);
                const priceLabel = maxPrice - ratio * priceRange;
                return (
                  <g key={i}>
                    <line
                      x1="20"
                      y1={y}
                      x2={width - 20}
                      y2={y}
                      stroke="#f0f3fa"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={width - 15}
                      y={y + 4}
                      fill="#9ca3af"
                      fontSize="10"
                      textAnchor="start"
                      className="font-mono tabular-nums"
                    >
                      {priceLabel >= 1000 ? priceLabel.toFixed(0) : priceLabel.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Volume Bars */}
              {chartData.map((d, index) => {
                const x = (index / (chartData.length - 1)) * (width - 40) + 20;
                const vBarHeight = (d.volume / maxVolume) * volumeHeight;
                const vY = height - vBarHeight - 10;
                const isBarUp = d.close >= d.open;

                return (
                  <rect
                    key={`v-${index}`}
                    x={x - 2}
                    y={vY}
                    width={4}
                    height={vBarHeight}
                    fill={isBarUp ? 'rgba(8, 153, 129, 0.3)' : 'rgba(242, 54, 69, 0.3)'}
                    rx="1"
                  />
                );
              })}

              {/* Chart Render: Area or Candlesticks */}
              {chartType === 'area' ? (
                <>
                  <path d={areaPath} fill="url(#areaGradient)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                // Candlestick rendering
                chartData.map((d, index) => {
                  const x = (index / (chartData.length - 1)) * (width - 40) + 20;
                  const candleUp = d.close >= d.open;
                  const bodyTop = chartHeight - ((Math.max(d.open, d.close) - minPrice) / priceRange) * (chartHeight - 40) - 20;
                  const bodyBottom = chartHeight - ((Math.min(d.open, d.close) - minPrice) / priceRange) * (chartHeight - 40) - 20;
                  const wickTop = chartHeight - ((d.high - minPrice) / priceRange) * (chartHeight - 40) - 20;
                  const wickBottom = chartHeight - ((d.low - minPrice) / priceRange) * (chartHeight - 40) - 20;
                  const bodyHeight = Math.max(3, bodyBottom - bodyTop);

                  return (
                    <g key={`c-${index}`}>
                      {/* Wick line */}
                      <line
                        x1={x}
                        y1={wickTop}
                        x2={x}
                        y2={wickBottom}
                        stroke={candleUp ? '#089981' : '#F23645'}
                        strokeWidth="1.5"
                      />
                      {/* Body */}
                      <rect
                        x={x - 3.5}
                        y={bodyTop}
                        width={7}
                        height={bodyHeight}
                        fill={candleUp ? '#089981' : '#F23645'}
                        rx="1"
                      />
                    </g>
                  );
                })
              )}

              {/* Hover crosshair & inspection hotspots */}
              {pointsCoords.map((pt, index) => (
                <rect
                  key={`hover-zone-${index}`}
                  x={pt.x - (width / chartData.length) / 2}
                  y="0"
                  width={width / chartData.length}
                  height={height}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => {
                    setHoveredPoint({
                      price: pt.data.close,
                      date: pt.data.date,
                      index
                    });
                  }}
                />
              ))}

              {/* Active hover crosshair line & dot */}
              {hoveredPoint && (
                <g>
                  <line
                    x1={pointsCoords[hoveredPoint.index].x}
                    y1="10"
                    x2={pointsCoords[hoveredPoint.index].x}
                    y2={height - 20}
                    stroke="#2962FF"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={pointsCoords[hoveredPoint.index].x}
                    cy={pointsCoords[hoveredPoint.index].y}
                    r="5"
                    fill="#2962FF"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Key Fundamentals & Technical Meter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Key Statistics */}
            <div className="md:col-span-2 bg-[#f8f9fd] rounded-2xl p-5 border border-[#f0f3fa]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6a6d78] mb-3">
                Key Fundamentals &amp; Statistics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 tabular-nums">
                <div>
                  <div className="text-xs text-[#6a6d78]">Market Cap</div>
                  <div className="text-sm font-bold text-[#131722] mt-0.5">{asset.marketCap || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6a6d78]">24h Volume</div>
                  <div className="text-sm font-bold text-[#131722] mt-0.5">{asset.volume24h || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6a6d78]">52-Week High</div>
                  <div className="text-sm font-bold text-[#131722] mt-0.5">
                    {asset.high52w ? `$${asset.high52w.toFixed(2)}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6a6d78]">52-Week Low</div>
                  <div className="text-sm font-bold text-[#131722] mt-0.5">
                    {asset.low52w ? `$${asset.low52w.toFixed(2)}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6a6d78]">P/E Ratio</div>
                  <div className="text-sm font-bold text-[#131722] mt-0.5">{asset.peRatio ? asset.peRatio.toFixed(1) : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6a6d78]">Sector</div>
                  <div className="text-sm font-bold text-[#131722] mt-0.5 truncate">{asset.sector || 'Global Assets'}</div>
                </div>
              </div>

              {asset.description && (
                <div className="mt-4 pt-3 border-t border-[#e0e3eb]/60 text-xs text-[#6a6d78] leading-relaxed">
                  {asset.description}
                </div>
              )}
            </div>

            {/* Technical Analysis Gauge & Paper Trading ticket */}
            <div className="bg-white rounded-2xl p-5 border border-[#e0e3eb] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6a6d78]">
                    Technical Gauge
                  </h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${isPositive ? 'bg-[#e6f7f2] text-[#089981]' : 'bg-[#feecee] text-[#F23645]'}`}>
                    {isPositive ? 'Strong Buy' : 'Neutral / Sell'}
                  </span>
                </div>

                {/* Progress bar gauge */}
                <div className="w-full bg-[#f0f3fa] h-2.5 rounded-full overflow-hidden flex mb-2">
                  <div className="bg-[#F23645] w-[20%]" title="Sell"></div>
                  <div className="bg-amber-400 w-[20%]" title="Neutral"></div>
                  <div className="bg-[#089981] w-[60%]" title="Buy"></div>
                </div>
                <div className="flex justify-between text-[10px] text-[#6a6d78] font-medium">
                  <span>Sell (3)</span>
                  <span>Neutral (8)</span>
                  <span>Buy (17)</span>
                </div>
              </div>

              {/* Paper Trading Ticket */}
              <div className="mt-5 pt-4 border-t border-[#f0f3fa]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#131722]">Simulated Paper Trade</span>
                  <span className="text-[10px] text-[#6a6d78] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#089981]" /> Zero Risk
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <label htmlFor="shares-input" className="text-xs text-[#6a6d78]">Shares / Units:</label>
                  <input
                    id="shares-input"
                    type="number"
                    min="1"
                    value={tradeShares}
                    onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2 py-1 text-xs border border-[#e0e3eb] rounded-lg text-center font-bold tabular-nums focus:ring-1 focus:ring-[#2962FF]"
                  />
                  <span className="text-xs text-[#6a6d78] tabular-nums font-medium">
                    ≈ ${(tradeShares * asset.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleBuy}
                    className="w-full py-2 bg-[#089981] hover:bg-[#07836e] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    Buy (Long)
                  </button>
                  <button
                    onClick={handleSell}
                    className="w-full py-2 bg-[#F23645] hover:bg-[#d92c3a] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    Sell (Short)
                  </button>
                </div>

                {tradeSuccessMsg && (
                  <div className="mt-2 p-2 bg-[#e6f7f2] text-[#089981] text-[11px] font-semibold rounded-lg text-center animate-in fade-in">
                    {tradeSuccessMsg}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
