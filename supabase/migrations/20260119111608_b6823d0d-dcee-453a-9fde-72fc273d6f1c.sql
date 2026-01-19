-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('job_seeker', 'employer');

-- Create enum for job types
CREATE TYPE public.job_type AS ENUM ('gig', 'contract', 'full_time');

-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('draft', 'active', 'closed', 'filled');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'shortlisted', 'rejected', 'hired');

-- Create profiles table (base for all users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create job seeker profiles table
CREATE TABLE public.job_seeker_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT,
  location TEXT,
  bio TEXT,
  availability TEXT DEFAULT 'available',
  profile_photo_url TEXT,
  work_samples JSONB DEFAULT '[]'::jsonb,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create employer profiles table
CREATE TABLE public.employer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  company_logo_url TEXT,
  location TEXT,
  description TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create job seeker skills (many-to-many)
CREATE TABLE public.job_seeker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  UNIQUE(seeker_id, skill_id)
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  job_type job_type NOT NULL DEFAULT 'full_time',
  budget_min INTEGER,
  budget_max INTEGER,
  budget_period TEXT DEFAULT 'month',
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  status job_status NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create job skills (many-to-many)
CREATE TABLE public.job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  UNIQUE(job_id, skill_id)
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  seeker_id UUID NOT NULL REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
  cover_note TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, seeker_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is a job seeker
CREATE OR REPLACE FUNCTION public.is_job_seeker(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'job_seeker'
  )
$$;

-- Helper function to check if user is an employer
CREATE OR REPLACE FUNCTION public.is_employer(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'employer'
  )
$$;

-- Helper function to check if user owns a job
CREATE OR REPLACE FUNCTION public.owns_job(job_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jobs
    WHERE id = job_id AND employer_id = auth.uid()
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- RLS Policies for job_seeker_profiles
CREATE POLICY "Anyone can view job seeker profiles" ON public.job_seeker_profiles
  FOR SELECT USING (true);

CREATE POLICY "Job seekers can insert own profile" ON public.job_seeker_profiles
  FOR INSERT WITH CHECK (id = auth.uid() AND public.is_job_seeker(auth.uid()));

CREATE POLICY "Job seekers can update own profile" ON public.job_seeker_profiles
  FOR UPDATE USING (id = auth.uid() AND public.is_job_seeker(auth.uid()));

-- RLS Policies for employer_profiles
CREATE POLICY "Anyone can view employer profiles" ON public.employer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Employers can insert own profile" ON public.employer_profiles
  FOR INSERT WITH CHECK (id = auth.uid() AND public.is_employer(auth.uid()));

CREATE POLICY "Employers can update own profile" ON public.employer_profiles
  FOR UPDATE USING (id = auth.uid() AND public.is_employer(auth.uid()));

-- RLS Policies for skills (public read, admin insert)
CREATE POLICY "Anyone can view skills" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert skills" ON public.skills
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for job_seeker_skills
CREATE POLICY "Anyone can view job seeker skills" ON public.job_seeker_skills
  FOR SELECT USING (true);

CREATE POLICY "Job seekers can manage own skills" ON public.job_seeker_skills
  FOR INSERT WITH CHECK (seeker_id = auth.uid() AND public.is_job_seeker(auth.uid()));

CREATE POLICY "Job seekers can delete own skills" ON public.job_seeker_skills
  FOR DELETE USING (seeker_id = auth.uid() AND public.is_job_seeker(auth.uid()));

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'active' OR employer_id = auth.uid());

CREATE POLICY "Employers can insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (employer_id = auth.uid() AND public.is_employer(auth.uid()));

CREATE POLICY "Employers can update own jobs" ON public.jobs
  FOR UPDATE USING (employer_id = auth.uid());

CREATE POLICY "Employers can delete own jobs" ON public.jobs
  FOR DELETE USING (employer_id = auth.uid());

-- RLS Policies for job_skills
CREATE POLICY "Anyone can view job skills" ON public.job_skills
  FOR SELECT USING (true);

CREATE POLICY "Employers can manage job skills" ON public.job_skills
  FOR INSERT WITH CHECK (public.owns_job(job_id));

CREATE POLICY "Employers can delete job skills" ON public.job_skills
  FOR DELETE USING (public.owns_job(job_id));

-- RLS Policies for job_applications
CREATE POLICY "Job seekers can view own applications" ON public.job_applications
  FOR SELECT USING (
    seeker_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND employer_id = auth.uid())
  );

CREATE POLICY "Job seekers can apply to jobs" ON public.job_applications
  FOR INSERT WITH CHECK (seeker_id = auth.uid() AND public.is_job_seeker(auth.uid()));

CREATE POLICY "Employers can update application status" ON public.job_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND employer_id = auth.uid())
  );

CREATE POLICY "Job seekers can withdraw applications" ON public.job_applications
  FOR DELETE USING (seeker_id = auth.uid() AND status = 'pending');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON public.job_seeker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed skills
INSERT INTO public.skills (name, category) VALUES
  ('React', 'Tech & Digital'),
  ('TypeScript', 'Tech & Digital'),
  ('Node.js', 'Tech & Digital'),
  ('Python', 'Tech & Digital'),
  ('UI/UX Design', 'Tech & Digital'),
  ('Data Analysis', 'Tech & Digital'),
  ('Digital Marketing', 'Tech & Digital'),
  ('SEO', 'Tech & Digital'),
  ('Electrical Wiring', 'Skilled Trades'),
  ('Plumbing', 'Skilled Trades'),
  ('Carpentry', 'Skilled Trades'),
  ('Auto Mechanics', 'Skilled Trades'),
  ('HVAC', 'Skilled Trades'),
  ('Welding', 'Skilled Trades'),
  ('Photography', 'Creative & Media'),
  ('Videography', 'Creative & Media'),
  ('Video Editing', 'Creative & Media'),
  ('Content Writing', 'Creative & Media'),
  ('Graphic Design', 'Design & Art'),
  ('Interior Design', 'Design & Art'),
  ('Fashion Design', 'Fashion & Tailoring'),
  ('Tailoring', 'Fashion & Tailoring'),
  ('Sales', 'SME Roles'),
  ('Customer Service', 'SME Roles'),
  ('Accounting', 'SME Roles'),
  ('Administration', 'SME Roles'),
  ('Cooking', 'Hospitality'),
  ('Catering', 'Hospitality'),
  ('Hotel Management', 'Hospitality'),
  ('Delivery', 'Logistics'),
  ('Driving', 'Logistics'),
  ('Warehouse Management', 'Logistics')
ON CONFLICT (name) DO NOTHING;