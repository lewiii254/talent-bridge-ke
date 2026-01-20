import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Building2,
  MapPin,
  Globe,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface EmployerProfile {
  company_name: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  company_logo_url: string | null;
  is_verified: boolean | null;
}

const CompanyProfile = () => {
  const { profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "employer")) {
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
      const { data } = await supabase
        .from("employer_profiles")
        .select("*")
        .eq("id", profile?.id)
        .maybeSingle();

      if (data) {
        setEmployerProfile(data);
        setCompanyName(data.company_name || "");
        setLocation(data.location || "");
        setDescription(data.description || "");
        setWebsite(data.website || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile?.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await supabase
        .from("employer_profiles")
        .update({ company_logo_url: publicUrl })
        .eq("id", profile?.id);

      setEmployerProfile((prev) => prev ? { ...prev, company_logo_url: publicUrl } : null);
      toast({ title: "Logo updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("employer_profiles")
        .update({
          company_name: companyName,
          location,
          description,
          website,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      await refreshProfile();
      toast({ title: "Company profile saved!" });
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

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Company Profile</h1>
          <p className="text-muted-foreground mt-1">
            A complete profile helps attract top talent
          </p>
        </div>

        {/* Verification Status */}
        {employerProfile?.is_verified && (
          <div className="card-elevated p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Verified Employer</p>
                <p className="text-sm text-green-700">
                  Your company has been verified by KaziHub
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logo Upload */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Company Logo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                {employerProfile?.company_logo_url ? (
                  <img
                    src={employerProfile.company_logo_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90"
              >
                {uploadingLogo ? (
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
                onChange={handleLogoUpload}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">Upload company logo</p>
              <p className="text-sm text-muted-foreground">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="card-elevated p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Company Information</h2>

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

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
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
            <Label htmlFor="description">About Your Company</Label>
            <Textarea
              id="description"
              placeholder="Tell job seekers about your company, culture, and values..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] rounded-xl resize-none"
            />
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
            "Save Company Profile"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
