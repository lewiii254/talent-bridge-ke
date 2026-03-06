import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Banknote,
  Clock,
  Building2,
  CheckCircle2,
  Wifi,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useSavedJobs } from "@/hooks/useSavedJobs";

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
    id: string;
    company_name: string | null;
    description: string | null;
    is_verified: boolean;
    location: string | null;
  };
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const { isSaved, toggleSave } = useSavedJobs();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const saved = job ? isSaved(job.id) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Job link copied to clipboard." });
  };

  const handleBookmark = () => {
    if (!job) return;
    const wasSaved = toggleSave({
      id: job.id,
      title: job.title,
      company_name: job.employer?.company_name ?? null,
      job_type: job.job_type,
      location: job.location,
      is_remote: job.is_remote,
      budget_min: job.budget_min,
      budget_max: job.budget_max,
      budget_period: job.budget_period,
      is_verified: job.employer?.is_verified ?? false,
      skills: job.skills?.map((s) => s.skill) ?? [],
      description: job.description,
      created_at: job.created_at,
    });
    toast({
      title: wasSaved ? "Job saved!" : "Job removed",
      description: wasSaved
        ? "Added to your saved jobs."
        : "Removed from your saved jobs.",
    });
  };

  useEffect(() => {
    if (id) {
      fetchJob();
      checkApplication();
    }
  }, [id, profile?.id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
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
          employer:employer_profiles(
            id,
            company_name,
            description,
            is_verified,
            location
          ),
          skills:job_skills(skill:skills(id, name))
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setJob(data as any);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplication = async () => {
    if (!profile?.id || !id) return;

    const { data } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", id)
      .eq("seeker_id", profile.id)
      .maybeSingle();

    setHasApplied(!!data);
  };

  const handleApply = async () => {
    if (!profile || profile.role !== "job_seeker") {
      toast({
        title: "Login required",
        description: "Please login as a job seeker to apply",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsApplying(true);

    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: id,
        seeker_id: profile.id,
        cover_note: coverNote || null,
      });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "The employer will review your profile.",
      });

      setHasApplied(true);
      setApplyDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const startConversation = async () => {
    if (!profile || !job?.employer?.id) return;

    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("job_seeker_id", profile.id)
        .eq("employer_id", job.employer.id)
        .eq("job_id", job.id)
        .maybeSingle();

      if (existing) {
        navigate(`/messages/${existing.id}`);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          job_seeker_id: profile.id,
          employer_id: job.employer.id,
          job_id: job.id,
        })
        .select()
        .single();

      if (error) throw error;
      navigate(`/messages/${newConv.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatBudget = () => {
    if (!job?.budget_min && !job?.budget_max) return null;

    const formatNum = (num: number) => num.toLocaleString();

    if (job.budget_min && job.budget_max) {
      return `KES ${formatNum(job.budget_min)} - ${formatNum(job.budget_max)} / ${
        job.budget_period || "month"
      }`;
    }
    if (job.budget_min) {
      return `From KES ${formatNum(job.budget_min)} / ${job.budget_period || "month"}`;
    }
    if (job.budget_max) {
      return `Up to KES ${formatNum(job.budget_max)} / ${job.budget_period || "month"}`;
    }
    return null;
  };

  const getJobTypeBadge = () => {
    switch (job?.job_type) {
      case "full_time":
        return { label: "Full-time", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
      case "contract":
        return { label: "Contract", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
      case "gig":
        return { label: "Gig", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" };
      default:
        return { label: job?.job_type, className: "bg-secondary text-secondary-foreground" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-tight py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Job not found</h1>
          <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
        </div>
      </div>
    );
  }

  const typeBadge = getJobTypeBadge();
  const budget = formatBudget();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container-tight py-8">
          {/* Back button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to jobs
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                aria-label={saved ? "Remove from saved" : "Save job"}
              >
                {saved ? (
                  <BookmarkCheck className="w-4 h-4 text-accent mr-1.5" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-1.5" />
                )}
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1.5" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="card-elevated p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {job.title}
                    </h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                      {job.employer?.company_name || "Company"}
                      {job.employer?.is_verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success text-success-foreground">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${typeBadge.className}`}
                  >
                    {typeBadge.label}
                  </span>
                  {(job.location || job.is_remote) && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                      {job.is_remote ? (
                        <>
                          <Wifi className="w-4 h-4" />
                          Remote
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </>
                      )}
                    </span>
                  )}
                  {budget && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                      <Banknote className="w-4 h-4" />
                      {budget}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((jobSkill) => (
                      <span
                        key={jobSkill.skill.id}
                        className="badge-skill"
                      >
                        {jobSkill.skill.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="card-elevated p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Job Description
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {job.description?.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="card-elevated p-6 sticky top-24">
                {profile?.role === "employer" ? (
                  <p className="text-center text-muted-foreground">
                    Switch to a job seeker account to apply
                  </p>
                ) : hasApplied ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                    <p className="font-medium text-foreground">Application Submitted</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      The employer will review your profile
                    </p>
                    <Link
                      to="/applications"
                      className="inline-block mt-4 text-accent hover:underline text-sm"
                    >
                      View your applications
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      className="w-full h-12"
                      onClick={() =>
                        profile ? setApplyDialogOpen(true) : navigate("/login")
                      }
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                    {profile?.role === "job_seeker" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={startConversation}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message Employer
                      </Button>
                    )}
                    <p className="text-center text-sm text-muted-foreground">
                      Quick apply with your KaziHub profile
                    </p>
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {job.employer?.company_name || "Company"}
                    </p>
                    {job.employer?.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.employer.location}
                      </p>
                    )}
                  </div>
                </div>
                {job.employer?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {job.employer.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Your profile will be shared with{" "}
              {job.employer?.company_name || "the employer"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cover Note (optional)
              </label>
              <Textarea
                placeholder="Introduce yourself and explain why you're a great fit..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Applying...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default JobDetail;
