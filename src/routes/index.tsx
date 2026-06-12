import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowRight, Award, CalendarCheck, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Star, Heart, Check, HelpCircle,
  X, PhoneCall, Loader2, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { clinic as fallbackClinic } from "@/lib/clinic";
import {
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  faqs as fallbackFaqs,
  stats as fallbackStats,
  getCategory
} from "@/lib/data";
import {
  getClinicSettings,
  getHeroData,
  getDoctorInfo,
  getServices,
  getTestimonials,
  getFAQs,
  getGallery,
  createAppointment,
  getSpecialtiesData,
  getWhyChooseUsData,
  getBeforeAfterVideo
} from "@/lib/firebaseServices";
import { toast } from "sonner";

const googleAvatarColors = [
  "bg-red-500 text-white",
  "bg-blue-500 text-white",
  "bg-green-600 text-white",
  "bg-yellow-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-indigo-500 text-white",
  "bg-orange-500 text-white",
  "bg-teal-500 text-white"
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % googleAvatarColors.length;
  return googleAvatarColors[index];
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr Jain's Skin Care Clinic | Dermatologist in Katraj, Pune" },
      { name: "description", content: "Advanced skin, hair and cosmetology care in Katraj, Pune by Dr. Amit Jain (MBBS, MD). 4.8★ rated. Book an appointment today." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <TrustStrip />
      <DoctorIntro />
      <Highlights />
      <BeforeAfter />
      <ServicesOverview />
      <WhyChooseUs />
      <TestimonialsSection />
      <GoogleReviewsSection />
      <FAQSection />
      <MapSectionComponent />
      <ContactCTASection />
      <CallbackPopup />
    </SiteLayout>
  );
}

function Hero() {
  const [clinic, setClinic] = useState(fallbackClinic);
  const [hero, setHero] = useState<any>({
    badgeText: "Trusted Dermatology · Katraj, Pune",
    title: "Dr Amit Jain's Skin, Hair and Laser Clinic",
    titleCursive: "Skin & Hair",
    titleSuffix: "Care",
    subtitle: "Advanced dermatology, cosmetology, and laser solutions customized for Indian skin.",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=70",
    ctaText: "Book Appointment",
    rating: 4.8,
    reviewsCount: 140,
    happyPatientsText: "15,000+ Happy Patients",
    doctorCardHighlight: "100% Evidence-Based Protocols",
  });

  useEffect(() => {
    getClinicSettings().then(setClinic);
    getHeroData().then((h: any) => {
      setHero({
        badgeText: h.badgeText || "Trusted Dermatology · Katraj, Pune",
        title: h.title || "Dr Amit Jain's Skin, Hair and Laser Clinic",
        titleCursive: h.titleCursive || "Skin & Hair",
        titleSuffix: h.titleSuffix || "Care",
        subtitle: h.subtitle || "Advanced dermatology, cosmetology, and laser solutions customized for Indian skin.",
        imageUrl: h.imageUrl,
        ctaText: h.ctaText,
        rating: h.rating,
        reviewsCount: h.reviewsCount,
        happyPatientsText: h.happyPatientsText || "15,000+ Happy Patients",
        doctorCardHighlight: h.doctorCardHighlight || "100% Evidence-Based Protocols",
      });
    });
  }, []);

  const whatsappLink = `https://wa.me/${clinic.phoneRaw}?text=${encodeURIComponent(clinic.whatsappMessage)}`;

  return (
    <section className="relative isolate overflow-hidden pt-3 pb-10 md:pt-4 md:pb-16">
      <div className="absolute inset-0 -z-10 bg-soft-radial bg-dot-pattern opacity-95" />
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-brand-teal/15 blur-3xl opacity-50 animate-pulse" />
      
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-0 pb-8 md:grid-cols-2 md:pt-0 md:pb-14 items-center">
        <div className="flex flex-col justify-center animate-fade-up">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-3.5 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {hero.badgeText}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-[3.25rem] lg:text-[3.75rem]">
            {hero.title} <span className="text-cursive text-5xl md:text-[3.75rem] lg:text-[4.25rem] inline-block font-normal">{hero.titleCursive}</span> {hero.titleSuffix}
          </h1>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground md:text-base leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <Link to="/appointment">
                <CalendarCheck className="mr-2 h-4 w-4" /> {hero.ctaText}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-emerald-200 bg-white/70 text-emerald-700 hover:bg-emerald-50 shadow-sm hover:-translate-y-0.5 transition-all">
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4 text-emerald-600" /> WhatsApp Consultation
              </a>
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t pt-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-foreground">
                <span className="text-sm font-extrabold">{hero.rating}</span>/5 <span className="font-normal text-muted-foreground">({hero.reviewsCount}+ Google Reviews)</span>
              </div>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-primary font-extrabold">✓</span>
              <span className="font-bold text-foreground">{hero.happyPatientsText}</span>
            </div>
          </div>
        </div>
        
        <div className="relative animate-fade-up">
          <div className="absolute -left-8 -top-8 -z-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-8 -bottom-8 -z-10 h-48 w-48 rounded-full bg-brand-emerald/15 blur-3xl" />
          
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl ring-soft transition-all duration-500 hover:scale-[1.01]">
            <img
              src={hero.imageUrl}
              alt="Advanced skin examination by expert dermatologist"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 glass rounded-2xl p-4 border border-white/60 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                  <Heart className="h-5 w-5 fill-white" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-foreground">{clinic.doctor}</div>
                  <div className="text-[10px] font-bold text-primary">{clinic.credentials.split("(")[0]}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                <span className="text-[11px] font-extrabold text-foreground tracking-tight">{hero.doctorCardHighlight}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const [count, setCount] = useState<number>(0);

  const cleanVal = value.replace(/,/g, "");
  const numMatch = cleanVal.match(/^([\d.]+)/);
  const target = numMatch ? parseFloat(numMatch[1]) : 0;
  const suffix = value.replace(/^[\d.,]+/, "");
  
  const hasComma = value.includes(",");
  const isFloat = value.includes(".") && parseFloat(value) % 1 !== 0;

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = 1600;
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(totalMiliseconds / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current = end * easeOut;

      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(end);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [target]);

  const formatNumber = (num: number) => {
    if (isFloat) {
      return num.toFixed(1);
    }
    const rounded = Math.floor(num);
    if (hasComma) {
      return rounded.toLocaleString("en-IN");
    }
    return rounded.toString();
  };

  return (
    <div className="text-center relative after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-border last:after:hidden max-md:even:after:hidden">
      <div className="text-3xl font-extrabold tracking-tight text-gradient md:text-4xl">
        {formatNumber(count)}{suffix}
      </div>
      <div className="mt-1.5 text-xs font-bold text-muted-foreground md:text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

function TrustStrip() {
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    getHeroData().then((h) => {
      if (h.stats) {
        setStats(h.stats);
      }
    });
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 -mt-8">
      <div className="glass rounded-[2rem] border bg-gradient-to-r from-white/95 to-brand-frost/40 px-6 py-8 shadow-xl md:px-12 md:py-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <AnimatedCounter key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}

function DoctorIntro() {
  const [doctor, setDoctor] = useState({
    name: "Dr. Amit Jain",
    role: "Chief Dermatologist & Hair Transplant Specialist",
    qualifications: ["MBBS from prestigious university", "MD - Skin (Dermatology, Venereology & Leprosy)"],
    memberships: [
      "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
      "Cosmetology Society of India (CSI)",
      "Association of Hair Restoration Surgeons (AHRS)",
    ],
    imageUrl: "https://res.cloudinary.com/dntsjzbei/image/upload/v1780681530/yotg2haunjnbiblavmpb.png",
    bio: "Dr. Amit Jain is a highly experienced skin specialist based in Katraj, Pune. Over the last 10+ years, he has successfully delivered clinical and aesthetic solutions for thousands of patients with a patient-first ethos.",
  });

  useEffect(() => {
    getDoctorInfo().then(setDoctor);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-40 translate-x-4 translate-y-4 rounded-[2rem]" />
          <div className="absolute -left-10 -bottom-10 -z-10 h-36 w-36 rounded-full bg-brand-emerald/10 blur-2xl" />
          
          <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-xl hover:scale-[1.005] transition-transform duration-300">
            <img src={doctor.imageUrl} alt={`${doctor.name} — Skin and Cosmetology expert`} className="h-full w-full object-cover" />
          </div>
        </div>
        <div>
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-secondary/80 px-3.5 py-1 text-[11px] font-bold text-primary uppercase tracking-wider">
            Meet your dermatologist
          </span>
          <h2 className="mt-3.5 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{doctor.name}</h2>
          <p className="mt-1.5 text-sm font-semibold text-primary">{doctor.role}</p>
          <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed">
            {doctor.bio}
          </p>
          
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {doctor.memberships.slice(0, 4).map((m, idx) => (
              <li key={idx} className="flex gap-3 rounded-2xl border bg-white/70 p-3.5 shadow-sm hover:bg-white/95 transition-all">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5 bg-secondary rounded-full p-1" />
                <div>
                  <div className="text-xs font-bold text-foreground">Verified Member</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{m}</div>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Published Research Highlight */}
          <Link to="/about" className="group mt-6 flex items-center gap-3.5 rounded-2xl border bg-gradient-to-r from-white/80 to-accent/30 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-glow-hover">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">Published Researcher — Peer-Reviewed Journals</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">BMJ Case Reports · Cureus · Mycoses (Wiley) · LWW & more</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
          </Link>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full shadow-sm hover:shadow">
              <Link to="/about">Read full bio profile <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/appointment">Book a consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const [data, setData] = useState<any>({
    eyebrow: "What we treat",
    titleMain: "Personalised",
    titleCursive: "skin & hair",
    titleSuffix: "specialties",
    description: "Every clinical solution is calibrated under a single specialist to achieve maximum safety and natural results.",
    items: [
      { title: "Skin Treatments", desc: "Comprehensive diagnostic care for acne, pigmentation, eczema, psoriasis, and deep scars.", icon: "Sparkles", tags: ["Acne Care", "Pigmentation", "Peels", "Skin Allergies"] },
      { title: "Hair Treatments", desc: "Advanced trichology services for male/female pattern hair loss, PRP growth factor therapy.", icon: "Award", tags: ["PRP Therapy", "Hair Thinning", "Mesotherapy", "Scalp Care"] },
      { title: "Cosmetology", desc: "Anti-aging injectables, fillers, medical Hydrafacials, carbon facials and skin boosters.", icon: "Star", tags: ["Hydrafacial", "Anti-aging", "Glow Facials", "Skin Boosters"] }
    ]
  });

  useEffect(() => {
    getSpecialtiesData().then(setData);
  }, []);

  const iconMap: Record<string, any> = {
    Sparkles: Sparkles,
    Award: Award,
    Star: Star,
    ShieldCheck: ShieldCheck,
    Heart: Heart,
    CheckCircle2: CheckCircle2,
    CalendarCheck: CalendarCheck,
    MessageCircle: MessageCircle,
    Check: Check,
    HelpCircle: HelpCircle,
    User: User,
  };

  return (
    <section className="relative isolate overflow-hidden py-14 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/20 via-brand-frost/25 to-transparent -z-10 bg-dot-pattern opacity-60" />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading 
          eyebrow={data.eyebrow} 
          title={<>{data.titleMain} <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">{data.titleCursive}</span> {data.titleSuffix}</>} 
          description={data.description} 
        />
        <div className="grid gap-6 md:grid-cols-3">
          {data.items.map((it: any) => {
            const IconComponent = iconMap[it.icon] || Sparkles;
            return (
              <div key={it.title} className="group relative flex flex-col justify-between rounded-2xl border bg-white/70 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/95 hover:shadow-xl border-glow-hover">
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-105">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">{it.title}</h3>
                  <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">Featured services</span>
                  <div className="flex flex-wrap gap-1.5">
                    {it.tags && it.tags.map((t: string) => (
                      <span key={t} className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  const [sets, setSets] = useState<any[]>([]);
  const [video, setVideo] = useState<any>({ videoUrl: "", title: "", thumbnailUrl: "", isActive: false });

  useEffect(() => {
    getGallery().then((galleryItems) => {
      // Find all gallery items that have beforeSrc and afterSrc defined
      let bAndA = galleryItems.filter((g: any) => g.beforeSrc && g.afterSrc);
      if (bAndA.length > 0) {
        // Sort by creation date descending (newest first)
        bAndA.sort((a: any, b: any) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        setSets(bAndA.map((g: any) => ({
          label: g.caption || "Clinical Transform",
          before: g.beforeSrc,
          after: g.afterSrc
        })));
      } else {
        // Static default fallbacks if none are uploaded in the database
        setSets([
          { label: "Acne Control", before: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=70", after: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=900&q=70" },
          { label: "Pigmentation & Tone", before: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=900&q=70", after: "https://images.unsplash.com/photo-1614109800763-7b46d0a9ad44?w=900&q=70" },
          { label: "Hair Density (PRP)", before: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=900&q=70", after: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=70" },
        ]);
      }
    });

    getBeforeAfterVideo().then((v) => {
      if (v) setVideo(v);
    });
  }, []);

  if (sets.length === 0) return null;

  const showVideo = video.isActive && video.videoUrl;
  const displaySets = showVideo ? sets.slice(0, 2) : sets.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
      <SectionHeading 
        eyebrow="Clinical results" 
        title={<>Transformative <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">patient results</span></>} 
        description="A real-world showcase of dermatological success. Specific clinical outcomes differ; consultation is recommended." 
      />
      <div className="grid gap-6 md:grid-cols-3">
        {showVideo && (
          <div className="group overflow-hidden rounded-3xl border bg-white/70 shadow-sm border-glow-hover transition-all duration-300 hover:shadow-lg p-2.5 flex flex-col h-full justify-between">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border shadow-inner flex items-center justify-center">
              {video.videoUrl.endsWith(".mp4") || video.videoUrl.includes("/video/") || video.videoUrl.startsWith("data:video/") ? (
                <video
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  controls
                  preload="metadata"
                  playsInline
                  className="h-full w-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={
                    video.videoUrl.includes("youtube.com/watch?v=")
                      ? video.videoUrl.replace("watch?v=", "embed/")
                      : video.videoUrl.includes("youtu.be/")
                      ? video.videoUrl.replace("youtu.be/", "youtube.com/embed/")
                      : video.videoUrl
                  }
                  title={video.title}
                  allowFullScreen
                  className="h-full w-full border-0 absolute inset-0"
                />
              )}
            </div>
            <div className="bg-white/95 px-4 py-3.5 text-center border-t mt-2 flex flex-col items-center justify-center grow">
              <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md mb-1.5 block w-fit">
                🎥 Live Procedure Walkthrough
              </span>
              <div className="text-xs font-bold text-foreground leading-snug">{video.title || "Clinical Transformation Walkthrough"}</div>
            </div>
          </div>
        )}

        {displaySets.map((s, idx) => (
          <div key={s.label + idx} className="group overflow-hidden rounded-2xl border bg-white/70 shadow-sm border-glow-hover transition-all duration-300 hover:shadow-lg">
            <div className="grid grid-cols-2 relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={s.before} alt={`${s.label} before`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">Before</span>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden border-l border-white">
                <img src={s.after} alt={`${s.label} after`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">After</span>
              </div>
            </div>
            <div className="bg-white/90 px-5 py-4 text-center border-t">
              <div className="text-sm font-bold text-foreground">{s.label} Treatment</div>
              <div className="mt-1 text-[11px] text-muted-foreground leading-relaxed">Visible results after completed clinical sessions</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesOverview() {
  const [services, setServices] = useState(fallbackServices);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    getServices().then(setServices);
  }, []);



  const filtered = useMemo(() => {
    if (activeTab === "All") return services.slice(0, 6);
    return services.filter((s: any) => getCategory(s.slug) === activeTab).slice(0, 6);
  }, [services, activeTab]);

  return (
    <section className="relative isolate overflow-hidden py-14 md:py-16 bg-white/40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-frost/20 to-brand-mint/10 bg-dot-pattern opacity-40" />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Our clinical services"
          title={<>Evidence-based <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">dermatology</span> treatments</>}
          description="Gentle protocols matched with state-of-the-art diagnostic technology for maximum patient comfort."
        />

        {/* Simple interactive filters for the homepage block */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 max-w-2xl mx-auto">
          {["All", "Dermatology", "Cosmetology", "Trichology", "Medical Care"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border",
                activeTab === tab
                  ? "bg-primary text-primary-foreground border-primary shadow-sm scale-102"
                  : "bg-white/70 text-muted-foreground border-primary/5 hover:bg-secondary/40 hover:text-primary hover:border-primary/10"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500 animate-fade-down">
          {filtered.map((s: any) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full shadow-sm hover:shadow-md px-6 py-5 text-xs font-extrabold border-primary/25 hover:border-primary hover:bg-secondary/10">
            <Link to="/services">View all services catalog <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const [data, setData] = useState<any>({
    eyebrow: "Clinical Integrity",
    titleMain: "Why Choose",
    titleCursive: "Dr. Amit Jain",
    leftCardBadge: "MD - Dermatology (Skin)",
    leftCardTitleMain: "Dermatology built on clinical",
    leftCardTitleCursive: "Integrity",
    leftCardDesc: "Dr. Amit Jain believes that skincare is a medical science, not a commercial transaction. We completely reject the aggressive sales targets common in aesthetic clinics, prioritizing your skin's health above all else.",
    leftCardBullets: [
      "10+ Years Active Clinical Experience",
      "15,000+ Successfully Treated Patients",
      "100% Evidence-Based Medical Protocols"
    ],
    items: [
      { t: "Expert-Led Care Only", d: "Unlike general aesthetic clinics, every consultation, diagnosis, and clinical procedure is directly handled by Dr. Amit Jain himself.", icon: "Award" },
      { t: "FDA-Cleared Technology", d: "Equipped with gold-standard, FDA-cleared aesthetic lasers and double-spin clinical PRP centrifuges for maximum efficacy.", icon: "ShieldCheck" },
      { t: "Indian Skin Specialization", d: "Calibrated protocols specially designed for Type IV-VI Indian skin, focusing strictly on melanocyte safety to prevent post-treatment pigmentation.", icon: "Heart" },
      { t: "Transparent & Ethical Pricing", d: "Upfront pricing schedules with absolutely zero forced cosmetic packages, hidden add-ons, or sales targets.", icon: "CheckCircle2" }
    ]
  });

  useEffect(() => {
    getWhyChooseUsData().then(setData);
  }, []);

  const iconMap: Record<string, any> = {
    Sparkles: Sparkles,
    Award: Award,
    Star: Star,
    ShieldCheck: ShieldCheck,
    Heart: Heart,
    CheckCircle2: CheckCircle2,
    CalendarCheck: CalendarCheck,
    MessageCircle: MessageCircle,
    Check: Check,
    HelpCircle: HelpCircle,
    User: User,
  };

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/15 to-transparent -z-10" />
      
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading 
          eyebrow={data.eyebrow} 
          title={<>{data.titleMain} <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">{data.titleCursive}</span></>} 
        />
        
        <div className="mt-12 grid gap-10 lg:grid-cols-12 items-center">
          {/* Asymmetrical Left Value Proposition Card */}
          <div className="lg:col-span-5 animate-fade-up">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-white p-8 md:p-10 shadow-xl bg-dot-pattern">
              <div className="absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full bg-secondary/30 blur-2xl" />
              
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-secondary px-3.5 py-1.5 text-xs font-bold text-primary shadow-3xs">
                <Award className="h-3.5 w-3.5" /> {data.leftCardBadge}
              </span>
              
              <h3 className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                {data.leftCardTitleMain} <span className="text-cursive font-normal text-3xl md:text-[2.25rem]">{data.leftCardTitleCursive}</span>
              </h3>
              
              <p className="mt-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
                {data.leftCardDesc}
              </p>
              
              <div className="mt-8 space-y-4 border-t border-border/40 pt-6">
                {data.leftCardBullets && data.leftCardBullets.map((bullet: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs md:text-sm font-bold text-foreground">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Asymmetrical Right Features Grid */}
          <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2 animate-fade-up">
            {data.items.map((it: any) => {
              const IconComponent = iconMap[it.icon] || ShieldCheck;
              return (
                <div 
                  key={it.t} 
                  className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary transition-all duration-500 group-hover:scale-105 group-hover:bg-primary group-hover:text-white shadow-3xs ring-4 ring-secondary/30">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-extrabold text-foreground text-base tracking-tight transition-colors duration-300 group-hover:text-primary">
                    {it.t}
                  </h4>
                  <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {it.d}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
      <SectionHeading eyebrow="Patient success stories" title={<>Loved by <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">our patients</span></>} />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.slice(0, 3).map((t, idx) => (
          <TestimonialCard key={idx} t={t} />
        ))}
      </div>
    </section>
  );
}

function GoogleReviewsSection() {
  const [clinic, setClinic] = useState(fallbackClinic);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    getClinicSettings().then(setClinic);
    getTestimonials().then(setTestimonials);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 md:pb-16">
      <div className="relative overflow-hidden rounded-[2.5rem] border bg-white/80 p-8 md:p-12 shadow-md bg-grid-pattern bg-gradient-to-br from-white/95 to-brand-frost/20">
        <div className="absolute -bottom-10 -right-10 hidden h-32 w-32 rounded-full bg-primary/10 blur-2xl md:block" />
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 shadow-sm">
              ⭐ Google Verified Patients
            </span>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-6xl font-extrabold tracking-tight text-foreground">{clinic.rating}</span>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="mt-1 text-xs font-bold text-muted-foreground">Based on {clinic.reviews}+ reviews</div>
              </div>
            </div>
            <h3 className="mt-5 text-xl font-bold text-foreground">Why patients trust Dr Jain's Skin Care Clinic</h3>
            <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Patients consistently appreciate Dr. Amit Jain's detailed diagnosis, clear communication of triggers, and ethical advice that ensures no unnecessary cosmetological treatments are pushed.
            </p>
            <div className="mt-6">
              <Button asChild className="rounded-full shadow-sm hover:shadow">
                <Link to="/testimonials">Read all verified reviews</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {testimonials.slice(1, 3).map((t, idx) => {
              const avatarColor = getAvatarColor(t.name);
              const initials = t.name ? t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "G";
              return (
                <div key={idx} className="group relative rounded-2xl border border-secondary bg-white p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                  <div className="absolute right-4 top-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.57-1.02-1.34-1.21-2.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${avatarColor} border border-black/5 shadow-3xs`}>
                      {initials}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-foreground">{t.name}</div>
                      <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{t.concern}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-medium">"{t.text}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [faqs, setFaqs] = useState(fallbackFaqs);

  useEffect(() => {
    getFAQs().then(setFaqs);
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:py-16">
      <SectionHeading eyebrow="Common doubts" title={<>Frequently asked <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">questions</span></>} />
      <Accordion type="single" collapsible className="rounded-2xl border bg-white/70 shadow-sm border-glow-hover p-2 space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`f-${i}`} className="border-b last:border-b-0 px-4 rounded-xl hover:bg-secondary/40 transition-colors">
            <AccordionTrigger className="text-left text-base font-bold text-foreground hover:no-underline py-4">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function MapSectionComponent() {
  const [clinic, setClinic] = useState(fallbackClinic);

  useEffect(() => {
    getClinicSettings().then(setClinic);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 md:pb-16">
      <SectionHeading eyebrow="Our location" title={<>Visit <span className="text-cursive font-normal text-4xl md:text-[2.75rem]">our skin clinic</span></>} description={`${clinic.address.line1}, ${clinic.address.line2}, ${clinic.address.city}.`} />
      <div className="overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">
        <iframe title="Clinic location" src={clinic.mapEmbed} className="h-[380px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}

function ContactCTASection() {
  const [clinic, setClinic] = useState(fallbackClinic);
  const [services, setServices] = useState(fallbackServices);
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("general");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getClinicSettings().then(setClinic);
    getServices().then(setServices);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setBooking(true);
    try {
      const payload = {
        name,
        phone,
        email: "",
        service,
        preferredDate: `${date}`,
        message: `Direct Website Booking. Notes: ${notes || "None"}`
      };
      await createAppointment(payload);
      toast.success("Appointment request submitted successfully!");
      setDone(true);
      setName("");
      setPhone("");
      setDate("");
      setNotes("");
    } catch (err: any) {
      toast.error("Booking failed: " + err.message);
    } finally {
      setBooking(false);
    }
  };

  const telLink = `tel:${clinic.phone.replace(/\s/g, "")}`;
  const whatsappLink = `https://wa.me/${clinic.phoneRaw}?text=${encodeURIComponent(clinic.whatsappMessage)}`;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-[2.5rem] border bg-gradient-to-br from-brand-deep via-primary to-brand-emerald p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 -z-10 opacity-35 bg-dot-pattern" />
        <div className="absolute -left-20 -top-20 hidden h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl md:block animate-pulse" />
        <div className="absolute -right-20 -bottom-20 hidden h-64 w-64 rounded-full bg-white/10 blur-3xl md:block" />
        
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: CTA values */}
          <div className="lg:col-span-5 text-left text-white space-y-4 relative z-10">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur shadow-sm">
              ✨ Direct Quick Booking
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight md:text-4xl">Ready for healthier skin & hair?</h2>
            <p className="text-white/90 text-xs md:text-sm leading-relaxed">
              Fill out this fast consultation slot request, or instantly trigger an automated booking on our WhatsApp desk. Calibrated care is just a moment away.
            </p>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-white/25">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 bg-white hover:bg-white/95 text-primary hover:-translate-y-0.5 transition-all text-xs font-extrabold shadow-md">
                <MessageCircle className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                Book via WhatsApp
              </a>
              <a href={telLink} className="inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 border border-white/30 bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 transition-all text-xs font-extrabold text-white">
                <PhoneCall className="h-4 w-4 text-white" />
                Call Helpdesk: {clinic.phone}
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 relative z-10">
            <div className="rounded-[2rem] border border-white/20 bg-white/95 p-6 md:p-8 shadow-xl text-left">
              {done ? (
                <div className="text-center py-8 space-y-4 animate-fade-up">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 font-extrabold" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground">Booking Request Submitted!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Thank you! Our front desk team will verify and confirm your clinical slot shortly.
                  </p>
                  <Button onClick={() => setDone(false)} variant="outline" className="rounded-full text-xs font-bold mt-2">
                    Book another slot
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-extrabold text-foreground tracking-tight border-b pb-2 flex items-center gap-1.5">
                    <CalendarCheck className="h-4.5 w-4.5 text-primary" />
                    Request a Direct Clinic Slot
                  </h3>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Clinical Service</label>
                      <select 
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-semibold"
                      >
                        <option value="general">General Consultation</option>
                        {services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Preferred Date *</label>
                      <input 
                        type="date" 
                        required 
                        min={new Date().toISOString().split("T")[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Brief Description of Concern</label>
                    <textarea 
                      placeholder="acne breakouts, pigmentation issues..." 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border bg-white px-3 py-2 text-xs outline-none resize-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={booking} 
                    className="w-full rounded-xl py-3 text-xs font-extrabold bg-primary hover:bg-primary/95 text-white transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {booking ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Submitting Slot Inquiry...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Confirm Slot Request
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallbackPopup() {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clinic, setClinic] = useState(fallbackClinic);

  useEffect(() => {
    getClinicSettings().then(setClinic);
    // Initial popup after 5 seconds
    const initialTimer = setTimeout(() => {
      // Check if they already submitted it in this session to prevent spamming
      const alreadySubmitted = sessionStorage.getItem("callback_submitted");
      if (!alreadySubmitted) {
        setShow(true);
        // Disable scroll when popup appears to lock the screen interaction
        document.body.style.overflow = "hidden";
      }
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    document.body.style.overflow = "unset"; // Restore scroll
    
    // Recurring interval: show again after 60 seconds of dismissal
    setTimeout(() => {
      const alreadySubmitted = sessionStorage.getItem("callback_submitted");
      if (!alreadySubmitted) {
        setShow(true);
        document.body.style.overflow = "hidden"; // Re-lock scroll
      }
    }, 60000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        phone: `+91 ${phone}`,
        email: "",
        service: "Callback Request",
        preferredDate: "ASAP",
        message: "Instant Call-Back Request from homepage slide-over popup."
      };
      await createAppointment(payload);
      sessionStorage.setItem("callback_submitted", "true");
      setSuccess(true);
      toast.success("Callback request submitted successfully!");
      
      // Close popup after 3 seconds of success message
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "unset"; // Restore scroll
      }, 3000);
    } catch (err: any) {
      toast.error("Failed to request callback: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const dynamicWhatsappLink = `https://wa.me/${clinic.phoneRaw || "919244323441"}?text=${encodeURIComponent("Hello Dr. Amit Jain's Clinic, I'd like to book an appointment and consult with you.")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* Click outside to close (acting as the lock screen backdrop) */}
      <div className="absolute inset-0 cursor-default" onClick={handleDismiss} />

      <div className="relative w-full max-w-md rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-white to-brand-frost/25 p-8 shadow-2xl animate-scale-up z-10">
        <button 
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-1.5 hover:bg-secondary/80 rounded-full text-muted-foreground transition-colors cursor-pointer border hover:text-foreground"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4 animate-scale-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h4 className="text-xl font-extrabold text-foreground">Callback Scheduled!</h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto font-bold">
              Thank you! Our front desk helpdesk team will dial your number (**+91 {phone}**) within 24 hours to assist you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary border border-primary/10 shadow-sm">
                <PhoneCall className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight">Get Call Back in 24 Hours</h3>
              <p className="text-xs text-muted-foreground font-semibold max-w-xs mx-auto leading-relaxed">
                Connect directly with Dr. Amit Jain's clinical helpdesk for guidance.
              </p>
            </div>

            {/* High-Trust Verification Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-dashed border-gray-200/80 my-4 text-[10px] text-center font-extrabold text-foreground bg-secondary/10 rounded-xl px-2">
              <div className="flex flex-col items-center gap-1.5 border-r border-gray-200 last:border-0">
                <span className="text-base select-none">🛡️</span>
                <span className="leading-tight text-[9px] uppercase tracking-wide text-muted-foreground">Verified Specialist</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 border-r border-gray-200 last:border-0">
                <span className="text-base select-none">⭐</span>
                <span className="leading-tight text-[9px] uppercase tracking-wide text-muted-foreground">4.8★ Google Rated</span>
              </div>
              <a 
                href={dynamicWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all text-emerald-600 hover:text-emerald-700 last:border-0"
              >
                <MessageCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                <span className="leading-tight text-[9px] uppercase tracking-wide text-muted-foreground">Msg on WhatsApp</span>
              </a>
            </div>

            <div className="space-y-3">
              {/* Name field */}
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  required 
                  placeholder="Enter Your Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border pl-10 pr-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-semibold bg-white"
                />
              </div>

              {/* Phone field with Country flag selector */}
              <div className="relative">
                <div className="absolute left-3.5 top-3 flex items-center gap-1">
                  <span className="text-xs font-bold text-foreground select-none">🇮🇳</span>
                  <span className="text-[10px] font-extrabold text-muted-foreground select-none">+91</span>
                </div>
                <input 
                  type="tel" 
                  required 
                  pattern="[0-9]{10}"
                  placeholder="Enter 10-Digit Mobile Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full rounded-xl border pl-16 pr-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-semibold bg-white"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl py-4 text-xs font-extrabold bg-primary hover:bg-primary/95 text-white transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:shadow-lg active:scale-[0.99] uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling call...
                </>
              ) : (
                <>
                  <PhoneCall className="h-4 w-4" />
                  Call Me Back
                </>
              )}
            </button>

            <p className="text-[9px] text-muted-foreground text-center font-semibold leading-normal block">
              🔒 Strictly Confidential. Your contact information is protected under medical privacy protocols.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
