import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link href="/#how-it-works">How It Works</Link></li>
              <li><Link href="/how-komal-works">How KOMAL Works</Link></li>
              <li><Link href="/meet-komal">Meet KOMAL</Link></li>
              <li><Link href="/team">Team</Link></li>
              <li><Link href="/#for-parents">For Parents</Link></li>
              <li><Link href="/#for-schools">For Schools</Link></li>
              <li><Link href="/#for-therapists">For Therapists</Link></li>
              <li><Link href="/#pricing">Pricing</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Press Kit</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal & Privacy</h4>
            <ul>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">COPPA Compliance</Link></li>
              <li><Link href="#">Data Security</Link></li>
              <li><Link href="#">Ethical AI Principles</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <Link href="#">Twitter</Link>
              <Link href="#">LinkedIn</Link>
              <Link href="#">Instagram</Link>
              <Link href="#">Facebook</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>All rights reserved © KOMAL AI Inc.</p>
          <p className="footer-brand">KOMAL</p>
        </div>
      </div>
    </footer>
  );
}

