"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, LayoutDashboard, LogIn, CreditCard, HelpCircle, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";


export default function Navbar() {
  const pathname = usePathname();
  const { user, userData, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll-based: flat at top, pill on scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 0;
          setIsScrolled(shouldScroll);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    setIsScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const navItems = useMemo(
    () => [
      { label: "Safety", href: { type: "route", value: "/content-safety" } as const },
      { label: "Mindfulness", href: { type: "route", value: "/mindfulness" } as const },
      { label: "About", href: { type: "route", value: "/team" } as const },
      { label: "Pricing", href: { type: "route", value: "/pricing" } as const },
    ],
    []
  );

  // Validate photoURL: only allow data:image/ URIs (from upload) or HTTPS URLs (social login)
  const safePhotoURL = useMemo(() => {
    const url = userData?.photoURL;
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('data:image/')) return url;
    if (url.startsWith('https://')) return url;
    return null;
  }, [userData?.photoURL]);

  // Hide navbar on dashboard page (after all hooks to respect Rules of Hooks)
  if (pathname === "/dashboard") return null;

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
        className={`z-[100] h-[72px] flex items-center left-1/2 -translate-x-1/2 px-6 overflow-visible ${isScrolled
          ? "fixed top-6 rounded-full border border-black/5 backdrop-blur-xl bg-white/60 shadow-lg"
          : "fixed top-[72px] rounded-full border border-transparent bg-transparent"
          }`}
        style={{
          width: "min(92%, 1300px)", // Constant width
          transitionProperty: "top, background-color, border-color, box-shadow, color",
          transitionDuration: "500ms",
          transitionTimingFunction: smoothEase,
          willChange: "top, background-color",
          contain: "layout style",
        } as React.CSSProperties}
      >
        {/* Logo Section - Left */}
        <Link
          href="/"
          className={`flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-90 whitespace-nowrap flex-1 ${isScrolled ? "text-primary" : "text-primary"
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

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center gap-6">
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
          {user ? (
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 overflow-hidden"
            >
              {safePhotoURL ? (
                <Image
                  src={safePhotoURL}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs font-semibold text-primary">
                  {userData?.firstName?.[0] || userData?.name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </Link>
          ) : (
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
          )}

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

        {/* Desktop CTA Buttons - Right */}
        <div className="hidden md:flex items-center gap-2 shrink-0 flex-1 justify-end">
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors ring-2 ring-primary/20 overflow-hidden"
              >
                {safePhotoURL ? (
                  <Image
                    src={safePhotoURL}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {userData?.firstName?.[0] || userData?.name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[200]">
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary/60" />
                    Dashboard
                  </Link>
                  <Link
                    href="/billing"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-primary/60" />
                    Billing
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-primary/60" />
                    Help
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-primary/60" />
                    Privacy
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={`h-9 px-4 rounded-full font-medium text-sm flex items-center gap-1.5 border border-primary/20 hover:bg-primary/5 ${isScrolled ? "text-primary" : "text-primary"}`}
                style={{
                  transitionProperty: "background-color, color",
                  transitionDuration: "400ms",
                  transitionTimingFunction: smoothEase,
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
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
            </>
          )}
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

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 flex items-center gap-2 border-b border-gray-100"
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
                <Link
                  href="/billing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 flex items-center gap-2 border-b border-gray-100"
                  style={{
                    transitionProperty: "background-color, opacity, transform",
                    transitionDuration: "400ms",
                    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    transitionDelay: isMobileMenuOpen ? `${(navItems.length + 1) * 50}ms` : "0ms",
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  Billing
                </Link>
                <Link
                  href="/help"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 flex items-center gap-2 border-b border-gray-100"
                  style={{
                    transitionProperty: "background-color, opacity, transform",
                    transitionDuration: "400ms",
                    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    transitionDelay: isMobileMenuOpen ? `${(navItems.length + 2) * 50}ms` : "0ms",
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                  Help
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-6 py-4 text-red-600 font-medium text-base hover:bg-red-50 flex items-center gap-2 w-full text-left"
                  style={{
                    transitionProperty: "background-color, opacity, transform",
                    transitionDuration: "400ms",
                    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    transitionDelay: isMobileMenuOpen ? `${(navItems.length + 3) * 50}ms` : "0ms",
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-primary font-medium text-base hover:bg-primary/5 flex items-center gap-2"
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
            )}
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
