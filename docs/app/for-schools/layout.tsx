import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komal Kids for Schools | AI Learning Platform for Educational Institutions",
  description: "Komal Kids helps schools provide personalized, safe AI learning experiences for students. Classroom-level dashboards, SEL framework alignment, and comprehensive student insights.",
  keywords: "ai for schools, educational ai platform, classroom ai, student engagement analytics, sel framework, school ai software, educational technology for schools",
  openGraph: {
    title: "Komal Kids for Schools | AI Learning Platform",
    description: "Empower your students with personalized AI learning experiences. Classroom-level insights and SEL framework alignment.",
    url: "https://komalkids.com/for-schools",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/for-schools",
  },
};

export default function ForSchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
