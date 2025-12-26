"use client"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { useUIStore } from "@/lib/stores/uiStore"
import { ChevronRight, ChevronLeft, TrendingUp,  } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, 
     TooltipContent,
   TooltipProvider,
   TooltipTrigger,
 } from "../ui/tooltip"
 import navItems from "./navitems"


const isActiveRoute = (currentPath: string, routePath: string): boolean => {
   // If it's exactly the same route
   if (currentPath === routePath) return true;
   
   // If current path starts with route path + "/" (sub-route)
   if (currentPath.startsWith(routePath + "/")) {
      // Special case: don't match parent if current route is a specific child
      const remainingPath = currentPath.substring(routePath.length + 1);
      const nextSegment = remainingPath.split("/")[0];
      
      // Add specific exclusions here
      const exclusions: Record<string, string[]> = {
         "/tickets": ["kanban", "new", "create"],
         "/users": ["profile", "settings"],
         // Add more as needed
      };
      
      if (exclusions[routePath] && exclusions[routePath].includes(nextSegment)) {
         return false;
      }
      
      return true;
   }
   
   return false;
};

export default function Sidebar() {
   const pathname = usePathname();
   const { sidebarCollapsed, toggleSidebarCollapse , setSidebarCollapsed} = useUIStore();
 useEffect(() => {
      const handleResize = () => {
         // Auto-close on mobile/tablet (< 1024px), open on desktop (>= 1024px)
         if (window.innerWidth < 1024) {
            setSidebarCollapsed(true);
         } else {
            setSidebarCollapsed(false);
         }
      };

      // Set initial state
      handleResize();

      // Listen for window resize
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
   }, [setSidebarCollapsed]);


   return (
      <aside
         className={cn(
         "fixed left-0 top-0 z-40 h-screen border-r dark:border-gray-600 border-gray-300 bg-white dark:bg-zinc-900 transition-all duration-300",
         sidebarCollapsed ? "w-16" : "w-64"
         )}
      >
         <div className="flex h-full flex-col">
         {/* Logo */}
         <div className="flex h-16 items-center justify-between border-b border-gray-300 dark:border-gray-600  px-4">
            {!sidebarCollapsed && (
               <Link href="/home" className="flex items-center space-x-2">
               <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
               </div>
               <span className="text-lg font-bold">Paiso</span>
               </Link>
            )}
            <Button
               size="icon"
               onClick={toggleSidebarCollapse}
               className={cn("h-8 w-8   cursor-pointer rounded-full bg-gray-200/50  dark:bg-gray-300/20",  sidebarCollapsed && "mx-auto")}
            >
               {sidebarCollapsed ? (
               <ChevronRight className="h-4 w-4" />
               ) : (
               <ChevronLeft className="h-4 w-4 " />
               )}
            </Button>
         </div>

         {/* Navigation */}
         <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            <TooltipProvider>
               {navItems.map((item, index) => {
               const isActive = isActiveRoute(pathname, item.href);
               const Icon = item.icon;

               const navLink = (
                  <Link
                     key={index}
                     href={item.href}
                     className={cn(
                     "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                     isActive
                        ? "bg-primary  dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                     sidebarCollapsed && "justify-center"
                     )}
                  >
                     <Icon
                     className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")}
                     />
                     {!sidebarCollapsed && <span>{item.title}</span>}
                  </Link>
               );

               return sidebarCollapsed ? (
                  <Tooltip key={index}>
                     <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                     <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
               ) : (
                  navLink
               );
               })}
            </TooltipProvider>
         </nav>
         </div>
      </aside>
   );
}