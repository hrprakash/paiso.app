export interface CompanyNewsNAlert {
    id: number;
    uuid: string;
    created_on: string; // ISO Date-time string
    updated_on: string; // ISO Date-time string
    source_type: 'news_alert' | 'company_news';
    title: string | null;
    body: string | null;
    encrypted_id: string | null;
    symbol: string | null;
    security_name: string | null;
    file: string | null; // URI
    remote_file_path: string | null; // URI
    remarks: string | null;
    expiry_date: string | null; // Date string
    added_date: string | null; // Date-time string
    modified_date: string | null; // Date-time string
    approved_date: string | null; // Date-time string
    published_date: string | null; // Date-time string
    board_meeting_date: string | null; // Date string
}
export interface NewsListResponse {
    count: number;
    next: string | null; // URI for the next page
    previous: string | null; // URI for the previous page
    results: CompanyNewsNAlert[]; // The array of news items
}
export interface NewsListRequestParams {
    source_type?: string;
    symbol?: string;
    title?: string;
    security_name?: string;
    approved_date?: string;
    page?: number;
    page_size?: number;
}

export interface MarketSummaryStats {
  "Total Turnover Rs:": number;
  "Total Traded Shares": number;
  "Total Transactions": number;
  "Total Scrips Traded": number;
}

export interface ScripDetail {
  symbol: string;
  sectorName: string;
  totalTurnover: number;
  totalTrades: number;
  totalTradeQuantity: number;
  pointChange: number;
  percentageChange: number;
  ltp: number;
}

export interface MarketDataResponse {
  scripsDetails: Record<string, ScripDetail>;
}

// Define the structure of each index item
// types/index.ts or wherever you keep types
export interface IndexItem {
  id: number;
  index: string;
  change: number;
  perChange: number;
  currentValue: number;
}

export interface IndexData {
  [key: string]: IndexItem;
}


export interface StockTableItem {
  id: number;
  sn?: number; // Serial number for display
  symbol: string;
  ltp: number;
  closePrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  turnover: number;
  trades: number;
  change: number;
  percentChange: number;
  previousClose: number;
  week52High: number;
  week52Low: number;
  marketCap: number;
  sector: string | null;
  name: string;
}
export interface CompanyList {
  id: number;
  uuid: string;
  created_on: string;
  updated_on: string;
  name: string;
  symbol: string;
  nepse_id: number;
  company_reg_no: string | null;
  email: string;
  website: string;
  nepse_status: string;
  commercial_operation_date: string | null;
  nrb_status: string;
  sector: number;
  ordinary_scrip: number;
  promoter_scrip: number | null;
}