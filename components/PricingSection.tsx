"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  priceINR: number;      // Base price in INR (for India)
  priceUSD: number;      // Base price in USD (for rest of world)
  periodMonthlyLabel: string;
  tagline: string;
  featured?: boolean;
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

export default function PricingSection({ plans }: { plans: Plan[] }) {
  const [geoData, setGeoData] = useState<GeoData>({
    isIndia: false,
    currencyCode: "USD",
    currencySymbol: "$",
    exchangeRate: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

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

  // Render price with proper formatting
  const renderPrice = (priceStr: string) => {
    return <span>{priceStr}</span>;
  };

  return (
    <div className="w-full">
      {/* Loading state with skeleton */}
      {isLoading && (
        <div className="flex justify-center mb-8">
          <div className="text-sm text-text-dim">Detecting your location...</div>
        </div>
      )}

      {/* Currency indicator (no toggle) */}
      {!isLoading && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
            <span className="text-sm text-text-dim">
              Prices shown in {geoData.currencySymbol} {geoData.currencyCode}
            </span>
          </div>
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

            {/* Plan Name */}
            <h3 className="text-lg font-bold text-primary mb-2">{plan.name}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold tracking-tight text-primary">
                {isLoading ? (
                  <span className="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block" />
                ) : (
                  renderPrice(formatPrice(plan))
                )}
              </span>
              <span className="text-xs text-text-dim">
                {plan.periodMonthlyLabel}
              </span>
            </div>

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
              asChild
              className={`w-full rounded-xl text-sm py-2.5 ${plan.featured
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-100 text-primary hover:bg-gray-200"
                }`}
              size="default"
            >
              <a href="#">{plan.cta}</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
