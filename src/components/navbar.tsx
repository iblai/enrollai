"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileDropdown } from "@/components/iblai/profile-dropdown";
import { IblaiNotificationBell } from "@/components/iblai/notification-bell";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/applications", label: "Applications" },
  { href: "/documents", label: "Documents" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex-shrink-0 border-b border-[var(--border-color)] bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 w-full items-center px-4 md:w-[75vw] md:px-0">
        <Link href="/" className="mr-8 flex items-center">
          <img
            src="https://ibl.ai/images/iblai-logo.png"
            alt="ibl.ai"
            className="h-7"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 px-3 py-4 text-[14px] font-medium transition-colors ${
                  isActive
                    ? "border-[var(--primary-color,#0058cc)] text-[var(--primary-color,#0058cc)]"
                    : "border-transparent text-[var(--text-secondary,#6b7280)] hover:text-[var(--text-primary,#111827)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <IblaiNotificationBell />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
