"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const blogPosts = [
  {
    slug: "is-ai-safe-for-kids-parent",
    title: "Is AI Safe for Kids? A Parent's Guide to Safe AI for Children",
    excerpt: "A warm, practical guide for parents on AI safety for kids. Learn about risks, safeguards, and why Komal Kids is safer than generic AI.",
    category: "Parenting",
    date: "2024-12-20",
    readTime: "7 min read"
  },
  {
    slug: "is-ai-safe-for-kids-tech",
    title: "Child Safe AI Design: Architecture and Guardrails",
    excerpt: "A technical analysis of child-safe AI design, system behavior, and architectural guardrails. Why constrained AI models are safer for children.",
    category: "Technology",
    date: "2024-12-20",
    readTime: "9 min read"
  },
  {
    slug: "is-ai-safe-for-kids-educator",
    title: "AI in Schools: Safe Educational AI for Children",
    excerpt: "A pedagogical perspective on using AI safely in educational environments. How Komal Kids aligns with learning objectives and supports classroom outcomes.",
    category: "Education",
    date: "2024-12-20",
    readTime: "8 min read"
  },
  {
    slug: "is-ai-safe-for-kids-trust",
    title: "AI Safety for Children: Governance and Risk Mitigation",
    excerpt: "A technical perspective on AI governance, risk mitigation, and safety architecture for child-facing AI systems.",
    category: "Trust & Safety",
    date: "2024-12-20",
    readTime: "10 min read"
  },
  {
    slug: "is-ai-safe-for-kids-policy",
    title: "Ethical AI for Kids: Responsible AI Adoption",
    excerpt: "A policy perspective on ethical AI principles, child protection, and long-term societal implications of AI designed for children.",
    category: "Policy & Ethics",
    date: "2024-12-20",
    readTime: "9 min read"
  },
  {
    slug: "is-ai-safe-for-kids",
    title: "Is AI Safe for Kids? A Parent's Complete Guide",
    excerpt: "Understanding the safety implications of AI for children and how to choose the right AI companion for your child.",
    category: "Parenting",
    date: "2024-12-15",
    readTime: "8 min read"
  },
  {
    slug: "what-is-digital-buddy-for-children",
    title: "What is a Digital Buddy for Children? Understanding AI Companions",
    excerpt: "Explore how AI digital buddies work, their benefits for child development, and what makes them safe and effective.",
    category: "Education",
    date: "2024-12-10",
    readTime: "6 min read"
  },
  {
    slug: "how-komal-differs-from-chatgpt-for-kids",
    title: "How Komal Differs from ChatGPT for Kids: A Detailed Comparison",
    excerpt: "Learn the key differences between Komal and ChatGPT, and why specialized AI for children matters.",
    category: "Technology",
    date: "2024-12-05",
    readTime: "7 min read"
  },
  {
    slug: "ai-companion-for-kids-safety-guide",
    title: "AI Companion for Kids: A Complete Safety Guide for Parents",
    excerpt: "Everything parents need to know about AI companions for children, including safety features, privacy, and best practices.",
    category: "Parenting",
    date: "2024-11-28",
    readTime: "9 min read"
  },
  {
    slug: "educational-ai-app-for-kids-benefits",
    title: "Educational AI App for Kids: Benefits and What to Look For",
    excerpt: "Discover how educational AI apps can enhance your child's learning experience and what features matter most.",
    category: "Education",
    date: "2024-11-20",
    readTime: "6 min read"
  },
  {
    slug: "screen-safe-ai-for-children",
    title: "Screen-Safe AI for Children: Balancing Technology and Well-being",
    excerpt: "How to ensure your child's screen time with AI is safe, healthy, and beneficial for their development.",
    category: "Parenting",
    date: "2024-11-15",
    readTime: "5 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-36 md:pt-44">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <ScrollReveal>
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text">
              Komal Kids Blog
            </h1>
            <p className="text-xl text-text-dim max-w-2xl mx-auto">
              Expert insights on AI for children, digital safety, parenting, and child development
            </p>
          </header>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 0.1}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <article className="bg-surface/50 border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-text group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-dim mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-text-dim">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
