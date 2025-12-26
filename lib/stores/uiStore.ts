// lib/stores/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
   theme: "light" | "dark" | "system";
   sidebarOpen: boolean;
   sidebarCollapsed: boolean;
   setTheme: (theme: "light" | "dark" | "system") => void;
   toggleSidebar: () => void;
   toggleSidebarCollapse: () => void;
   setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
   persist(
      (set) => ({
         theme: "system",
         sidebarOpen: true,
         sidebarCollapsed: false,

         setTheme: (theme) => {
         set({ theme });

         // Apply theme to document
         if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");

            if (theme === "system") {
               const systemTheme = window.matchMedia(
               "(prefers-color-scheme: dark)"
               ).matches
               ? "dark"
               : "light";
               root.classList.add(systemTheme);
            } else {
               root.classList.add(theme);
            }
         }
         },

         toggleSidebar: () =>
         set((state) => ({ sidebarOpen: !state.sidebarOpen })),

         toggleSidebarCollapse: () =>
         set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
         })),
            setSidebarCollapsed: (collapsed) => 
            set({ sidebarCollapsed: collapsed }),
      }),
      {
         name: "ui-storage",
      }
   )
);
