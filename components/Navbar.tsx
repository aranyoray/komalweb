"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll-based: flat at top, pill on scroll
  useEffect(() => {
    const handleScroll = () => {
      const shouldScroll = window.scrollY > 50;
      if (shouldScroll !== isScrolled) {
        setIsTransitioning(true);
        setIsScrolled(shouldScroll);
        setTimeout(() => setIsTransitioning(false), 700);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = useMemo(
    () => [
      { label: "How It Works", href: { type: "route", value: "/how-komal-works" } as const },
      { label: "About", href: { type: "route", value: "/team" } as const },
      { label: "Pricing", href: { type: "route", value: "/pricing" } as const },
    ],
    []
  );

  const resolveHref = (item: (typeof navItems)[number]) => {
    if (item.href.type === "route") return item.href.value;
    return pathname === "/" ? item.href.value : `/${item.href.value}`;
  };

  const gentleEase = "cubic-bezier(0.25, 0.1, 0.25, 1)";

  return (
    <>
      <nav
        className={`fixed z-[100] h-[64px] flex items-center transition-all duration-500 ${isScrolled
          ? "left-1/2 top-4 rounded-full border backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/15 px-6"
          : "left-0 right-0 top-0 bg-white border-b border-gray-100 px-6 md:px-10"
          }`}
        style={{
          width: isScrolled ? "min(90%, 72rem)" : "100%",
          transform: isScrolled ? "translateX(-50%)" : "none",
          transition: `all 550ms ${gentleEase}`,
          willChange: isTransitioning ? "width, transform" : "auto",
        }}
      >
        {/* Logo Section - Left */}
        <Link
          href="/"
          className={`flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-90 transition-all duration-300 whitespace-nowrap shrink-0 ${isScrolled ? "text-white" : "text-primary"
            }`}
        >
          <div className="w-10 h-10 relative shrink-0 flex items-center justify-center hover:animate-[vibrate_0.5s_ease-in-out]">
            <Image
              src="/finalstrokemonkey.png"
              alt="KOMAL Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline text-xl font-semibold">KOMAL</span>
        </Link>

        {/* Desktop Navigation - Centered with flex-1 */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={resolveHref(item)}
              className={`font-medium text-[14px] hover:opacity-100 transition-all duration-300 ${isScrolled ? "text-white/85 hover:text-white" : "text-primary/80 hover:text-primary"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile: CTA Button + Hamburger Menu */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Button
            asChild
            className={`h-9 px-4 rounded-full border-0 font-medium text-sm flex items-center gap-1.5 ${isScrolled
              ? "bg-white text-black hover:bg-white/90"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
          >
            <Link href="#">
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-full transition-colors ${isScrolled
              ? "text-white hover:bg-white/10"
              : "text-primary hover:bg-primary/10"
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop CTA Button - Right */}
        <div className="hidden md:block shrink-0">
          <Button
            asChild
            className={`h-9 px-5 rounded-full border-0 font-medium text-sm transition-all duration-300 flex items-center gap-1.5 ${isScrolled
              ? "bg-white text-black hover:bg-white/90"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
          >
            <Link href="#">
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-x-0 z-[99] md:hidden transition-all duration-300 ease-out ${isScrolled ? "top-[80px]" : "top-[64px]"} ${isMobileMenuOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="mx-4 mt-2 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
          <div className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={resolveHref(item)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 transition-colors border-b border-gray-100 last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop overlay when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[98] bg-black/20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
