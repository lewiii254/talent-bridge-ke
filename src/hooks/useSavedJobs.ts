import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kazihub_saved_jobs";

interface SavedJob {
  id: string;
  title: string;
  company_name: string | null;
  job_type: string;
  location: string | null;
  is_remote: boolean;
  budget_min: number | null;
  budget_max: number | null;
  budget_period: string | null;
  is_verified: boolean;
  skills: { id: string; name: string }[];
  description: string | null;
  created_at: string;
  saved_at: string;
}

export const useSavedJobs = () => {
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const jobs: SavedJob[] = JSON.parse(stored);
        setSavedJobs(jobs);
        setSavedJobIds(new Set(jobs.map((j) => j.id)));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveJob = useCallback((job: Omit<SavedJob, "saved_at">) => {
    setSavedJobs((prev) => {
      if (prev.find((j) => j.id === job.id)) return prev;
      const updated = [...prev, { ...job, saved_at: new Date().toISOString() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setSavedJobIds((prev) => new Set([...prev, job.id]));
  }, []);

  const unsaveJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => {
      const updated = prev.filter((j) => j.id !== jobId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      next.delete(jobId);
      return next;
    });
  }, []);

  const toggleSave = useCallback(
    (job: Omit<SavedJob, "saved_at">) => {
      if (savedJobIds.has(job.id)) {
        unsaveJob(job.id);
        return false;
      } else {
        saveJob(job);
        return true;
      }
    },
    [savedJobIds, saveJob, unsaveJob]
  );

  const isSaved = useCallback(
    (jobId: string) => savedJobIds.has(jobId),
    [savedJobIds]
  );

  return { savedJobs, savedJobIds, saveJob, unsaveJob, toggleSave, isSaved };
};
