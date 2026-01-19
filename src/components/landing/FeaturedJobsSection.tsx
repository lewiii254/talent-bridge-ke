import { MapPin, Clock, Banknote, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const featuredJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "Safaricom",
    location: "Nairobi, Kenya",
    type: "Full-time",
    salary: "KES 150K - 250K/mo",
    skills: ["React", "TypeScript", "Node.js"],
    posted: "2 hours ago",
    verified: true,
  },
  {
    id: 2,
    title: "Professional Electrician",
    company: "BuildRight Contractors",
    location: "Mombasa, Kenya",
    type: "Contract",
    salary: "KES 2,500/day",
    skills: ["Electrical", "Wiring", "Solar"],
    posted: "5 hours ago",
    verified: true,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Fintech Startup",
    location: "Remote",
    type: "Full-time",
    salary: "KES 100K - 180K/mo",
    skills: ["Figma", "UI Design", "Prototyping"],
    posted: "1 day ago",
    verified: true,
  },
  {
    id: 4,
    title: "Wedding Photographer",
    company: "Moments Studio",
    location: "Nairobi, Kenya",
    type: "Gig",
    salary: "KES 50K - 100K/event",
    skills: ["Photography", "Editing", "Videography"],
    posted: "3 hours ago",
    verified: false,
  },
];

const FeaturedJobsSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-tight">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured <span className="text-accent">Jobs</span>
            </h2>
            <p className="text-muted-foreground">
              Latest opportunities from verified employers
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/jobs">
              View All Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="group card-elevated p-6 hover:border-accent/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {job.company}
                      {job.verified && (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-success text-success-foreground">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.type === 'Full-time' ? 'bg-blue-100 text-blue-700' :
                  job.type === 'Contract' ? 'bg-amber-100 text-amber-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {job.type}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span key={skill} className="badge-skill text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Banknote className="w-4 h-4" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.posted}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
