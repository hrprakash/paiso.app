import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/utils/publicClient';

interface StockItem {
  id: number;
  sector: string | null;
  symbol: string;
  name: string;
  ltp: string;
  close_price: string;
  open_price: string;
  high_price: string;
  low_price: string;
  total_traded_quantity: number;
  total_traded_value: string;
  total_trades: number;
  previous_day_close_price: string;
  week_52_high: string;
  week_52_low: string;
  market_capitalization: string;
  [key: string]: any;
}

export async function GET() {
  try {
    const data = await publicApiClient.Keyget(`/nepse/today-price/`) as StockItem[];
    
    const transformedData = data.map((item: StockItem) => {
      const ltp = parseFloat(item.ltp);
      const previousClose = parseFloat(item.previous_day_close_price);
      const change = ltp - previousClose;
      const percentChange = previousClose !== 0 ? (change / previousClose) * 100 : 0;

      return {
        id: item.id,
        sector: item.sector,
        symbol: item.symbol,
        name: item.name,
        ltp,
        closePrice: parseFloat(item.close_price),
        openPrice: parseFloat(item.open_price),
        highPrice: parseFloat(item.high_price),
        lowPrice: parseFloat(item.low_price),
        volume: item.total_traded_quantity,
        turnover: parseFloat(item.total_traded_value),
        trades: item.total_trades,
        change,
        percentChange,
        previousClose,
        week52High: parseFloat(item.week_52_high),
        week52Low: parseFloat(item.week_52_low),
        marketCap: parseFloat(item.market_capitalization),
      };
    });
    
    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length
    });
    
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch today prices',
        details: error.message 
      },
      { status: 500 }
    );
  }
}