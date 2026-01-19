import { Link } from "react-router-dom";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-tight section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">
                Kazi<span className="text-accent">Hub</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Connecting skilled talent with real opportunities across Africa. 
              Skills-first hiring for the modern workforce.
            </p>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">For Job Seekers</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Skill Categories
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">For Employers</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/post-job" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/talent" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 text-accent" />
                Nairobi, Kenya
              </li>
              <li>
                <a href="mailto:hello@kazihub.com" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  <Mail className="w-4 h-4 text-accent" />
                  hello@kazihub.com
                </a>
              </li>
              <li>
                <a href="tel:+254700000000" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  <Phone className="w-4 h-4 text-accent" />
                  +254 700 000 000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 KaziHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
