import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Building2,
  Loader2,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface Application {
  id: string;
  status: "pending" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
  cover_note: string | null;
  job: {
    id: string;
    title: string;
    job_type: string;
    location: string | null;
    is_remote: boolean;
    employer: {
      company_name: string | null;
      company_logo_url: string | null;
    };
  };
}

const statusFilters = [
  { value: "all", label: "All", icon: FileText },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "shortlisted", label: "Shortlisted", icon: CheckCircle2 },
  { value: "rejected", label: "Rejected", icon: XCircle },
  { value: "hired", label: "Hired", icon: Briefcase },
];

const MyApplications = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "job_seeker")) {
      navigate("/dashboard");
    }
  }, [authLoading, profile, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchApplications();
    }
  }, [profile?.id]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          cover_note,
          job:jobs(
            id,
            title,
            job_type,
            location,
            is_remote,
            employer:employer_profiles(company_name, company_logo_url)
          )
        `)
        .eq("seeker_id", profile?.id)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      setApplications((data as any) || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", className: "bg-amber-100 text-amber-700", icon: Clock };
      case "shortlisted":
        return { label: "Shortlisted", className: "bg-blue-100 text-blue-700", icon: CheckCircle2 };
      case "rejected":
        return { label: "Rejected", className: "bg-red-100 text-red-700", icon: XCircle };
      case "hired":
        return { label: "Hired", className: "bg-green-100 text-green-700", icon: Briefcase };
      default:
        return { label: status, className: "bg-secondary text-secondary-foreground", icon: FileText };
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your job applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusFilters.map((filter) => {
            const count =
              filter.value === "all"
                ? applications.length
                : applications.filter((a) => a.status === filter.value).length;
            return (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "card-elevated p-4 text-left transition-all",
                  statusFilter === filter.value && "ring-2 ring-accent"
                )}
              >
                <filter.icon className={cn(
                  "w-5 h-5 mb-2",
                  filter.value === "pending" && "text-amber-500",
                  filter.value === "shortlisted" && "text-blue-500",
                  filter.value === "rejected" && "text-red-500",
                  filter.value === "hired" && "text-green-500",
                  filter.value === "all" && "text-muted-foreground"
                )} />
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-sm text-muted-foreground">{filter.label}</p>
              </button>
            );
          })}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <Link
                  key={app.id}
                  to={`/jobs/${app.job?.id}`}
                  className="card-elevated p-5 block hover:border-accent/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {app.job?.employer?.company_logo_url ? (
                        <img
                          src={app.job.employer.company_logo_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {app.job?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {app.job?.employer?.company_name || "Company"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                        >
                          <statusBadge.icon className="w-3.5 h-3.5" />
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                        <span className="capitalize">
                          {app.job?.job_type?.replace("_", " ")}
                        </span>
                        {app.job?.is_remote ? (
                          <span>Remote</span>
                        ) : (
                          app.job?.location && <span>{app.job.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No applications found
            </h3>
            <p className="text-muted-foreground mb-6">
              {statusFilter === "all"
                ? "Start applying to jobs to track your applications here"
                : `No ${statusFilter} applications`}
            </p>
            <Button asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
