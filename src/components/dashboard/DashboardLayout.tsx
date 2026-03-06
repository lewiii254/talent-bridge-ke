import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import {
  Briefcase,
  LayoutDashboard,
  Search,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  Plus,
  Users,
  Building2,
  MessageCircle,
  Bookmark,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isJobSeeker = profile?.role === "job_seeker";

  const jobSeekerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Browse Jobs", icon: Search },
    { href: "/applications", label: "My Applications", icon: FileText },
    { href: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/profile", label: "My Profile", icon: User },
  ];

  const employerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-jobs", label: "My Jobs", icon: Briefcase },
    { href: "/applicants", label: "Applicants", icon: Users },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/company-profile", label: "Company Profile", icon: Building2 },
  ];

  const links = isJobSeeker ? jobSeekerLinks : employerLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Kazi<span className="text-accent">Hub</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          {/* Post Job button for employers */}
          {!isJobSeeker && (
            <Link
              to="/post-job"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </Link>
          )}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-border space-y-1">
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {profile?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile?.role?.replace("_", " ")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                {isJobSeeker ? (
                  <User className="w-5 h-5 text-accent" />
                ) : (
                  <Building2 className="w-5 h-5 text-accent" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
