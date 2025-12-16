"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-left">
            <Link href="/" className="logo">KOMAL</Link>
          </div>
          <div className="nav-center">
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/how-komal-works">How KOMAL Works</Link>
            <Link href="/meet-komal">Platform</Link>
            <Link href="/team">Team</Link>
            <Link href="/#for-parents">For Parents</Link>
            <Link href="/#for-schools">For Schools</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/#about">About</Link>
          </div>
          <div className="nav-right">
            <Link href="#" className="btn-login">Login</Link>
            <Link href="#" className="btn-enterprise">Get Started Free</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

