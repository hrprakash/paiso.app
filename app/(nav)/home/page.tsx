
"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Search, Sparkles, Brush, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authstore";
import { MarketDataResponse, MarketSummaryStats } from "@/lib/api/types";
import { summaryApi } from "@/lib/api/summary";
import { IndexData } from "@/lib/api/types";
import MarketTicker from "@/components/MarketTicker";
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from 'gsap/SplitText'
import Animation from "@/components/ui/animation";


gsap.registerPlugin(ScrollTrigger, SplitText);

const SortHeader = ({ 
  label, 
  sortKey, 
  onSort, 
  align = 'left',
  currentSort,
  className = ''
}: { 
  label: string; 
  sortKey: string; 
  onSort: (key: string) => void; 
  align?: 'left' | 'right';
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  className?: string;
}) => {
  const isActive = currentSort?.key === sortKey;
  const direction = currentSort?.direction;

  return (
    <th 
      className={`px-3 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <div className="flex flex-col">
          {isActive && direction === 'asc' ? (
            <ArrowUpDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          ) : isActive && direction === 'desc' ? (
            <ArrowUpDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ArrowUpDown className="h-3 w-3 text-gray-800" />
          )}
        </div>
      </div>
    </th>
  );
};
interface ProcessedStock {
  symbol: string;
  ltp: number;
  change: number;
  percentChange: number;
  volume: number;
  transactions: number;
  turnover: number;
}

export default function Home() {

  useGSAP(() =>{
    
    
  const heroSplits = new SplitText(".hero", {type:"words"})
  const paraSplits = new SplitText(".paragraph", {type:"lines"})

    gsap.from(heroSplits.words, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease:"expo.out",
      stagger: 0.06
    })

       gsap.from(paraSplits.lines, {
       opacity: 0,
            yPercent: 100,
            duration: 1,
            ease: "expo.out",
            stagger: 0.05,
            delay: 0.8
    })

  // gsap.from(".left-btn", {
  //   opacity: 0,
  //   y: 100,
  //   duration: 1,
  //   ease: "expo.out"
  // })
  
  // gsap.from(".right-btn", {
  //   opacity: 0,
  //   y: 100,        
  //   duration: 1,
  //   ease: "expo.out"
  // })
})





  const [currentDateTime, setCurrentDateTime] = useState("");
  const [summaryData, setSummaryData] = useState<MarketSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [topGainers, setTopGainers] = useState<ProcessedStock[]>([]);
  const [topLosers, setTopLosers] = useState<ProcessedStock[]>([]);
  const [turnover, setTurnover] = useState<ProcessedStock[]>([]);
  const [topVolume, setTopVolume] = useState<ProcessedStock[]>([]);
  const [topTransactions, setTopTransactions] = useState<ProcessedStock[]>([]);
    const [subIndicesData, setSubIndicesData] = useState<IndexData | null>(null);

  // Tab states
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const [activeTab2, setActiveTab2] = useState<'turnover' | 'topvolume' | 'toptransactions'>('turnover');

  // Sort states
  const [sortConfig1, setSortConfig1] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [sortConfig2, setSortConfig2] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const { user, isAuthenticated, checkAuth } = useAuthStore();

  const processMarketData = (data: MarketDataResponse) => {
    const scripsArray = Object.values(data.scripsDetails).map(scrip => ({
      symbol: scrip.symbol,
      ltp: scrip.ltp,
      change: scrip.pointChange,
      percentChange: scrip.percentageChange,
      volume: scrip.totalTradeQuantity,
      transactions: scrip.totalTrades,
      turnover: scrip.totalTurnover
    }));

    const sortedByChange = [...scripsArray].sort((a, b) => b.percentChange - a.percentChange);
    
    const processedTopGainers = sortedByChange
      .filter(stock => stock.percentChange > 0)
      .slice(0, 9);
    
    const processedTopLosers = sortedByChange
      .filter(stock => stock.percentChange < 0)
      .reverse()
      .slice(0, 9);

    const processedTopTurnover = [...scripsArray]
      .sort((a, b) => b.turnover - a.turnover)
      .slice(0, 9);

    const processedTopVolume = [...scripsArray]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 9);

    const processedTopTransactions = [...scripsArray]
      .sort((a, b) => b.transactions - a.transactions)
      .slice(0, 9);

    return {
      topGainers: processedTopGainers,
      topLosers: processedTopLosers,
      topTurnover: processedTopTurnover,
      topVolume: processedTopVolume,
      topTransactions: processedTopTransactions
    };
  };

  const formatNumber = (num?: number) => {
    if (!num || isNaN(num)) return "0";
    
    const formatted = num.toLocaleString("en-IN");
    
    if (num >= 1_000_000_000) {
      const arab = num / 1_000_000_000;
      return `${formatted} (${arab.toFixed(2)} Arab)`;
    }
    
    if (num >= 10_000_000) {
      const crore = num / 10_000_000;
      return `${formatted} (${crore.toFixed(2)} Crore)`;
    }
    
    if (num >= 100_000) {
      const lakh = num / 100_000;
      return `${formatted} (${lakh.toFixed(2)} Lakh)`;
    }
    
    return formatted;
  };

  const handleSort1 = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig1 && sortConfig1.key === key && sortConfig1.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig1({ key, direction });
  };

  const handleSort2 = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig2 && sortConfig2.key === key && sortConfig2.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig2({ key, direction });
  };



  const sortData = (
    array: ProcessedStock[], 
    config: { key: string; direction: 'asc' | 'desc' } | null
  ): ProcessedStock[] => {
    if (!config) return array;
    return [...array].sort((a, b) => {
      const aValue = a[config.key as keyof ProcessedStock];
      const bValue = b[config.key as keyof ProcessedStock];
      
      if (aValue < bValue) return config.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

 // Get data for first table
  const data1 = activeTab === 'gainers' ? topGainers : topLosers;
  const sortedData1 = sortData(data1, sortConfig1);

  // Get data for second table
  const dataMap: Record<string, ProcessedStock[]> = {
    turnover: turnover,
    topvolume: topVolume,
    toptransactions: topTransactions
  };
  const data2 = dataMap[activeTab2];
  const sortedData2 = sortData(data2, sortConfig2);



  const handledemobtn = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {


const subIndices = async () => {
  try {
    const response = await summaryApi.subIndices();
    
    if (response.success && response.data) {
      // Just set the data directly - no transformation needed!
      setSubIndicesData(response.data);
    }
  } catch (err) {
    console.error("subindices error:", err);
  }
}
  console.log('Component mounted, calling subIndices');
subIndices()

    const marketData = async () => {
      try {
        const response = await summaryApi.marketTable();
        console.log(response);
        const processed = processMarketData(response);
        
        setTopGainers(processed.topGainers);
        setTopLosers(processed.topLosers);
        setTurnover(processed.topTurnover);
        setTopVolume(processed.topVolume);
        setTopTransactions(processed.topTransactions);
        
        console.log('Processed data:', processed);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };
    marketData();

    const summaryDataFetch = async () => {
      try {
        const response = await summaryApi.marketSummary();
        setSummaryData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    summaryDataFetch();

    const subIndicesInterval = setInterval(subIndices, 30000);
      const marketDataInterval = setInterval(marketData, 30000);
  const summaryDataInterval = setInterval(summaryDataFetch, 30000);


    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
      };
      const formatted = now.toLocaleString('en-US', options);
      setCurrentDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => {clearInterval(interval)
      clearInterval(marketDataInterval);
    clearInterval(summaryDataInterval);
     clearInterval(subIndicesInterval); 

    };
  }, []);

 
  return (
    <div className="min-h-screen overflow-x-hidden">

      
    <div className="flex items-center border-b-4 pl-4 sm:pl-6 md:pl-8 border-gray-300 dark:border-gray-600 pt-2 pb-2">
  <p className="text-sm sm:text-base pr-4 whitespace-nowrap">As of {currentDateTime}</p>
  <MarketTicker subIndicesData={subIndicesData}/>
</div>

      <div className="w-full mt-8 sm:mt-12 md:mt-14 lg:mt-16 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-6xl mx-auto">
          <p className="paragraph  font-ovo text-base sm:text-lg md:text-xl tracking-wider font-medium mb-3 sm:mb-4">
            Finance is our core
          </p>

          <h1 className="hero  font-ovo text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl mx-auto mb-4 sm:mb-6 leading-tight font-extrabold px-4">
            Powerful insight for every investor.
          </h1>

          <h2 className="paragraph font-ovo text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-10 font-normal px-4">
            Live market data and powerful analytical tools that work the way you do
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            {isAuthenticated ? (
              <button onClick={() => router.push("/dashboard")} className="left-btn cursor-pointer bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold px-6 sm:px-8 py-3 rounded-xl shadow-lg text-base sm:text-lg w-full sm:w-auto">
                Go to Dashboard
              </button>
            ) : (
              <button onClick={() => router.push("/login")} className="left-btn cursor-pointer bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold px-6 sm:px-8 py-3 rounded-xl shadow-lg text-base sm:text-lg w-full sm:w-auto">
                Try for free
              </button>
            )}

            <button onClick={() => router.push("/live")} className="right-btn cursor-pointer bg-white border-2 border-teal-500 hover:bg-teal-50 transition-all text-teal-500 font-semibold px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg w-full sm:w-auto">
              View Live Market
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 mb-4 flex justify-center px-4 sm:px-6">
        <div className="max-w-7xl w-full">
          <div className="bg-gray-100 border-2 sm:border-4 border-gray-200 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
            <img src="portfolio-light.webp" alt="Portfolio Dashboard" className="w-full h-auto" />
          </div>
        </div>
      </div>

      <div className="mt-14 px-2 sm:px-4 transition-colors">
        <h2 className="flex items-center justify-center font-ovo text-2xl sm:text-3xl md:text-4xl max-w-3xl mx-auto mb-6 sm:mb-8 font-semibold text-gray-900 dark:text-white">
          Market Summary
        </h2>

        <div className="lg:max-w-7xl max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-14 px-2 sm:px-4">
          
          {/* LEFT TABLE */}
          <div className="flex flex-col">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <button
                onClick={() => setActiveTab('gainers')}
                className={`flex-1 max-w-[120px] sm:max-w-[150px] py-1.5 sm:py-2 font-semibold text-[10px] sm:text-xs transition-all rounded-l-lg border border-r-0 ${
                  activeTab === 'gainers' 
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-emerald-600 dark:border-emerald-600 cursor-pointer' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setActiveTab('losers')}
                className={`flex-1 max-w-[120px] sm:max-w-[150px] py-1.5 sm:py-2 font-semibold text-[10px] sm:text-xs transition-all rounded-r-lg border ${
                  activeTab === 'losers' 
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-red-600 dark:border-red-600 cursor-pointer' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Top Losers
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-400 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] sm:text-xs">
                 <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-400 dark:border-gray-800">
  <tr>
    <SortHeader label="Symbol" sortKey="symbol" onSort={handleSort1} align="left" currentSort={sortConfig1} />
    <SortHeader label="LTP" sortKey="ltp" onSort={handleSort1} align="right" currentSort={sortConfig1} />
    <SortHeader label="Pt." sortKey="change" onSort={handleSort1} align="right" currentSort={sortConfig1} />
    <SortHeader label="%Chg" sortKey="percentChange" onSort={handleSort1} align="right" currentSort={sortConfig1} />
    <SortHeader label="Vol" sortKey="volume" onSort={handleSort1} align="right" currentSort={sortConfig1} />
    <SortHeader label="Trans" sortKey="transactions" onSort={handleSort1} align="right" currentSort={sortConfig1} className="hidden sm:table-cell" />
    <SortHeader label="Turnover" sortKey="turnover" onSort={handleSort1} align="right" currentSort={sortConfig1} className="hidden sm:table-cell" />
  </tr>
</thead>
                  <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
                    {sortedData1.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{stock.symbol}</td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right dark:text-gray-300">{stock.ltp.toLocaleString()}</td>
                        <td className={`px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right font-bold ${activeTab === 'gainers' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stock.change.toFixed(2)}
                        </td>
                        <td className={`px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right font-bold ${activeTab === 'gainers' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stock.percentChange.toFixed(2)}%
                        </td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right text-gray-800 dark:text-gray-400">{stock.volume.toLocaleString()}</td>
                        <td className="hidden sm:table-cell px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right text-gray-800 dark:text-gray-400">{stock.transactions.toLocaleString()}</td>
                        <td className="hidden sm:table-cell px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right text-gray-800 dark:text-gray-400">{stock.turnover.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT TABLE */}
          <div className="flex flex-col">
            <div className="flex items-center justify-center mb-3 sm:mb-4 gap-1">
              <button
                onClick={() => setActiveTab2('turnover')}
                className={`flex-1 max-w-[100px] sm:max-w-[120px] py-1.5 sm:py-2 font-semibold text-[10px] sm:text-xs transition-all rounded-l-lg border border-r-0 ${
                  activeTab2 === 'turnover' 
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-blue-600 dark:border-blue-600 cursor-pointer' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Turnover
              </button>
              <button
                onClick={() => setActiveTab2('topvolume')}
                className={`flex-1 max-w-[100px] sm:max-w-[120px] py-1.5 sm:py-2 font-semibold text-[10px] sm:text-xs transition-all border ${
                  activeTab2 === 'topvolume' 
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-blue-600 dark:border-blue-600 cursor-pointer' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setActiveTab2('toptransactions')}
                className={`flex-1 max-w-[100px] sm:max-w-[120px] py-1.5 sm:py-2 font-semibold text-[10px] sm:text-xs transition-all rounded-r-lg border border-l-0 ${
                  activeTab2 === 'toptransactions' 
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-blue-600 dark:border-blue-600 cursor-pointer' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Transactions
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-400 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] sm:text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-400 dark:border-gray-800">
  <tr>
    <SortHeader label="Symbol" sortKey="symbol" onSort={handleSort2} align="left" currentSort={sortConfig2} />
    <SortHeader label="LTP" sortKey="ltp" onSort={handleSort2} align="right" currentSort={sortConfig2} />
    <SortHeader label="Pt." sortKey="change" onSort={handleSort2} align="right" currentSort={sortConfig2} />
    <SortHeader label="%Chg" sortKey="percentChange" onSort={handleSort2} align="right" currentSort={sortConfig2} />
    <SortHeader label="Vol" sortKey="volume" onSort={handleSort2} align="right" currentSort={sortConfig2} />
    <SortHeader label="Trans" sortKey="transactions" onSort={handleSort2} align="right" currentSort={sortConfig2} className="hidden sm:table-cell" />
    <SortHeader label="Turnover" sortKey="turnover" onSort={handleSort2} align="right" currentSort={sortConfig2} className="hidden sm:table-cell" />
  </tr>
</thead>
                  <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
                    {sortedData2.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{stock.symbol}</td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right dark:text-gray-300">{stock.ltp.toLocaleString()}</td>
                        <td className={`px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right font-bold ${stock.percentChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stock.change.toFixed(2)}
                        </td>
                        <td className={`px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right font-bold ${stock.percentChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stock.percentChange.toFixed(2)}%
                        </td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right text-gray-800 dark:text-gray-400">{stock.volume.toLocaleString()}</td>
                        <td className="hidden sm:table-cell px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right text-gray-800 dark:text-gray-400">{stock.transactions.toLocaleString()}</td>
                        <td className="hidden sm:table-cell px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap text-right text-gray-800 dark:text-gray-400">{stock.turnover.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center px-4 mt-8 sm:mt-12">
          <div className="bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8">
            <p className="text-white text-center text-sm sm:text-base mb-6 sm:mb-8">
              Latest Date: {currentDateTime}
            </p>
            
            <div className="grid grid-cols-2 gap-6 sm:gap-8 text-white">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Total turnover Rs</p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {formatNumber(summaryData?.["Total Turnover Rs:"])}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Total transactions</p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {summaryData?.["Total Transactions"]?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Total traded shares</p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {formatNumber(summaryData?.["Total Traded Shares"])}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Total scripts traded</p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {summaryData?.["Total Scrips Traded"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* <div className="max-w-6xl h-[50vh]">

      <Animation/>
</div> */}


      <div className="w-full mt-12 md:mt-14 lg:mt-16 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-ovo text-sm md:text-base tracking-wider font-medium mb-3 sm:mb-4">
            Our suits of best products
          </p>

          <h2 className="font-ovo text-4xl sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto mb-4 sm:mb-6 leading-tight font-semibold px-4">
            Feel the best experience with our premium products
          </h2>

          <p className="font-ovo text-base sm:text-lg md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 font-normal px-4">
            Packed with features to help you stay on top of your finances, no matter where life takes you.
          </p>

          <button onClick={() => handledemobtn()} className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold px-6 sm:px-8 py-3 rounded-xl shadow-lg text-base sm:text-lg w-full sm:w-auto">
            See our demo
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center px-4 sm:px-6 mt-12 sm:mt-16 lg:mt-20 mb-10">
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 sm:gap-8 lg:gap-10 max-w-6xl w-full">
          <div className="bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl w-full lg:max-w-md">
            <h3 className="font-semibold text-xl sm:text-2xl mb-4 sm:mb-6">
              Market Intelligence and Analysis
            </h3>

            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              <li>• Real-time NEPSE prices, indices, and market trends</li>
              <li>• In-depth broker performance comparisons</li>
              <li>• AI-powered signals and technical charting tools</li>
              <li>• Macro-economic impact analysis (GDP, inflation, interest rates)</li>
            </ul>

            <div className="mt-8 sm:mt-10 flex justify-center">
              <img src="/investment-insights.webp" alt="Investment Insights" className=" w-full rounded-2xl"  />
            </div>
          </div>

          <div className="bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl w-full lg:max-w-md">
            <h3 className="font-semibold text-xl sm:text-2xl mb-4 sm:mb-6">
              Investment Insights and Advisory
            </h3>

            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              <li>• Company financials, valuation metrics, and earnings reports</li>
              <li>• Custom portfolio consulting and strategy support</li>
              <li>• Predictive analytics and personalized alerts</li>
              <li>• Fundamental & technical insights for informed decisions</li>
            </ul>

            <div className="mt-8 sm:mt-10 flex justify-center">
              <img src="/market-intelligence.webp" alt="Market Intelligence" className="rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-10 shadow-xl w-full flex flex-col justify-center items-center  rounded-lg">
        <div className="max-w-4xl w-full flex flex-col lg:flex-row justify-center items-center mb-6 sm:mb-8 gap-6 sm:gap-8 px-4">
          <h2 className="font-ovo font-medium text-2xl sm:text-3xl md:text-4xl  leading-tight max-w-sm text-center lg:text-left">
            Built by investors for investors
          </h2>

          <button  onClick={() => handledemobtn()} className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold px-6 sm:px-8 py-3 rounded-xl shadow-lg text-base sm:text-lg flex-shrink-0 whitespace-nowrap w-full sm:w-auto">
            Try for free
          </button>
        </div>

        <p className="font-ovo text-base sm:text-lg max-w-2xl  text-center px-4 mb-8">
          Paiso gives you the edge with real-time data, intelligent signals, and tools crafted by traders who understand what actually matters.
        </p>

        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">
                  See only what matters
                </h3>
              </div>
              <p className="leading-relaxed text-sm sm:text-base ">
                Our dashboard is fully customizable track only the indicators, stocks, and signals that align with your strategy. Instant market access from anywhere.
              </p>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">
                  Simplify your investing
                </h3>
              </div>
              <p className="leading-relaxed text-sm sm:text-base ">
                All your portfolios, trades, insights, and reports in one place. We make decision-making fast, visual and distraction-free.
              </p>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Brush className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">
                  Tailored to your vision
                </h3>
              </div>
              <p className="leading-relaxed text-sm sm:text-base ">
                Break away from rigid tools. Napalytix adapts to your investment style — whether you're a long-term investor, swing trader, or data-driven analyst.
              </p>
            </div>
          </div>

          <img className="w-full rounded-lg shadow-lg" src="/hero-chart.webp" alt="Dashboard preview" />
        </div>
      </div>

          <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-10 shadow-xl w-full flex flex-col rounded-lg bg-white dark:bg-zinc-900">
  
  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4"> 
    <div className="flex flex-col gap-2 w-full">
      <h1 className="font-ovo text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        Who do we empower?
      </h1>
      <p className="text-gray-600 font-ovo dark:text-gray-400 max-w-2xl text-lg">
        We deliver high-quality data, advanced analytics and AI-driven insights for comprehensive financial success.
      </p>
    </div>

    <button  
      onClick={handledemobtn} 
      className="cursor-pointer  bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold px-4 py-4 rounded-full shadow-lg text-md flex-shrink-0 whitespace-nowrap"
    >
      See Our Demo
    </button>
  </div>


                      <div></div>
</div>
      

      <div className="w-full mt-12 md:mt-14 lg:mt-16 flex items-center justify-center px-4 sm:px-6 mb-6">
        <div className="text-center max-w-6xl mx-auto">
          <p className="font-ovo text-sm md:text-base  tracking-wider font-medium mb-3 sm:mb-4">
            Market Summary
          </p>

          <h2 className="font-ovo text-3xl sm:text-4xl md:text-5xl max-w-2xl mx-auto leading-tight font-semibold  mb-2">
            Everything in one
          </h2>

          <h2 className="font-ovo text-3xl sm:text-4xl md:text-5xl max-w-2xl mx-auto mb-4 sm:mb-6 leading-tight font-semibold ">
            place
          </h2>

          <p className="leading-relaxed text-base sm:text-lg font-ovo max-w-2xl mb-8 sm:mb-10 mx-auto px-4 ">
            Paiso is the only tool you need for a full picture of the financial markets. We've got your back. Our industry-leading data is right there for you, no matter the size of your portfolio.
          </p>

          <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-left">NEPSE Dashboard</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 text-left">
              Real-time overview of the Nepal Stock Exchange with key market indicators.
            </p>
            <img 
              src="/nepalytix-chart.webp" 
              alt="NEPSE Dashboard" 
              className="w-full rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-left">Research and report</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 text-left">
                Expert-driven market research and insightful investment reports.
              </p>
              <img 
                src="/research-and-report.webp" 
                alt="Research and Report" 
                className="w-full rounded-lg"
              />
            </div>

            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-left">AI-based buy-sell signal</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 text-left">
                Smart trading signals powered by AI to guide your investment decisions.
              </p>
              <img 
                src="/ai-buy-sell-signal.webp" 
                alt="AI-based buy-sell signal" 
                className="w-full rounded-lg"
              />
            </div>

            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-left">Financial and technical analysis</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 text-left">
                In-depth analysis tools to evaluate stock performance and trends.
              </p>
              <img 
                src="/financial-and-technical-analysis.webp" 
                alt="Financial and technical analysis" 
                className="w-full rounded-lg"
              />
            </div>

            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-left">Broker analysis</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 text-left">
                Compare and analyze broker performance and trading activity.
              </p>
              <img 
                src="/broker-analysis.webp" 
                alt="Broker analysis" 
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className='relative h-[300px] sm:h-[350px] md:h-[400px] bg-cover bg-center flex items-center justify-start px-6 sm:px-8 md:px-12' style={{ backgroundImage: "url('/footer-img.webp')" }}>
        <div className='max-w-2xl'>
          <h2 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight'>
            Ready to Take Control of Your Finances?
          </h2>
          <p className='text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6'>
            Track live stock prices and market indices.
          </p>
          <button  onClick={() =>handledemobtn()} className='bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base'>
            Get a free demo
          </button>
        </div>
      </div>
    </div>
  );
}