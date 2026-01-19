import { Link } from "react-router-dom";
import { MapPin, Clock, Banknote, Building2, CheckCircle2, Wifi } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string | null;
    job_type: string;
    budget_min: number | null;
    budget_max: number | null;
    budget_period: string | null;
    location: string | null;
    is_remote: boolean;
    created_at: string;
    employer: {
      company_name: string | null;
      is_verified: boolean;
    };
    skills: {
      skill: {
        id: string;
        name: string;
      };
    }[];
  };
}

const JobCard = ({ job }: JobCardProps) => {
  const formatBudget = () => {
    if (!job.budget_min && !job.budget_max) return null;
    
    const formatNum = (num: number) => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      return num.toString();
    };

    if (job.budget_min && job.budget_max) {
      return `KES ${formatNum(job.budget_min)} - ${formatNum(job.budget_max)}/${job.budget_period || "mo"}`;
    }
    if (job.budget_min) {
      return `From KES ${formatNum(job.budget_min)}/${job.budget_period || "mo"}`;
    }
    if (job.budget_max) {
      return `Up to KES ${formatNum(job.budget_max)}/${job.budget_period || "mo"}`;
    }
    return null;
  };

  const getJobTypeBadge = () => {
    switch (job.job_type) {
      case "full_time":
        return { label: "Full-time", className: "bg-blue-100 text-blue-700" };
      case "contract":
        return { label: "Contract", className: "bg-amber-100 text-amber-700" };
      case "gig":
        return { label: "Gig", className: "bg-purple-100 text-purple-700" };
      default:
        return { label: job.job_type, className: "bg-secondary text-secondary-foreground" };
    }
  };

  const timeAgo = () => {
    const now = new Date();
    const posted = new Date(job.created_at);
    const diffMs = now.getTime() - posted.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return posted.toLocaleDateString();
  };

  const typeBadge = getJobTypeBadge();
  const budget = formatBudget();

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group card-elevated p-5 hover:border-accent/50 block transition-all"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {job.employer?.company_name || "Company"}
              {job.employer?.is_verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              )}
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${typeBadge.className}`}
        >
          {typeBadge.label}
        </span>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.skills.slice(0, 4).map((jobSkill) => (
            <span
              key={jobSkill.skill.id}
              className="badge-skill text-xs"
            >
              {jobSkill.skill.name}
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
          {timeAgo()}
        </span>
      </div>
    </Link>
  );
};

export default JobCard;
