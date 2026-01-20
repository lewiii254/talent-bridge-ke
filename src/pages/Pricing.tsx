import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "KES 0",
    period: "forever",
    description: "Perfect for job seekers exploring opportunities",
    features: [
      "Create professional profile",
      "Browse unlimited jobs",
      "Apply to jobs",
      "Skill verification",
      "Basic messaging",
      "Job alerts",
    ],
    notIncluded: [
      "Featured profile",
      "Priority support",
      "Advanced analytics",
    ],
    ctaText: "Sign Up Free",
    ctaLink: "/signup?role=seeker",
    popular: false,
    forRole: "Job Seekers",
  },
  {
    name: "Starter",
    price: "KES 4,999",
    period: "/month",
    description: "Great for small businesses and startups",
    features: [
      "Post up to 5 active jobs",
      "Access to all candidates",
      "Basic applicant filtering",
      "Company verification badge",
      "Direct messaging",
      "Job performance insights",
      "Email support",
    ],
    notIncluded: [
      "Featured job listings",
      "Advanced analytics",
      "Priority support",
    ],
    ctaText: "Start Free Trial",
    ctaLink: "/signup?role=employer",
    popular: false,
    forRole: "Employers",
  },
  {
    name: "Professional",
    price: "KES 14,999",
    period: "/month",
    description: "Best for growing companies hiring actively",
    features: [
      "Unlimited job postings",
      "Featured job listings (3/month)",
      "Advanced candidate filtering",
      "Company verification badge",
      "Priority messaging",
      "Detailed analytics & reports",
      "Bulk hiring tools",
      "Priority email support",
      "Proactive candidate outreach",
    ],
    notIncluded: ["Dedicated account manager", "API access"],
    ctaText: "Start Free Trial",
    ctaLink: "/signup?role=employer",
    popular: true,
    forRole: "Employers",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with complex needs",
    features: [
      "Everything in Professional",
      "Unlimited featured listings",
      "Custom integrations & API",
      "Dedicated account manager",
      "Custom branding options",
      "Advanced security & compliance",
      "SLA guarantees",
      "Phone & priority support",
      "Training & onboarding",
      "Custom reporting",
    ],
    notIncluded: [],
    ctaText: "Contact Sales",
    ctaLink: "/contact",
    popular: false,
    forRole: "Employers",
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-20">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Simple, Transparent{" "}
                <span className="text-accent">Pricing</span>
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Choose the plan that fits your needs. No hidden fees, cancel
                anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="section-padding">
          <div className="container-tight">
            {/* Job Seekers */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                For Job Seekers
              </h2>
              <div className="max-w-md mx-auto">
                <Card
                  className={`p-8 relative hover:shadow-xl transition-shadow`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {pricingPlans[0].name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {pricingPlans[0].description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {pricingPlans[0].price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {pricingPlans[0].period}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pricingPlans[0].features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button size="lg" className="w-full" asChild>
                    <Link to={pricingPlans[0].ctaLink}>
                      {pricingPlans[0].ctaText}
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>

            {/* Employers */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                For Employers
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {pricingPlans.slice(1).map((plan, index) => (
                  <Card
                    key={index}
                    className={`p-8 relative hover:shadow-xl transition-shadow ${
                      plan.popular ? "border-accent border-2" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">
                        {plan.period}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground/60">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link to={plan.ctaLink}>{plan.ctaText}</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Pricing FAQs
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">
                    Is there a free trial for employer plans?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! All employer plans come with a 14-day free trial. No
                    credit card required to start.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Can I change plans later?
                  </h3>
                  <p className="text-muted-foreground">
                    Absolutely! You can upgrade, downgrade, or cancel your plan
                    at any time from your dashboard.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept M-Pesa, credit/debit cards, and bank transfers for
                    enterprise plans.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Do you offer discounts for non-profits?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! We offer 30% discounts for verified non-profit
                    organizations. Contact our sales team for details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you find the perfect plan.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
