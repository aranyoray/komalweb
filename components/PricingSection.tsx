"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Plan = {
  name: string;
  priceINR: number;
  priceUSD: number;
  originalPriceINR?: number;
  originalPriceUSD?: number;
  billingMonths?: number;
  periodMonthlyLabel: string;
  tagline: string;
  featured?: boolean;
  discount?: number;
  contactSales?: boolean;
  cta: string;
  features: string[];
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
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const formatPrice = (plan: Plan): string => {
    return `₹${plan.priceINR.toLocaleString("en-IN")}`;
  };

  const formatOriginalPrice = (plan: Plan): string | null => {
    if (!plan.originalPriceINR) return null;
    return `₹${plan.originalPriceINR.toLocaleString("en-IN")}`;
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

    const amount = plan.priceINR * 100; // INR to paise
    const currency = "inr";

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
                    {formatPrice(plan)}
                  </span>
                  <span className="text-xs text-text-dim">
                    {plan.periodMonthlyLabel}
                  </span>
                </>
              )}
            </div>

            {/* Original price strikethrough */}
            {plan.discount && formatOriginalPrice(plan) && (
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
