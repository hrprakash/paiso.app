import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexItem {
  id: number;
  index: string;
  change: number;
  perChange: number;
  currentValue: number;
}

interface IndexData {
  [key: string]: IndexItem;
}

interface MarketTickerProps {
  subIndicesData: IndexData | null;
}

const MarketTicker = ({ subIndicesData }: MarketTickerProps) => {
  const [isPaused, setIsPaused] = useState(false);
  
  if (!subIndicesData || Object.keys(subIndicesData).length === 0) {
    console.log('Showing loading state');
    return (
      <div className="w-full py-2">
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-28 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const indices = Object.values(subIndicesData);
  
    const removeIndexSuffix = (name: string) => {
    return name.replace(/\s+Index$/i, '').trim();
  };
  // ... rest of component
  
  // Duplicate the array for seamless infinite scroll
  const tickerItems = [...indices, ...indices];

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full  overflow-hidden dark:border-gray-800">
      <div 
        className="flex whitespace-nowrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex scroll-animation"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {tickerItems.map((item, index) => {
            const isPositive = item.perChange >= 0;
            
            return (
              <div 
                key={`${item.id}-${index}`}
                className="flex items-center px-3 sm:px-5 py-2.5 border-r border-gray-300 dark:border-gray-600  transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Index Name */}
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                    {removeIndexSuffix(item.index)}
                  </span>    
                  
                  {/* Current Value */}
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatNumber(item.currentValue)}
                  </span>
                  
                  {/* Change Value */}
                  <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                    isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositive ? '+' : ''}{formatNumber(item.change)}
                  </span>
                  
                  {/* Percentage Change */}
                  <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                    isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    ({isPositive ? '+' : ''}{formatNumber(item.perChange)}%)
                  </span>

                  <span>
                     {isPositive ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                  )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .scroll-animation {
          animation: scroll 90s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarketTicker;