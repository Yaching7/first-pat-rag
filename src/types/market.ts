export type AssetCategory = 
  | 'Indices'
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  marketCap?: string;
  volume24h?: string;
  high52w?: number;
  low52w?: number;
  peRatio?: number;
  sparkline: number[];
  sector?: string;
  description?: string;
}

export interface WatchlistItem {
  assetId: string;
  addedAt: string;
  targetAlertPrice?: number;
}

export interface PaperTradePosition {
  id: string;
  assetSymbol: string;
  assetName: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  timestamp: string;
}
