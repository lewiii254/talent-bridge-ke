import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  User,
  MapPin,
  Camera,
  Plus,
  X,
  Link as LinkIcon,
  Image,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SkillSelector from "@/components/onboarding/SkillSelector";

interface JobSeekerProfile {
  full_name: string | null;
  location: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  availability: string | null;
	profile_completion: number | null;
  work_samples: { type: string; url: string; title: string }[];
}

const Profile = () => {
  const { profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);

  const [seekerProfile, setSeekerProfile] = useState<JobSeekerProfile | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("available");
  const [workSamples, setWorkSamples] = useState<{ type: string; url: string; title: string }[]>([]);
  const [newSampleUrl, setNewSampleUrl] = useState("");
  const [newSampleTitle, setNewSampleTitle] = useState("");

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "job_seeker")) {
      navigate("/dashboard");
    }
  }, [authLoading, profile, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchProfile();
    }
  }, [profile?.id]);

  const fetchProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from("job_seeker_profiles")
        .select("*")
        .eq("id", profile?.id)
        .maybeSingle();

      if (profileData) {
        setSeekerProfile(profileData as any);
        setFullName(profileData.full_name || "");
        setLocation(profileData.location || "");
        setBio(profileData.bio || "");
        setAvailability(profileData.availability || "available");
        setWorkSamples((profileData.work_samples as any) || []);
      }

      // Fetch skills
      const { data: skillsData } = await supabase
        .from("job_seeker_skills")
        .select("skill_id")
        .eq("seeker_id", profile?.id);

      if (skillsData) {
        setSelectedSkills(skillsData.map((s) => s.skill_id));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await supabase
        .from("job_seeker_profiles")
        .update({ profile_photo_url: publicUrl })
        .eq("id", profile?.id);

      setSeekerProfile((prev) => prev ? { ...prev, profile_photo_url: publicUrl } : null);
      toast({ title: "Photo updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addWorkSample = () => {
    if (!newSampleUrl || !newSampleTitle) return;

    const type = newSampleUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" : "link";
    setWorkSamples([...workSamples, { type, url: newSampleUrl, title: newSampleTitle }]);
    setNewSampleUrl("");
    setNewSampleTitle("");
  };

  const removeWorkSample = (index: number) => {
    setWorkSamples(workSamples.filter((_, i) => i !== index));
  };

  const calculateCompletion = () => {
    let score = 0;
    if (fullName) score += 20;
    if (location) score += 15;
    if (bio) score += 20;
    if (selectedSkills.length > 0) score += 25;
    if (workSamples.length > 0) score += 10;
    if (seekerProfile?.profile_photo_url) score += 10;
    return Math.min(score, 100);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
			const completion = calculateCompletion();

      // Update profile
      const { error: profileError } = await supabase
        .from("job_seeker_profiles")
        .update({
          full_name: fullName,
          location,
          bio,
          availability,
          work_samples: workSamples,
					profile_completion: completion,
        })
        .eq("id", profile?.id);

      if (profileError) throw profileError;

      // Update skills - delete existing and insert new
      await supabase.from("job_seeker_skills").delete().eq("seeker_id", profile?.id);

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
      toast({ title: "Profile saved!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

	const completion = calculateCompletion();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Complete your profile to get more job matches
          </p>
        </div>

				{/* Completion Progress */}
				<div className="card-elevated p-6">
					<div className="flex items-center justify-between mb-3">
						<span className="font-medium text-foreground">Profile Completion</span>
						<span className="text-lg font-bold text-accent">{completion}%</span>
					</div>
					<Progress value={completion} className="h-3" />
					{completion === 100 && (
						<div className="flex items-center gap-2 mt-3 text-green-600">
							<CheckCircle2 className="w-4 h-4" />
							<span className="text-sm font-medium">Your profile is complete!</span>
						</div>
					)}
				</div>

        {/* Photo Upload */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                {seekerProfile?.profile_photo_url ? (
                  <img
                    src={seekerProfile.profile_photo_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90"
              >
                {uploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">Upload a photo</p>
              <p className="text-sm text-muted-foreground">
                A professional photo helps you stand out
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card-elevated p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell employers about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[120px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Availability</Label>
            <div className="flex gap-3">
              {["available", "busy", "not_looking"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAvailability(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    availability === status
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {status === "available" && "Available"}
                  {status === "busy" && "Busy"}
                  {status === "not_looking" && "Not Looking"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Skills</h2>
          <SkillSelector
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            maxSkills={15}
          />
        </div>

        {/* Work Samples */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Work Samples</h2>
          <p className="text-sm text-muted-foreground">
            Add links to your portfolio, projects, or work samples
          </p>

          {/* Existing samples */}
          {workSamples.length > 0 && (
            <div className="space-y-2">
              {workSamples.map((sample, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  {sample.type === "image" ? (
                    <Image className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <LinkIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{sample.title}</p>
                    <a
                      href={sample.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline truncate block"
                    >
                      {sample.url}
                    </a>
                  </div>
                  <button
                    onClick={() => removeWorkSample(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new sample */}
          <div className="flex gap-3">
            <Input
              placeholder="Title"
              value={newSampleTitle}
              onChange={(e) => setNewSampleTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="URL"
              value={newSampleUrl}
              onChange={(e) => setNewSampleUrl(e.target.value)}
              className="flex-[2]"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addWorkSample}
              disabled={!newSampleUrl || !newSampleTitle}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full h-12" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
