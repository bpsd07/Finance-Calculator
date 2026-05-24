"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Home", href: "/" },
  { label: "EMI", href: "/emi-calculator" },
  { label: "SIP", href: "/sip-calculator" },
  { label: "Tax", href: "/tax-regime-calculator" },
  { label: "Salary", href: "/salary-calculator" },
  { label: "Prepay", href: "/loan-prepayment-calculator" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:block ${
        scrolled ? "navbar shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">FinAI</span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {links.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "text-accent bg-accent-subtle"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
