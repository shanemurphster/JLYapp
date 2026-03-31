"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/install",
    label: "Install",
    icon: (active: boolean) => (
      // Phone with down-arrow — "add to phone"
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#C9A96E" : "#9B8E82"}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <path d="M12 7v6m0 0l-2-2m2 2l2-2" />
        <circle cx="12" cy="17.5" r="0.5" fill={active ? "#C9A96E" : "#9B8E82"} stroke="none" />
      </svg>
    ),
  },
  {
    href: "/",
    label: "Today",
    icon: (active: boolean) => (
      // Four-pointed star / cross — the app's mark
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#C9A96E" : "#9B8E82"}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    href: "/support",
    label: "Support",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#C9A96E" : "#9B8E82"}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Treat /settings and /about as active for their replacement routes
  const effectivePath =
    pathname === "/settings" ? "/install" :
    pathname === "/about" ? "/support" :
    pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-grace-cream border-t border-grace-gold-light">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 pt-2
                      pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ href, label, icon }) => {
          const active = effectivePath === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-5 py-1.5 min-w-[64px] min-h-[44px] justify-center"
            >
              {icon(active)}
              <span className={`text-[10px] font-sans font-medium tracking-wide ${
                active ? "text-grace-gold" : "text-grace-muted"
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
