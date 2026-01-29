"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu, X, LayoutDashboard, LogIn } from "lucide-react";
/// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";


export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  // Transition state no longer strictly needed for layout stability but useful for painting
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll-based: flat at top, pill on scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const shouldScroll = currentScrollY > 0;

          // Only update if state actually changed
          if (shouldScroll !== isScrolled) {
            setIsScrolled(shouldScroll);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    const initialShouldScroll = window.scrollY > 50;
    if (initialShouldScroll !== isScrolled) {
      setIsScrolled(initialShouldScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = useMemo(
    () => [
      { label: "Demo", href: { type: "route", value: "/demo" } as const },
      { label: "Mindfulness", href: { type: "route", value: "/mindfulness" } as const },
      { label: "Safety", href: { type: "route", value: "/content-safety" } as const },
      { label: "About", href: { type: "route", value: "/team" } as const },
      { label: "Pricing", href: { type: "route", value: "/pricing" } as const },
    ],
    []
  );

  const resolveHref = (item: (typeof navItems)[number]) => {
    if (item.href.type === "route") return item.href.value;
    return pathname === "/" ? item.href.value : `/${item.href.value}`;
  };

  // Smooth easing - optimized for performance
  const smoothEase = "cubic-bezier(0.4, 0, 0.2, 1)"; // Material Design ease-in-out

  // Calculate width using CSS custom property for better performance
  const maxWidth = "1300px";
  const scrolledWidth = "min(92%, 1300px)";

  return (
    <>
      <nav
        className={`z-[100] h-[72px] flex items-center left-1/2 -translate-x-1/2 px-6 ${isScrolled
          ? "fixed top-6 rounded-full border border-black/5 backdrop-blur-xl bg-white/60 shadow-lg"
          : "fixed top-[72px] rounded-full border border-transparent bg-transparent"
          }`}
        style={{
          width: "min(92%, 1300px)", // Constant width
          transitionProperty: "top, background-color, border-color, box-shadow, color",
          transitionDuration: "500ms",
          transitionTimingFunction: smoothEase,
          willChange: "top, background-color",
          contain: "layout style paint",
        } as React.CSSProperties}
      >
        {/* Logo Section - Left */}
        <Link
          href="/"
          className={`flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-90 whitespace-nowrap shrink-0 ${isScrolled ? "text-primary" : "text-primary"
            }`}
          style={{
            transitionProperty: "color",
            transitionDuration: "400ms",
            transitionTimingFunction: smoothEase,
          }}
        >
          <div className="w-12 h-12 relative shrink-0 flex items-center justify-center hover:animate-[vibrate_0.5s_ease-in-out]">
            <Image
              src="/komaliconnobg.png"
              alt="KOMAL Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline text-3xl font-semibold">KOMAL</span>
        </Link>

        {/* Desktop Navigation - Centered with flex-1 */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={resolveHref(item)}
              className={`font-medium text-base hover:opacity-100 ${isScrolled ? "text-primary/80 hover:text-primary" : "text-primary/80 hover:text-primary"
                }`}
              style={{
                transitionProperty: "color, opacity",
                transitionDuration: "400ms",
                transitionTimingFunction: smoothEase,
              }}
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
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
            style={{
              transitionProperty: "background-color, color",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
          >
            <Link href="mailto:play@komalkids.com">
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-full ${isScrolled
              ? "text-primary hover:bg-primary/10"
              : "text-primary hover:bg-primary/10"
              }`}
            style={{
              transitionProperty: "color, background-color",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
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
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button
            asChild
            className={`h-9 px-5 rounded-full border-0 font-medium text-sm flex items-center gap-1.5 ${isScrolled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
            style={{
              transitionProperty: "background-color, color",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
          >
            <Link href="mailto:play@komalkids.com">
              Start for free
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-x-0 z-[99] md:hidden ${isMobileMenuOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        style={{
          top: isScrolled ? "110px" : "94px",
          transitionProperty: "opacity, transform, top",
          transitionDuration: "400ms",
          transitionTimingFunction: smoothEase,
          willChange: isMobileMenuOpen ? "opacity, transform" : "auto",
        }}
      >
        <div className="mx-4 mt-2 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
          <div className="flex flex-col py-2">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={resolveHref(item)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 border-b border-gray-100"
                style={{
                  transitionProperty: "background-color, opacity, transform",
                  transitionDuration: "400ms",
                  transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Links for Mobile */}
            {/* <SignedOut> */}
            {/* <Link
              href="/sign-in"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 border-b border-gray-100 flex items-center gap-2"
              style={{
                transitionProperty: "background-color, opacity, transform",
                transitionDuration: "400ms",
                transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transitionDelay: isMobileMenuOpen ? `${navItems.length * 50}ms` : "0ms",
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
              }}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-4 bg-primary text-white font-medium text-base hover:bg-primary/90 flex items-center gap-2"
              style={{
                transitionProperty: "background-color, opacity, transform",
                transitionDuration: "400ms",
                transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transitionDelay: isMobileMenuOpen ? `${(navItems.length + 1) * 50}ms` : "0ms",
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Get Started
            </Link> */}
            {/* </SignedOut> */}

            {/* <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 bg-primary text-white font-medium text-base hover:bg-primary/90 flex items-center gap-2"
                style={{
                  transitionProperty: "background-color, opacity, transform",
                  transitionDuration: "400ms",
                  transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  transitionDelay: isMobileMenuOpen ? `${navItems.length * 50}ms` : "0ms",
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </SignedIn> */}
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
