import { ROUTES } from "@/lib/constants/route"
import { 
  FolderKanban,         // Portfolio
  Activity,             // Market Summary
  Eye,                  // Watchlist
  LineChart,            // Charts
  Signal,               // Signals
  SlidersHorizontal,    // Range (Screener)
  PieChart,             // Sector Analysis
  CandlestickChart,     // Technical Analysis
  Scale,                // Fundamental Analysis
  Banknote,             // Mutual Fund
  ScanLineIcon,                 // Scanner
  Briefcase,            // Broker Analysis
  Search,               // Research & Reports
  Mail,                 // Newsletter
  MessageSquare,         // Feedback & Suggestions
  SignalIcon,
  ScanLine
} from 'lucide-react';
interface NavItem {
   title: string;
   href: string;
   icon: any;
   permission?: string;
}

const navItems: NavItem[] = [
   {
      title: "Portfolio",
      href: ROUTES.DASHBOARD.HOME,
      icon: FolderKanban,
   },
   {
      title: "Market Summary",
      href: ROUTES.MARKETSUMMARY,
      icon: Activity,
   },
   {
      title: "Watchlist",
      href: ROUTES.WATCHLIST,
      icon: Eye,
   },
   {
      title: "Charts",
      href: ROUTES.CHARTS,
      icon: LineChart,
   },
  {
      title: "Signals",
      href: ROUTES.SIGNALS,
      icon: Signal,
   },
    {
      title: "Range",
      href: ROUTES.RANGE,
      icon: SlidersHorizontal,
   },
    {
      title: "Sector Analysis",
      href: ROUTES.SECTOR_ANALYSIS,
      icon: PieChart,
   },
    {
      title: "Technical Analysis",
      href: ROUTES.TECHNICAL_ANALYSIS,
      icon: CandlestickChart,
   },
    {
      title: "Fundamental Analysis",
      href: ROUTES.FUNDAMENTAL_ANALYSIS,
      icon: Scale,
   },
    {
      title: "Mutual Fund",
      href: ROUTES.MUTUAL_FUND,
      icon: Banknote,
   },
    {
      title: "Scanner",
      href: ROUTES.SCANNER,
      icon: ScanLineIcon,
   },
    {
      title: "Broker Analysis",
      href: ROUTES.BROKER_ANALYSIS,
      icon: Briefcase,
   },
   {
      title: "Research Analysis",
      href: ROUTES.RESEARCH_REPORTS,
      icon: Search,
   },
   {
      title: "Newsletter",
      href: ROUTES.NEWSLETTER,
      icon: Mail,
   },
   {
      title: "Feedback & Suggestions",
      href: ROUTES.FEEDBACK_AND_SUGGESTIONS,
      icon: MessageSquare,
   },

];
export default navItems;