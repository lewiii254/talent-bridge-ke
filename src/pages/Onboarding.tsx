import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Building2, User, ArrowRight, Check, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SkillSelector from "@/components/onboarding/SkillSelector";

const Onboarding = () => {
  const { profile, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Job Seeker fields
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Employer fields
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!loading && !profile) {
      navigate("/login");
    }
  }, [loading, profile, navigate]);

  const handleJobSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update job seeker profile
      const { error: profileError } = await supabase
        .from("job_seeker_profiles")
        .update({
          full_name: fullName,
          location,
          bio,
          profile_completion: 40,
        })
        .eq("id", profile?.id);

      if (profileError) throw profileError;

      // Add skills
      if (selectedSkills.length > 0) {
        const skillInserts = selectedSkills.map((skillId) => ({
          seeker_id: profile?.id,
          skill_id: skillId,
        }));

        const { error: skillError } = await supabase
          .from("job_seeker_skills")
          .insert(skillInserts);

        if (skillError) throw skillError;
      }

      await refreshProfile();

      toast({
        title: "Profile created!",
        description: "Your profile is ready. Start exploring jobs!",
      });

      navigate("/dashboard");
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

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("employer_profiles")
        .update({
          company_name: companyName,
          location: companyLocation,
          description: companyDescription,
          website,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: "Company profile created!",
        description: "You're ready to start posting jobs.",
      });

      navigate("/dashboard");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const isJobSeeker = profile?.role === "job_seeker";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            isJobSeeker ? "bg-accent/10" : "bg-primary/10"
          }`}>
            {isJobSeeker ? (
              <User className="w-8 h-8 text-accent" />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isJobSeeker ? "Complete your profile" : "Set up your company"}
          </h1>
          <p className="text-muted-foreground">
            {isJobSeeker
              ? "Tell employers about yourself and your skills"
              : "Add your company details to start hiring"}
          </p>
        </div>

        {/* Form */}
        <div className="card-elevated p-8">
          {isJobSeeker ? (
            <form onSubmit={handleJobSeekerSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Nairobi, Kenya"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] rounded-xl resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Your Skills</Label>
                <SkillSelector
                  selectedSkills={selectedSkills}
                  onSkillsChange={setSelectedSkills}
                />
              </div>

              <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleEmployerSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLocation">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="companyLocation"
                    placeholder="e.g., Nairobi, Kenya"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">About Your Company</Label>
                <Textarea
                  id="companyDescription"
                  placeholder="Tell job seekers about your company, culture, and what makes you a great place to work..."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="min-h-[100px] rounded-xl resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Skip option */}
        <p className="text-center mt-6 text-muted-foreground">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-accent hover:underline"
          >
            Skip for now
          </button>
          {" "}— you can complete this later
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
