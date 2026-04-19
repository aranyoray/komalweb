"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Plan = {
  name: string;
  priceINR: number;      // Base price in INR (for India)
  priceUSD: number;      // Base price in USD (for rest of world)
  originalPriceINR?: number;  // Original price before discount
  originalPriceUSD?: number;  // Original price before discount
  billingMonths?: number;     // Recurring interval in months (1 = monthly, 6 = semi-annual)
  periodMonthlyLabel: string;
  tagline: string;
  featured?: boolean;
  discount?: number;     // Discount percentage (e.g. 10 for 10%)
  contactSales?: boolean; // Show "Contact Sales" mailto instead of Stripe
  cta: string;
  features: string[];
};

type GeoData = {
  isIndia: boolean;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;  // USD to local currency
};

// Common currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  KRW: "₩",
  SGD: "S$",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
  MYR: "RM",
  THB: "฿",
  PHP: "₱",
  IDR: "Rp",
  VND: "₫",
  BRL: "R$",
  MXN: "$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  ILS: "₪",
  ZAR: "R",
  NZD: "NZ$",
  HKD: "HK$",
  TWD: "NT$",
  TRY: "₺",
  RUB: "₽",
  PKR: "₨",
  BDT: "৳",
  LKR: "Rs",
  NPR: "रू",
};

// Approximate exchange rates from USD (updated periodically)
// These are fallback rates if the API doesn't provide them
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149,
  CNY: 7.24,
  KRW: 1320,
  SGD: 1.34,
  CAD: 1.36,
  AUD: 1.53,
  INR: 83,
  AED: 3.67,
  SAR: 3.75,
  MYR: 4.47,
  THB: 35.5,
  PHP: 56,
  IDR: 15800,
  VND: 24500,
  BRL: 4.97,
  MXN: 17.2,
  CHF: 0.88,
  SEK: 10.5,
  NOK: 10.8,
  DKK: 6.9,
  PLN: 4.0,
  CZK: 23,
  HUF: 360,
  ILS: 3.7,
  ZAR: 18.5,
  NZD: 1.64,
  HKD: 7.82,
  TWD: 31.5,
  TRY: 32,
  RUB: 92,
  PKR: 278,
  BDT: 110,
  LKR: 320,
  NPR: 133,
};

// Map plan names to Stripe price env var keys
const PLAN_PRICE_MAP: Record<string, string> = {
  Grow: 'grow',
  Thrive: 'thrive',
  Partner: 'partner',
};

export default function PricingSection({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const { user, getIdToken } = useAuth();
  const [geoData, setGeoData] = useState<GeoData>({
    isIndia: false,
    currencyCode: "USD",
    currencySymbol: "$",
    exchangeRate: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use ipapi.co to get country and currency info
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data && data.country_code) {
          const isIndia = data.country_code === "IN";
          const currencyCode = isIndia ? "INR" : (data.currency || "USD");
          const currencySymbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;

          // Get exchange rate - use fallback if not available
          let exchangeRate = FALLBACK_RATES[currencyCode] || 1;

          // Try to get live exchange rate for non-India visitors
          if (!isIndia && currencyCode !== "USD") {
            try {
              // Use a free exchange rate API
              const rateResponse = await fetch(
                `https://api.exchangerate-api.com/v4/latest/USD`
              );
              const rateData = await rateResponse.json();
              if (rateData && rateData.rates && rateData.rates[currencyCode]) {
                exchangeRate = rateData.rates[currencyCode];
              }
            } catch {
              // Use fallback rate if API fails
              console.log("Using fallback exchange rate");
            }
          }

          setGeoData({
            isIndia,
            currencyCode,
            currencySymbol,
            exchangeRate,
          });
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        // Default to USD if detection fails
        setGeoData({
          isIndia: false,
          currencyCode: "USD",
          currencySymbol: "$",
          exchangeRate: 1,
        });
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Format price based on location
  const formatPrice = (plan: Plan): string => {
    if (geoData.isIndia) {
      // Show INR price for India
      return `₹${plan.priceINR}`;
    } else {
      // Convert USD to local currency and round
      const convertedPrice = plan.priceUSD * geoData.exchangeRate;

      // Smart rounding based on currency value
      let roundedPrice: number;
      if (geoData.exchangeRate > 100) {
        // For currencies like JPY, KRW, IDR, VND - round to nearest 10 or 100
        if (geoData.exchangeRate > 1000) {
          roundedPrice = Math.round(convertedPrice / 100) * 100;
        } else {
          roundedPrice = Math.round(convertedPrice / 10) * 10;
        }
      } else if (geoData.exchangeRate > 10) {
        // For currencies like INR, MXN, THB - round to nearest integer
        roundedPrice = Math.round(convertedPrice);
      } else {
        // For currencies like EUR, GBP, USD - round to nearest 0.99 or whole number
        roundedPrice = Math.round(convertedPrice);
      }

      // Format with appropriate decimal places
      if (roundedPrice === 0) {
        return `${geoData.currencySymbol}0`;
      }

      // No decimals for large currencies or whole numbers
      return `${geoData.currencySymbol}${roundedPrice.toLocaleString()}`;
    }
  };

  // Format original (pre-discount) price
  const formatOriginalPrice = (plan: Plan): string | null => {
    if (!plan.originalPriceUSD && !plan.originalPriceINR) return null;
    if (geoData.isIndia) {
      return plan.originalPriceINR ? `₹${plan.originalPriceINR}` : null;
    }
    if (!plan.originalPriceUSD) return null;
    const convertedPrice = plan.originalPriceUSD * geoData.exchangeRate;
    let roundedPrice: number;
    if (geoData.exchangeRate > 100) {
      roundedPrice = geoData.exchangeRate > 1000
        ? Math.round(convertedPrice / 100) * 100
        : Math.round(convertedPrice / 10) * 10;
    } else {
      roundedPrice = Math.round(convertedPrice);
    }
    return `${geoData.currencySymbol}${roundedPrice.toLocaleString()}`;
  };

  // Zero-decimal currencies (Stripe doesn't multiply by 100 for these)
  const ZERO_DECIMAL_CURRENCIES = new Set([
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
  ]);

  // Compute the charge amount in the user's local currency (whole number, display-level)
  const getChargeAmount = (plan: Plan): number => {
    if (geoData.isIndia) return plan.priceINR;
    const converted = plan.priceUSD * geoData.exchangeRate;
    if (geoData.exchangeRate > 100) {
      return geoData.exchangeRate > 1000
        ? Math.round(converted / 100) * 100
        : Math.round(converted / 10) * 10;
    }
    return Math.round(converted);
  };

  // Convert display amount to Stripe smallest-unit amount
  const toStripeAmount = (displayAmount: number, currency: string): number => {
    if (ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase())) return displayAmount;
    return displayAmount * 100;
  };

  const handlePlanClick = async (plan: Plan) => {
    // Contact Sales plans → email
    if (plan.contactSales) {
      window.location.href = 'mailto:play@komalkids.com';
      return;
    }

    const planKey = PLAN_PRICE_MAP[plan.name];

    // Essentials (free) plan → sign up
    if (!planKey) {
      router.push('/sign-up');
      return;
    }

    // Paid plans require auth
    if (!user) {
      router.push(`/sign-in?redirect=/pricing`);
      return;
    }

    const displayAmount = getChargeAmount(plan);
    const currency = geoData.currencyCode.toLowerCase();
    const amount = toStripeAmount(displayAmount, currency);

    setCheckoutLoading(plan.name);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: planKey,
          amount,
          currency,
          billingMonths: plan.billingMonths || 1,
          planName: plan.name,
        }),
      });

      const data = await res.json();
      if (data.url && typeof data.url === 'string' && data.url.startsWith('https://')) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="w-full">
      {/* Loading state with skeleton */}
      {isLoading && (
        <div className="flex justify-center mb-8">
          <div className="text-sm text-text-dim">Detecting your location...</div>
        </div>
      )}


      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 ${plan.featured
              ? "border-2 border-primary shadow-md"
              : "border border-gray-200 shadow-sm"
              }`}
          >
            {/* Most Popular Badge */}
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Most Popular
                </Badge>
              </div>
            )}

            {/* Discount Badge */}
            {plan.discount && (
              <div className="absolute -top-3 right-4 z-10">
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  {plan.discount}% OFF
                </span>
              </div>
            )}

            {/* Plan Name */}
            <h3 className="text-lg font-bold text-primary mb-2">{plan.name}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
              {plan.contactSales ? (
                <span className="text-3xl font-bold tracking-tight text-primary">Custom</span>
              ) : (
                <>
                  <span className="text-3xl font-bold tracking-tight text-primary">
                    {isLoading ? (
                      <span className="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block" />
                    ) : (
                      formatPrice(plan)
                    )}
                  </span>
                  <span className="text-xs text-text-dim">
                    {plan.periodMonthlyLabel}
                  </span>
                </>
              )}
            </div>

            {/* Original price strikethrough */}
            {!isLoading && plan.discount && formatOriginalPrice(plan) && (
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm text-text-dim line-through">
                  {formatOriginalPrice(plan)}
                </span>
                <span className="text-xs font-medium text-green-600">
                  Save {plan.discount}%
                </span>
              </div>
            )}

            {/* Tagline */}
            <p className="text-sm text-text-dim mb-4">{plan.tagline}</p>

            {/* Features */}
            <ul className="flex-grow space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="text-xs text-text-dim flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => handlePlanClick(plan)}
              disabled={checkoutLoading === plan.name}
              className={`w-full rounded-xl text-sm py-2.5 ${plan.featured
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-100 text-primary hover:bg-gray-200"
                }`}
              size="default"
            >
              {checkoutLoading === plan.name ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
