import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "For Job Seekers",
    questions: [
      {
        question: "Is KaziHub really free for job seekers?",
        answer:
          "Yes! KaziHub is 100% free for job seekers. You can create a profile, browse jobs, apply to unlimited positions, and communicate with employers at no cost.",
      },
      {
        question: "Do I need a CV to apply for jobs?",
        answer:
          "No, you don't! KaziHub is skills-first. Simply fill out your profile with your skills, experience, and work samples. Employers can see your capabilities without a traditional CV.",
      },
      {
        question: "How do I increase my chances of getting hired?",
        answer:
          "Complete your profile 100%, add all relevant skills, upload work samples or portfolio links, keep your availability updated, and respond quickly to employer messages. Profiles with verified skills get 3x more views!",
      },
      {
        question: "What types of jobs are available?",
        answer:
          "We have full-time, contract, and gig opportunities across Tech, Trades, Creative, Design, SME, Hospitality, Fashion, Logistics, and more. From software developers to plumbers, designers to chefs!",
      },
    ],
  },
  {
    category: "For Employers",
    questions: [
      {
        question: "How much does it cost to post jobs?",
        answer:
          "We offer a free plan with limited job posts, and paid plans starting at KES 4,999/month for unlimited posts, featured listings, and advanced candidate filtering. Check our Pricing page for details.",
      },
      {
        question: "How do I get verified as an employer?",
        answer:
          "After signing up, submit your company registration documents through your dashboard. Our team reviews within 24-48 hours. Verified employers get a badge and 5x more applications!",
      },
      {
        question: "Can I contact candidates directly?",
        answer:
          "Yes! Once a candidate applies, you can message them directly through the platform or via WhatsApp (if they've opted in). Premium plans also allow you to reach out to candidates proactively.",
      },
      {
        question: "What makes KaziHub different from other job platforms?",
        answer:
          "KaziHub is skills-first, not CV-first. We verify employer legitimacy, support diverse job types (full-time/contract/gig), and focus on African talent. Plus, we're built for mobile-first users across Kenya and beyond.",
      },
    ],
  },
  {
    category: "General",
    questions: [
      {
        question: "Is my data secure on KaziHub?",
        answer:
          "Absolutely. We use industry-standard encryption, secure Supabase authentication, and never share your personal data with third parties without consent. Read our Privacy Policy for full details.",
      },
      {
        question: "Can I use KaziHub outside Kenya?",
        answer:
          "Yes! While we're based in Kenya, we welcome job seekers and employers from across Africa and beyond. Remote jobs are clearly marked, and many employers hire internationally.",
      },
      {
        question: "How do I report a fraudulent job or user?",
        answer:
          "Use the 'Report' button on any job listing or profile. Our moderation team investigates all reports within 24 hours. We have zero tolerance for scams and fraudulent activity.",
      },
    ],
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked{" "}
            <span className="text-accent">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about KaziHub
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {category.category}
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border rounded-lg px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="text-accent hover:underline font-medium"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
