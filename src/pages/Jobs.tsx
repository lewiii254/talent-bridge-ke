import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, X, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import { cn } from "@/lib/utils";

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
    company_name: string | null;
    is_verified: boolean;
  };
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
}

const jobTypes = [
  { value: "all", label: "All Types" },
  { value: "full_time", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "gig", label: "Gig" },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [jobTypeFilter, setJobTypeFilter] = useState(searchParams.get("type") || "all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [jobTypeFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
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
          employer:employer_profiles(company_name, is_verified),
          skills:job_skills(skill:skills(id, name))
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (jobTypeFilter !== "all" && (jobTypeFilter === "full_time" || jobTypeFilter === "contract" || jobTypeFilter === "gig")) {
        query = query.eq("job_type", jobTypeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs((data as any) || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update search params
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (locationFilter) params.set("location", locationFilter);
    if (jobTypeFilter !== "all") params.set("type", jobTypeFilter);
    setSearchParams(params);

    // Filter jobs client-side for now
    // In production, you'd want to do this server-side
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) =>
        s.skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesLocation =
      !locationFilter ||
      job.is_remote ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Search Header */}
        <div className="bg-primary py-12">
          <div className="container-tight">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
              Find Your Next Opportunity
            </h1>

            <form onSubmit={handleSearch}>
              <div className="bg-primary-foreground rounded-2xl p-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by skill, job title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-0 bg-secondary/50"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-0 bg-secondary/50"
                    />
                  </div>
                  <Button type="submit" variant="accent" className="h-12 px-8">
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="container-tight py-8">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-muted-foreground">
              {filteredJobs.length} jobs found
            </span>

            <div className="flex-1" />

            {/* Job Type Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {jobTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setJobTypeFilter(type.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    jobTypeFilter === type.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("");
                  setJobTypeFilter("all");
                  setSearchParams({});
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
