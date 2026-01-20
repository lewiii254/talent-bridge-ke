import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  Shield,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  UserCheck,
  Building2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalUsers: number;
  totalJobSeekers: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

interface User {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  employer: { company_name: string | null };
  applications_count: number;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  seeker: { full_name: string | null };
  job: { title: string };
}

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!adminLoading && !authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const [
        { count: totalUsers },
        { count: totalJobSeekers },
        { count: totalEmployers },
        { count: totalJobs },
        { count: activeJobs },
        { count: totalApplications },
        { count: pendingApplications },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "job_seeker"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "employer"),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("job_applications").select("*", { count: "exact", head: true }),
        supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        totalJobSeekers: totalJobSeekers || 0,
        totalEmployers: totalEmployers || 0,
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        totalApplications: totalApplications || 0,
        pendingApplications: pendingApplications || 0,
      });

      // Fetch users
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setUsers(usersData || []);

      // Fetch jobs with counts
      const { data: jobsData } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          status,
          created_at,
          employer:employer_profiles(company_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from("job_applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);
          return { ...job, applications_count: count || 0 };
        })
      );
      setJobs(jobsWithCounts as any);

      // Fetch applications
      const { data: appsData } = await supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          seeker:job_seeker_profiles(full_name),
          job:jobs(title)
        `)
        .order("applied_at", { ascending: false })
        .limit(100);
      setApplications(appsData as any || []);

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, status: "active" | "closed" | "draft" | "filled") => {
    const { error } = await supabase
      .from("jobs")
      .update({ status })
      .eq("id", jobId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Job status updated" });
      fetchDashboardData();
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Job deleted" });
      fetchDashboardData();
    }
  };

  if (adminLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-destructive flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "users", label: "Users", icon: Users },
            { id: "jobs", label: "Jobs", icon: Briefcase },
            { id: "applications", label: "Applications", icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full ${
                activeTab === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Back to Site
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "jobs" && "Job Management"}
              {activeTab === "applications" && "Application Management"}
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your platform
            </p>
          </div>

          {activeTab !== "overview" && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && stats && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card-elevated p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-elevated p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalJobSeekers}</p>
                        <p className="text-sm text-muted-foreground">Job Seekers</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-elevated p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalEmployers}</p>
                        <p className="text-sm text-muted-foreground">Employers</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-elevated p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.activeJobs}</p>
                        <p className="text-sm text-muted-foreground">Active Jobs</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card-elevated p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Jobs</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalJobs}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <div className="card-elevated p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalApplications}</p>
                      </div>
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <div className="card-elevated p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Applications</p>
                        <p className="text-3xl font-bold text-foreground">{stats.pendingApplications}</p>
                      </div>
                      <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-elevated p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Recent Users</h3>
                    <div className="space-y-3">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                          <div>
                            <p className="font-medium text-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-elevated p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Recent Jobs</h3>
                    <div className="space-y-3">
                      {jobs.slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                          <div>
                            <p className="font-medium text-foreground">{job.title}</p>
                            <p className="text-xs text-muted-foreground">{job.employer?.company_name || "Unknown"}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            job.status === "active" ? "bg-green-100 text-green-700" : "bg-secondary text-secondary-foreground"
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="card-elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.phone || "-"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            user.role === "employer" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {user.role.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="card-elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.employer?.company_name || "Unknown"}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{job.applications_count}</TableCell>
                        <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteJob(job.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="card-elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.seeker?.full_name || "Anonymous"}</TableCell>
                        <TableCell>{app.job?.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            app.status === "pending" ? "bg-amber-100 text-amber-700" :
                            app.status === "shortlisted" ? "bg-blue-100 text-blue-700" :
                            app.status === "hired" ? "bg-green-100 text-green-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(app.applied_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
