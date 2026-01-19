import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            Join thousands of skilled professionals and employers already 
            connecting on KaziHub. Your next opportunity is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup?role=seeker">
                Find Work Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/signup?role=employer">
                Post a Job
                <Briefcase className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-primary-foreground/60 text-sm">
            Free to join for job seekers. Employers start with a free plan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
