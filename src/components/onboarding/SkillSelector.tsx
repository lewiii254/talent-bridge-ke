import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

interface SkillSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  maxSkills?: number;
}

const SkillSelector = ({
  selectedSkills,
  onSkillsChange,
  maxSkills = 10,
}: SkillSelectorProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data) {
      setSkills(data);
    }
    setLoading(false);
  };

  const categories = ["all", ...new Set(skills.map((s) => s.category).filter(Boolean))];

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const toggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      onSkillsChange(selectedSkills.filter((id) => id !== skillId));
    } else if (selectedSkills.length < maxSkills) {
      onSkillsChange([...selectedSkills, skillId]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-full bg-secondary animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category as string)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category === "all" ? "All Skills" : category}
          </button>
        ))}
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <span className="text-sm text-muted-foreground w-full mb-1">
            Selected ({selectedSkills.length}/{maxSkills}):
          </span>
          {selectedSkills.map((skillId) => {
            const skill = skills.find((s) => s.id === skillId);
            return (
              <button
                key={skillId}
                type="button"
                onClick={() => toggleSkill(skillId)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                {skill?.name}
                <X className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      )}

      {/* Skills Grid */}
      <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggleSkill(skill.id)}
              disabled={!isSelected && selectedSkills.length >= maxSkills}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                !isSelected && selectedSkills.length >= maxSkills && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              {skill.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SkillSelector;
