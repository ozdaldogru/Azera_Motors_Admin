"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/lib/ThemeProvider';
import { signOut } from "next-auth/react";
import { X } from "lucide-react";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="lg:hidden">
      <div className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm">
        <div style={{ width: '70px', aspectRatio: '1/1', position: 'relative' }}>
          <Image src="/logo.svg" alt="logo" fill style={{ objectFit: 'contain' }} />
        </div>

        <div className="relative flex gap-4 items-center">
          <Menu
            className="cursor-pointer"
            onClick={() => setDropdownMenu(!dropdownMenu)}
            color={theme === 'dark' ? "#fff" : "#23272f"}
          />
          {dropdownMenu && (
            <div className="fixed right-0 top-0 z-30 flex h-full w-72 flex-col gap-2 border-l border-white/10 bg-[var(--sidebar)] p-5 shadow-xl lg:hidden">
              <button
                className="self-end mb-2"
                onClick={() => setDropdownMenu(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" color="#fff" />
              </button>
              {navLinks.map((link) => (
                <Link
                  href={link.url}
                  key={link.label}
                  className="flex gap-4 rounded-lg px-3 py-3 text-sm text-gray-100 transition-colors hover:bg-white/5 hover:text-blue-300"
                  onClick={() => setDropdownMenu(false)}
                >
                  {link.icon} <p>{link.label}</p>
                </Link>
              ))}

              <div className="flex flex-row items-center gap-10 ">

                  <button
                    aria-label="Toggle dark mode"
                    onClick={toggleTheme}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 shadow hover:bg-white/10"
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <MoonIcon className="w-5 h-5 text-white" />
                    )}
                  </button>

                <button
                  onClick={() => {
                    setDropdownMenu(false);
                    signOut({ callbackUrl: "/sign-in" });
                  }}
                  className="rounded-lg bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/25"
                >
                  Log Out
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
