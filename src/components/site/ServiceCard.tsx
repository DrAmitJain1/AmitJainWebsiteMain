import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { ServiceIcon } from "./ServiceIcon";
import type { Service } from "@/lib/data";

const getCategory = (slug: string) => {
  if (["prp-therapy", "hair-fall-treatment"].includes(slug)) return "Trichology";
  if (["anti-aging-treatment", "cosmetology-procedures"].includes(slug)) return "Cosmetology";
  if (["nail-disorders", "skin-allergy-treatment"].includes(slug)) return "Medical Care";
  return "Dermatology";
};

export function ServiceCard({ service }: { service: Service }) {
  const cat = getCategory(service.slug);
  
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/10 bg-white/80 backdrop-blur-md p-6 md:p-7 shadow-xs hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/25"
    >
      {/* Decorative luxury gradient glow at the top-right */}
      <div className="absolute -right-16 -top-16 -z-10 h-32 w-32 rounded-full bg-brand-frost/30 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/10" />
      <div className="absolute -left-16 -bottom-16 -z-10 h-32 w-32 rounded-full bg-brand-mint/20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-secondary/30" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/80 text-primary transition-all duration-500 group-hover:scale-105 group-hover:bg-primary group-hover:text-white shadow-xs ring-4 ring-secondary/30">
            <ServiceIcon name={service.icon} className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/10 bg-secondary/40 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-primary shadow-2xs">
            <Sparkles className="h-2.5 w-2.5 text-primary/75" />
            {cat}
          </span>
        </div>
        
        <h3 className="text-lg font-extrabold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
          {service.title}
        </h3>
        
        <p className="mt-2.5 text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
          {service.short}
        </p>

        {/* Quick bullet points of targeted symptoms/concerns */}
        {service.symptoms && service.symptoms.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/30">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60 block mb-1.5">Target Concerns:</span>
            <ul className="space-y-1">
              {service.symptoms.slice(0, 2).map((symptom, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold truncate">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-3.5">
        <span className="text-xs font-extrabold text-muted-foreground transition-all duration-300 group-hover:text-primary">
          Explore Treatment
        </span>
        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white shadow-2xs">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}