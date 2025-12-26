
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Outfit, Ovo} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { useAuth } from "@/lib/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-outfit'
});

const ovo = Ovo({
  subsets: ["latin"], 
  weight: ["400"], 
  variable: '--font-ovo' 
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paiso-Home",
  description: "Paiso hompage",
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en"  suppressHydrationWarning>
      <body
      className={`${geistSans.variable} ${outfit.variable} ${ovo.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
        attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
                <Providers>{children}</Providers>
        </ThemeProvider>
          
      </body>
    </html>
  );
}
