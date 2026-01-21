"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu, X, LayoutDashboard, LogIn } from "lucide-react";
/// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import WaitlistModal from "@/components/WaitlistModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Scroll-based: flat at top, pill on scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const shouldScroll = currentScrollY > 50;

          // Only update if state actually changed
          if (shouldScroll !== isScrolled) {
            setIsTransitioning(true);
            setIsScrolled(shouldScroll);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsTransitioning(false), 500);
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
      clearTimeout(timeoutId);
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
  const maxWidth = "72rem";
  const scrolledWidth = "min(92%, 72rem)";

  return (
    <>
      <nav
        className={`fixed z-[100] h-[64px] flex items-center ${isScrolled
          ? "left-1/2 top-4 rounded-full border border-white/10 backdrop-blur-xl bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-3 md:px-6"
          : "left-0 right-0 top-0 bg-white border-b border-gray-100 px-3 md:px-10"
          }`}
        style={{
          width: isScrolled ? scrolledWidth : "100%",
          maxWidth: isScrolled ? maxWidth : "none",
          transform: isScrolled ? "translateX(-50%)" : "translateX(0)",
          transitionProperty: "width, max-width, transform, top, background-color, border-radius, box-shadow, border-color, padding-left, padding-right, backdrop-filter",
          transitionDuration: "400ms",
          transitionTimingFunction: smoothEase,
          willChange: isTransitioning ? "transform, width" : "auto",
          contain: "layout style paint",
        } as React.CSSProperties}
      >
        {/* Logo Section - Left */}
        <Link
          href="/"
          className={`flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-90 whitespace-nowrap shrink-0 ${isScrolled ? "text-white" : "text-primary"
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
              alt="AgileWeb Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline text-2xl font-semibold">AgileWeb</span>
        </Link>

        {/* Desktop Navigation - Centered with flex-1 */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={resolveHref(item)}
              className={`font-medium text-[14px] hover:opacity-100 ${isScrolled ? "text-white/85 hover:text-white" : "text-primary/80 hover:text-primary"
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
            onClick={() => setIsWaitlistOpen(true)}
            className={`h-9 px-4 rounded-full border-0 font-medium text-sm flex items-center gap-1.5 ${isScrolled
              ? "bg-white text-black hover:bg-white/90"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
            style={{
              transitionProperty: "background-color, color",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </Button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-full ${isScrolled
              ? "text-white hover:bg-white/10"
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
          {/* Signed Out - Show Sign In and Get Started */}
          {/* <SignedOut> */}
          {/* <Link
            href="/sign-in"
            className={`font-medium text-[14px] hover:opacity-100 ${isScrolled ? "text-white/85 hover:text-white" : "text-primary/80 hover:text-primary"
              }`}
            style={{
              transitionProperty: "color, opacity",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
          >
            Sign In
          </Link>
          <Button
            onClick={() => setIsWaitlistOpen(true)}
            className={`h-9 px-5 rounded-full border-0 font-medium text-sm flex items-center gap-1.5 ${isScrolled
              ? "bg-white text-black hover:bg-white/90"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
            style={{
              transitionProperty: "background-color, color",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </Button> */}
          {/* </SignedOut> */}

          {/* Signed In - Show Dashboard and User Button */}
          {/* <SignedIn> */}
          {/* <Link
            href="/dashboard"
            className={`h-9 px-4 rounded-full font-medium text-sm flex items-center gap-1.5 ${isScrolled
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            style={{
              transitionProperty: "background-color, color",
              transitionDuration: "400ms",
              transitionTimingFunction: smoothEase,
            }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link> */}
          {/* <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                }
              }}
            /> */}
          {/* </SignedIn> */}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-x-0 z-[99] md:hidden ${isMobileMenuOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        style={{
          top: isScrolled ? "80px" : "64px",
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

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
}
