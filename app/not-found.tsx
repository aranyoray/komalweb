import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="value-prop" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 className="hero-title" style={{ fontSize: "72px", marginBottom: "16px" }}>
            404
          </h1>
          <h2 className="section-title" style={{ fontSize: "32px", marginBottom: "24px" }}>
            Page Not Found
          </h2>
          <p className="section-description" style={{ marginBottom: "32px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/how-komal-works" className="btn-secondary">
              How It Works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

