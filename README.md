# KaziHub - Talent Bridge Kenya

<div align="center">
  
  ![KaziHub Logo](https://img.shields.io/badge/KaziHub-Skills_First_Job_Platform-blue?style=for-the-badge)
  
  **Connecting Skilled Talent with Real Opportunities Across Africa**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)
  
</div>

---

## 🌟 Overview

**KaziHub** (Talent Bridge Kenya) is a revolutionary skills-first job platform that transforms how employers and job seekers connect across Kenya and Africa. Unlike traditional CV-based hiring, KaziHub focuses on **what you can do**, not just where you studied or who you know.

### 🎯 Our Mission

To democratize access to work across Africa by building a platform that values skills, experience, and real capabilities over traditional credentials.

### ✨ Key Differentiators

- 🚫 **No CV Required** - Profile-based hiring with skills at the forefront
- ✅ **Verified Employers** - Protected job seekers from scams and fraud
- 🎨 **Multi-Industry Support** - From tech to trades, creative to corporate
- 📱 **Mobile-First** - Built for Africa's smartphone-first workforce
- 💰 **Free for Job Seekers** - Always free to browse and apply
- 🔐 **Enterprise Security** - Row-level security and encrypted data

---

## 🚀 Features

### For Job Seekers

- ✅ **Skills-Based Profiles** - Showcase your abilities with 32+ skill categories
- 🔍 **Smart Job Matching** - AI-powered recommendations based on your skills
- 📊 **Application Tracking** - Monitor your applications (pending, shortlisted, hired)
- 🎯 **Personalized Dashboard** - Track progress and recommended opportunities
- 💼 **Portfolio Integration** - Link work samples and projects
- 🔔 **Job Alerts** - Get notified of relevant opportunities
- 📱 **Direct Messaging** - Connect with employers instantly

### For Employers

- 📝 **Unlimited Job Postings** - Post full-time, contract, and gig opportunities
- 🎯 **Skill-Based Filtering** - Find candidates by specific skills
- ✅ **Company Verification** - Build trust with verified employer badge
- 📊 **Hiring Analytics** - Track applicants through your pipeline
- 👥 **Applicant Management** - Organize candidates (pending → shortlisted → hired)
- 💳 **Flexible Pricing** - Free trial, then scalable plans
- 🌟 **Featured Listings** - Boost visibility for urgent hires

### Platform Features

- 🔐 **Secure Authentication** - Supabase Auth with row-level security
- 🎨 **Modern UI/UX** - Built with shadcn/ui and Tailwind CSS
- 🌙 **Dark Mode Support** - Seamless theme switching
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🔒 **Data Privacy** - GDPR-compliant with transparent policies

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3 with TypeScript
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS + shadcn/ui component library
- **State Management:** React Context API + TanStack React Query
- **Routing:** React Router DOM v6
- **Form Handling:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner + Custom Toast

### Backend & Services
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **Real-time:** Supabase Real-time subscriptions
- **Storage:** Supabase Storage (for future file uploads)

### Development Tools
- **Linting:** ESLint with TypeScript support
- **Testing:** Vitest + Testing Library
- **Package Manager:** npm (Node.js 18+ recommended)

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/lewiii254/talent-bridge-ke.git
   cd talent-bridge-ke
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   - Create a new project at [Supabase](https://supabase.com)
   - Run the SQL migration files in `supabase/migrations/` in order
   - Seed the database with skills: `supabase/seed.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be running at `http://localhost:5173`

---

## 🔧 Environment Setup

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Optional Configuration

```env
# Optional: Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id

# Optional: Feature Flags
VITE_ENABLE_MESSAGING=true
VITE_ENABLE_PAYMENTS=false
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:5173` |
| `npm run build` | Build for production (output to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## 🗂️ Project Structure

```
talent-bridge-ke/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── jobs/           # Job listing components
│   │   ├── landing/        # Landing page sections
│   │   ├── layout/         # Header, Footer, etc.
│   │   ├── onboarding/     # Onboarding flow components
│   │   └── ui/             # shadcn/ui base components
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication state management
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Utility functions
│   ├── pages/              # Route pages
│   │   ├── Index.tsx       # Landing page
│   │   ├── Login.tsx       # Login page
│   │   ├── Signup.tsx      # Registration page
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── Jobs.tsx        # Job listings
│   │   ├── JobDetail.tsx   # Single job view
│   │   ├── PostJob.tsx     # Job posting form
│   │   ├── AboutUs.tsx     # About page
│   │   ├── Contact.tsx     # Contact page
│   │   ├── Pricing.tsx     # Pricing page
│   │   ├── Privacy.tsx     # Privacy policy
│   │   └── Terms.tsx       # Terms of service
│   ├── App.tsx             # Main app component with routes
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database schema migrations
│   └── seed.sql            # Seed data (skills, etc.)
├── .env                    # Environment variables (not in git)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # This file
```

---

## 🗄️ Database Schema

### Core Tables

1. **profiles** - User base information
2. **job_seeker_profiles** - Extended job seeker data
3. **employer_profiles** - Extended employer data
4. **jobs** - Job postings
5. **job_applications** - Application tracking
6. **skills** - Master skill list (32 skills across 8 categories)
7. **job_seeker_skills** - Many-to-many: users ↔ skills
8. **job_skills** - Many-to-many: jobs ↔ skills

### Security

- **Row-Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Employers can only edit their own job postings
- Helper functions: `is_job_seeker()`, `is_employer()`, `owns_job()`

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done)
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
   - Deploy!

3. **Custom Domain** (Optional)
   - Add your domain in Vercel settings
   - Update DNS records

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Other Platforms

KaziHub works on any static hosting platform:
- **Cloudflare Pages**
- **AWS Amplify**
- **GitHub Pages** (with router workaround)
- **DigitalOcean App Platform**

---

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

### Test Coverage

- ✅ Component unit tests
- ✅ Integration tests for authentication
- ✅ Form validation tests
- 🚧 E2E tests (coming soon)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Standards

- Follow existing code style (ESLint rules enforced)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Reporting Bugs

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)

---

## 📝 Roadmap

### Q1 2026
- [x] Core job posting and application system
- [x] Skills-based matching
- [x] Landing page with testimonials, FAQs, stats
- [x] About, Contact, Pricing, Privacy, Terms pages
- [ ] Profile editing and management
- [ ] Saved jobs/wishlist feature
- [ ] Email notifications system

### Q2 2026
- [ ] WhatsApp integration for messaging
- [ ] Payment system for employer plans
- [ ] Employer verification workflow
- [ ] Advanced search and filtering
- [ ] Work samples/portfolio uploads
- [ ] Admin dashboard for moderation

### Q3 2026
- [ ] Mobile app (React Native)
- [ ] Skill assessments and badges
- [ ] Video interviews integration
- [ ] AI-powered job matching
- [ ] Multilingual support (English, Swahili)

### Q4 2026
- [ ] Enterprise API for integrations
- [ ] Analytics dashboard for employers
- [ ] Referral program
- [ ] Expansion to Tanzania, Uganda

---

## 🔐 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email:
- **Email:** security@kazihub.co.ke
- **Do NOT** open a public issue for security vulnerabilities

### Security Measures

- ✅ HTTPS-only in production
- ✅ Row-level security on all database tables
- ✅ Encrypted authentication tokens
- ✅ Input validation with Zod schemas
- ✅ CSRF protection
- ✅ Regular dependency updates

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 KaziHub / Talent Bridge Kenya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Team

**KaziHub** is built and maintained by the Talent Bridge Kenya team.

- **Founder & Lead Developer:** [lewiii254](https://github.com/lewiii254)
- **Contributors:** See [GitHub Contributors](https://github.com/lewiii254/talent-bridge-ke/graphs/contributors)

---

## 📞 Contact & Support

### General Inquiries
- **Email:** hello@kazihub.co.ke
- **Support:** support@kazihub.co.ke
- **Phone:** +254 700 000 000

### Social Media
- **Website:** [kazihub.co.ke](https://kazihub.co.ke) *(coming soon)*
- **Twitter:** [@KaziHubKE](https://twitter.com/KaziHubKE) *(coming soon)*
- **LinkedIn:** [KaziHub](https://linkedin.com/company/kazihub) *(coming soon)*

### Office
KaziHub  
Nairobi, Kenya

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Vite](https://vitejs.dev) - Build tool
- [React](https://react.dev) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/lewiii254/talent-bridge-ke?style=social)
![GitHub forks](https://img.shields.io/github/forks/lewiii254/talent-bridge-ke?style=social)
![GitHub issues](https://img.shields.io/github/issues/lewiii254/talent-bridge-ke)
![GitHub pull requests](https://img.shields.io/github/issues-pr/lewiii254/talent-bridge-ke)

---

<div align="center">
  
  **Built with ❤️ in Kenya for Africa**
  
  [Get Started](https://kazihub.co.ke/signup) • [Documentation](#) • [Report Bug](https://github.com/lewiii254/talent-bridge-ke/issues) • [Request Feature](https://github.com/lewiii254/talent-bridge-ke/issues)
  
</div>
