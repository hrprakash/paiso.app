// components/layout/Header.tsx
"use client";
import { useAuthStore } from "@/lib/stores/authstore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdowm-menu"
import { LogOut, User, Settings, Home , CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/lib/constants/route"
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import navItems from "./navitems";
import { usePathname } from 'next/navigation';

export default function Header() {
   const { user, logout } = useAuthStore();
   const router = useRouter();
   const pathname = usePathname();
const [mounted, setMounted] = useState(false);

   const currentPageTitle = useMemo(() => {
      const currentItem  = navItems.find(item =>{
         if(pathname === item.href) return true
         if(pathname.startsWith(item.href + "/")) return true 
         return false
      })

      return currentItem?.title || "Dashboard";
   }, [pathname]);

   //    useEffect(() => {
   //    setMounted(true);
   // }, []);

   // // Return a placeholder or null during SSR to prevent ID mismatch
   // if (!mounted) {
   //    return null; // Or a skeleton/basic version of your header
   // }

   const handleLogout = () => {
      logout();
      router.push("/home");
   };

   const getInitials = () => {
      if (user?.first_name) {
         return `${user.first_name[0]}`.toUpperCase();
      }
      return "U"
   };

   return (
      <header className="sticky top-0 z-30 dark:border-gray-600 flex h-16 items-center justify-between border-b border-gray-300  bg-white dark:bg-zinc-900 px-6">
         <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">{currentPageTitle}</span>
         </div>

         <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle/>

            {/* User Menu */}
            <DropdownMenu >
               <DropdownMenuTrigger asChild>
                  <Button className="relative h-10 w-10 rounded-full bg-gray-400" >
                     <Avatar>
                        <AvatarFallback className="bg-primary text-white dark:text-black cursor-pointer">
                           {getInitials()}
                        </AvatarFallback>
                     </Avatar>
                  </Button>
               </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-64 p-2  dark:bg-black/30 dark:text-white bg-white">
                  {/* User Info Header */}
                  <div className="px-3 py-3 mb-2 flex  flex-col items-center justify-center">
                     <p className="flex justify-center text-md font-semibold text-gray-900 dark:text-white">
                        {user?.first_name}
                     </p>
                     <p className="text-sm text-gray-500 dark:text-white">
                        {user?.email}
                     </p>
                  </div>


                  {/* Menu Items */}
                  <DropdownMenuItem 
                     className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-500" 
                     onClick={() => router.push("/home")}
                  >
                     <Home className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-300" />
                     <span className="text-sm">Home</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 mx-2 border" />
                  <DropdownMenuItem 
                     className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-500" 
                     onClick={() => router.push(ROUTES.DASHBOARD.HOME)}
                  >
                     <CreditCard className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-300" />
                     <div className="flex flex-col">
                        <span className="text-sm">Current Plan</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Basic</span>
                     </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 mx-2 border" />

                  <DropdownMenuItem 
                     onClick={handleLogout} 
                     className="cursor-pointer px-3 py-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                  >
                     <LogOut className="mr-3 h-4 w-4" />
                     <span className="text-sm">Sign Out</span>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </header>
   );
}