"use client";

import { FC, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  children?: ReactNode;
  disableNav?: boolean;
}

const Header: FC<HeaderProps> = ({ children, disableNav = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <div className="bg-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
            from-blue-600 to-purple-600 cursor-pointer hover:from-blue-700 hover:to-purple-700 
            hover:scale-105 transition-all duration-300 select-none"
              onClick={() => router.push('/')}>
              Pokédex
            </h1>

            <button
              onClick={() => router.push("/pokedex")}
              disabled={disableNav}
              className={`px-4 py-3 cursor-pointer hover:from-blue-700 hover:to-purple-700 
              hover:scale-105 transition-all duration-300 rounded-xl font-medium bg-white border border-gray-300 hover:bg-gray-50
              flex items-center gap-2 ${isActive('/pokedex') ? 'text-amber-300' : 'text-gray-700'}
              ${disableNav ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Discover</span>
            </button>

            <button
              onClick={() => router.push("/teambuilder")}
              disabled={disableNav}
              className={`px-4 py-3 cursor-pointer hover:from-blue-700 hover:to-purple-700 
              hover:scale-105 transition-all duration-300 rounded-xl font-medium bg-white border border-gray-300 hover:bg-gray-50
              flex items-center gap-2 ${isActive('/teambuilder') ? 'text-amber-300' : 'text-gray-700'}
              ${disableNav ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Team Builder</span>
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;