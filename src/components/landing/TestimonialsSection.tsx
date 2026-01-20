import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Njeri",
    role: "Graphic Designer",
    location: "Nairobi",
    rating: 5,
    text: "KaziHub helped me land my dream freelance job in just two weeks. The skills-first approach really showcased my abilities without the pressure of a traditional CV.",
    initials: "SN",
  },
  {
    name: "David Omondi",
    role: "Full Stack Developer",
    location: "Mombasa",
    rating: 5,
    text: "As a self-taught developer, I struggled with CV-based applications. KaziHub let me demonstrate my skills through projects, and I got hired within a month!",
    initials: "DO",
  },
  {
    name: "Grace Wanjiku",
    role: "HR Manager, TechCorp Kenya",
    location: "Nairobi",
    rating: 5,
    text: "We've hired 5 amazing talents through KaziHub. The skill verification system saves us time, and the candidates are pre-vetted for quality.",
    initials: "GW",
  },
  {
    name: "James Mutua",
    role: "Plumber & Handyman",
    location: "Kisumu",
    rating: 5,
    text: "I never thought finding consistent gig work would be this easy. KaziHub connects me with clients who value my skills. I'm now fully booked!",
    initials: "JM",
  },
  {
    name: "Linda Akinyi",
    role: "Fashion Designer",
    location: "Nairobi",
    rating: 5,
    text: "KaziHub understands creative professionals. I got contract work with a major brand through the platform. Game changer for fashion talent!",
    initials: "LA",
  },
  {
    name: "Michael Kipchoge",
    role: "CEO, StartupHub Africa",
    location: "Nairobi",
    rating: 5,
    text: "As a startup, we needed skilled developers fast. KaziHub's verified employer badge gave us credibility, and we hired a full team in weeks.",
    initials: "MK",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Trusted by Thousands
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Success Stories from{" "}
            <span className="text-accent">Real People</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from job seekers and employers who found success on KaziHub
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-accent/20" />
              
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                "{testimonial.text}"
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Join <span className="font-semibold text-accent">10,000+</span>{" "}
            happy users on KaziHub
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
