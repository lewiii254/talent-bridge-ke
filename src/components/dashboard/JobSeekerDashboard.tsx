import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";
import JobCard from "@/components/jobs/JobCard";

interface JobSeekerProfile {
  full_name: string | null;
  location: string | null;
  bio: string | null;
  profile_completion: number | null;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  job: {
    id: string;
    title: string;
    employer: {
      company_name: string | null;
    };
  };
}

interface Job {
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
}

const JobSeekerDashboard = () => {
  const { profile } = useAuth();
  const [seekerProfile, setSeekerProfile] = useState<JobSeekerProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile?.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch seeker profile
      const { data: profileData } = await supabase
        .from("job_seeker_profiles")
        .select("*")
        .eq("id", profile?.id)
        .maybeSingle();

      setSeekerProfile(profileData);

      // Fetch recent applications
      const { data: appsData } = await supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          job:jobs(
            id,
            title,
            employer:employer_profiles(company_name)
          )
        `)
        .eq("seeker_id", profile?.id)
        .order("applied_at", { ascending: false })
        .limit(5);

      setApplications((appsData as any) || []);

      // Fetch recommended jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          description,
          job_type,
          budget_min,
          budget_max,
          budget_period,
          location,
          is_remote,
          created_at,
          employer:employer_profiles(company_name, is_verified),
          skills:job_skills(skill:skills(id, name))
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6);

      setRecommendedJobs((jobsData as any) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = seekerProfile?.profile_completion || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "shortlisted":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "hired":
        return "bg-green-100 text-green-700";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-2xl bg-secondary animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-secondary animate-pulse lg:col-span-2" />
          <div className="h-64 rounded-2xl bg-secondary animate-pulse" />
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
              Welcome back{seekerProfile?.full_name ? `, ${seekerProfile.full_name}` : ""}! 👋
            </h1>
            <p className="text-muted-foreground">
              {profileCompletion < 100
                ? "Complete your profile to get more job matches"
                : "Your profile is complete. Browse jobs and apply!"}
            </p>
          </div>
          <Button variant="accent" asChild>
            <Link to="/jobs">
              Browse Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-accent">
                {profileCompletion}%
              </span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <Link
              to="/profile"
              className="inline-flex items-center gap-1 mt-3 text-sm text-accent hover:underline"
            >
              Complete your profile
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {applications.filter((a) => a.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {applications.filter((a) => a.status === "shortlisted").length}
              </p>
              <p className="text-sm text-muted-foreground">Shortlisted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
            <Link to="/jobs" className="text-accent text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {recommendedJobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {recommendedJobs.length === 0 && (
              <div className="card-elevated p-8 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Applications</h2>
            <Link to="/applications" className="text-accent text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="card-elevated divide-y divide-border">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="p-4">
                  <h4 className="font-medium text-foreground mb-1 line-clamp-1">
                    {app.job?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {app.job?.employer?.company_name || "Company"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        app.status
                      )}`}
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
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No applications yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/jobs">Start applying</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
