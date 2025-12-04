import { cn } from "@/lib/utils";
import { Building2, MessageCircle, Headphones, ShieldAlert, Users, LucideIcon } from "lucide-react";

export interface SubCategory {
  key: string;
  name: string;
  icon: LucideIcon;
}

export const subCategories: SubCategory[] = [
  { key: "brandProfile", name: "Brand Persona", icon: Building2 },
  { key: "communicationStyle", name: "Communication", icon: MessageCircle },
  { key: "supportEscalation", name: "Support", icon: Headphones },
  { key: "safetyCrisis", name: "Safety", icon: ShieldAlert },
  { key: "playerBehaviour", name: "Behaviour Controls", icon: Users },
];

interface SubCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  completedCategories: Set<string>;
}

export function SubCategoryTabs({ activeCategory, onCategoryChange, completedCategories }: SubCategoryTabsProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {subCategories.map((category) => {
            const isActive = activeCategory === category.key;
            const isCompleted = completedCategories.has(category.key);
            const Icon = category.icon;
            
            return (
              <button
                key={category.key}
                onClick={() => onCategoryChange(category.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap",
                  "hover:bg-secondary/80 group relative",
                  isActive && "bg-primary text-primary-foreground shadow-md hover:bg-primary"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors flex-shrink-0",
                  isActive ? "text-primary-foreground" : "text-foreground/70 group-hover:text-foreground"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}>
                  {category.name}
                </span>
                {isCompleted && !isActive && (
                  <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">
            {completedCategories.size}/{subCategories.length}
          </span>
        </div>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${(completedCategories.size / subCategories.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
