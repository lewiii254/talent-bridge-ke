import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
} from "lucide-react";

interface EmployerProfile {
  company_name: string | null;
  is_verified: boolean;
}

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  applications_count: number;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  seeker: {
    full_name: string | null;
  };
  job: {
    title: string;
  };
}

const EmployerDashboard = () => {
  const { profile } = useAuth();
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    hired: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile?.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch employer profile
      const { data: profileData } = await supabase
        .from("employer_profiles")
        .select("company_name, is_verified")
        .eq("id", profile?.id)
        .maybeSingle();

      setEmployerProfile(profileData);

      // Fetch jobs with application counts
      const { data: jobsData } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          status,
          created_at
        `)
        .eq("employer_id", profile?.id)
        .order("created_at", { ascending: false });

      // Get application counts for each job
      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from("job_applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);
          return { ...job, applications_count: count || 0 };
        })
      );

      setJobs(jobsWithCounts);

      // Fetch recent applicants
      const { data: applicantsData } = await supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          seeker:job_seeker_profiles(full_name),
          job:jobs!inner(title, employer_id)
        `)
        .eq("job.employer_id", profile?.id)
        .order("applied_at", { ascending: false })
        .limit(5);

      setRecentApplicants((applicantsData as any) || []);

      // Calculate stats
      const activeJobs = jobsWithCounts.filter((j) => j.status === "active").length;
      const totalApplicants = jobsWithCounts.reduce((sum, j) => sum + j.applications_count, 0);

      // Get shortlisted and hired counts
      const { count: shortlistedCount } = await supabase
        .from("job_applications")
        .select("*, job:jobs!inner(employer_id)", { count: "exact", head: true })
        .eq("status", "shortlisted")
        .eq("job.employer_id", profile?.id);

      const { count: hiredCount } = await supabase
        .from("job_applications")
        .select("*, job:jobs!inner(employer_id)", { count: "exact", head: true })
        .eq("status", "hired")
        .eq("job.employer_id", profile?.id);

      setStats({
        activeJobs,
        totalApplicants,
        shortlisted: shortlistedCount || 0,
        hired: hiredCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-secondary text-secondary-foreground";
      case "closed":
        return "bg-red-100 text-red-700";
      case "filled":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-2xl bg-secondary animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-elevated p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {employerProfile?.company_name
                ? `Welcome, ${employerProfile.company_name}!`
                : "Welcome to your dashboard!"}
              {employerProfile?.is_verified && (
                <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-success text-success-foreground">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">
              Manage your job postings and find the perfect candidates
            </p>
          </div>
          <Button variant="accent" asChild>
            <Link to="/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeJobs}</p>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalApplicants}</p>
              <p className="text-xs text-muted-foreground">Applicants</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.shortlisted}</p>
              <p className="text-xs text-muted-foreground">Shortlisted</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.hired}</p>
              <p className="text-xs text-muted-foreground">Hired</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Jobs</h2>
            <Link to="/my-jobs" className="text-accent text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="card-elevated divide-y divide-border">
            {jobs.length > 0 ? (
              jobs.slice(0, 5).map((job) => (
                <Link
                  key={job.id}
                  to={`/my-jobs/${job.id}`}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{job.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        {job.applications_count}
                      </p>
                      <p className="text-xs text-muted-foreground">applicants</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                <Button variant="accent" asChild>
                  <Link to="/post-job">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Applicants</h2>
            <Link to="/applicants" className="text-accent text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="card-elevated divide-y divide-border">
            {recentApplicants.length > 0 ? (
              recentApplicants.map((app) => (
                <div key={app.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-accent">
                        {app.seeker?.full_name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {app.seeker?.full_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Applied for {app.job?.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        app.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : app.status === "shortlisted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No applicants yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
