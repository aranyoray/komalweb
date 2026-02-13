import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ms Linda Xu Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LindaXuDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
