import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase, Mail, Lock, Phone, Loader2, Eye, EyeOff, User, Building2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type UserRole = "job_seeker" | "employer";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole | null;

  const [step, setStep] = useState<"role" | "details">(initialRole ? "details" : "role");
  const [role, setRole] = useState<UserRole>(initialRole || "job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, role, phone);

    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Account created!",
      description: "Welcome to KaziHub. Let's set up your profile.",
    });

    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Kazi<span className="text-accent">Hub</span>
              </span>
            </Link>

            {step === "role" ? (
              <>
                <h1 className="text-3xl font-bold text-foreground">Join KaziHub</h1>
                <p className="mt-2 text-muted-foreground">
                  Select how you want to use KaziHub
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
                <p className="mt-2 text-muted-foreground">
                  {role === "job_seeker" 
                    ? "Find your next opportunity" 
                    : "Start hiring talented professionals"}
                </p>
              </>
            )}
          </div>

          {step === "role" ? (
            <div className="space-y-4">
              {/* Job Seeker Option */}
              <button
                onClick={() => handleRoleSelect("job_seeker")}
                className="w-full p-6 rounded-2xl border-2 border-border hover:border-accent bg-card text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <User className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      I'm looking for work
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Browse jobs, showcase your skills, and connect with employers
                    </p>
                  </div>
                </div>
              </button>

              {/* Employer Option */}
              <button
                onClick={() => handleRoleSelect("employer")}
                className="w-full p-6 rounded-2xl border-2 border-border hover:border-accent bg-card text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Building2 className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      I'm hiring
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Post jobs, find skilled talent, and grow your team
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role indicator */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  role === "job_seeker" ? "bg-accent/20" : "bg-accent/20"
                )}>
                  {role === "job_seeker" ? (
                    <User className="w-4 h-4 text-accent" />
                  ) : (
                    <Building2 className="w-4 h-4 text-accent" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {role === "job_seeker" ? "Job Seeker Account" : "Employer Account"}
                </span>
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="ml-auto text-sm text-accent hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number (optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          )}

          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Why join KaziHub?
          </h2>
          <ul className="space-y-4">
            {[
              "Skills-first hiring — no CV required",
              "Verified employers you can trust",
              "Direct WhatsApp messaging",
              "Free for job seekers",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-primary-foreground/90">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;
