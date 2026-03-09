"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  CreditCard,
  FileText,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Download,
  ArrowLeft,
  Receipt,
  Award,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";

interface AmbassadorPayment {
  paymentIntentId: string | null;
  amountPaid: number | null;
  currency: string;
  paymentStatus: string | null;
  paidAt: string | null;
  receiptUrl: string | null;
  cardBrand: string | null;
  cardLast4: string | null;
  checkoutSessionId: string | null;
}

interface BillingData {
  subscription: {
    id: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string;
    priceId: string;
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
  } | null;
  invoices: {
    id: string;
    amountPaid: number;
    currency: string;
    status: string;
    created: string;
    invoicePdf: string | null;
    hostedInvoiceUrl: string | null;
  }[];
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  plan: string;
  planName: string;
  reportsUsed: number;
  subscriptionEndDate?: string;
  ambassadorPayment: AmbassadorPayment | null;
}

export default function BillingPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading, getIdToken } = useAuth();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in?redirect=/billing");
    }
  }, [authLoading, user, router]);

  const fetchBilling = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/stripe/billing", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBillingData(data);
      }
    } catch (error) {
      console.error("Failed to fetch billing:", error);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchBilling();
    }
  }, [authLoading, user, fetchBilling]);

  const handleCancel = async () => {
    setCanceling(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/stripe/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (res.ok) {
        setShowCancelConfirm(false);
        fetchBilling();
      }
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setCanceling(false);
    }
  };

  const handlePortal = async () => {
    try {
      const token = await getIdToken();
      const res = await fetch("/api/stripe/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "portal" }),
      });

      const data = await res.json();
      if (data.url && typeof data.url === 'string' && data.url.startsWith('https://')) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "succeeded":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> {status === "succeeded" ? "Paid" : "Active"}
          </span>
        );
      case "canceling":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <AlertTriangle className="w-3 h-3" /> Canceling
          </span>
        );
      case "past_due":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> Past Due
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <XCircle className="w-3 h-3" /> Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const isAmbassador = billingData?.plan === "ambassador" || userData?.plan === "ambassador";

  const currentPlan = billingData?.plan || userData?.plan || "free";

  const getPlanDescription = () => {
    switch (currentPlan) {
      case "grow":
        return "Monthly subscription — billed every month";
      case "thrive":
        return "6-month subscription — billed every 6 months";
      case "ambassador":
        return "Lifetime membership — no recurring charges";
      default:
        return "Free plan — upgrade anytime";
    }
  };

  const formatInterval = (interval: string, intervalCount: number) => {
    if (intervalCount === 1) return `per ${interval}`;
    return `every ${intervalCount} ${interval}s`;
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <NoiseOverlay opacity={0.025} />
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white">
        <div className="absolute inset-0 opacity-15 z-0">
          <FloatingOrbs count={3} />
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>

        <div className="relative z-10 pt-32 md:pt-36 pb-16">
          <div className="container max-w-[900px] px-6 mx-auto">
            {/* Back link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <ScrollReveal>
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary font-medium text-sm mb-4 ring-1 ring-primary/10">
                  <CreditCard className="w-4 h-4" />
                  <span>Billing & Subscription</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">
                  Manage Your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">{isAmbassador ? "Membership" : "Subscription"}</span>
                    <span
                      className="absolute left-0 right-0 bottom-[0.1em] h-[0.3em] rounded-full -z-0"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(107, 78, 113, 0.15), rgba(107, 78, 113, 0.25), rgba(107, 78, 113, 0.15))",
                      }}
                    />
                  </span>
                </h1>
                <p className="text-text-dim max-w-[500px]">
                  View your plan details, payment history, and manage your billing.
                </p>
              </div>
            </ScrollReveal>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Plan Card */}
                <ScrollReveal delay={0.1}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                          {isAmbassador ? <Award className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          Current Plan
                        </h2>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary">
                            {billingData?.planName || userData?.planName || "Free"}
                          </span>
                          {isAmbassador && billingData?.ambassadorPayment?.paymentStatus
                            ? getStatusBadge(billingData.ambassadorPayment.paymentStatus)
                            : billingData?.subscription
                              ? getStatusBadge(
                                  billingData.subscription.cancelAtPeriodEnd
                                    ? "canceling"
                                    : billingData.subscription.status
                                )
                              : getStatusBadge("active")}
                        </div>
                        <p className="text-xs text-text-dim mt-1">{getPlanDescription()}</p>
                      </div>
                      {billingData?.subscription && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(
                              billingData.subscription.amount,
                              billingData.subscription.currency
                            )}
                          </p>
                          <p className="text-xs text-text-dim">
                            {formatInterval(billingData.subscription.interval, billingData.subscription.intervalCount)}
                          </p>
                        </div>
                      )}
                      {isAmbassador && billingData?.ambassadorPayment?.amountPaid && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(
                              billingData.ambassadorPayment.amountPaid,
                              billingData.ambassadorPayment.currency
                            )}
                          </p>
                          <p className="text-xs text-text-dim">one-time payment</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-primary/5 rounded-xl p-4">
                        <p className="text-xs text-text-dim mb-1">Reports Used</p>
                        <p className="text-lg font-bold text-primary">
                          {billingData?.reportsUsed ?? userData?.reportsUsed ?? 0}
                          {(billingData?.plan || userData?.plan) === "free" && (
                            <span className="text-sm font-normal text-text-dim"> / 5</span>
                          )}
                        </p>
                      </div>

                      {isAmbassador && billingData?.ambassadorPayment?.paidAt && (
                        <div className="bg-primary/5 rounded-xl p-4">
                          <p className="text-xs text-text-dim mb-1">Joined</p>
                          <p className="text-lg font-bold text-primary">
                            {new Date(billingData.ambassadorPayment.paidAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                      )}

                      <div className="bg-primary/5 rounded-xl p-4">
                        <p className="text-xs text-text-dim mb-1">Billing Cycle</p>
                        <p className="text-lg font-bold text-primary">
                          {isAmbassador
                            ? "Lifetime"
                            : currentPlan === "thrive"
                              ? "Every 6 months"
                              : currentPlan === "grow"
                                ? "Monthly"
                                : "—"}
                        </p>
                      </div>

                      {billingData?.subscription && (
                        <>
                          <div className="bg-primary/5 rounded-xl p-4">
                            <p className="text-xs text-text-dim mb-1">
                              {billingData.subscription.cancelAtPeriodEnd ? "Expires" : "Renews"}
                            </p>
                            <p className="text-lg font-bold text-primary">
                              {new Date(billingData.subscription.currentPeriodEnd).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </p>
                          </div>
                          <div className="bg-primary/5 rounded-xl p-4">
                            <p className="text-xs text-text-dim mb-1">Status</p>
                            <p className="text-lg font-bold text-primary capitalize">
                              {billingData.subscription.cancelAtPeriodEnd
                                ? "Canceling"
                                : billingData.subscription.status}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3">
                      {(!billingData?.subscription && !isAmbassador) && (
                        <Button
                          onClick={() => router.push("/pricing")}
                          className="btn-primary-premium text-white rounded-full border-0"
                        >
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Upgrade Plan
                        </Button>
                      )}
                      {billingData?.subscription && !billingData.subscription.cancelAtPeriodEnd && (
                        <>
                          <Button
                            onClick={() => router.push("/pricing")}
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/5 rounded-full"
                          >
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Change Plan
                          </Button>
                          <Button
                            onClick={handlePortal}
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/5 rounded-full"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Update Payment
                          </Button>
                          <Button
                            onClick={() => setShowCancelConfirm(true)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            Cancel Subscription
                          </Button>
                        </>
                      )}
                      {isAmbassador && billingData?.ambassadorPayment?.receiptUrl && (
                        <a
                          href={billingData.ambassadorPayment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/5 rounded-full"
                          >
                            <Receipt className="w-4 h-4 mr-2" />
                            View Receipt
                          </Button>
                        </a>
                      )}
                      {billingData?.plan !== "free" && (
                        <Button
                          onClick={handlePortal}
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/5 rounded-full"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Stripe Billing Portal
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Payment Method — for ambassador show card from Firestore */}
                {(billingData?.paymentMethod || (isAmbassador && billingData?.ambassadorPayment?.cardLast4)) && (
                  <ScrollReveal delay={0.2}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 p-6">
                      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600 uppercase">
                            {billingData?.paymentMethod?.brand || billingData?.ambassadorPayment?.cardBrand || "Card"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary">
                            •••• •••• •••• {billingData?.paymentMethod?.last4 || billingData?.ambassadorPayment?.cardLast4}
                          </p>
                          {billingData?.paymentMethod && (
                            <p className="text-xs text-text-dim">
                              Expires {billingData.paymentMethod.expMonth}/{billingData.paymentMethod.expYear}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Ambassador Payment Details */}
                {isAmbassador && billingData?.ambassadorPayment && (
                  <ScrollReveal delay={0.25}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 p-6">
                      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
                        Payment Details
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-text-dim border-b border-gray-100">
                              <th className="pb-3 font-medium">Date</th>
                              <th className="pb-3 font-medium">Description</th>
                              <th className="pb-3 font-medium">Amount</th>
                              <th className="pb-3 font-medium">Status</th>
                              <th className="pb-3 font-medium text-right">Receipt</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-50 last:border-0">
                              <td className="py-3 text-primary">
                                {billingData.ambassadorPayment.paidAt
                                  ? new Date(billingData.ambassadorPayment.paidAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "—"}
                              </td>
                              <td className="py-3 text-primary">
                                Ambassador Community — Lifetime
                              </td>
                              <td className="py-3 font-medium text-primary">
                                {billingData.ambassadorPayment.amountPaid
                                  ? formatCurrency(
                                      billingData.ambassadorPayment.amountPaid,
                                      billingData.ambassadorPayment.currency
                                    )
                                  : "—"}
                              </td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  Paid
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                {billingData.ambassadorPayment.receiptUrl && (
                                  <a
                                    href={billingData.ambassadorPayment.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:text-primary/70 transition-colors text-xs font-medium"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    View
                                  </a>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Invoice History — for subscription plans */}
                {billingData?.invoices && billingData.invoices.length > 0 && (
                  <ScrollReveal delay={0.3}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 p-6">
                      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Invoice History
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-text-dim border-b border-gray-100">
                              <th className="pb-3 font-medium">Date</th>
                              <th className="pb-3 font-medium">Amount</th>
                              <th className="pb-3 font-medium">Status</th>
                              <th className="pb-3 font-medium text-right">Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billingData.invoices.map((invoice) => (
                              <tr key={invoice.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-3 text-primary">
                                  {new Date(invoice.created).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="py-3 font-medium text-primary">
                                  {formatCurrency(invoice.amountPaid, invoice.currency)}
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      invoice.status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {invoice.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {invoice.invoicePdf && (
                                      <a
                                        href={invoice.invoicePdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/70 transition-colors"
                                        title="Download PDF"
                                      >
                                        <Download className="w-4 h-4" />
                                      </a>
                                    )}
                                    {invoice.hostedInvoiceUrl && (
                                      <a
                                        href={invoice.hostedInvoiceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/70 transition-colors"
                                        title="View Invoice"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Cancel Subscription?
                </h3>
                <p className="text-sm text-text-dim">
                  Your subscription will remain active until the end of your current billing period.
                  After that, you&apos;ll be downgraded to the free plan with 5 reports.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCancelConfirm(false)}
                  variant="outline"
                  className="flex-1 rounded-full border-gray-200"
                >
                  Keep Plan
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  {canceling ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
