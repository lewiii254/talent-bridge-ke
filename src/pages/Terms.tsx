import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-20">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Terms of Service
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
                Welcome to KaziHub (Talent Bridge KE). By accessing or using our
                platform, you agree to be bound by these Terms of Service. Please
                read them carefully.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By creating an account or using KaziHub, you agree to these
                Terms, our Privacy Policy, and all applicable laws and
                regulations. If you do not agree, do not use our platform.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                2. Eligibility
              </h2>
              <p className="text-muted-foreground">
                You must be at least 18 years old to use KaziHub. By registering,
                you represent that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>You are of legal age to form a binding contract</li>
                <li>All information you provide is accurate and truthful</li>
                <li>
                  You will maintain the accuracy of your account information
                </li>
                <li>You are not prohibited from using the platform by law</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Account Creation
              </h3>
              <p className="text-muted-foreground">
                You can register as either a job seeker or an employer. You are
                responsible for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Maintaining the confidentiality of your password</li>
                <li>All activities under your account</li>
                <li>
                  Notifying us immediately of unauthorized access or security
                  breaches
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Account Termination
              </h3>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your account if you
                violate these Terms, engage in fraudulent activity, or for any
                reason at our discretion.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                4. User Conduct
              </h2>
              <p className="text-muted-foreground">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  Post false, misleading, or fraudulent job listings or profiles
                </li>
                <li>
                  Harass, abuse, or harm other users or discriminate based on
                  race, gender, religion, etc.
                </li>
                <li>
                  Use the platform for any illegal activity or solicitation of
                  illegal services
                </li>
                <li>
                  Scrape, data mine, or use automated tools to access the
                  platform without permission
                </li>
                <li>Attempt to hack, disrupt, or compromise platform security</li>
                <li>
                  Share or resell access to KaziHub or user data without
                  authorization
                </li>
                <li>
                  Post spam, unsolicited advertising, or promotional content
                </li>
                <li>Impersonate another person or entity</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                5. Job Seeker Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  You must provide accurate information about your skills and
                  experience
                </li>
                <li>
                  You are responsible for verifying employer legitimacy before
                  accepting jobs
                </li>
                <li>
                  KaziHub is not liable for employer conduct, payment disputes,
                  or job quality
                </li>
                <li>
                  Do not share personal financial information (e.g., bank details)
                  until you've verified the employer
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                6. Employer Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  You must be a legitimate business or individual hiring for
                  genuine positions
                </li>
                <li>
                  Job postings must be accurate, legal, and non-discriminatory
                </li>
                <li>
                  You must comply with all applicable labor laws and regulations
                </li>
                <li>
                  Payment for services is your responsibility; KaziHub is not a
                  party to your employment contracts
                </li>
                <li>
                  Verified employer badges are granted at our discretion and can
                  be revoked for misconduct
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                7. Payments and Subscriptions
              </h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Job Seeker Accounts
              </h3>
              <p className="text-muted-foreground">
                KaziHub is free for job seekers. We will never charge you to
                browse or apply for jobs.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Employer Plans
              </h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Subscription fees are billed monthly or annually</li>
                <li>All payments are non-refundable except as required by law</li>
                <li>
                  We may change pricing with 30 days' notice to existing
                  subscribers
                </li>
                <li>
                  If payment fails, your account may be downgraded or suspended
                </li>
                <li>Cancellations take effect at the end of the billing cycle</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-muted-foreground">
                KaziHub and its content (logo, design, text, code) are owned by
                Talent Bridge KE and protected by copyright, trademark, and other
                intellectual property laws.
              </p>
              <p className="text-muted-foreground mt-4">
                You retain ownership of content you post (profiles, job listings),
                but you grant us a license to use, display, and distribute it on
                the platform.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                9. Disclaimers and Limitation of Liability
              </h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Platform "As Is"
              </h3>
              <p className="text-muted-foreground">
                KaziHub is provided "as is" without warranties of any kind. We do
                not guarantee uninterrupted access, error-free operation, or
                specific results.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                No Employment Guarantee
              </h3>
              <p className="text-muted-foreground">
                We do not guarantee that job seekers will find employment or that
                employers will find suitable candidates.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Third-Party Conduct
              </h3>
              <p className="text-muted-foreground">
                KaziHub is not responsible for the conduct, actions, or omissions
                of users. We are not liable for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Fraudulent job postings or employer misconduct</li>
                <li>Payment disputes between users</li>
                <li>Workplace injuries, harassment, or discrimination</li>
                <li>Job quality, work conditions, or contract terms</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Limitation of Liability
              </h3>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, KaziHub's liability is
                limited to the amount you paid us in the past 12 months (or KES
                10,000, whichever is less).
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                10. Indemnification
              </h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold KaziHub harmless from any claims,
                damages, or expenses arising from your use of the platform, your
                violation of these Terms, or your violation of any third-party
                rights.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                11. Dispute Resolution
              </h2>
              <p className="text-muted-foreground">
                Any disputes will be governed by the laws of Kenya. You agree to
                attempt to resolve disputes informally first by contacting us at
                legal@kazihub.co.ke. If unresolved, disputes will be settled in
                Kenyan courts.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-muted-foreground">
                We may update these Terms at any time. We'll notify you of
                material changes via email or platform notice. Continued use after
                changes means you accept the new Terms.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, contact:
              </p>
              <ul className="list-none pl-0 text-muted-foreground">
                <li>Email: legal@kazihub.co.ke</li>
                <li>Support: support@kazihub.co.ke</li>
                <li>Phone: +254 700 000 000</li>
                <li>Address: Nairobi, Kenya</li>
              </ul>

              <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  By using KaziHub, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service.
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

export default Terms;
