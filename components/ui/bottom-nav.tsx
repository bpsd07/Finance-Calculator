"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, TrendingUp, FileText, IndianRupee, Home } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/emi-calculator", label: "EMI", icon: Calculator },
  { href: "/sip-calculator", label: "SIP", icon: TrendingUp },
  { href: "/tax-regime-calculator", label: "Tax", icon: FileText },
  { href: "/salary-calculator", label: "Salary", icon: IndianRupee },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-nav lg:hidden safe-bottom">
      <div className="flex items-center justify-around px-2 pb-1 pt-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-150 ${
                active
                  ? "text-accent"
                  : "text-foreground-tertiary hover:text-foreground-secondary"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <div className="flex flex-col items-center px-2 py-1">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
