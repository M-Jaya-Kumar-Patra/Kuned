import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import BetaNotice from "@/components/BetaNotice";
import { GoogleAnalytics } from "@next/third-parties/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuned",
  description: "Buy, sell & discover great deals near you.",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics gaId="G-7L1J4NMRP9" />
        
          <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="afterInteractive"
        />
        
        <AuthProvider>
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      
      <div className="flex flex-col min-h-screen">
        <NavbarWrapper />

        <BetaNotice />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>

    </GoogleOAuthProvider>
  </AuthProvider>
      </body>
    </html>
  );
}
