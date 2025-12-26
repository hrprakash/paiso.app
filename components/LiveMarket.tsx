"use client"
import { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, Search, X, ChevronDown } from 'lucide-react';
import { summaryApi } from '@/lib/api/summary';
import { StockTableItem } from '@/lib/api/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdowm-menu"


const StockTable = () => {
      const [currentDateTime, setCurrentDateTime] = useState("");
  const [allStocks, setAllStocks] = useState<StockTableItem[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockTableItem[]>([]);
  const [displayedStocks, setDisplayedStocks] = useState<StockTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(20);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StockTableItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    fetchStocks();

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
    const interval = setInterval(updateDateTime, 3000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, itemsPerPage, allStocks]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await summaryApi.todayPrice();
      
      if (response.success && response.data) {
        setAllStocks(response.data);
        setFilteredStocks(response.data);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allStocks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      );
    }

    setFilteredStocks(filtered);

    // Apply items per page
    if (itemsPerPage === 'all') {
      setDisplayedStocks(filtered);
    } else {
      setDisplayedStocks(filtered.slice(0, itemsPerPage));
    }
  };

  const handleSort = (key: keyof StockTableItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...displayedStocks].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return direction === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setDisplayedStocks(sorted);
    setSortConfig({ key, direction });
  };

  const handleReset = () => {
    setSearchQuery('');
    setItemsPerPage(20);
    setSortConfig(null);
    setFilteredStocks(allStocks);
    setDisplayedStocks(allStocks.slice(0, 20));
  };

  const handleFilter = () => {
    applyFilters();
  };

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: keyof StockTableItem }) => {
    const isActive = sortConfig?.key === sortKey;
    
    return (
      <th 
        className="px-3 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-right"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center justify-end gap-1">
          {label}
          <ArrowUpDown className={`h-3 w-3 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
        </div>
      </th>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">


    <div className='mx-auto flex items-center justify-center-safe'>
     <p className='font-ovo text-lg font-semibold'>
           As of {currentDateTime}
        </p>
    </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Symbol or Company Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none dark:bg-zinc-800 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Items Per Page */}
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Items Per Page
            </label>


<DropdownMenu>
  <DropdownMenuTrigger className="w-full sm:w-32 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md  focus:ring-emerald-500 dark:bg-zinc-800  focus:outline-none  dark:text-white cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
    <span>{itemsPerPage === 'all' ? 'All' : itemsPerPage}</span>
    <ChevronDown className="h-4 w-4 ml-2" />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-32 bg-white dark:bg-zinc-700">
    <DropdownMenuItem 
      onClick={() => setItemsPerPage(20)}
      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-400"
    >
      20
    </DropdownMenuItem>
    <DropdownMenuItem 
      onClick={() => setItemsPerPage(50)}
      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-400"
    >
      50
    </DropdownMenuItem>
    <DropdownMenuItem 
      onClick={() => setItemsPerPage(100)}
      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-400"
    >
      100
    </DropdownMenuItem>
    <DropdownMenuItem 
      onClick={() => setItemsPerPage(200)}
      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-400"
    >
      200
    </DropdownMenuItem>
    <DropdownMenuItem 
      onClick={() => setItemsPerPage('all')}
      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-400"
    >
      All
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>




          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleFilter}
              className="flex-1 sm:flex-initial px-6 py-2 bg-emerald-400 dark:bg-zinc-700 hover:text-white dark:hover:text-emerald-500 cursor-pointer text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="cursor-pointer flex-1 sm:flex-initial px-6 py-2 bg-emerald-400 hover:bg-red-400 text-white dark:text-white font-medium rounded-md   transition-colors  dark:bg-zinc-600 dark:hover:bg-red-400 dark:hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {displayedStocks.length} of {filteredStocks.length} stocks
          {searchQuery && ` (filtered from ${allStocks.length} total)`}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                S/N
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Symbol
              </th>
              <SortHeader label="Close Price" sortKey="closePrice" />
              <SortHeader label="Open Price" sortKey="openPrice" />
              <SortHeader label="High" sortKey="highPrice" />
              <SortHeader label="Low" sortKey="lowPrice" />
              <SortHeader label="Total Traded" sortKey="volume" />
              <SortHeader label="Total Traded Value" sortKey="turnover" />
              <SortHeader label="Total Trades" sortKey="trades" />
              <SortHeader label="LTP" sortKey="ltp" />
              <SortHeader label="Avg Day Close" sortKey="previousClose" />
              <SortHeader label="% Traded" sortKey="percentChange" />
              <SortHeader label="52 Week High" sortKey="week52High" />
              <SortHeader label="52 Week Low" sortKey="week52Low" />
              <SortHeader label="Market Cap" sortKey="marketCap" />
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-gray-700">
            {displayedStocks.length === 0 ? (
              <tr>
                <td colSpan={15} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                  No stocks found matching your search criteria
                </td>
              </tr>
            ) : (
              displayedStocks.map((stock, index) => {
                const isPositive = stock.percentChange >= 0;
                
                return (
                  <tr 
                    key={stock.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-3 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {stock.symbol}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.closePrice)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.openPrice)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.highPrice)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.lowPrice)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.volume, 0)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.turnover)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {stock.trades}
                    </td>
                    <td className="px-3 py-4 text-sm text-right font-semibold">
                      <div className="flex items-center justify-end gap-1">
                        {formatNumber(stock.ltp)}
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.previousClose)}
                    </td>
                    <td className={`px-3 py-4 text-sm text-right font-medium ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{formatNumber(stock.percentChange)}%
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.week52High)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.week52Low)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatNumber(stock.marketCap)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;