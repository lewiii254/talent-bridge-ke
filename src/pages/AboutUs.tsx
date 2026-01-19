import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Target,
  Heart,
  Users,
  Lightbulb,
  Award,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-20">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                About <span className="text-accent">KaziHub</span>
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Revolutionizing how Africa connects talent with opportunity
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding">
          <div className="container-tight">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  KaziHub exists to democratize access to work across Africa by
                  building a skills-first job platform that values what you can
                  do, not just where you studied or who you know.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  We believe every skilled person deserves a fair chance to
                  showcase their abilities, and every employer deserves access
                  to verified, quality talent without the noise.
                </p>
                <p className="text-lg text-muted-foreground">
                  By removing CVs and focusing on skills, portfolios, and real
                  experience, we're leveling the playing field for everyone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 text-center">
                  <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Skills First</h3>
                  <p className="text-sm text-muted-foreground">
                    Show what you can do
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Built for Africa</h3>
                  <p className="text-sm text-muted-foreground">
                    Local first, global ready
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Trust & Safety</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified employers only
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <Lightbulb className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Modern tools for modern work
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding bg-secondary/30">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-4">
                  KaziHub was born from a simple observation: traditional job
                  hunting in Kenya and across Africa is broken. Talented
                  plumbers, designers, developers, and creatives were being
                  overlooked because they didn't have the "right" CV or
                  connections.
                </p>
                <p className="text-muted-foreground mb-4">
                  Meanwhile, employers were drowning in applications from
                  unqualified candidates and struggling to find the skilled
                  workers they desperately needed.
                </p>
                <p className="text-muted-foreground mb-4">
                  In 2024, we decided to fix this. We built KaziHub as a
                  skills-first platform where your abilities speak louder than
                  your alma mater. Where employers are verified to protect job
                  seekers from scams. Where gig workers, freelancers, and
                  full-timers all have equal opportunity.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to connect thousands of skilled
                  professionals with verified employers across Kenya, with plans
                  to expand throughout East Africa and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-tight">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <Award className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">Meritocracy</h3>
                <p className="text-muted-foreground">
                  Your skills and work quality determine your success, not your
                  background or connections.
                </p>
              </Card>
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
                <p className="text-muted-foreground">
                  Every job type matters—from tech to trades, creative to
                  corporate. All work has dignity.
                </p>
              </Card>
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <TrendingUp className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  Clear job descriptions, verified employers, no hidden fees.
                  What you see is what you get.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Join Us in Building the Future of Work
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Whether you're seeking work or seeking talent, KaziHub is your
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Get Started Today</Link>
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
