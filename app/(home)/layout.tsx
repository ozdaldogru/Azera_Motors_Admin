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
            <div className="flex max-lg:flex-col text-black-1 bg-color-grey-1">
              <LeftSideBar />
              <TopBar />
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
        </body>
      </html>
  
  );
}
