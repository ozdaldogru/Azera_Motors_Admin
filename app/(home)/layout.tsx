import "../globals.css";
import * as React from "react";
import { ThemeProvider } from "@/lib/ThemeProvider";
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import { ToasterProvider } from "@/lib/ToasterProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azera Motors admin",
  description: "Admin dashboard to manage Azera Motors",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <ToasterProvider />
            <div className="flex min-h-screen max-lg:flex-col bg-[var(--background)] text-[var(--foreground)]">
              <LeftSideBar />
              <TopBar />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
  
  );
}
