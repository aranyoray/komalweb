import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Komal",
  description:
    "Komal terms of service: usage terms, user responsibilities, intellectual property, and legal agreements for our child safety platform.",
  robots: "index, follow",
  alternates: {
    canonical: "https://komalkids.com/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main>
      <section className="value-prop">
        <div className="container">
          <div className="privacy-policy-content">
            <h1 className="privacy-title">Terms of Service</h1>
            <p className="last-updated">
              <strong>Last Updated:</strong> {lastUpdated}
            </p>

            <div className="privacy-highlight">
              <p>
                <strong>Important:</strong> These Terms of Service (&quot;Terms&quot;) govern your use of the
                Komal application and website (collectively, the &quot;Service&quot;), operated by KOMAL (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our
                Service, you agree to be bound by these Terms. If you do not agree, please do not use the
                Service.
              </p>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account, downloading the Komal application, or accessing the Komal website at
              komalkids.com, you acknowledge that you have read, understood, and agree to be bound by these
              Terms and our{" "}
              <a href="/privacy-policy">Privacy Policy</a>. If you are a parent or guardian using the Service
              on behalf of a child, you accept these Terms on their behalf.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Komal is an AI-powered social-emotional learning (SEL) and child safety platform designed for
              children ages 3-16. The Service provides:
            </p>
            <ul>
              <li>AI-powered content safety analysis and filtering</li>
              <li>Social-emotional learning therapy sessions</li>
              <li>Parental controls and monitoring dashboards</li>
              <li>Progress tracking and reporting</li>
              <li>Age-appropriate content recommendations</li>
            </ul>
            <p>
              The Service is intended to supplement, not replace, professional medical, psychological, or
              therapeutic advice. Always consult qualified professionals for health-related decisions.
            </p>

            <h2>3. Eligibility and Account Registration</h2>

            <h3>3.1 Age Requirements</h3>
            <ul>
              <li>
                You must be at least 18 years old (or the age of majority in your jurisdiction) to create a
                parent/guardian account.
              </li>
              <li>
                Child profiles may only be created and managed by a parent or legal guardian.
              </li>
              <li>
                Children under 13 may not use the Service without verifiable parental consent, in compliance
                with COPPA.
              </li>
            </ul>

            <h3>3.2 Account Responsibilities</h3>
            <ul>
              <li>
                You are responsible for maintaining the confidentiality of your account credentials.
              </li>
              <li>
                You agree to provide accurate, current, and complete information during registration.
              </li>
              <li>
                You are responsible for all activities that occur under your account.
              </li>
              <li>
                You must notify us immediately of any unauthorized use of your account.
              </li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>
                Violate any applicable local, state, national, or international law or regulation.
              </li>
              <li>
                Upload, transmit, or distribute any content that is unlawful, harmful, threatening, abusive,
                or otherwise objectionable.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Service, other accounts, or computer
                systems.
              </li>
              <li>
                Interfere with or disrupt the Service or servers/networks connected to the Service.
              </li>
              <li>
                Use the Service to collect personal information of other users without their consent.
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the Service.
              </li>
              <li>
                Use automated systems (bots, scrapers) to access the Service without our written permission.
              </li>
            </ul>

            <h2>5. Subscriptions and Payments</h2>

            <h3>5.1 Free and Paid Plans</h3>
            <p>
              Komal offers both free and paid subscription plans. Free plan users receive limited access to
              features and reports. Paid plans offer expanded features, additional reports, and premium
              capabilities.
            </p>

            <h3>5.2 Billing</h3>
            <ul>
              <li>
                Paid subscriptions are billed on a recurring basis (monthly or annually) through our payment
                processor, Stripe.
              </li>
              <li>
                You authorize us to charge the payment method on file for all applicable fees.
              </li>
              <li>
                All fees are stated in USD unless otherwise indicated.
              </li>
            </ul>

            <h3>5.3 Cancellation and Refunds</h3>
            <ul>
              <li>
                You may cancel your subscription at any time through the Billing page.
              </li>
              <li>
                Cancellation takes effect at the end of the current billing period.
              </li>
              <li>
                Refunds are handled in accordance with applicable consumer protection laws and the policies of
                the app store through which you purchased the subscription.
              </li>
            </ul>

            <h2>6. Intellectual Property</h2>

            <h3>6.1 Our Property</h3>
            <p>
              The Service, including all content, features, functionality, software, designs, text, graphics,
              logos, icons, images, audio, video, and the arrangement thereof, is owned by KOMAL and is protected by international copyright, trademark, patent, trade secret, and other
              intellectual property laws.
            </p>

            <h3>6.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service
              for personal, non-commercial purposes in accordance with these Terms.
            </p>

            <h3>6.3 Your Content</h3>
            <p>
              You retain ownership of any content you submit through the Service (such as profile
              information). By submitting content, you grant us a non-exclusive, worldwide, royalty-free
              license to use, process, and store that content solely for the purpose of providing and
              improving the Service.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <a href="/privacy-policy">Privacy Policy</a>, which describes how we collect, use, and protect
              your personal information. Key privacy commitments include:
            </p>
            <ul>
              <li>No biometric data storage — all processing is on-device</li>
              <li>Only de-identified scores are stored</li>
              <li>Full compliance with COPPA, GDPR, and DPDPA</li>
              <li>Parental consent required for all child data</li>
            </ul>

            <h2>8. Disclaimers</h2>

            <h3>8.1 Service Provided &quot;As Is&quot;</h3>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
              warranties of any kind, either express or implied, including but not limited to implied
              warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>

            <h3>8.2 No Medical Advice</h3>
            <div className="privacy-highlight">
              <p>
                <strong>Important:</strong> Komal is not a medical device and does not provide medical,
                psychological, or therapeutic diagnoses. The Service is designed as an educational and
                supplementary tool. Always consult qualified healthcare professionals for medical decisions
                regarding your child.
              </p>
            </div>

            <h3>8.3 Content Safety</h3>
            <p>
              While we strive to provide accurate content safety analysis, no automated system is perfect. We
              do not guarantee that the Service will identify all unsafe content or that our safety ratings
              will be error-free.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, KOMAL, its directors,
              employees, partners, agents, and affiliates shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to loss of data, profits,
              goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to, use of, or inability to use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            <p>
              In no event shall our total liability exceed the amount paid by you to us in the twelve (12)
              months preceding the claim.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless KOMAL and its officers,
              directors, employees, and agents from any claims, damages, obligations, losses, liabilities,
              costs, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit through the Service</li>
            </ul>

            <h2>11. Termination</h2>
            <ul>
              <li>
                We may suspend or terminate your access to the Service at any time, with or without cause,
                with or without notice.
              </li>
              <li>
                You may terminate your account at any time by contacting us at play@komalkids.com or through
                the account settings.
              </li>
              <li>
                Upon termination, your right to use the Service ceases immediately.
              </li>
              <li>
                Sections on intellectual property, disclaimers, limitation of liability, indemnification, and
                governing law survive termination.
              </li>
            </ul>

            <h2>12. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes
              by:
            </p>
            <ul>
              <li>Posting updated Terms on the Service</li>
              <li>Updating the &quot;Last Updated&quot; date at the top of these Terms</li>
              <li>Providing in-app or email notifications for significant changes</li>
            </ul>
            <p>
              Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>

            <h2>13. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without
              regard to its conflict of law principles. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts in Bengaluru, India.
            </p>
            <p>
              For users in the European Union, nothing in these Terms affects your rights under mandatory
              consumer protection laws of your country of residence.
            </p>

            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be
              limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain
              in full force and effect.
            </p>

            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and
              KOMAL regarding the use of the Service and supersede all prior agreements and
              understandings.
            </p>

            <h2>16. Contact Us</h2>
            <div className="contact-info">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:play@komalkids.com">play@komalkids.com</a>
              </p>
              <p>
                <strong>Privacy Inquiries:</strong>{" "}
                <a href="mailto:privacy@komalkids.com">privacy@komalkids.com</a>
              </p>
              <p>
                <strong>Company:</strong> KOMAL
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a href="https://komalkids.com">komalkids.com</a>
              </p>
            </div>

            <hr className="privacy-divider" />

            <p className="privacy-footer">
              These Terms of Service are effective as of the date listed above and apply to all users of the
              Komal application and website.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
