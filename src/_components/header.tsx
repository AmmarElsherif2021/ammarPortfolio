'use client';

import Link from 'next/link';
//import { usePathname } from "next/navigation";

// const NAV_ITEMS = [
//   { href: "/", label: "Projects" },
//   { href: "/about", label: "About me" },
// ];

const Header = () => {
  //const pathname = usePathname();

  return (
    <header className="w-full py-4 px-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between retro-header-bar">
        {/* Left: BLOG tab */}
        <div className="retro-header-tab bg-retro-orange">
          <span className="font-mono text-retro-xs font-bold uppercase tracking-widest">BLOG</span>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="retro-header-logo px-5 no-underline hover:opacity-80 transition-opacity"
        >
          Ammar101.
        </Link>

        {/* Right: Play button */}
        <div className="retro-header-tab bg-retro-ink text-retro-gold border-l-2">
          <span className="text-lg">▶</span>
        </div>

        {/* Optional: colorful bar on top of header (as a separate element) */}
      </div>
      {/* Colorful underline strip */}
      <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-retro">
        <div className="flex-1 bg-retro-red"></div>
        <div className="flex-1 bg-retro-orange"></div>
        <div className="flex-1 bg-retro-gold"></div>
        <div className="flex-1 bg-retro-teal"></div>
        <div className="flex-1 bg-retro-violet"></div>
      </div>
    </header>
  );
};

export default Header;
