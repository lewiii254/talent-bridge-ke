import { 
  Code, 
  Wrench, 
  Palette, 
  Building2, 
  Camera, 
  Truck, 
  Scissors, 
  ChefHat,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "tech",
    title: "Tech & Digital",
    description: "Developers, designers, data analysts, marketers",
    icon: Code,
    jobCount: 2840,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "trades",
    title: "Skilled Trades",
    description: "Plumbers, electricians, mechanics, carpenters",
    icon: Wrench,
    jobCount: 1520,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "creative",
    title: "Creative & Media",
    description: "Photographers, videographers, content creators",
    icon: Camera,
    jobCount: 980,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "design",
    title: "Design & Art",
    description: "Graphic designers, UI/UX, interior design",
    icon: Palette,
    jobCount: 1230,
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    id: "sme",
    title: "SME Roles",
    description: "Sales, admin, customer service, accounting",
    icon: Building2,
    jobCount: 3100,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    id: "hospitality",
    title: "Hospitality",
    description: "Chefs, servers, hotel staff, catering",
    icon: ChefHat,
    jobCount: 890,
    color: "bg-red-500/10 text-red-600",
  },
  {
    id: "fashion",
    title: "Fashion & Tailoring",
    description: "Tailors, fashion designers, stylists",
    icon: Scissors,
    jobCount: 640,
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    id: "logistics",
    title: "Logistics & Delivery",
    description: "Drivers, riders, warehouse, dispatch",
    icon: Truck,
    jobCount: 1780,
    color: "bg-cyan-500/10 text-cyan-600",
  },
];

const CategoriesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-tight">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore by <span className="text-accent">Skill Category</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From tech to trades, find opportunities that match your expertise
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/jobs?category=${category.id}`}
              className="group card-elevated p-6 hover:border-accent/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-accent">
                  {category.jobCount.toLocaleString()} jobs
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
