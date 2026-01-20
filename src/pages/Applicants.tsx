import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  MapPin,
  User,
  Loader2,
  CheckCircle2,
  XCircle,
  Briefcase,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface Applicant {
  id: string;
  status: string;
  applied_at: string;
  cover_note: string | null;
  seeker: {
    id: string;
    full_name: string | null;
    location: string | null;
    profile_photo_url: string | null;
    bio: string | null;
  };
  job: {
    id: string;
    title: string;
  };
}

const statusFilters = [
  { value: "all", label: "All Applicants" },
  { value: "pending", label: "Pending" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const Applicants = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "employer")) {
      navigate("/dashboard");
    }
  }, [authLoading, profile, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchApplicants();
      fetchJobs();
    }
  }, [profile?.id]);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("id, title")
      .eq("employer_id", profile?.id);
    setJobs(data || []);
  };

  const fetchApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          cover_note,
          seeker:job_seeker_profiles(id, full_name, location, profile_photo_url, bio),
          job:jobs!inner(id, title, employer_id)
        `)
        .eq("job.employer_id", profile?.id)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      setApplicants((data as any) || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: string, status: "pending" | "shortlisted" | "rejected" | "hired") => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;
      toast({ title: "Status updated!" });
      fetchApplicants();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.job?.id === jobFilter;
    return matchesStatus && matchesJob;
  });

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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Applicants</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage all job applications
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="ml-auto text-sm text-muted-foreground self-center">
            {filteredApplicants.length} applicant{filteredApplicants.length !== 1 && "s"}
          </span>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filteredApplicants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApplicants.map((app) => (
              <div key={app.id} className="card-elevated p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                    {app.seeker?.profile_photo_url ? (
                      <img
                        src={app.seeker.profile_photo_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {app.seeker?.full_name || "Anonymous"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Applied for {app.job?.title}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                          app.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : app.status === "shortlisted"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "hired"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {app.seeker?.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.seeker.location}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant={app.status === "shortlisted" ? "default" : "outline"}
                        onClick={() => updateStatus(app.id, "shortlisted")}
                        className="flex-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Shortlist
                      </Button>
                      <Button
                        size="sm"
                        variant={app.status === "hired" ? "default" : "outline"}
                        onClick={() => updateStatus(app.id, "hired")}
                        className="flex-1"
                      >
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        Hire
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateStatus(app.id, "rejected")}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No applicants found
            </h3>
            <p className="text-muted-foreground">
              {statusFilter !== "all" || jobFilter !== "all"
                ? "Try adjusting your filters"
                : "Applicants will appear here when they apply to your jobs"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;
