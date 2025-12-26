import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STORAGE_KEYS } from "./lib/constants/key_strings";

export function proxy(request: NextRequest){

    const token = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value

    const isAuthPage = 
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/forget-password") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/verify-email") 
    

    const isPublicPath = 
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/") 

      // Redirect to dashboard if accessing auth pages with token
//    if (isAuthPage && token) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//    }

     // Redirect to login if accessing protected routes without token
     if (!isPublicPath && !isAuthPage && !token) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.set("returnTo", request.url, {  
//             response.cookies.set(...): This tells the browser to store a small piece of data (a cookie) on the user's computer.
// "returnTo": This is the name (key) of the cookie. You can name it anything (e.g., redirectAfterLogin), but returnTo is a common convention.
// request.url: This is the value being stored. As discussed before, it is the full, absolute URL the user was trying to access (e.g., http://localhost:3000/dashboard/settings)
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 300,
        })
        return response
     }

        // If accessing login page but token exists, redirect to stored return URL or dashboard
        if (isAuthPage && token) {
            const returnTo = request.cookies.get("returnTo")?.value
            const redirectUrl = returnTo || "/home"
            const response = NextResponse.redirect(new URL(redirectUrl, request.url))
            response.cookies.delete("returnTo")
            return response
        }
        return NextResponse.next()
}

export const config = {
    matcher: [
          "/login",
      "/forgot-password",
      "/register",
      "/verify-email",
      "/api/:path*",
      "/dashboard",
      "/auth/:path*",
    ]
}