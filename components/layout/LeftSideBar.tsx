"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { useTheme } from '@/lib/ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { signOut } from "next-auth/react";

const LeftSideBar = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 shadow-xl max-lg:hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f]' : 'bg-[#d0d3d4]'}`}>

      <div className="flex flex-col gap-12 flex-1">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium hover:text-red-1 transition-colors ${theme === 'dark' ? 'text-gray-200 hover:text-yellow-300' : pathname === link.url ? 'text-blue-1' : 'text-grey-1'}`}
          >
            {link.icon} <p>{link.label}</p>
            
          </Link>
          
        ))}

       <div className={`flex flex-col gap-4 text-body-medium items-center ${theme === 'dark' ? 'text-gray-200' : ''}`}>
          <div className="flex flex-row items-center gap-2">
            <p>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</p>
            <button
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="rounded-full p-2 border border-gray-300 bg-transparent dark:bg-gray-800 dark:border-gray-600 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>


    </div>
  );
};

export default LeftSideBar;
