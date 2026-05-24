"use client";

import { useEffect, useRef } from "react";

export function SpotlightGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseLeave = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (ref.current) ref.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (typeof window === "undefined") return null;
  if (window.innerWidth < 1024) return null;

  return <div ref={ref} className="spotlight-glow" aria-hidden="true" />;
}
