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
      <div className={`sticky top-0 z-20 w-full flex justify-between items-center px-4 py-4 shadow-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f]' : 'bg-[#d0d3d4]'}`}>
        <Image src="/logo.svg" alt="logo" width={70} height={70} />

        <div className="relative flex gap-4 items-center">
          <Menu
            className="cursor-pointer"
            onClick={() => setDropdownMenu(!dropdownMenu)}
            color={theme === 'dark' ? "#fff" : "#23272f"}
          />
          {dropdownMenu && (
            <div className="fixed top-0 right-0 z-30 w-64 h-full bg-[#23272f] shadow-xl flex flex-col gap-4 p-5 lg:hidden">
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
                  className="flex gap-4 text-body-medium transition-colors py-2 rounded text-gray-100 hover:text-yellow-300"
                  onClick={() => setDropdownMenu(false)}
                >
                  {link.icon} <p>{link.label}</p>
                </Link>
              ))}

              <div className="flex flex-row items-center gap-10 ">

                  <button
                    aria-label="Toggle dark mode"
                    onClick={toggleTheme}
                    className="rounded-full p-2 border border-gray-700 bg-[#23272f] shadow hover:bg-gray-800 transition-colors "
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
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors text-sm self-start"
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
