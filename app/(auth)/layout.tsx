import "../globals.css";
import * as React from "react";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { ToasterProvider } from "@/lib/ToasterProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'AzeraMotors',
  description: 'Azera Motors Admin Panel',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ToasterProvider />
          <div className="auth-shell flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
