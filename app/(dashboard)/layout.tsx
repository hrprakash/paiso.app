// app/(dashboard)/layout.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authstore";
import { useAuth } from "@/lib/hooks/useAuth";
import Sidebar from "@/components/layout/Sidebar";
import { useUIStore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils/cn";
import Header from "@/components/layout/Header";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const { sidebarCollapsed } = useUIStore();

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-900">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-zinc-900">
          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
