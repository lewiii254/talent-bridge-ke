import { UserPlus, Search, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Sign up in 2 minutes. Add your skills, experience, and work samples. No CV needed.",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Get Matched",
    description: "Our smart matching connects you with relevant jobs or talent based on skills.",
    icon: Search,
    color: "bg-accent",
  },
  {
    id: 3,
    title: "Connect & Hire",
    description: "Apply with one tap, message directly via WhatsApp, and close deals fast.",
    icon: CheckCircle2,
    color: "bg-success",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How <span className="text-accent">KaziHub</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Get started in minutes, not days. Simple, fast, and effective.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              {/* Step Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Step Number */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">{step.id}</span>
                </div>
                
                {/* Text */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
