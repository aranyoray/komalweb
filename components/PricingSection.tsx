"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  priceDisplay: string;
  priceDisplayUSD?: string;
  periodMonthlyLabel: string;
  tagline: string;
  featured?: boolean;
  cta: string;
  features: string[];
};

export default function PricingSection({ plans }: { plans: Plan[] }) {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Helper function to render price with cents as superscript
  const renderPrice = (price: string) => {
    // Match patterns like $9.99 or ₹99
    const match = price.match(/^([₹$])(\d+)(\.(\d+))?$/);
    if (match) {
      const [, symbol, dollars, , cents] = match;
      return (
        <>
          <span>{symbol}{dollars}</span>
          {cents && <sup className="text-lg font-bold align-super">.{cents}</sup>}
        </>
      );
    }
    return price;
  };

  return (
    <div className="w-full">
      {/* Currency Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1 gap-1">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currency === "INR"
              ? "bg-primary text-white shadow-md"
              : "text-gray-600 hover:text-primary"
              }`}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currency === "USD"
              ? "bg-primary text-white shadow-md"
              : "text-gray-600 hover:text-primary"
              }`}
          >
            $ USD
          </button>
        </div>
      </div>

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
                {renderPrice(currency === "USD" && plan.priceDisplayUSD ? plan.priceDisplayUSD : plan.priceDisplay)}
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
