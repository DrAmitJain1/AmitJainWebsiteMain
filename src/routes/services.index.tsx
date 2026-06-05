import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, Stethoscope, Scissors, Activity, Image as ImageIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { getServices } from "@/lib/firebaseServices";
import { services as fallbackServices } from "@/lib/data";
import { cn } from "@/lib/utils";

const getCategory = (slug: string) => {
  if (["prp-therapy", "hair-fall-treatment"].includes(slug)) return "Trichology";
  if (["anti-aging-treatment", "cosmetology-procedures"].includes(slug)) return "Cosmetology";
  if (["nail-disorders", "skin-allergy-treatment"].includes(slug)) return "Medical Care";
  return "Dermatology";
};

const displayCategories = ["Dermatology", "Cosmetology", "Trichology", "Medical Care"];

const categoryMeta: Record<string, { icon: any; color: string }> = {
  All: { icon: Sparkles, color: "text-primary" },
  Dermatology: { icon: Stethoscope, color: "text-blue-500" },
  Cosmetology: { icon: Sparkles, color: "text-purple-500" },
  Trichology: { icon: Scissors, color: "text-amber-500" },
  "Medical Care": { icon: Activity, color: "text-emerald-500" },
};

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services | Dr Jain's Skin Care Clinic, Pune" },
      { name: "description", content: "Acne, pigmentation, PRP, hair fall, peels, anti-aging, scars and more. Dermatology and cosmetology services in Katraj, Pune." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const [servicesList, setServicesList] = useState(fallbackServices);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getServices().then(setServicesList);
  }, []);

  // Compute counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: servicesList.length };
    for (const s of servicesList) {
      const cat = getCategory(s.slug);
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [servicesList]);

  // Filter and search services list
  const filteredServices = useMemo(() => {
    return servicesList.filter((s) => {
      const cat = getCategory(s.slug);
      const matchesCategory = filter === "All" || cat === filter;
      const matchesSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.short.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.overview || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [servicesList, filter, searchQuery]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our services"
        title={<>Complete <span className="text-gradient">skin, hair & cosmetology</span> care</>}
        description="A modern dermatology suite — every treatment delivered by Dr. Amit Jain himself."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />
      <section className="relative isolate overflow-hidden mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/15 via-brand-frost/20 to-transparent -z-10 bg-dot-pattern opacity-60" />

        {/* Search and Category Filter Header */}
        <div className="mb-10 flex flex-col md:flex-row gap-5 items-center justify-between bg-white/70 backdrop-blur-md border border-primary/10 p-5 rounded-3xl shadow-xs">
          
          {/* Glassmorphic Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["All", ...displayCategories].map((cat) => {
              const Icon = categoryMeta[cat]?.icon || Sparkles;
              const isSelected = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 inline-flex items-center gap-1.5 shadow-2xs border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary scale-102"
                      : "bg-white/80 text-muted-foreground border-primary/10 hover:bg-secondary/40 hover:text-primary hover:border-primary/20"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-white" : categoryMeta[cat]?.color)} />
                  {cat}
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-md font-bold ml-1",
                    isSelected ? "bg-white/25 text-white" : "bg-secondary text-muted-foreground"
                  )}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
            <input
              type="text"
              placeholder="Search treatments or concerns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 text-xs md:text-sm bg-white border border-primary/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold bg-secondary/80 rounded-full h-5 w-5 flex items-center justify-center">✕</button>
            )}
          </div>
        </div>

        {/* Search Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20 bg-white/40 border border-dashed rounded-3xl p-6">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h4 className="text-base font-bold text-foreground">No services found</h4>
            <p className="text-xs text-muted-foreground mt-1">Try matching standard conditions (e.g. acne, hair loss, laser, chemical peel).</p>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-down">
          {filteredServices.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}