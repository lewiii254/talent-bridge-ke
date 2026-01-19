import { Shield, Phone, BadgeCheck, Building2, Users, Star } from "lucide-react";

const trustFeatures = [
  {
    icon: BadgeCheck,
    title: "Verified Employers",
    description: "Every employer is verified before posting jobs",
  },
  {
    icon: Phone,
    title: "Phone Verification",
    description: "All users verify their phone numbers for trust",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your data is protected with enterprise security",
  },
];

const stats = [
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "24hrs", label: "Avg Response Time", icon: Users },
  { value: "500+", label: "Companies Hiring", icon: Building2 },
];

const TrustSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Trust Features */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built on <span className="text-accent">Trust</span> & Transparency
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              We take verification seriously. Every employer and job seeker goes through 
              our trust checks so you can hire and apply with confidence.
            </p>

            <div className="space-y-6">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats Card */}
          <div className="card-elevated p-8 md:p-10">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Trusted by Thousands
              </h3>
              <p className="text-muted-foreground">
                Real results from real people across Kenya
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-2xl bg-secondary/50">
                  <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="badge-verified">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Verified Platform
                </div>
                <div className="badge-verified">
                  <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                  GDPR Compliant
                </div>
                <div className="badge-verified">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  SSL Secured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
