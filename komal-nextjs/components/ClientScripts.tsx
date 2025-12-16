"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Add scroll effect to navbar
    let lastScroll = 0;
    const navbar = document.querySelector(".navbar") as HTMLElement;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (navbar) {
        if (currentScroll > 100) {
          navbar.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        } else {
          navbar.style.boxShadow = "none";
        }
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    // Add animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".feature-card, .principle-card, .testimonial-card, .pricing-card, .faq-item"
    );

    animatedElements.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(20px)";
      (el as HTMLElement).style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

    // Cleanup
    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", handleScroll);
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null;
}

