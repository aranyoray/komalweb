import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Safety Scanner | Free Child Internet Safety Tool",
  description: "Scan any URL for child safety with AgileWeb's free AI-powered tool. Check if websites are safe for kids with our content analyzer. Instant results for parents and educators.",
  keywords: "URL safety checker, website safety for kids, child safe website scanner, content safety analyzer, is this website safe for children, parental control URL checker, kid-safe URL scanner, free website safety tool",
  openGraph: {
    title: "Free URL Safety Scanner for Kids | AgileWeb",
    description: "Scan any URL to check if it's safe for children. AI-powered content analysis with instant results.",
    url: "https://komalkids.com/demo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Child Safety URL Scanner | AgileWeb",
    description: "Check if any website is safe for your children with our AI-powered scanner.",
  },
  alternates: {
    canonical: "https://komalkids.com/demo",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
