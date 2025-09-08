"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/lib/ThemeProvider';

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 shadow-xl lg:hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f]' : 'bg-[#d0d3d4]'}`}>
      <Image src="/logo.svg" alt="logo" width={150} height={70} />

      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium transition-colors ${theme === 'dark' ? 'text-gray-200 hover:text-yellow-300' : pathname === link.url ? 'text-blue-1' : 'text-grey-1'}`}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="relative flex gap-4 items-center">
        <Menu
          className="cursor-pointer md:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        {dropdownMenu && (
          <div className={`absolute top-10 right-6 flex flex-col gap-8 p-5 shadow-xl rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                className={`flex gap-4 text-body-medium transition-colors ${theme === 'dark' ? 'text-gray-200 hover:text-yellow-300' : ''}`}
                onClick={() => setDropdownMenu(false)}
              >
                {link.icon} <p>{link.label}</p>
              </Link>
            ))}
          </div>
        )}
        <button
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
          className="rounded-full p-2 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
