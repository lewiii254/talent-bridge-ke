import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Briefcase, MapPin, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SkillSelector from "@/components/onboarding/SkillSelector";

const PostJob = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState<"full_time" | "contract" | "gig">("full_time");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState("month");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && profile?.role !== "employer") {
      navigate("/dashboard");
    }
  }, [authLoading, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create job
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .insert({
          employer_id: profile?.id,
          title,
          description,
          job_type: jobType,
          budget_min: budgetMin ? parseInt(budgetMin) : null,
          budget_max: budgetMax ? parseInt(budgetMax) : null,
          budget_period: budgetPeriod,
          location: isRemote ? null : location,
          is_remote: isRemote,
          status: "active",
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Add skills
      if (selectedSkills.length > 0 && job) {
        const skillInserts = selectedSkills.map((skillId) => ({
          job_id: job.id,
          skill_id: skillId,
        }));

        const { error: skillError } = await supabase
          .from("job_skills")
          .insert(skillInserts);

        if (skillError) throw skillError;
      }

      toast({
        title: "Job posted!",
        description: "Your job is now live and visible to job seekers.",
      });

      navigate("/my-jobs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Post a New Job</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to attract the right candidates
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card-elevated p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Job Details
            </h2>

            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px] rounded-xl resize-none"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Job Type *</Label>
              <RadioGroup
                value={jobType}
                onValueChange={(v) => setJobType(v as any)}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="full_time" id="full_time" className="peer sr-only" />
                  <Label
                    htmlFor="full_time"
                    className="px-4 py-2 rounded-xl border-2 border-border cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                  >
                    Full-time
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="contract" id="contract" className="peer sr-only" />
                  <Label
                    htmlFor="contract"
                    className="px-4 py-2 rounded-xl border-2 border-border cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                  >
                    Contract
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="gig" id="gig" className="peer sr-only" />
                  <Label
                    htmlFor="gig"
                    className="px-4 py-2 rounded-xl border-2 border-border cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                  >
                    Gig / One-time
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <SkillSelector
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
                maxSkills={8}
              />
            </div>
          </div>

          {/* Location */}
          <div className="card-elevated p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Location
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="remote">Remote Work</Label>
                <p className="text-sm text-muted-foreground">
                  This job can be done from anywhere
                </p>
              </div>
              <Switch
                id="remote"
                checked={isRemote}
                onCheckedChange={setIsRemote}
              />
            </div>

            {!isRemote && (
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Nairobi, Kenya"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 rounded-xl"
                  required={!isRemote}
                />
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="card-elevated p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Banknote className="w-5 h-5 text-accent" />
              Budget / Salary
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Minimum (KES)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="e.g., 50000"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Maximum (KES)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="e.g., 100000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Payment Period</Label>
              <RadioGroup
                value={budgetPeriod}
                onValueChange={setBudgetPeriod}
                className="flex flex-wrap gap-3"
              >
                {["hour", "day", "week", "month", "project"].map((period) => (
                  <div key={period} className="flex items-center">
                    <RadioGroupItem value={period} id={period} className="peer sr-only" />
                    <Label
                      htmlFor={period}
                      className="px-4 py-2 rounded-xl border-2 border-border cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 capitalize"
                    >
                      Per {period}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
