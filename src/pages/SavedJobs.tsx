import { Link } from "react-router-dom";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Bookmark,
  Building2,
  MapPin,
  Banknote,
  Clock,
  Wifi,
  CheckCircle2,
  Trash2,
  Search,
} from "lucide-react";

const SavedJobs = () => {
  const { savedJobs, unsaveJob } = useSavedJobs();

  const formatBudget = (job: {
    budget_min: number | null;
    budget_max: number | null;
    budget_period: string | null;
  }) => {
    if (!job.budget_min && !job.budget_max) return null;
    const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString());
    if (job.budget_min && job.budget_max)
      return `KES ${fmt(job.budget_min)} - ${fmt(job.budget_max)}/${job.budget_period || "mo"}`;
    if (job.budget_min) return `From KES ${fmt(job.budget_min)}/${job.budget_period || "mo"}`;
    if (job.budget_max) return `Up to KES ${fmt(job.budget_max)}/${job.budget_period || "mo"}`;
    return null;
  };

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case "full_time":
        return { label: "Full-time", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
      case "contract":
        return { label: "Contract", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
      case "gig":
        return { label: "Gig", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" };
      default:
        return { label: type, className: "bg-secondary text-secondary-foreground" };
    }
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const posted = new Date(dateStr);
    const diffMs = now.getTime() - posted.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return posted.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
            <p className="text-sm text-muted-foreground">
              {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved jobs yet</h3>
            <p className="text-muted-foreground mb-6">
              Bookmark jobs you're interested in to view them here later.
            </p>
            <Button variant="accent" asChild>
              <Link to="/jobs">
                <Search className="w-4 h-4 mr-2" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedJobs
              .slice()
              .sort((a, b) => {
                const aTime = new Date(a.saved_at).getTime();
                const bTime = new Date(b.saved_at).getTime();
                return bTime - aTime;
              })
              .map((job) => {
                const typeBadge = getJobTypeBadge(job.job_type);
                const budget = formatBudget(job);
                return (
                  <div key={job.id} className="card-elevated p-5 relative group">
                    {/* Remove button */}
                    <button
                      onClick={() => unsaveJob(job.id)}
                      aria-label="Remove from saved jobs"
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link to={`/jobs/${job.id}`} className="block pr-10">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-1">
                              {job.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${typeBadge.className}`}
                            >
                              {typeBadge.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            {job.company_name || "Company"}
                            {job.is_verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {job.skills.slice(0, 4).map((skill) => (
                            <span key={skill.id} className="badge-skill text-xs">
                              {skill.name}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="badge-skill text-xs">+{job.skills.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                        {(job.location || job.is_remote) && (
                          <span className="flex items-center gap-1">
                            {job.is_remote ? (
                              <>
                                <Wifi className="w-3.5 h-3.5" />
                                Remote
                              </>
                            ) : (
                              <>
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </>
                            )}
                          </span>
                        )}
                        {budget && (
                          <span className="flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5" />
                            {budget}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Posted {timeAgo(job.created_at)}
                        </span>
                        <span className="flex items-center gap-1 text-accent/80">
                          <Bookmark className="w-3.5 h-3.5" />
                          Saved {timeAgo(job.saved_at)}
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedJobs;
