// lib/hooks/useAuth.ts
"use client"
import { useEffect } from "react";
import { useAuthStore } from "../stores/authstore";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth: boolean = true) {
   const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
   const router = useRouter();

   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   useEffect(() => {
      if (!isLoading && requireAuth && !isAuthenticated) {
         router.push("/login");
      }
   }, [isAuthenticated, isLoading, requireAuth, router]);

   return { user, isAuthenticated, isLoading };
}
