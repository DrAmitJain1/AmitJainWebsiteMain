import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  X,
  Stethoscope,
  Building2,
  Sparkles,
  ScanEye,
  Image,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { getGallery, getServices } from "@/lib/firebaseServices";
import { galleryImages as fallbackGallery } from "@/lib/data";
import { cn } from "@/lib/utils";

// Section metadata for each category
const sectionMeta: Record<string, { icon: any; label: string; description: string; gradient: string }> = {
  Doctor: {
    icon: Stethoscope,
    label: "Meet the Doctor",
    description: "Dr. Amit Jain — experienced dermatologist, researcher, and compassionate clinician.",
    gradient: "from-blue-600 to-blue-800",
  },
  Clinic: {
    icon: Building2,
    label: "Our Clinic",
    description: "A calm, modern and meticulously clean space designed for your comfort and care.",
    gradient: "from-emerald-600 to-emerald-800",
  },
  Treatment: {
    icon: Sparkles,
    label: "Treatment Rooms & Equipment",
    description: "State-of-the-art suites equipped with FDA-cleared aesthetic devices and advanced technology.",
    gradient: "from-purple-600 to-purple-800",
  },
  "Before & After": {
    icon: ScanEye,
    label: "Patient Transformations",
    description: "Real clinical outcomes. Drag the slider to compare before & after results.",
    gradient: "from-orange-500 to-orange-700",
  },
};

const displayCategories = ["Doctor", "Clinic", "Treatment", "Before & After"];

// ----------------------------------------------------
// INTERACTIVE BEFORE/AFTER SLIDER COMPONENT
// ----------------------------------------------------
function BeforeAfterSlider({
  before,
  after,
  label
}: {
  before: string;
  after: string;
  label: string;
}) {
  const [percent, setPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, currentTarget: HTMLDivElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPercent(newPercent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    handleMove(e.clientX, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX, e.currentTarget);
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border bg-white/70 p-2 shadow-sm border-glow-hover hover:shadow-lg transition-all duration-300 select-none touch-none"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX, e.currentTarget);
        }}
      >
        {/* BEFORE IMAGE (Background) */}
        <img
          src={before}
          alt="Before treatment"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* AFTER IMAGE (Foreground overlay clipping) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
        >
          <img
            src={after}
            alt="After treatment"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.35)]"
          style={{ left: `${percent}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-lg border border-primary/20 flex items-center justify-center text-primary text-xs font-black select-none pointer-events-none">
            ↔
          </div>
        </div>

        {/* Badges overlay */}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm pointer-events-none">Before</span>
        <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm pointer-events-none">After</span>
      </div>

      <div className="px-3 py-2.5 text-left flex items-center justify-between pointer-events-none">
        <span className="text-xs font-extrabold text-foreground">{label}</span>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 animate-pulse">Interactive Slider</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SECTION HEADER COMPONENT
// ----------------------------------------------------
function GallerySectionHeader({ category }: { category: string }) {
  const meta = sectionMeta[category];
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <div className="mb-6 mt-2">
      <div className="flex items-center gap-3 mb-2">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">{meta.label}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{meta.description}</p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Dr Jain's Skin Care Clinic" },
      { name: "description", content: "Take a tour of our modern clinic, meet Dr. Amit Jain, and see patient transformations." },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "caption-asc" | "caption-desc">("default");
  const [open, setOpen] = useState<number | null>(null);
  const [galleryList, setGalleryList] = useState<any[]>(fallbackGallery);
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    getGallery().then(setGalleryList);
    getServices().then(setServicesList);
  }, []);

  // Standardize "Treatments" category to singular "Treatment"
  const normalizedGalleryList = useMemo(() => {
    return galleryList.map((item) => {
      let cat = item.category;
      if (cat === "Treatments") cat = "Treatment";
      return { ...item, category: cat };
    });
  }, [galleryList]);

  // Match service to gallery item
  const getLinkedService = (item: any) => {
    if (item.serviceSlug) {
      return servicesList.find((s) => s.slug === item.serviceSlug);
    }
    const captionLower = (item.caption || "").toLowerCase();
    return servicesList.find((s) => {
      const titleLower = s.title.toLowerCase();
      if (captionLower.includes("acne") && titleLower.includes("acne")) return true;
      if (captionLower.includes("prp") && titleLower.includes("prp")) return true;
      if (captionLower.includes("pigmentation") && titleLower.includes("pigmentation")) return true;
      if (captionLower.includes("scar") && titleLower.includes("scar")) return true;
      if (captionLower.includes("hair") && titleLower.includes("hair")) return true;
      if (captionLower.includes("peel") && titleLower.includes("peel")) return true;
      if (captionLower.includes("aging") && titleLower.includes("aging")) return true;
      return false;
    });
  };

  // Perform search, filter, and sort operations
  const processedGalleryItems = useMemo(() => {
    let items = [...normalizedGalleryList];

    // Filter by tab
    if (filter !== "All") {
      items = items.filter((i) => i.category === filter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          (i.caption || "").toLowerCase().includes(query) ||
          (i.category || "").toLowerCase().includes(query)
      );
    }

    // Sort items
    if (sortBy === "caption-asc") {
      items.sort((a, b) => (a.caption || "").localeCompare(b.caption || ""));
    } else if (sortBy === "caption-desc") {
      items.sort((a, b) => (b.caption || "").localeCompare(a.caption || ""));
    }

    return items;
  }, [normalizedGalleryList, filter, searchQuery, sortBy]);

  // Group items by category for "All" view (but only if not searching or sorting, which display flat)
  const isGroupingActive = filter === "All" && !searchQuery.trim() && sortBy === "default";

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof processedGalleryItems> = {};
    const categories = displayCategories;
    for (const cat of categories) {
      groups[cat] = processedGalleryItems.filter((i) => i.category === cat);
    }
    return groups;
  }, [processedGalleryItems]);

  const groupEntries = Object.entries(groupedItems).filter(([, items]) => items.length > 0);

  // Category counts based on normalized database
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: normalizedGalleryList.length };
    for (const item of normalizedGalleryList) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [normalizedGalleryList]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "ArrowRight") {
        setOpen((prev) => (prev !== null && prev < processedGalleryItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setOpen((prev) => (prev !== null && prev > 0 ? prev - 1 : processedGalleryItems.length - 1));
      } else if (e.key === "Escape") {
        setOpen(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, processedGalleryItems]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Gallery"
        title={<>A look <span className="text-gradient">inside our clinic</span></>}
        description="Calm, modern and meticulously clean — designed for your comfort. Explore our spaces, meet the doctor, and see real patient transformations."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      />
      
      <section className="relative isolate overflow-hidden mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/10 via-brand-frost/10 to-transparent -z-10 bg-dot-pattern opacity-50" />

        {/* Premium Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2.5 justify-center">
          {["All", ...displayCategories].map((c) => {
            const Icon = c === "All" ? Image : (sectionMeta[c]?.icon || Image);
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "rounded-2xl border px-5 py-3 text-xs font-extrabold transition-all duration-300 inline-flex items-center gap-2 shadow-xs",
                  filter === c
                    ? "border-primary bg-primary text-primary-foreground shadow-md scale-102"
                    : "border-primary/15 bg-white/80 text-muted-foreground hover:bg-secondary/40 hover:text-primary hover:border-primary/30"
                )}
              >
                <Icon className="h-4 w-4" />
                {c}
                <span className={cn(
                  "ml-1 text-[10px] px-2 py-0.5 rounded-lg font-extrabold",
                  filter === c ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                )}>
                  {categoryCounts[c] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search & Sorting Controls */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/70 backdrop-blur-md border border-primary/10 p-4 rounded-3xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
            <input
              type="text"
              placeholder="Search by caption, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs md:text-sm bg-white/90 border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold bg-secondary/80 rounded-full h-5 w-5 flex items-center justify-center">✕</button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-white/90 border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground font-semibold cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="caption-asc">Sort A-Z</option>
              <option value="caption-desc">Sort Z-A</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {processedGalleryItems.length === 0 && (
          <div className="text-center py-20 bg-white/40 border border-dashed rounded-3xl p-6">
            <Image className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h4 className="text-base font-bold text-foreground">No gallery assets found</h4>
            <p className="text-xs text-muted-foreground mt-1">Try updating your search query or choosing another section.</p>
          </div>
        )}

        {/* Grouped View (All items, grouped by headers) */}
        {isGroupingActive ? (
          groupEntries.map(([category, items], sectionIdx) => (
            <div key={category} className="mb-16 last:mb-0 animate-fade-down">
              <GallerySectionHeader category={category} />
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((img) => {
                  const flatIdx = processedGalleryItems.indexOf(img);
                  const linked = getLinkedService(img);

                  if (img.beforeSrc && img.afterSrc) {
                    return (
                      <div key={img.id || img.beforeSrc} className="relative group/card">
                        <BeforeAfterSlider before={img.beforeSrc} after={img.afterSrc} label={img.caption} />
                        {linked && (
                          <div className="absolute bottom-3 right-4 z-10">
                            <Link
                              to="/services/$slug"
                              params={{ slug: linked.slug }}
                              className="px-2.5 py-1 text-[10px] font-bold bg-white text-primary border rounded-lg shadow-sm hover:bg-secondary inline-flex items-center gap-1 transition-all"
                            >
                              Learn More <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        )}
                        <button
                          onClick={() => setOpen(flatIdx)}
                          className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-opacity"
                        >
                          <ScanEye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={img.id || img.src}
                      onClick={() => setOpen(flatIdx >= 0 ? flatIdx : null)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white/70 p-2 shadow-sm border-glow-hover hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted w-full">
                        <img src={img.src} alt={img.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute left-3 top-3 rounded-full bg-secondary/95 px-2.5 py-0.5 text-[9px] font-bold text-primary shadow-sm backdrop-blur-sm">{img.category}</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-xs font-bold flex items-center gap-1">
                            Zoom View <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-2.5 text-left w-full flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-foreground">{img.caption}</span>
                          {linked && (
                            <Link
                              to="/services/$slug"
                              params={{ slug: linked.slug }}
                              className="text-[9px] font-bold text-primary hover:underline mt-1 inline-flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              For {linked.title} <ExternalLink className="h-2 w-2" />
                            </Link>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md hover:bg-secondary transition-colors shrink-0 self-center">View</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {sectionIdx < groupEntries.length - 1 && (
                <div className="mt-14 border-t border-border/30" />
              )}
            </div>
          ))
        ) : (
          /* Flat View (When filtered or searched) */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-down">
            {processedGalleryItems.map((img, idx) => {
              const linked = getLinkedService(img);

              if (img.beforeSrc && img.afterSrc) {
                return (
                  <div key={img.id || img.beforeSrc} className="relative group/card">
                    <BeforeAfterSlider before={img.beforeSrc} after={img.afterSrc} label={img.caption} />
                    {linked && (
                      <div className="absolute bottom-3 right-4 z-10">
                        <Link
                          to="/services/$slug"
                          params={{ slug: linked.slug }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-white text-primary border rounded-lg shadow-sm hover:bg-secondary inline-flex items-center gap-1 transition-all"
                        >
                          Learn More <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    )}
                    <button
                      onClick={() => setOpen(idx)}
                      className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-opacity"
                    >
                      <ScanEye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={img.id || img.src}
                  onClick={() => setOpen(idx)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white/70 p-2 shadow-sm border-glow-hover hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted w-full">
                    <img src={img.src} alt={img.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-secondary/95 px-2.5 py-0.5 text-[9px] font-bold text-primary shadow-sm backdrop-blur-sm">{img.category}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        Zoom View <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 text-left w-full flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-foreground">{img.caption}</span>
                      {linked && (
                        <Link
                          to="/services/$slug"
                          params={{ slug: linked.slug }}
                          className="text-[9px] font-bold text-primary hover:underline mt-1 inline-flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          For {linked.title} <ExternalLink className="h-2 w-2" />
                        </Link>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md shrink-0 self-center">View</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Premium Lightbox supporting Standard & Before/After Images */}
      {open !== null && processedGalleryItems[open] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 md:p-10 select-none animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute -top-12 right-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors shadow-lg border border-white/10"
              onClick={() => setOpen(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation buttons */}
            <button
              className="absolute -left-2 md:-left-16 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors shadow-lg border border-white/10 z-20"
              onClick={() => setOpen((prev) => (prev !== null && prev > 0 ? prev - 1 : processedGalleryItems.length - 1))}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              className="absolute -right-2 md:-right-16 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors shadow-lg border border-white/10 z-20"
              onClick={() => setOpen((prev) => (prev !== null && prev < processedGalleryItems.length - 1 ? prev + 1 : 0))}
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Content Display Card */}
            <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 w-full flex flex-col items-center">
              <div className="w-full relative flex items-center justify-center aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-neutral-950 rounded-2xl">
                {processedGalleryItems[open].beforeSrc && processedGalleryItems[open].afterSrc ? (
                  <div className="w-full max-w-xl p-2">
                    <BeforeAfterSlider
                      before={processedGalleryItems[open].beforeSrc}
                      after={processedGalleryItems[open].afterSrc}
                      label={processedGalleryItems[open].caption}
                    />
                  </div>
                ) : (
                  <img
                    src={processedGalleryItems[open].src}
                    alt={processedGalleryItems[open].caption}
                    className="max-h-[65vh] max-w-full rounded-lg object-contain"
                  />
                )}
              </div>

              {/* Lightbox Footer */}
              <div className="w-full mt-4 px-2 py-1 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 pt-3">
                <div className="mb-3 sm:mb-0">
                  <h4 className="text-white text-sm md:text-base font-extrabold">{processedGalleryItems[open].caption}</h4>
                  <span className="text-[10px] font-bold text-primary bg-secondary/90 px-2.5 py-0.5 rounded-lg mt-1.5 inline-block uppercase tracking-wider">
                    {processedGalleryItems[open].category}
                  </span>
                </div>
                {(() => {
                  const linked = getLinkedService(processedGalleryItems[open]);
                  return linked ? (
                    <Link
                      to="/services/$slug"
                      params={{ slug: linked.slug }}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 shrink-0"
                      onClick={() => setOpen(null)}
                    >
                      Learn about {linked.title} <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}