"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { useTheme } from '@/lib/ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { signOut } from "next-auth/react";
import Image from "next/image";

const LeftSideBar = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sticky left-0 top-0 z-30 flex min-h-screen w-72 flex-col border-r border-white/10 bg-[var(--sidebar)] px-5 py-6 shadow-2xl max-lg:hidden">
      <div className="mb-10 flex items-center gap-3 px-3">
        <Image src="/logo.svg" alt="Azera Motors" width={42} height={42} className="rounded-xl bg-white p-1" />
        <div>
          <p className="text-sm font-bold tracking-wide text-white">AZERA MOTORS</p>
          <p className="text-xs text-slate-400">Admin workspace</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${pathname === link.url || (link.url !== "/" && pathname?.startsWith(`${link.url}/`)) ? 'bg-blue-500/15 text-blue-300 shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="opacity-80">{link.icon}</span><p>{link.label}</p>
            
          </Link>
          
        ))}

       <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-slate-300">
          <div className="flex items-center justify-between px-3">
            <p>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</p>
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
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="mt-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-2.5 font-semibold text-red-300 hover:bg-red-500/20"
          >
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default LeftSideBar;
