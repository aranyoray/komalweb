export default function IsAiSafeForKidsTechPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-primary mb-6">Is AI Safe for Kids? The Tech Behind On-Device Safety</h1>
      <p className="text-base text-text-dim mb-6">
        This article explains why on-device safety systems are preferred for sensitive child-focused experiences,
        emphasizing predictable latency, privacy, and governance.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-base text-text-dim">
        <li>
          <strong>Reduced attack surface:</strong> No cloud-based API calls means fewer vectors for data exposure or
          manipulation.
        </li>
        <li>
          <strong>Predictable latency:</strong> On-device processing provides consistent &lt;200ms response times.
        </li>
        <li>
          <strong>Governance-friendly:</strong> Parents and institutions can audit system behavior without relying on
          third-party cloud services.
        </li>
      </ul>
    </main>
  );
}
