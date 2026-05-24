import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FinAI India | AI-Powered Finance Calculators",
  description:
    "Smart Indian finance calculators with AI-powered insights. Compare old vs new tax regime, calculate EMI, SIP returns, salary in-hand, and loan prepayment.",
  keywords: [
    "EMI calculator India", "SIP calculator", "tax regime calculator India",
    "salary calculator CTC to in-hand", "loan prepayment calculator",
    "Indian finance tools", "AI financial advisor India",
  ],
  openGraph: {
    title: "FinAI India | AI-Powered Finance Calculators",
    description: "Smart financial calculators with AI insights. Compare old vs new tax regime, calculate EMI, SIP returns, and more.",
    type: "website", locale: "en_IN", siteName: "FinAI India",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinAI India | AI-Powered Finance Calculators",
    description: "Smart financial calculators with AI insights.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#020617" />
        <meta name="application-name" content="FinAI India" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider>
            <Navbar />
            <main className="pt-16 min-h-screen pb-20 lg:pb-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
