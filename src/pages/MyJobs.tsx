import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Plus,
  Users,
  Clock,
  MapPin,
  Wifi,
  Edit,
  Trash2,
  Eye,
  Loader2,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface Job {
  id: string;
  title: string;
  status: string;
  job_type: string;
  location: string | null;
  is_remote: boolean;
  created_at: string;
  applications: {
    id: string;
    status: string;
    applied_at: string;
    seeker: {
      id: string;
      full_name: string | null;
      location: string | null;
      profile_photo_url: string | null;
      bio: string | null;
    };
  }[];
}

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
  skills?: { skill: { name: string } }[];
}

const MyJobs = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "employer")) {
      navigate("/dashboard");
    }
  }, [authLoading, profile, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchJobs();
    }
  }, [profile?.id]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          status,
          job_type,
          location,
          is_remote,
          created_at,
          applications:job_applications(
            id,
            status,
            applied_at,
            seeker:job_seeker_profiles(id, full_name, location, profile_photo_url, bio)
          )
        `)
        .eq("employer_id", profile?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs((data as any) || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId: string) => {
    setLoadingApplicants(true);
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          cover_note,
          seeker:job_seeker_profiles(id, full_name, location, profile_photo_url, bio)
        `)
        .eq("job_id", jobId)
        .order("applied_at", { ascending: false });

      if (error) throw error;

      // Fetch skills for each applicant
      const applicantsWithSkills = await Promise.all(
        (data || []).map(async (app: any) => {
          const { data: skillsData } = await supabase
            .from("job_seeker_skills")
            .select("skill:skills(name)")
            .eq("seeker_id", app.seeker?.id);
          return { ...app, skills: skillsData || [] };
        })
      );

      setApplicants(applicantsWithSkills);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const openApplicantDialog = (job: Job) => {
    setSelectedJob(job);
    setApplicantDialogOpen(true);
    fetchApplicants(job.id);
  };

  const updateApplicationStatus = async (applicationId: string, status: "pending" | "shortlisted" | "rejected" | "hired") => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;

      toast({ title: "Status updated!" });
      fetchApplicants(selectedJob!.id);
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateJobStatus = async (jobId: string, status: "active" | "closed" | "draft" | "filled") => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status })
        .eq("id", jobId);

      if (error) throw error;
      toast({ title: "Job status updated!" });
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) throw error;
      toast({ title: "Job deleted!" });
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job postings and applicants
            </p>
          </div>
          <Button asChild>
            <Link to="/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Link>
          </Button>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => {
              const pendingCount = job.applications?.filter((a) => a.status === "pending").length || 0;
              const totalApplicants = job.applications?.length || 0;

              return (
                <div key={job.id} className="card-elevated p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">
                          {job.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{job.job_type?.replace("_", " ")}</span>
                        {job.is_remote ? (
                          <span className="flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5" />
                            Remote
                          </span>
                        ) : (
                          job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location}
                            </span>
                          )
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={job.status}
                        onValueChange={(value: "active" | "closed" | "draft" | "filled") => updateJobStatus(job.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="filled">Filled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/jobs/${job.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteJob(job.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Applicants */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => openApplicantDialog(job)}
                      className="flex items-center justify-between w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {totalApplicants} Applicant{totalApplicants !== 1 && "s"}
                        </span>
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                            {pendingCount} pending
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No jobs posted yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Post your first job to start receiving applications
            </p>
            <Button asChild>
              <Link to="/post-job">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Link>
            </Button>
          </div>
        )}

        {/* Applicant Dialog */}
        <Dialog open={applicantDialogOpen} onOpenChange={setApplicantDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Review and manage applications for this position
              </DialogDescription>
            </DialogHeader>

            {loadingApplicants ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : applicants.length > 0 ? (
              <div className="space-y-4 mt-4">
                {applicants.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                        {app.seeker?.profile_photo_url ? (
                          <img
                            src={app.seeker.profile_photo_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">
                            {app.seeker?.full_name || "Anonymous"}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
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
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {app.seeker.location}
                          </p>
                        )}
                        {app.seeker?.bio && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {app.seeker.bio}
                          </p>
                        )}
                        {app.skills && app.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {app.skills.slice(0, 5).map((s, i) => (
                              <span key={i} className="badge-skill text-xs">
                                {s.skill?.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {app.cover_note && (
                          <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">
                              {app.cover_note}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant={app.status === "shortlisted" ? "default" : "outline"}
                            onClick={() => updateApplicationStatus(app.id, "shortlisted")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant={app.status === "hired" ? "default" : "outline"}
                            onClick={() => updateApplicationStatus(app.id, "hired")}
                          >
                            <Briefcase className="w-4 h-4 mr-1" />
                            Hire
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No applicants yet</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MyJobs;
