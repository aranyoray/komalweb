import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ms Linda Yu Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LindaYuDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
