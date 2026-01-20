import { TrendingUp, Users, Briefcase, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: "10,000+",
    label: "Active Job Listings",
    description: "Across all industries",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Skilled Professionals",
    description: "Ready to work",
  },
  {
    icon: CheckCircle2,
    value: "5,000+",
    label: "Verified Employers",
    description: "Trusted companies",
  },
  {
    icon: TrendingUp,
    value: "92%",
    label: "Success Rate",
    description: "Within 30 days",
  },
];

const StatsSection = () => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Powering Kenya's{" "}
            <span className="text-accent">Talent Economy</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Real numbers from real people building careers and businesses
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-primary-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-primary-foreground/80 text-lg">
            Join the fastest-growing talent platform in East Africa
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
