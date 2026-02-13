"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";

interface AdminUser {
  uid: string;
  name: string;
  email: string;
  plan: string;
  subscriptionStatus: string | null;
  subscriptionEndDate: string | null;
  country: string | null;
  role: string | null;
  paid: boolean;
}

interface UsersResponse {
  users: AdminUser[];
  page: number;
  totalPages: number;
  total: number;
}

export default function LindaXuDashboardPage() {
  const { user, loading: authLoading, getIdToken } = useAuth();

  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(
    async (p: number, s: string, f: string) => {
      setLoading(true);
      try {
        const token = await getIdToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const params = new URLSearchParams({
          page: String(p),
          search: s,
          filter: f,
        });

        const res = await fetch(`/api/admin/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    },
    [getIdToken]
  );

  // Fetch when auth resolves or page/filter changes
  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers(page, search, filter);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter, authLoading, user]);

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, value, filter);
    }, 300);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  // Check if any user on the current page is a Canada/China ambassador
  const showExpiryCol =
    data?.users.some(
      (u) =>
        u.role === "ambassador" &&
        u.country &&
        ["CA", "CN"].includes(u.country.toUpperCase())
    ) ?? false;

  const getStatusBadge = (user: AdminUser) => {
    if (user.plan === "ambassador") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Ambassador
        </span>
      );
    }
    const status = user.subscriptionStatus;
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Active
          </span>
        );
      case "canceling":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            Canceling
          </span>
        );
      case "past_due":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Past Due
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Free
          </span>
        );
    }
  };

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      free: "Free",
      grow: "Grow",
      thrive: "Thrive",
      partner: "Partner",
      ambassador: "Ambassador",
    };
    return labels[plan] || plan;
  };

  // Pagination range helper
  const getPageRange = () => {
    if (!data) return [];
    const total = data.totalPages;
    const current = data.page;
    const range: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  const startItem = data ? (data.page - 1) * 10 + 1 : 0;
  const endItem = data ? Math.min(data.page * 10, data.total) : 0;

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
          <div className="container max-w-[1100px] px-6 mx-auto">
            <ScrollReveal>
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary font-medium text-sm mb-4 ring-1 ring-primary/10">
                  <Users className="w-4 h-4" />
                  <span>Admin Panel</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">
                  Ms Linda Xu{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Dashboard</span>
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
                  View and manage all registered users.
                </p>
              </div>
            </ScrollReveal>

            {/* Controls */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
                  <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-primary/10 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="paid">Paid</option>
                    <option value="not-paid">Not Paid</option>
                  </select>
                </div>

                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-primary/10 text-sm text-primary placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Table */}
            <ScrollReveal delay={0.15}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !data || data.users.length === 0 ? (
                  <div className="text-center py-20 text-text-dim">
                    No users found.
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-text-dim border-b border-gray-100">
                            <th className="px-6 py-4 font-medium">Country</th>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Plan</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Paid</th>
                            {showExpiryCol && (
                              <th className="px-6 py-4 font-medium">
                                Expiry Date
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {data.users.map((u) => (
                            <tr
                              key={u.uid}
                              className="border-b border-gray-50 last:border-0 hover:bg-primary/[0.02] transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-xl">
                                {u.country?.toUpperCase() === "CA"
                                  ? "🇨🇦"
                                  : u.country?.toUpperCase() === "CN"
                                  ? "🇨🇳"
                                  : "—"}
                              </td>
                              <td className="px-6 py-4 text-primary font-medium whitespace-nowrap">
                                {u.name || "—"}
                              </td>
                              <td className="px-6 py-4 text-primary/80 whitespace-nowrap">
                                {u.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-primary font-medium">
                                  {getPlanLabel(u.plan)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(u)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {u.paid ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Paid
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    Not Paid
                                  </span>
                                )}
                              </td>
                              {showExpiryCol && (
                                <td className="px-6 py-4 text-primary/80 whitespace-nowrap">
                                  {u.role === "ambassador" &&
                                  u.country &&
                                  ["CA", "CN"].includes(
                                    u.country.toUpperCase()
                                  ) &&
                                  u.subscriptionEndDate
                                    ? new Date(
                                        u.subscriptionEndDate
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "—"}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
                      <p className="text-xs text-text-dim">
                        Showing {startItem}–{endItem} of {data.total}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={data.page <= 1}
                          className="p-2 rounded-lg hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-primary" />
                        </button>
                        {getPageRange().map((n) => (
                          <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`min-w-[2rem] h-8 rounded-lg text-xs font-medium transition-colors ${
                              n === data.page
                                ? "bg-primary text-white"
                                : "text-primary hover:bg-primary/5"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setPage((p) => Math.min(data.totalPages, p + 1))
                          }
                          disabled={data.page >= data.totalPages}
                          className="p-2 rounded-lg hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
