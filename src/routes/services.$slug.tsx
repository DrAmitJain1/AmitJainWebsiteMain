import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, MessageCircle, Sparkles, ScanEye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { ServiceCard } from "@/components/site/ServiceCard";
import { getServices, getClinicSettings, getGallery } from "@/lib/firebaseServices";
import { clinic as fallbackClinic } from "@/lib/clinic";
import { services as fallbackServices, type Service } from "@/lib/data";

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
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 animate-pulse">Drag Slider</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const list = await getServices();
    const s = list.find((x) => x.slug === params.slug);
    if (!s) {
      const fallback = fallbackServices.find((x) => x.slug === params.slug);
      if (!fallback) throw notFound();
      return fallback;
    }
    return s;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Service"} | Dr Jain's Skin Care Clinic` },
      { name: "description", content: loaderData?.short ?? "" },
    ],
    links: [{ rel: "canonical", href: `/services/${loaderData?.slug ?? ""}` }],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const s = Route.useLoaderData() as Service;
  const [clinic, setClinic] = useState(fallbackClinic);
  const [others, setOthers] = useState<Service[]>([]);
  const [relatedGallery, setRelatedGallery] = useState<any[]>([]);

  useEffect(() => {
    getClinicSettings().then(setClinic);
    getServices().then((list) => {
      setOthers(list.filter((x) => x.slug !== s.slug).slice(0, 3));
    });
    getGallery().then((galleryItems) => {
      const slugLower = s.slug.toLowerCase();
      const titleLower = s.title.toLowerCase();
      
      const matches = galleryItems.filter((g: any) => {
        if (g.serviceSlug === s.slug) return true;
        const captionLower = (g.caption || "").toLowerCase();
        const categoryLower = (g.category || "").toLowerCase();
        
        if (slugLower.includes("acne") && (captionLower.includes("acne") || categoryLower.includes("acne"))) return true;
        if (slugLower.includes("prp") && (captionLower.includes("prp") || categoryLower.includes("prp"))) return true;
        if (slugLower.includes("pigmentation") && (captionLower.includes("pigmentation") || categoryLower.includes("pigmentation"))) return true;
        if (slugLower.includes("scar") && (captionLower.includes("scar") || categoryLower.includes("scar"))) return true;
        if (slugLower.includes("hair") && (captionLower.includes("hair") || categoryLower.includes("hair"))) return true;
        if (slugLower.includes("peel") && (captionLower.includes("peel") || categoryLower.includes("peel"))) return true;
        if (slugLower.includes("aging") && (captionLower.includes("aging") || categoryLower.includes("aging"))) return true;
        if (slugLower.includes("cosmetology") && (captionLower.includes("cosmetology") || categoryLower.includes("cosmetology"))) return true;
        if (slugLower.includes("nail") && (captionLower.includes("nail") || categoryLower.includes("nail"))) return true;
        return false;
      });
      setRelatedGallery(matches);
    });
  }, [s.slug]);

  const whatsappLink = `https://wa.me/${clinic.phoneRaw}?text=${encodeURIComponent(`Hi, I'd like to book an appointment for ${s.title}.`)}`;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Treatment Details"
        title={s.title}
        description={s.short}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: s.title }]}
      />
      <section className="relative isolate overflow-hidden mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/10 via-brand-frost/10 to-transparent -z-10 bg-dot-pattern opacity-50" />
        
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-xs border-glow-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary ring-4 ring-secondary/30">
                  <ServiceIcon name={s.icon} className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-foreground">Overview & Indications</h2>
              </div>
              <div className={`grid gap-6 ${s.imageUrl ? "md:grid-cols-2" : "grid-cols-1"}`}>
                <div className="flex flex-col justify-center">
                  <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed font-medium">{s.overview}</p>
                </div>
                {s.imageUrl && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border bg-muted shadow-2xs group">
                    <img
                      src={s.imageUrl}
                      alt={`${s.title} reference`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            {/* Symptoms & Causes Grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6 shadow-xs border-glow-hover">
                <h3 className="text-base font-extrabold text-foreground">Symptoms & Concerns</h3>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground/80 leading-relaxed font-semibold">
                  {s.symptoms.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-primary shrink-0 p-0.5 bg-secondary rounded-lg" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6 shadow-xs border-glow-hover">
                <h3 className="text-base font-extrabold text-foreground">Common Triggers & Causes</h3>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground/80 leading-relaxed font-semibold">
                  {s.causes.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-primary shrink-0 p-0.5 bg-secondary rounded-lg" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vertical Timeline Process Card */}
            <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-xs border-glow-hover">
              <h3 className="text-base md:text-lg font-extrabold text-foreground mb-6">Our Tailored Treatment Process</h3>
              <div className="relative pl-6 md:pl-8 border-l border-primary/20 space-y-8 py-2 ml-4">
                {s.process.map((p, i) => (
                  <div key={p.step} className="relative group/timeline">
                    <span className="absolute -left-[37px] md:-left-[45px] top-0.5 flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-primary border-2 border-primary shadow-xs transition-transform duration-300 group-hover/timeline:scale-110">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm md:text-base font-extrabold text-foreground group-hover/timeline:text-primary transition-colors duration-300">
                        {p.step}
                      </h4>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed mt-1 md:mt-1.5 font-semibold">
                        {p.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits of Treatment */}
            <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-xs border-glow-hover">
              <h3 className="text-base md:text-lg font-extrabold text-foreground mb-4">Key Benefits & Outcomes</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-xs font-semibold text-muted-foreground/80 leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0 bg-emerald-50 rounded-full p-0.5 border border-emerald-100" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-extrabold text-foreground">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="rounded-3xl border bg-white/80 backdrop-blur-md p-2 shadow-xs">
                {s.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`f-${i}`} className="px-4 border-b last:border-b-0">
                    <AccordionTrigger className="text-left text-xs md:text-sm font-extrabold text-foreground py-4 hover:no-underline transition-colors hover:text-primary">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground/80 leading-relaxed pb-4 font-semibold">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sticky Side Card */}
          <aside className="space-y-5">
            <div className="sticky top-24 rounded-3xl border bg-gradient-to-br from-brand-deep via-primary to-brand-emerald p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 -z-10 opacity-20 bg-dot-pattern" />
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                <CalendarCheck className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-extrabold text-white">Schedule a Consultation</h4>
              <p className="mt-2 text-xs text-white/85 leading-relaxed font-semibold">
                Set up an appointment with Dr. Amit Jain to diagnose your symptoms and customize a therapy plan.
              </p>
              <div className="mt-6 grid gap-2.5">
                <Button asChild className="rounded-full bg-white text-primary hover:bg-white/95 font-bold shadow-md hover:-translate-y-0.5 transition-all py-5 text-xs">
                  <Link to="/appointment"><CalendarCheck className="mr-2 h-4 w-4" /> Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 font-bold shadow-md hover:-translate-y-0.5 transition-all py-5 text-xs">
                  <a href={whatsappLink} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Chat</a>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Dynamic Related Gallery Block */}
        {relatedGallery.length > 0 && (
          <div className="mt-16 rounded-3xl border border-primary/10 bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ScanEye className="h-5 w-5 text-primary" />
              <h3 className="text-base md:text-lg font-extrabold text-foreground">Treatment Gallery & Results</h3>
            </div>
            <p className="text-xs text-muted-foreground/80 mb-6 font-semibold">
              Before/after transformations and clinic snapshots specifically for {s.title}.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGallery.map((img, idx) => {
                if (img.beforeSrc && img.afterSrc) {
                  return (
                    <BeforeAfterSlider
                      key={idx}
                      before={img.beforeSrc}
                      after={img.afterSrc}
                      label={img.caption}
                    />
                  );
                }
                return (
                  <div key={idx} className="group overflow-hidden rounded-2xl border bg-white p-2 shadow-xs hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                      <img src={img.src} alt={img.caption} className="h-full w-full object-cover transition duration-300 group-hover:scale-103" />
                    </div>
                    <div className="px-3 py-2.5 text-xs font-extrabold text-foreground">{img.caption}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Treatments */}
        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between border-b pb-4">
            <div>
              <h3 className="text-base md:text-lg font-extrabold tracking-tight text-foreground">Explore Other Treatments</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Explore our wide clinical services portfolio.</p>
            </div>
            <Link to="/services" className="text-xs font-extrabold text-primary inline-flex items-center gap-1 hover:underline">
              All services <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => <ServiceCard key={o.slug} service={o} />)}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}