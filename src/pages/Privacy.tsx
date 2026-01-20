import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-20">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Last updated: January 19, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-tight">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <p className="text-muted-foreground">
                At KaziHub (Talent Bridge KE), we take your privacy seriously.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our platform.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                1. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Personal Information
              </h3>
              <p className="text-muted-foreground">
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Full name and email address</li>
                <li>Phone number (optional)</li>
                <li>Location (city/country)</li>
                <li>Profile photo (optional)</li>
                <li>
                  For job seekers: skills, work experience, portfolio links
                </li>
                <li>
                  For employers: company name, website, business registration
                  details
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Automatically Collected Information
              </h3>
              <p className="text-muted-foreground">We automatically collect:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages viewed and time spent on site</li>
                <li>Referral source</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground">We use your information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Create and manage your account</li>
                <li>
                  Match job seekers with relevant opportunities and employers
                  with qualified candidates
                </li>
                <li>Send job alerts and platform updates</li>
                <li>Process transactions and payments (for employer plans)</li>
                <li>Verify employer legitimacy and prevent fraud</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal obligations</li>
                <li>
                  Communicate with you about your account or customer support
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                3. Information Sharing
              </h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                With Other Users
              </h3>
              <p className="text-muted-foreground">
                When you apply for a job, employers can see your profile
                information including name, skills, experience, and any work
                samples you've shared. Your email and phone number are never
                shared without your explicit consent.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                With Service Providers
              </h3>
              <p className="text-muted-foreground">We share data with:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Supabase (authentication and database hosting)</li>
                <li>Email service providers (for notifications)</li>
                <li>Payment processors (for employer subscriptions)</li>
                <li>Analytics tools (Google Analytics)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Legal Requirements
              </h3>
              <p className="text-muted-foreground">
                We may disclose your information if required by law, court
                order, or government regulation, or to protect our rights and
                users' safety.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Encrypted database storage</li>
                <li>Row-level security policies on database</li>
                <li>Regular security audits and updates</li>
                <li>Two-factor authentication (optional)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                However, no method of transmission over the internet is 100%
                secure. We cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                5. Your Rights
              </h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  Access, update, or delete your personal information at any
                  time through your account settings
                </li>
                <li>Opt out of marketing emails (unsubscribe link included)</li>
                <li>Request a copy of your data (data portability)</li>
                <li>
                  Delete your account permanently (contact support@kazihub.co.ke)
                </li>
                <li>Withdraw consent for data processing</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                6. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground">
                We use cookies to enhance your experience, remember your
                preferences, and analyze site usage. You can disable cookies in
                your browser settings, but this may affect site functionality.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-muted-foreground">
                KaziHub is not intended for users under 18 years old. We do not
                knowingly collect data from children. If you believe a child has
                provided us with personal information, please contact us
                immediately.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                8. International Users
              </h2>
              <p className="text-muted-foreground">
                KaziHub is based in Kenya. If you access our platform from
                outside Kenya, your data may be transferred to and processed in
                Kenya. By using KaziHub, you consent to this transfer.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We'll
                notify you of significant changes via email or a prominent
                notice on our platform. Continued use after changes constitutes
                acceptance.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or how we handle
                your data, please contact us:
              </p>
              <ul className="list-none pl-0 text-muted-foreground">
                <li>Email: privacy@kazihub.co.ke</li>
                <li>Support: support@kazihub.co.ke</li>
                <li>Phone: +254 700 000 000</li>
                <li>Address: Nairobi, Kenya</li>
              </ul>

              <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  By using KaziHub, you acknowledge that you have read and
                  understood this Privacy Policy and agree to its terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
