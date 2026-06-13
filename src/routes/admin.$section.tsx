import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus, CalendarCheck, Home, Sparkles, FileText, Image as ImageIcon,
  MessageSquare, Search, Trash2, Save, ArrowLeft, Loader2, Edit3, X, HelpCircle, Phone,
  User, Award, Star, Settings, CheckCircle2, ShieldCheck, Heart, Info, BookOpen, ExternalLink
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, setDoc, doc, deleteDoc, addDoc, getDoc
} from "firebase/firestore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { clinic as fallbackClinic } from "@/lib/clinic";
import {
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  blogs as fallbackBlogs,
  galleryImages as fallbackGallery,
  faqs as fallbackFaqs
} from "@/lib/data";

// ----------------------------------------------------
// DYNAMIC IMAGE SELECTOR COMPONENT (Task 1)
// ----------------------------------------------------
function ImageSelector({
  label,
  value,
  onChange,
  accept = "image/*"
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const [gallery, setGallery] = useState<any[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!showGallery) return;

    async function loadGallery() {
      try {
        const urlsSet = new Set<string>();

        // 1. Fetch from gallery collection
        const gallerySnap = await getDocs(collection(db, "gallery"));
        gallerySnap.forEach((d) => {
          const data = d.data();
          if (data.src) urlsSet.add(data.src);
          if (data.beforeSrc) urlsSet.add(data.beforeSrc);
          if (data.afterSrc) urlsSet.add(data.afterSrc);
        });

        // 2. Fetch from services collection
        const servicesSnap = await getDocs(collection(db, "services"));
        servicesSnap.forEach((d) => {
          const data = d.data();
          if (data.imageUrl) urlsSet.add(data.imageUrl);
        });

        // 3. Fetch from blogs collection
        const blogsSnap = await getDocs(collection(db, "blogs"));
        blogsSnap.forEach((d) => {
          const data = d.data();
          if (data.cover) urlsSet.add(data.cover);
        });

        // 4. Fetch from hero/content
        try {
          const heroSnap = await getDoc(doc(db, "hero", "content"));
          if (heroSnap.exists()) {
            const data = heroSnap.data();
            if (data.imageUrl) urlsSet.add(data.imageUrl);
          }
        } catch (e) {
          console.warn("Failed to load hero images:", e);
        }

        // 5. Fetch from doctor/info
        try {
          const doctorSnap = await getDoc(doc(db, "doctor", "info"));
          if (doctorSnap.exists()) {
            const data = doctorSnap.data();
            if (data.imageUrl) urlsSet.add(data.imageUrl);
          }
        } catch (e) {
          console.warn("Failed to load doctor images:", e);
        }

        // 6. Fetch from custom uploads history
        try {
          const uploadsSnap = await getDocs(collection(db, "cloudinary_images"));
          uploadsSnap.forEach((d) => {
            const data = d.data();
            if (data.src) urlsSet.add(data.src);
          });
        } catch (e) {
          console.warn("Failed to load custom uploads:", e);
        }

        // Add default/fallback gallery items
        fallbackGallery.forEach((item: any) => {
          if (item.src) urlsSet.add(item.src);
          if (item.beforeSrc) urlsSet.add(item.beforeSrc);
          if (item.afterSrc) urlsSet.add(item.afterSrc);
        });

        // Convert the set to a list of gallery items
        const list = Array.from(urlsSet).map((url) => ({
          src: url,
          caption: url.includes("cloudinary") ? "Cloudinary Upload" : "Website Asset"
        }));

        setGallery(list);
      } catch (e) {
        setGallery(fallbackGallery);
      }
    }
    loadGallery();
  }, [showGallery]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Missing Cloudinary environment variables.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      if (result.secure_url) {
        onChange(result.secure_url);
        toast.success("File uploaded to Cloudinary successfully!");

        // Log upload to Firestore history so it is always selectable
        try {
          await addDoc(collection(db, "cloudinary_images"), {
            src: result.secure_url,
            uploadedAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn("Failed to log Cloudinary upload to Firestore:", dbErr);
        }
      } else {
        throw new Error(result.error?.message || "Upload did not return secure URL.");
      }
    } catch (err: any) {
      console.warn("Cloudinary upload failed, using local Base64 fallback:", err.message || err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
          toast.success("File selected from computer!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 border rounded-2xl p-4 bg-secondary/5 mt-2">
      <label className="text-xs font-bold text-muted-foreground uppercase block">{label}</label>

      {/* Current Preview */}
      {value && (
        <div className="relative aspect-video max-w-xs rounded-xl overflow-hidden border bg-muted group shadow-sm">
          {value.endsWith(".mp4") || value.includes("/video/") || value.startsWith("data:video/") ? (
            <video src={value} className="h-full w-full object-contain bg-black" muted loop autoPlay playsInline />
          ) : (
            <img src={value} alt="Selected" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 rounded-full p-1.5 bg-black/60 text-white hover:bg-black/85 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {/* Computer Upload */}
        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-white hover:bg-secondary/15 text-xs font-bold text-foreground cursor-pointer shadow-sm transition-all active:scale-95">
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          <span>{uploading ? "Uploading..." : "Upload from Computer"}</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>

        {/* Gallery Select Toggle */}
        <button
          type="button"
          onClick={() => setShowGallery(!showGallery)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold shadow-sm transition-all active:scale-95 ${
            showGallery ? "bg-primary text-primary-foreground border-primary animate-pulse" : "bg-white hover:bg-secondary/15 text-foreground"
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Choose from Gallery</span>
        </button>
      </div>

      {/* Selectable Gallery Grid */}
      {showGallery && (
        <div className="border-t pt-3 mt-3 animate-fade-down">
          <div className="text-[11px] font-extrabold text-muted-foreground mb-2 uppercase">Select an image from gallery:</div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1.5 border rounded-xl bg-white">
            {gallery.map((g, idx) => (
              <button
                key={g.id || idx}
                type="button"
                onClick={() => {
                  onChange(g.src);
                  setShowGallery(false);
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border bg-muted hover:border-primary/50 transition-all ${
                  value === g.src ? "ring-2 ring-primary border-primary scale-95" : ""
                }`}
              >
                <img src={g.src} alt={g.caption || "Gallery item"} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// COMMA SEPARATED INPUT COMPONENT
// ----------------------------------------------------
function CommaSeparatedInput({
  value,
  onChange,
  className,
  placeholder
}: {
  value: string[];
  onChange: (newValue: string[]) => void;
  className?: string;
  placeholder?: string;
}) {
  const [localVal, setLocalVal] = useState(() => value ? value.join(", ") : "");

  useEffect(() => {
    const parentStr = value ? value.join(", ") : "";
    const currentArray = localVal.split(",").map(x => x.trim()).filter(Boolean);
    const parentArray = value || [];

    const isArraysEqual = currentArray.length === parentArray.length &&
      currentArray.every((v, i) => v === parentArray[i]);

    if (!isArraysEqual) {
      setLocalVal(parentStr);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalVal(newValue);
    const parsedArray = newValue.split(",").map(x => x.trim()).filter(Boolean);
    onChange(parsedArray);
  };

  return (
    <input
      type="text"
      value={localVal}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
    />
  );
}

export const Route = createFileRoute("/admin/$section")({
  component: AdminSection,
});

const labels: Record<string, string> = {
  homepage: "Homepage & Clinic Settings",
  services: "Clinic Services & Catalog",
  blogs: "Blog Post Panel",
  gallery: "Gallery Image Assets",
  appointments: "Patient Appointments",
  testimonials: "Google Reviews Manager",
  seo: "SEO Titles & Meta",
  faqs: "FAQ Registry",
};

function AdminSection() {
  const { section } = Route.useParams();
  const navigate = useNavigate();
  const title = labels[section] ?? "CMS Management Panel";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // 1. Form States for Homepage Settings
  const [clinicSettings, setClinicSettings] = useState<any>(null);
  const [heroSettings, setHeroSettings] = useState<any>(null);
  const [doctorSettings, setDoctorSettings] = useState<any>(null);
  const [specialtiesSettings, setSpecialtiesSettings] = useState<any>(null);
  const [whyChooseUsSettings, setWhyChooseUsSettings] = useState<any>(null);
  const [videoSettings, setVideoSettings] = useState<any>({ videoUrl: "", title: "", thumbnailUrl: "", isActive: false });

  // 2. Generic Add Item States
  const [newService, setNewService] = useState({
    title: "",
    slug: "",
    short: "",
    icon: "Sparkles",
    overview: "",
    symptomsStr: "",
    causesStr: "",
    benefitsStr: "",
    process: [] as { step: string; detail: string }[],
    faqs: [] as { q: string; a: string }[],
    imageUrl: ""
  });
  const [newStep, setNewStep] = useState({ step: "", detail: "" });
  const [newFaqItem, setNewFaqItem] = useState({ q: "", a: "" });

  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "Acne",
    cover: "",
    readMins: 5,
    bodyStr: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [newTestimonial, setNewTestimonial] = useState({ name: "", rating: 5, concern: "Acne", text: "", date: "Today" });
  const [newGallery, setNewGallery] = useState({ src: "", beforeSrc: "", afterSrc: "", category: "Clinic", caption: "", serviceSlug: "" });
  const [galleryAssetType, setGalleryAssetType] = useState<"standard" | "beforeAfter">("standard");
  const [galleryCatFilter, setGalleryCatFilter] = useState("All");
  const [adminGallerySearch, setAdminGallerySearch] = useState("");
  const [galleryServicesList, setGalleryServicesList] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ q: "", a: "", category: "General" });

  // 3. SEO Settings State
  const [seoSettings, setSeoSettings] = useState<any>({ title: "", description: "", canonicalUrl: "" });

  // 3.5 Redesigned Active Tabs
  const [homepageTab, setHomepageTab] = useState<"contact" | "hero" | "doctor" | "specialties" | "whychoose" | "resultsVideo">("contact");
  const [servicesTab, setServicesTab] = useState<"add" | "manage">("manage");
  const [blogsTab, setBlogsTab] = useState<"add" | "manage">("manage");
  const [testimonialsTab, setTestimonialsTab] = useState<"add" | "manage">("manage");
  const [faqsTab, setFaqsTab] = useState<"add" | "manage">("manage");
  const [galleryTab, setGalleryTab] = useState<"add" | "manage">("manage");

  // 4. Editing State
  const [editingItem, setEditingItem] = useState<any>(null);

  // 5. Appointment Filter and Sort States (Task 5)
  const [apptSearch, setApptSearch] = useState("");
  const [apptFilterStatus, setApptFilterStatus] = useState("All");
  const [apptFilterService, setApptFilterService] = useState("All");
  const [apptSort, setApptSort] = useState("newest");

  useEffect(() => {
    async function loadSectionData() {
      setLoading(true);
      try {
        if (section === "appointments") {
          const snap = await getDocs(collection(db, "appointments"));
          const list: any[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setData(list);
        } else if (section === "homepage") {
          const snapSettings = await getDocs(collection(db, "settings"));
          let clinicData = fallbackClinic;
          snapSettings.forEach((d) => {
            if (d.id === "clinic") clinicData = d.data() as any;
          });
          setClinicSettings(clinicData);

          const snapHero = await getDocs(collection(db, "hero"));
          let heroData = {
            title: "Beautiful, healthy skin starts with expert clinical care",
            subtitle: "Advanced dermatology, cosmetology, and laser solutions customized for Indian skin.",
            imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=70",
            ctaText: "Book Appointment",
            rating: 4.8,
            reviewsCount: 140,
            stats: [
              { value: "10+", label: "Years of Experience" },
              { value: "15,000+", label: "Happy Patients" },
              { value: "4.8★", label: "Google Rating" },
              { value: "20+", label: "Treatments Offered" },
            ]
          };
          snapHero.forEach((d) => {
            if (d.id === "content") heroData = d.data() as any;
          });
          setHeroSettings(heroData);

          const docSnap = await getDoc(doc(db, "doctor", "info"));
          let doctorData = {
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
            publications: []
          };
          if (docSnap.exists()) {
            doctorData = docSnap.data() as any;
          }
          setDoctorSettings(doctorData);

          const specSnap = await getDoc(doc(db, "homepage", "specialties"));
          if (specSnap.exists()) {
            setSpecialtiesSettings(specSnap.data());
          } else {
            setSpecialtiesSettings({
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
          }

          const wcuSnap = await getDoc(doc(db, "homepage", "whyChooseUs"));
          if (wcuSnap.exists()) {
            setWhyChooseUsSettings(wcuSnap.data());
          } else {
            setWhyChooseUsSettings({
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
          }

          const vidSnap = await getDoc(doc(db, "homepage", "beforeAfterVideo"));
          if (vidSnap.exists()) {
            setVideoSettings(vidSnap.data());
          } else {
            setVideoSettings({
              videoUrl: "",
              title: "Clinical Treatment Walkthrough",
              thumbnailUrl: "",
              isActive: false
            });
          }
        } else if (section === "services") {
          const snap = await getDocs(collection(db, "services"));
          const list: any[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setData(list.length > 0 ? list : fallbackServices);
        } else if (section === "blogs") {
          const snap = await getDocs(collection(db, "blogs"));
          const list: any[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setData(list.length > 0 ? list : fallbackBlogs);
        } else if (section === "testimonials") {
          const snap = await getDocs(collection(db, "testimonials"));
          const list: any[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setData(list.length > 0 ? list : fallbackTestimonials);
        } else if (section === "gallery") {
          const snap = await getDocs(collection(db, "gallery"));
          const list: any[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setData(list.length > 0 ? list : fallbackGallery);

          // Also fetch services list for gallery item linking
          try {
            const servSnap = await getDocs(collection(db, "services"));
            const servList: any[] = [];
            servSnap.forEach((d) => servList.push({ id: d.id, ...d.data() }));
            setGalleryServicesList(servList.length > 0 ? servList : fallbackServices);
          } catch (err) {
            console.error("Failed to load services in admin gallery section:", err);
            setGalleryServicesList(fallbackServices);
          }
        } else if (section === "seo") {
          const docSnap = await getDoc(doc(db, "seo", "home"));
          let seoData = {
            title: "Dr Jain's Skin Care Clinic | Dermatologist in Katraj, Pune",
            description: "Advanced skin, hair and cosmetology care in Katraj, Pune by Dr. Amit Jain (MBBS, MD). 4.8★ rated. Book an appointment today.",
            canonicalUrl: "/",
          };
          if (docSnap.exists()) {
            seoData = docSnap.data() as any;
          }
          setSeoSettings(seoData);
        } else if (section === "faqs") {
          const snap = await getDocs(collection(db, "faq"));
          const list: any[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setData(list.length > 0 ? list : fallbackFaqs);
        }
      } catch (error) {
        console.error("Error loading CMS section: ", error);
      } finally {
        setLoading(false);
      }
    }
    loadSectionData();
  }, [section]);

  const handleSaveHomepage = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "clinic"), clinicSettings);
      await setDoc(doc(db, "hero", "content"), heroSettings);
      if (doctorSettings) {
        await setDoc(doc(db, "doctor", "info"), doctorSettings);
      }
      if (specialtiesSettings) {
        await setDoc(doc(db, "homepage", "specialties"), specialtiesSettings);
      }
      if (whyChooseUsSettings) {
        const cleanedWhyChooseUs = {
          ...whyChooseUsSettings,
          leftCardBullets: whyChooseUsSettings.leftCardBullets
            ? whyChooseUsSettings.leftCardBullets.map((x: string) => x.trim()).filter(Boolean)
            : []
        };
        await setDoc(doc(db, "homepage", "whyChooseUs"), cleanedWhyChooseUs);
      }
      if (videoSettings) {
        await setDoc(doc(db, "homepage", "beforeAfterVideo"), videoSettings);
      }
      toast.success("Homepage & Clinic configuration saved!");
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSEO = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "seo", "home"), seoSettings);
      toast.success("SEO Meta Settings successfully updated!");
    } catch (err: any) {
      toast.error("Failed to save SEO: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Expanded Service catalog integration (Task 3)
  const handleAddService = async () => {
    if (!newService.title || !newService.slug) return toast.error("Provide title and slug!");
    setSaving(true);
    try {
      const payload = {
        title: newService.title,
        slug: newService.slug,
        short: newService.short,
        icon: newService.icon,
        overview: newService.overview || "Service details to be updated.",
        symptoms: newService.symptomsStr.split(",").map(x => x.trim()).filter(Boolean),
        causes: newService.causesStr.split(",").map(x => x.trim()).filter(Boolean),
        benefits: newService.benefitsStr.split(",").map(x => x.trim()).filter(Boolean),
        process: newService.process.length > 0 ? newService.process : [{ step: "Dermal Evaluation", detail: "Assess current markers." }],
        faqs: newService.faqs.length > 0 ? newService.faqs : [{ q: "Is this safe?", a: "Yes, it is dermatologically tested." }],
        imageUrl: newService.imageUrl || ""
      };
      await setDoc(doc(db, "services", newService.slug), payload);
      toast.success("New treatment catalog details added!");
      setData((prev) => [...prev, { id: newService.slug, ...payload }]);
      setNewService({
        title: "",
        slug: "",
        short: "",
        icon: "Sparkles",
        overview: "",
        symptomsStr: "",
        causesStr: "",
        benefitsStr: "",
        process: [],
        faqs: [],
        imageUrl: ""
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upgraded Blog Publication Form (Task 4)
  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.slug) return toast.error("Provide title and slug!");
    setSaving(true);
    try {
      const payload = {
        title: newBlog.title,
        slug: newBlog.slug,
        excerpt: newBlog.excerpt,
        category: newBlog.category,
        date: newBlog.date,
        cover: newBlog.cover || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=70",
        readMins: newBlog.readMins || 5,
        body: newBlog.bodyStr.split("\n\n").filter(Boolean)
      };
      await setDoc(doc(db, "blogs", newBlog.slug), payload);
      toast.success("Blog article published!");
      setData((prev) => [...prev, { id: newBlog.slug, ...payload }]);
      setNewBlog({
        title: "",
        slug: "",
        excerpt: "",
        category: "Acne",
        cover: "",
        readMins: 5,
        bodyStr: "",
        date: new Date().toISOString().split("T")[0]
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) return toast.error("Provide name and review text!");
    setSaving(true);
    try {
      const payload = {
        ...newTestimonial,
        initials: newTestimonial.name.split(" ").map((x) => x[0]).join("")
      };
      const docRef = await addDoc(collection(db, "testimonials"), payload);
      toast.success("Testimonial review added!");
      setData((prev) => [...prev, { id: docRef.id, ...payload }]);
      setNewTestimonial({ name: "", rating: 5, concern: "Acne", text: "", date: "Today" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGallery = async () => {
    if (galleryAssetType === "standard") {
      if (!newGallery.src) return toast.error("Provide a valid image URL!");
    } else {
      if (!newGallery.beforeSrc || !newGallery.afterSrc) {
        return toast.error("Provide both Before and After image URLs!");
      }
    }
    setSaving(true);
    try {
      const payload = galleryAssetType === "standard"
        ? { src: newGallery.src, category: newGallery.category, caption: newGallery.caption, serviceSlug: newGallery.serviceSlug || "", createdAt: new Date().toISOString() }
        : { beforeSrc: newGallery.beforeSrc, afterSrc: newGallery.afterSrc, category: "Before & After", caption: newGallery.caption, serviceSlug: newGallery.serviceSlug || "", createdAt: new Date().toISOString() };
         
      const docRef = await addDoc(collection(db, "gallery"), payload);
      toast.success("New gallery asset successfully added!");
      setData((prev) => [...prev, { id: docRef.id, ...payload }]);
      setNewGallery({ src: "", beforeSrc: "", afterSrc: "", category: "Clinic", caption: "", serviceSlug: "" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFAQ = async () => {
    if (!newFaq.q || !newFaq.a) return toast.error("Provide question and answer!");
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "faq"), newFaq);
      toast.success("New FAQ successfully added!");
      setData((prev) => [...prev, { id: docRef.id, ...newFaq }]);
      setNewFaq({ q: "", a: "", category: "General" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      let colName = "";
      let docId = editingItem.slug || editingItem.id;

      if (section === "services") {
        colName = "services";
      } else if (section === "blogs") {
        colName = "blogs";
      } else if (section === "testimonials") {
        colName = "testimonials";
        docId = editingItem.id;
      } else if (section === "gallery") {
        colName = "gallery";
        docId = editingItem.id;
      } else if (section === "faqs") {
        colName = "faq";
        docId = editingItem.id;
      }

      if (!colName || !docId) {
        throw new Error("Could not determine document context.");
      }

      await setDoc(doc(db, colName, docId), editingItem);
      toast.success("Document updated successfully!");

      setData((prev) =>
        prev.map((item) =>
          (item.id === editingItem.id || item.slug === editingItem.slug) ? editingItem : item
        )
      );
      setEditingItem(null);
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (col: string, id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast.success("Document deleted!");
      setData((prev) => prev.filter((d) => d.id !== id && d.slug !== id));
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  // Appointment Status Modification Trigger (Task 5)
  const handleUpdateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      const apptDoc = data.find((x) => x.id === id);
      if (!apptDoc) return;
      await setDoc(doc(db, "appointments", id), {
        ...apptDoc,
        status: newStatus
      });
      toast.success(`Appointment status updated to ${newStatus}!`);
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground font-bold">Fetching clinic records...</span>
      </div>
    );
  }

  // Filter & Sort Logic for Logged Patient Appointments (Task 5)
  const filteredAppointments = data
    .filter((appt) => {
      const searchStr = `${appt.name || ""} ${appt.email || ""} ${appt.phone || ""} ${appt.service || ""} ${appt.message || ""}`.toLowerCase();
      const matchesSearch = searchStr.includes(apptSearch.toLowerCase());

      const status = appt.status || "Pending";
      const matchesStatus = apptFilterStatus === "All" || status.toLowerCase() === apptFilterStatus.toLowerCase();

      const matchesService = apptFilterService === "All" || appt.service === apptFilterService;

      return matchesSearch && matchesStatus && matchesService;
    })
    .sort((a, b) => {
      if (apptSort === "newest") {
        return new Date(b.createdAt || b.preferredDate).getTime() - new Date(a.createdAt || a.preferredDate).getTime();
      }
      if (apptSort === "oldest") {
        return new Date(a.createdAt || a.preferredDate).getTime() - new Date(b.createdAt || b.preferredDate).getTime();
      }
      if (apptSort === "nameAsc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (apptSort === "nameDesc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={() => navigate({ to: "/admin" })} variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground font-semibold">Manage your clinic database details for: {section}</p>
        </div>
      </div>

      {/* RENDER DYNAMIC SECTION FORMS */}

      {/* 1. HOMEPAGE & SETTINGS */}
      {section === "homepage" && clinicSettings && heroSettings && (
        <div className="space-y-6">
          {/* Header Card with Navigation Tabs */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary animate-spin-slow" /> Homepage & Profile Settings
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Customize your clinic information, biography, banner, and key home sections.</p>
              </div>
              <Button onClick={handleSaveHomepage} disabled={saving} className="rounded-xl font-bold shadow-md self-end md:self-auto bg-primary">
                {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                Save All Home Configuration
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-secondary/35 p-1.5 rounded-2xl">
              {[
                { id: "contact", label: "📞 Contact Info" },
                { id: "hero", label: "🖼️ Hero Banner" },
                { id: "doctor", label: "👨‍⚕️ Doctor Biography" },
                { id: "specialties", label: "✨ Specialties Copy" },
                { id: "whychoose", label: "🤝 Why Choose Us" },
                { id: "resultsVideo", label: "🎥 Patient Results Video" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setHomepageTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    homepageTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content 1: Contact Details */}
          {homepageTab === "contact" && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Contact Settings Info</strong>
                  This updates your brand name, phone, and email shown in the header, footer, and contact page. Make sure the phone number matches your active WhatsApp.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinic Brand Name</label>
                  <input type="text" value={clinicSettings.name} onChange={(e) => setClinicSettings({ ...clinicSettings, name: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinic Tagline</label>
                  <input type="text" value={clinicSettings.tagline} onChange={(e) => setClinicSettings({ ...clinicSettings, tagline: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Phone Number (WhatsApp Direct)</label>
                  <input type="text" value={clinicSettings.phone} onChange={(e) => setClinicSettings({ ...clinicSettings, phone: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinic Email Address</label>
                  <input type="text" value={clinicSettings.email} onChange={(e) => setClinicSettings({ ...clinicSettings, email: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Hero Banner */}
          {homepageTab === "hero" && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Hero Banner Info</strong>
                  This updates the top banner section of your homepage. We recommend keeping titles short and using a high-quality clinic or treatment image (1200x700).
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Badge Capsule Text (e.g. "Topper MD")</label>
                    <input type="text" value={heroSettings.badgeText || ""} onChange={(e) => setHeroSettings({ ...heroSettings, badgeText: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Hero Title Main Heading</label>
                    <input type="text" value={heroSettings.title} onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Hero Title Cursive Part</label>
                    <input type="text" value={heroSettings.titleCursive || ""} onChange={(e) => setHeroSettings({ ...heroSettings, titleCursive: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Hero Title Suffix Part</label>
                    <input type="text" value={heroSettings.titleSuffix || ""} onChange={(e) => setHeroSettings({ ...heroSettings, titleSuffix: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Happy Patients Stat Text</label>
                    <input type="text" value={heroSettings.happyPatientsText || ""} onChange={(e) => setHeroSettings({ ...heroSettings, happyPatientsText: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Doctor Card Highlight Info</label>
                    <input type="text" value={heroSettings.doctorCardHighlight || ""} onChange={(e) => setHeroSettings({ ...heroSettings, doctorCardHighlight: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Hero Subtitle Paragraph</label>
                  <textarea value={heroSettings.subtitle} onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-20 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Call-To-Action Button Text</label>
                  <input type="text" value={heroSettings.ctaText} onChange={(e) => setHeroSettings({ ...heroSettings, ctaText: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                
                <ImageSelector 
                  label="Hero Banner Image Asset"
                  value={heroSettings.imageUrl || ""}
                  onChange={(url) => setHeroSettings({ ...heroSettings, imageUrl: url })}
                />
              </div>
            </div>
          )}

          {/* Tab Content 3: Doctor Biography */}
          {homepageTab === "doctor" && doctorSettings && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Doctor Biography Info</strong>
                  This updates your biography, credentials, and published research papers shown on the **About the Doctor** page. Remember to add clear years/DOIs for publications.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Doctor Name</label>
                  <input type="text" value={doctorSettings.name || ""} onChange={(e) => setDoctorSettings({ ...doctorSettings, name: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Specialist Role Title</label>
                  <input type="text" value={doctorSettings.role || ""} onChange={(e) => setDoctorSettings({ ...doctorSettings, role: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                
                <div className="sm:col-span-2">
                  <ImageSelector 
                    label="Doctor Avatar Profile Image"
                    value={doctorSettings.imageUrl || ""}
                    onChange={(url) => setDoctorSettings({ ...doctorSettings, imageUrl: url })}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinical Biography Description</label>
                  <textarea value={doctorSettings.bio || ""} onChange={(e) => setDoctorSettings({ ...doctorSettings, bio: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-24 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>

                {/* Publications Editor (Peer-Reviewed) */}
                <div className="sm:col-span-2 border-t pt-4 mt-2">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary" /> Peer-Reviewed Publications ({doctorSettings.publications?.length || 0})</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPubs = doctorSettings.publications ? [...doctorSettings.publications] : [];
                        newPubs.push({
                          title: "",
                          journal: "",
                          journalShort: "",
                          authors: "",
                          year: new Date().getFullYear().toString(),
                          volume: "",
                          doi: "",
                          url: "",
                          type: "Case Report",
                          level: "International",
                          color: "from-blue-600 to-blue-800"
                        });
                        setDoctorSettings({ ...doctorSettings, publications: newPubs });
                      }}
                      className="h-8 text-xs rounded-xl font-bold shadow-sm"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Publication
                    </Button>
                  </h3>

                  <div className="space-y-4">
                    {doctorSettings.publications && doctorSettings.publications.map((pub: any, idx: number) => (
                      <div key={idx} className="border rounded-2xl p-4 bg-secondary/5 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newPubs = doctorSettings.publications.filter((_: any, i: number) => i !== idx);
                            setDoctorSettings({ ...doctorSettings, publications: newPubs });
                          }}
                          className="absolute top-3 right-3 text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="font-extrabold text-xs text-primary">Publication #{idx + 1}</div>
                        
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Title</label>
                            <input
                              type="text"
                              value={pub.title || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, title: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Journal Full Name</label>
                            <input
                              type="text"
                              value={pub.journal || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, journal: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Journal Short Name</label>
                            <input
                              type="text"
                              value={pub.journalShort || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, journalShort: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Authors (comma separated)</label>
                            <input
                              type="text"
                              value={pub.authors || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, authors: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Year</label>
                            <input
                              type="text"
                              value={pub.year || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, year: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Volume / Issue</label>
                            <input
                              type="text"
                              value={pub.volume || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, volume: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">DOI</label>
                            <input
                              type="text"
                              value={pub.doi || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, doi: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">URL Link</label>
                            <input
                              type="text"
                              value={pub.url || ""}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, url: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Type</label>
                            <select
                              value={pub.type || "Case Report"}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, type: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            >
                              <option value="Case Report">Case Report</option>
                              <option value="Original Research">Original Research</option>
                              <option value="Review Article">Review Article</option>
                              <option value="Short Communication">Short Communication</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Level</label>
                            <select
                              value={pub.level || "International"}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, level: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            >
                              <option value="International">International</option>
                              <option value="National">National</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Theme Gradient Color</label>
                            <select
                              value={pub.color || "from-blue-600 to-blue-800"}
                              onChange={(e) => {
                                const newPubs = [...doctorSettings.publications];
                                newPubs[idx] = { ...pub, color: e.target.value };
                                setDoctorSettings({ ...doctorSettings, publications: newPubs });
                              }}
                              className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                            >
                              <option value="from-blue-600 to-blue-800">Blue Gradient</option>
                              <option value="from-orange-500 to-orange-700">Orange Gradient</option>
                              <option value="from-purple-600 to-purple-800">Purple Gradient</option>
                              <option value="from-emerald-600 to-emerald-800">Emerald Gradient</option>
                              <option value="from-red-600 to-red-800">Red Gradient</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Specialties */}
          {homepageTab === "specialties" && specialtiesSettings && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Specialties Section Info</strong>
                  This section configures the treatments categories shown on the homepage (usually Skin, Hair, Cosmetology). Recommend keeping descriptions concise.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Section Eyebrow</label>
                  <input type="text" value={specialtiesSettings.eyebrow || ""} onChange={(e) => setSpecialtiesSettings({ ...specialtiesSettings, eyebrow: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Title Main Part</label>
                  <input type="text" value={specialtiesSettings.titleMain || ""} onChange={(e) => setSpecialtiesSettings({ ...specialtiesSettings, titleMain: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Title Cursive Part</label>
                  <input type="text" value={specialtiesSettings.titleCursive || ""} onChange={(e) => setSpecialtiesSettings({ ...specialtiesSettings, titleCursive: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Title Suffix Part</label>
                  <input type="text" value={specialtiesSettings.titleSuffix || ""} onChange={(e) => setSpecialtiesSettings({ ...specialtiesSettings, titleSuffix: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Section Description</label>
                  <textarea value={specialtiesSettings.description || ""} onChange={(e) => setSpecialtiesSettings({ ...specialtiesSettings, description: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-20 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-foreground">Specialties Cards (3 Cards)</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {specialtiesSettings.items && specialtiesSettings.items.map((item: any, idx: number) => (
                    <div key={idx} className="border rounded-2xl p-4 space-y-3 bg-secondary/5">
                      <div className="font-extrabold text-xs text-primary">Card #{idx + 1}</div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Title</label>
                        <input type="text" value={item.title || ""} onChange={(e) => {
                          const newItems = [...specialtiesSettings.items];
                          newItems[idx] = { ...item, title: e.target.value };
                          setSpecialtiesSettings({ ...specialtiesSettings, items: newItems });
                        }} className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Icon</label>
                        <select value={item.icon || "Sparkles"} onChange={(e) => {
                          const newItems = [...specialtiesSettings.items];
                          newItems[idx] = { ...item, icon: e.target.value };
                          setSpecialtiesSettings({ ...specialtiesSettings, items: newItems });
                        }} className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none">
                          <option value="Sparkles">Sparkles</option>
                          <option value="Award">Award</option>
                          <option value="Star">Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Description</label>
                        <textarea value={item.desc || ""} onChange={(e) => {
                          const newItems = [...specialtiesSettings.items];
                          newItems[idx] = { ...item, desc: e.target.value };
                          setSpecialtiesSettings({ ...specialtiesSettings, items: newItems });
                        }} className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white h-16 resize-none outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Featured Tags (comma separated)</label>
                        <CommaSeparatedInput
                          value={item.tags || []}
                          onChange={(newTags) => {
                            const newItems = [...specialtiesSettings.items];
                            newItems[idx] = { ...item, tags: newTags };
                            setSpecialtiesSettings({ ...specialtiesSettings, items: newItems });
                          }}
                          className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 5: Why Choose Us */}
          {homepageTab === "whychoose" && whyChooseUsSettings && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Why Choose Us Info</strong>
                  This updates the value propositions and reasons why patients should consult you. Keep bullets clear and one per line.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Section Eyebrow</label>
                  <input type="text" value={whyChooseUsSettings.eyebrow || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, eyebrow: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Title Main Part</label>
                  <input type="text" value={whyChooseUsSettings.titleMain || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, titleMain: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Title Cursive Part</label>
                  <input type="text" value={whyChooseUsSettings.titleCursive || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, titleCursive: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Left Card Badge</label>
                  <input type="text" value={whyChooseUsSettings.leftCardBadge || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, leftCardBadge: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Left Card Title Main Part</label>
                  <input type="text" value={whyChooseUsSettings.leftCardTitleMain || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, leftCardTitleMain: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Left Card Title Cursive Part</label>
                  <input type="text" value={whyChooseUsSettings.leftCardTitleCursive || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, leftCardTitleCursive: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Left Card Description</label>
                  <textarea value={whyChooseUsSettings.leftCardDesc || ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, leftCardDesc: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-20 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Left Card Bullet Points (One per line)</label>
                  <textarea value={whyChooseUsSettings.leftCardBullets ? whyChooseUsSettings.leftCardBullets.join("\n") : ""} onChange={(e) => setWhyChooseUsSettings({ ...whyChooseUsSettings, leftCardBullets: e.target.value.split("\n") })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-24 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-foreground">Why Choose Value Cards (4 Cards)</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {whyChooseUsSettings.items && whyChooseUsSettings.items.map((item: any, idx: number) => (
                    <div key={idx} className="border rounded-2xl p-4 space-y-3 bg-secondary/5">
                      <div className="font-extrabold text-xs text-primary">Value Card #{idx + 1}</div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Title</label>
                        <input type="text" value={item.t || ""} onChange={(e) => {
                          const newItems = [...whyChooseUsSettings.items];
                          newItems[idx] = { ...item, t: e.target.value };
                          setWhyChooseUsSettings({ ...whyChooseUsSettings, items: newItems });
                        }} className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Icon</label>
                        <select value={item.icon || "Award"} onChange={(e) => {
                          const newItems = [...whyChooseUsSettings.items];
                          newItems[idx] = { ...item, icon: e.target.value };
                          setWhyChooseUsSettings({ ...whyChooseUsSettings, items: newItems });
                        }} className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white outline-none">
                          <option value="Award">Award</option>
                          <option value="ShieldCheck">ShieldCheck</option>
                          <option value="Heart">Heart</option>
                          <option value="CheckCircle2">CheckCircle2</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Description</label>
                        <textarea value={item.d || ""} onChange={(e) => {
                          const newItems = [...whyChooseUsSettings.items];
                          newItems[idx] = { ...item, d: e.target.value };
                          setWhyChooseUsSettings({ ...whyChooseUsSettings, items: newItems });
                        }} className="w-full rounded-xl border px-2.5 py-1.5 text-xs bg-white h-16 resize-none outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {homepageTab === "resultsVideo" && videoSettings && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Patient Results Video Settings</strong>
                  Configure a showcase video displaying clinic treatments or before-and-after results. If enabled, this video will appear side-by-side with your before-and-after photo comparison cards on the homepage.
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-foreground select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoSettings.isActive || false}
                        onChange={(e) => setVideoSettings({ ...videoSettings, isActive: e.target.checked })}
                        className="rounded border-primary/30 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                      />
                      <span>Show video on homepage results section</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Video Title / Caption</label>
                    <input
                      type="text"
                      value={videoSettings.title || ""}
                      onChange={(e) => setVideoSettings({ ...videoSettings, title: e.target.value })}
                      placeholder="e.g. PRP Hair density treatment walkthrough"
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <ImageSelector
                    label="Before/After Video (.mp4 file)"
                    value={videoSettings.videoUrl || ""}
                    onChange={(url) => setVideoSettings({ ...videoSettings, videoUrl: url })}
                    accept="video/*"
                  />

                  <ImageSelector
                    label="Video Thumbnail Image (Optional Poster)"
                    value={videoSettings.thumbnailUrl || ""}
                    onChange={(url) => setVideoSettings({ ...videoSettings, thumbnailUrl: url })}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save bar */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveHomepage} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary">
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              Save All Home Configuration
            </Button>
          </div>
        </div>
      )}

      {/* 2. CLINIC SERVICES (Task 3) */}
      {section === "services" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card with Navigation Tabs */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Clinic Services Catalog
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage the treatments, clinical processes, and FAQs displayed to patients.</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1.5 bg-secondary/35 p-1.5 rounded-2xl w-fit">
              {[
                { id: "manage", label: "📋 Manage Treatments" },
                { id: "add", label: "➕ Add New Treatment" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setServicesTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    servicesTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {servicesTab === "add" ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Add Treatment Details</strong>
                  Create a new clinical service entry. The unique slug identifier acts as the web link address (e.g. <code>hydrafacial-glow</code> maps to <code>/services/hydrafacial-glow</code>).
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Treatment Name</label>
                  <input type="text" placeholder="Hydrafacial Treatment" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Unique Slug Identifier</label>
                  <input type="text" placeholder="hydrafacial-glow" value={newService.slug} onChange={(e) => setNewService({ ...newService, slug: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Service Icon (Visual SVG Representation)</label>
                  <select value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Sparkles">Sparkles</option>
                    <option value="Sun">Sun</option>
                    <option value="Droplet">Droplet</option>
                    <option value="Scissors">Scissors</option>
                    <option value="Layers">Layers</option>
                    <option value="Star">Star</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Reference Image (Optional)</label>
                  <ImageSelector
                    label="Pick Service Image"
                    value={newService.imageUrl || ""}
                    onChange={(url) => setNewService({ ...newService, imageUrl: url })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Short Excerpt Summary</label>
                  <input type="text" placeholder="Instant hydrating facial for dull, pigmented skin." value={newService.short} onChange={(e) => setNewService({ ...newService, short: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Full In-depth Overview</label>
                  <textarea placeholder="Write a detailed explanation of what this clinical service involves, clinical procedures, technology used..." value={newService.overview} onChange={(e) => setNewService({ ...newService, overview: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-24 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              {/* Diagnostic Strings input fields */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-sm font-extrabold tracking-tight">Clinical Diagnostic Details</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Symptoms (comma separated)</label>
                    <input type="text" placeholder="Whiteheads, papules, oily skin" value={newService.symptomsStr} onChange={(e) => setNewService({ ...newService, symptomsStr: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Common Causes (comma separated)</label>
                    <input type="text" placeholder="Hormonal fluctuations, excess sebum" value={newService.causesStr} onChange={(e) => setNewService({ ...newService, causesStr: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Benefits (comma separated)</label>
                    <input type="text" placeholder="Clearer skin, controlled oil" value={newService.benefitsStr} onChange={(e) => setNewService({ ...newService, benefitsStr: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              {/* Process steps addition */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-sm font-extrabold tracking-tight">Treatment Steps Process ({newService.process.length})</h3>
                {newService.process.length > 0 && (
                  <div className="space-y-2 border rounded-xl p-3 bg-secondary/5 max-h-40 overflow-y-auto">
                    {newService.process.map((step, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-1.5 last:border-0 last:pb-0">
                        <div>
                          <span className="font-extrabold text-primary">{idx + 1}. {step.step}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{step.detail}</p>
                        </div>
                        <button type="button" onClick={() => setNewService({ ...newService, process: newService.process.filter((_, i) => i !== idx) })} className="text-destructive hover:text-destructive/80 font-bold">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2 items-end border p-4 rounded-2xl bg-secondary/5">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Step Name</label>
                    <input type="text" placeholder="e.g. Skin Analysis" value={newStep.step} onChange={(e) => setNewStep({ ...newStep, step: e.target.value })} className="w-full rounded-xl border px-3 py-1.5 text-xs bg-white outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Step Detail Description</label>
                    <input type="text" placeholder="Detailed grading and mapping triggers." value={newStep.detail} onChange={(e) => setNewStep({ ...newStep, detail: e.target.value })} className="w-full rounded-xl border px-3 py-1.5 text-xs bg-white outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!newStep.step) return toast.error("Step name is required!");
                        setNewService({ ...newService, process: [...newService.process, newStep] });
                        setNewStep({ step: "", detail: "" });
                      }}
                      className="h-8 text-xs rounded-xl font-bold shadow-sm"
                    >
                      Add Process Step
                    </Button>
                  </div>
                </div>
              </div>

              {/* FAQs addition */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-sm font-extrabold tracking-tight">Service FAQs ({newService.faqs.length})</h3>
                {newService.faqs.length > 0 && (
                  <div className="space-y-2 border rounded-xl p-3 bg-secondary/5 max-h-40 overflow-y-auto">
                    {newService.faqs.map((faq, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-1.5 last:border-0 last:pb-0">
                        <div>
                          <span className="font-extrabold text-foreground">Q: {faq.q}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">A: {faq.a}</p>
                        </div>
                        <button type="button" onClick={() => setNewService({ ...newService, faqs: newService.faqs.filter((_, i) => i !== idx) })} className="text-destructive hover:text-destructive/80 font-bold">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2 items-end border p-4 rounded-2xl bg-secondary/5">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Question</label>
                    <input type="text" placeholder="How long does it take?" value={newFaqItem.q} onChange={(e) => setNewFaqItem({ ...newFaqItem, q: e.target.value })} className="w-full rounded-xl border px-3 py-1.5 text-xs bg-white outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Answer Explanation</label>
                    <input type="text" placeholder="Most patients see improvement in 6 weeks." value={newFaqItem.a} onChange={(e) => setNewFaqItem({ ...newFaqItem, a: e.target.value })} className="w-full rounded-xl border px-3 py-1.5 text-xs bg-white outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!newFaqItem.q || !newFaqItem.a) return toast.error("Question and answer are both required!");
                        setNewService({ ...newService, faqs: [...newService.faqs, newFaqItem] });
                        setNewFaqItem({ q: "", a: "" });
                      }}
                      className="h-8 text-xs rounded-xl font-bold shadow-sm"
                    >
                      Add Service FAQ
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleAddService} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary"><Plus className="mr-1.5 h-4 w-4" /> Add Treatment</Button>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-down space-y-4">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Manage Catalog Info</strong>
                  Below are all treatments currently listed in the database. You can edit their text copy, images, diagnostic questions, or remove them completely from the live app.
                </div>
              </div>

              <div className="divide-y">
                {data.map((s) => (
                  <div key={s.slug || s.id} className="flex items-center justify-between py-3.5 hover:bg-secondary/5 px-2 rounded-xl transition-all">
                    <div>
                      <div className="font-bold text-sm text-foreground">{s.title}</div>
                      <div className="text-xs text-muted-foreground font-semibold">/services/{s.slug || s.id}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button onClick={() => setEditingItem(s)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-primary hover:bg-secondary"><Edit3 className="h-4 w-4" /></Button>
                      <Button onClick={() => handleDeleteItem("services", s.slug || s.id)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BLOG POST PANEL (Task 4) */}
      {section === "blogs" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card with Navigation Tabs */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Blog Post Panel
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Publish and manage education resources and clinical skin and hair advice articles.</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1.5 bg-secondary/35 p-1.5 rounded-2xl w-fit">
              {[
                { id: "manage", label: "📋 Published Articles" },
                { id: "add", label: "✍️ Publish Article" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBlogsTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    blogsTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {blogsTab === "add" ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Publish New Article</strong>
                  Write and publish science-backed dermatological guidelines. Note that the unique slug maps to the link address on the website (e.g. <code>/blog/your-slug</code>).
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Article Title</label>
                  <input type="text" placeholder="Dermatologist Skincare Guidelines" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Article Slug</label>
                  <input type="text" placeholder="dermatologist-skincare-guidelines" value={newBlog.slug} onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Category</label>
                  <input type="text" placeholder="Acne / Hair / Skincare" value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Reading time (minutes)</label>
                  <input type="number" placeholder="5" value={newBlog.readMins} onChange={(e) => setNewBlog({ ...newBlog, readMins: parseInt(e.target.value) || 5 })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                
                <div className="sm:col-span-2">
                  <ImageSelector
                    label="Blog cover image banner"
                    value={newBlog.cover || ""}
                    onChange={(url) => setNewBlog({ ...newBlog, cover: url })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Excerpt Summary</label>
                  <input type="text" placeholder="Science-backed dermatological tips to support your daily routines." value={newBlog.excerpt} onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Blog Body Content (separated by empty newlines for new paragraphs)</label>
                  <textarea placeholder="Write the main paragraphs here. Hit enter twice between sections..." value={newBlog.bodyStr} onChange={(e) => setNewBlog({ ...newBlog, bodyStr: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-40 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <Button onClick={handleAddBlog} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary"><Plus className="mr-1.5 h-4 w-4" /> Publish Blog</Button>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-down space-y-4">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Manage Blog Articles</strong>
                  Modify details or remove published blog articles from the live website feeds.
                </div>
              </div>

              <div className="divide-y">
                {data.map((b) => (
                  <div key={b.slug || b.id} className="flex items-center justify-between py-3.5 hover:bg-secondary/5 px-2 rounded-xl transition-all">
                    <div>
                      <div className="font-bold text-sm text-foreground">{b.title}</div>
                      <div className="text-xs text-muted-foreground font-semibold">/blog/{b.slug || b.id} · {b.category}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button onClick={() => setEditingItem(b)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-primary hover:bg-secondary"><Edit3 className="h-4 w-4" /></Button>
                      <Button onClick={() => handleDeleteItem("blogs", b.slug || b.id)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. GOOGLE REVIEWS TESTIMONIALS */}
      {section === "testimonials" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card with Navigation Tabs */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Google Reviews Manager
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Showcase and manage patient testimonials and Google reviews on the homepage.</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1.5 bg-secondary/35 p-1.5 rounded-2xl w-fit">
              {[
                { id: "manage", label: "📋 Patient Reviews" },
                { id: "add", label: "➕ Add Google Review" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTestimonialsTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    testimonialsTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {testimonialsTab === "add" ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Add New Review</strong>
                  Manually upload a 5-star Google review or patient feedback card. Specifying the clinical concern helps categorize the review.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Patient Name</label>
                  <input type="text" placeholder="Vikram Malhotra" value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinical Concern</label>
                  <input type="text" placeholder="Acne / PRP" value={newTestimonial.concern} onChange={(e) => setNewTestimonial({ ...newTestimonial, concern: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Review Text</label>
                  <textarea placeholder="Amazing experience, highly satisfying..." value={newTestimonial.text} onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-20 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <Button onClick={handleAddTestimonial} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary"><Plus className="mr-1.5 h-4 w-4" /> Add Testimonial</Button>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-down space-y-4">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Review Directory</strong>
                  List of patient testimonials showing on the home slider. You can modify their texts or remove outdated feedback entries.
                </div>
              </div>

              <div className="divide-y">
                {data.map((t, idx) => (
                  <div key={t.id || idx} className="flex items-center justify-between py-3.5 hover:bg-secondary/5 px-2 rounded-xl transition-all">
                    <div className="mr-4">
                      <div className="font-bold text-sm text-foreground">{t.name} <span className="text-xs text-primary font-semibold ml-1.5">({t.concern})</span></div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">"{t.text}"</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button onClick={() => setEditingItem(t)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-primary hover:bg-secondary"><Edit3 className="h-4 w-4" /></Button>
                      <Button onClick={() => handleDeleteItem("testimonials", t.id)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PATIENT APPOINTMENTS (Task 5) */}
      {section === "appointments" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-base font-extrabold tracking-tight">Logged Patient Appointments ({data.length})</h2>
              
              {/* Quick status count overview */}
              <div className="flex gap-2 text-xs font-semibold">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">Pending: {data.filter(x => (x.status || "Pending").toLowerCase() === "pending").length}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">Confirmed: {data.filter(x => (x.status || "").toLowerCase() === "confirmed").length}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg">Done: {data.filter(x => (x.status || "").toLowerCase() === "done").length}</span>
              </div>
            </div>

            {/* Filter and Search Bar controls */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search name, phone, service..." 
                  value={apptSearch} 
                  onChange={(e) => setApptSearch(e.target.value)} 
                  className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select 
                  value={apptFilterStatus} 
                  onChange={(e) => setApptFilterStatus(e.target.value)} 
                  className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Confirmed">Confirmed Only</option>
                  <option value="Done">Done Only</option>
                </select>
              </div>

              {/* Service/Treatment Filter */}
              <div>
                <select 
                  value={apptFilterService} 
                  onChange={(e) => setApptFilterService(e.target.value)} 
                  className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Treatments</option>
                  {Array.from(new Set(data.map((x) => x.service).filter(Boolean))).map((srv) => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              {/* Sort selector */}
              <div>
                <select 
                  value={apptSort} 
                  onChange={(e) => setApptSort(e.target.value)} 
                  className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Date: Newest First</option>
                  <option value="oldest">Date: Oldest First</option>
                  <option value="nameAsc">Patient Name: A-Z</option>
                  <option value="nameDesc">Patient Name: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards listing */}
          {filteredAppointments.length === 0 ? (
            <div className="rounded-2xl border bg-white py-12 text-center text-sm text-muted-foreground shadow-sm">
              No matching appointment inquiries found.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAppointments.map((a) => {
                const status = (a.status || "Pending").toLowerCase();
                let statusBadge = "bg-amber-100 text-amber-800 border-amber-200";
                if (status === "confirmed") statusBadge = "bg-blue-100 text-blue-800 border-blue-200";
                if (status === "done") statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                if (status === "cancelled") statusBadge = "bg-destructive/10 text-destructive border-destructive/20";

                return (
                  <div key={a.id} className="rounded-xl border bg-white p-5 space-y-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-extrabold text-sm text-foreground">{a.name}</div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-1.5 border rounded-full uppercase tracking-wider ${statusBadge}`}>
                          {a.status || "Pending"}
                        </span>
                      </div>
                      <Button onClick={() => handleDeleteItem("appointments", a.id)} variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Treatment</span>
                        <span className="font-semibold text-foreground">{a.service}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Preferred Date</span>
                        <span className="font-bold text-primary">{a.preferredDate}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground leading-normal border-t pt-3">
                      <div className="font-semibold text-foreground flex items-center flex-wrap gap-1.5">
                        <a 
                          href={`tel:${a.phone}`} 
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold hover:underline"
                          title={`Click to call ${a.phone}`}
                        >
                          <Phone className="h-3 w-3 text-primary shrink-0" />
                          <span>{a.phone}</span>
                        </a>
                        <span>·</span>
                        <span>{a.email}</span>
                      </div>
                      <div className="italic mt-1 text-muted-foreground bg-secondary/10 rounded p-2 border border-secondary/20">"{a.message || "No custom message provided"}"</div>
                    </div>

                    {/* Status change actions */}
                    <div className="flex gap-1.5 border-t pt-3 mt-2 justify-end">
                      <button 
                        onClick={() => handleUpdateAppointmentStatus(a.id, "Pending")}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                          status === "pending" ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-white hover:bg-amber-50 border-gray-200 text-amber-800"
                        }`}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => handleUpdateAppointmentStatus(a.id, "Confirmed")}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                          status === "confirmed" ? "bg-blue-600 text-white border-blue-700 shadow-sm" : "bg-white hover:bg-blue-50 border-gray-200 text-blue-800"
                        }`}
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleUpdateAppointmentStatus(a.id, "Done")}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                          status === "done" ? "bg-emerald-600 text-white border-emerald-700 shadow-sm" : "bg-white hover:bg-emerald-50 border-gray-200 text-emerald-800"
                        }`}
                      >
                        Done
                      </button>
                      <button 
                        onClick={() => handleUpdateAppointmentStatus(a.id, "Cancelled")}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                          status === "cancelled" ? "bg-destructive text-white border-destructive shadow-sm" : "bg-white hover:bg-destructive/10 border-gray-200 text-destructive"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. GALLERY IMAGES PANEL */}
      {section === "gallery" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card with Navigation Tabs */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Gallery Image Assets
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Upload and organize clinic showcase, doctor profile, or patient result images.</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1.5 bg-secondary/35 p-1.5 rounded-2xl w-fit">
              {[
                { id: "manage", label: "📋 Gallery Image Catalog" },
                { id: "add", label: "➕ Add Gallery Image" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGalleryTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    galleryTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {galleryTab === "add" ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Add Gallery Image</strong>
                  Upload a clinic image asset or before & after patient result cards. Before & After images are styled in a side-by-side layout on the website.
                </div>
              </div>

              {/* Type selector */}
              <div className="flex gap-2 p-1 border rounded-2xl bg-secondary/10 w-fit">
                <button
                  type="button"
                  onClick={() => setGalleryAssetType("standard")}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                    galleryAssetType === "standard" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Standard Image
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryAssetType("beforeAfter")}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                    galleryAssetType === "beforeAfter" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Before / After Results
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {galleryAssetType === "standard" ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Gallery Image Asset</label>
                      <ImageSelector
                        label="Pick Gallery Image"
                        value={newGallery.src || ""}
                        onChange={(url) => setNewGallery({ ...newGallery, src: url })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Gallery Section Category</label>
                      <select value={newGallery.category} onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="Doctor">Doctor Images</option>
                        <option value="Clinic">Clinic Images</option>
                        <option value="Treatment">Treatment Room</option>
                        <option value="Before & After">Before & After</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2 animate-fade-down">
                    <ImageSelector
                      label="Before Treatment Image"
                      value={newGallery.beforeSrc || ""}
                      onChange={(url) => setNewGallery({ ...newGallery, beforeSrc: url })}
                    />
                    <ImageSelector
                      label="After Treatment Image"
                      value={newGallery.afterSrc || ""}
                      onChange={(url) => setNewGallery({ ...newGallery, afterSrc: url })}
                    />
                  </div>
                )}
                <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Caption / Treatment Name</label>
                    <input type="text" placeholder="Acne Therapy Results" value={newGallery.caption} onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Related Service Link (Optional)</label>
                    <select
                      value={newGallery.serviceSlug || ""}
                      onChange={(e) => setNewGallery({ ...newGallery, serviceSlug: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">-- No Related Service --</option>
                      {galleryServicesList.map((s: any) => (
                        <option key={s.slug} value={s.slug}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Button onClick={handleAddGallery} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary"><Plus className="mr-1.5 h-4 w-4" /> Add Image Asset</Button>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-down space-y-4">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Gallery Catalog</strong>
                  Filter and manage standard photos and result cards loaded in your clinic database.
                </div>
              </div>

              {/* Search and Category filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-5">
                {/* Category filter tabs */}
                <div className="flex flex-wrap gap-2 p-1 border rounded-2xl bg-secondary/10 w-fit">
                  {["All", "Doctor", "Clinic", "Treatment", "Before & After"].map((cat) => {
                    const count = cat === "All"
                      ? data.length
                      : data.filter((g) => g.category === cat || (cat === "Treatment" && g.category === "Treatments")).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setGalleryCatFilter(cat)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5",
                          galleryCatFilter === cat ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {cat}
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-bold", galleryCatFilter === cat ? "bg-primary/10 text-primary" : "bg-secondary/60 text-muted-foreground")}>{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search catalog by caption..."
                    value={adminGallerySearch}
                    onChange={(e) => setAdminGallerySearch(e.target.value)}
                    className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-primary/15 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                  />
                  {adminGallerySearch && (
                    <button onClick={() => setAdminGallerySearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold">✕</button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data
                  .filter((g) => {
                    const cat = g.category;
                    const matchesCat =
                      galleryCatFilter === "All" ||
                      cat === galleryCatFilter ||
                      (galleryCatFilter === "Treatment" && cat === "Treatments");
                    const matchesSearch =
                      !adminGallerySearch.trim() ||
                      (g.caption || "").toLowerCase().includes(adminGallerySearch.toLowerCase().trim());
                    return matchesCat && matchesSearch;
                  })
                  .map((g, idx) => {
                    const linked = galleryServicesList.find(s => s.slug === g.serviceSlug);
                    return (
                      <div key={g.id || idx} className="rounded-xl border p-3 bg-secondary/10 flex flex-col justify-between space-y-2">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          {g.beforeSrc && g.afterSrc ? (
                            <div className="grid grid-cols-2 h-full w-full relative">
                              <img src={g.beforeSrc} alt="before" className="h-full w-full object-cover" />
                              <img src={g.afterSrc} alt="after" className="h-full w-full object-cover border-l border-white" />
                              <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">Before/After</span>
                            </div>
                          ) : (
                            <img src={g.src} alt={g.caption} className="h-full w-full object-cover" />
                          )}
                          <span className="absolute top-2 left-2 bg-secondary/80 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full">{g.category}</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-extrabold text-foreground truncate">{g.caption}</div>
                          {linked && (
                            <div className="text-[10px] text-primary font-bold">Linked: {linked.title}</div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-border/20">
                          <span className="text-[9px] font-bold text-muted-foreground">{g.category}</span>
                          <div className="flex items-center">
                            <Button onClick={() => setEditingItem(g)} variant="ghost" size="icon" className="rounded-full h-7 w-7 text-primary hover:bg-secondary"><Edit3 className="h-4 w-4" /></Button>
                            {g.id && (
                              <Button onClick={() => handleDeleteItem("gallery", g.id)} variant="ghost" size="icon" className="rounded-full h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. SEO METADATA PANEL */}
      {section === "seo" && seoSettings && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" /> Search Engine Optimization
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Calibrate how your clinic webpage is previewed on search engine result pages like Google.</p>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
                <strong className="font-bold text-primary block mb-0.5">SEO Meta Calibration</strong>
                Title tags should be under 60 characters, and descriptions under 160 characters. This determines Google search snippet formatting.
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Google Browser Title Tag</label>
                <input type="text" value={seoSettings.title} onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Meta Description Snippet</label>
                <textarea value={seoSettings.description} onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-24 resize-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Canonical Web URL</label>
                <input type="text" value={seoSettings.canonicalUrl} onChange={(e) => setSeoSettings({ ...seoSettings, canonicalUrl: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <Button onClick={handleSaveSEO} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary">
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              Save SEO Target Meta
            </Button>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold tracking-tight mb-1">Google SERP Live Preview Simulator</h2>
            <p className="text-xs text-muted-foreground mb-4">This simulates how the clinical home results will render dynamically in Google Mobile/Desktop indexes.</p>
            
            <div className="border border-secondary/60 rounded-2xl p-5 bg-[#f8f9fa] max-w-xl">
              <div className="text-xs text-[#202124] flex items-center gap-1.5 mb-1 truncate">
                <span className="font-semibold text-xs">https://drjainskinclinic.in</span>
                <span className="text-[#5f6368]">{seoSettings.canonicalUrl === "/" ? "" : seoSettings.canonicalUrl}</span>
              </div>
              <h3 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer leading-snug mb-1.5 truncate">
                {seoSettings.title || "Dr Jain's Skin Care Clinic | Dermatologist in Katraj, Pune"}
              </h3>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {seoSettings.description || "Advanced skin, hair and cosmetology care in Katraj, Pune by Dr. Amit Jain..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. FAQ PANEL */}
      {section === "faqs" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card with Navigation Tabs */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" /> FAQ Registry
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage the frequently asked questions displayed in the accordion on the homepage.</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1.5 bg-secondary/35 p-1.5 rounded-2xl w-fit">
              {[
                { id: "manage", label: "📋 FAQ Registry" },
                { id: "add", label: "➕ Add FAQ Question" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFaqsTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    faqsTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {faqsTab === "add" ? (
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 animate-fade-down">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">Add New FAQ</strong>
                  Compose a clinical FAQ. Grouping by category helps organize how questions are shown to patients.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Category</label>
                  <select value={newFaq.category} onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="General">General Inquiries</option>
                    <option value="Safety">Safety & Skin</option>
                    <option value="Fees">Consult Fee & Price</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">FAQ Question Text</label>
                  <input type="text" placeholder="Do I need a prior appointment to consult Dr. Jain?" value={newFaq.q} onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Detailed Explanation Answer</label>
                  <textarea placeholder="Yes, appointments help us evaluate every skin concern carefully without rush..." value={newFaq.a} onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm outline-none h-20 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <Button onClick={handleAddFAQ} disabled={saving} className="rounded-xl font-bold shadow-md bg-primary"><Plus className="mr-1.5 h-4 w-4" /> Add FAQ</Button>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-down space-y-4">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold text-primary block mb-0.5">FAQ Registry</strong>
                  Below are all the general questions in the database. You can edit their answers or delete them entirely.
                </div>
              </div>

              <div className="divide-y space-y-4">
                {data.map((faq, idx) => (
                  <div key={faq.id || idx} className="flex justify-between items-start py-4 hover:bg-secondary/5 px-2 rounded-xl transition-all">
                    <div className="mr-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary text-primary font-bold text-[9px] px-2 py-0.5 rounded-full">{faq.category}</span>
                        <span className="font-extrabold text-sm text-foreground">Q: {faq.q}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/25">A: {faq.a}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button onClick={() => setEditingItem(faq)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-primary hover:bg-secondary"><Edit3 className="h-4 w-4" /></Button>
                      {faq.id && (
                        <Button onClick={() => handleDeleteItem("faq", faq.id)} variant="ghost" size="icon" className="rounded-full h-9 w-9 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PREMIUM FLOATING EDIT DIALOG PANEL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-[2rem] border bg-white p-8 shadow-2xl backdrop-blur-md max-h-[85vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Modify Clinic Document</h3>
                <p className="text-xs text-muted-foreground">Modify collection: {section}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="rounded-full p-2 hover:bg-secondary text-muted-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>

            {/* SERVICES EDITOR (Task 3 Expanded) */}
            {section === "services" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Service Title</label>
                  <input type="text" value={editingItem.title || ""} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Slug (ReadOnly)</label>
                  <input type="text" readOnly value={editingItem.slug || ""} className="w-full rounded-xl border bg-secondary/10 px-3 py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Service Icon</label>
                  <select value={editingItem.icon || "Sparkles"} onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Sparkles">Sparkles</option>
                    <option value="Sun">Sun</option>
                    <option value="Droplet">Droplet</option>
                    <option value="Scissors">Scissors</option>
                    <option value="Layers">Layers</option>
                    <option value="Star">Star</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Reference Image (Optional)</label>
                  <ImageSelector
                    label="Pick Service Reference Image"
                    value={editingItem.imageUrl || ""}
                    onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Service Short Summary</label>
                  <input type="text" value={editingItem.short || ""} onChange={(e) => setEditingItem({ ...editingItem, short: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Full In-depth Overview</label>
                  <textarea value={editingItem.overview || ""} onChange={(e) => setEditingItem({ ...editingItem, overview: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none h-24 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Symptoms (comma separated)</label>
                  <CommaSeparatedInput value={editingItem.symptoms || []} onChange={(newVal) => setEditingItem({ ...editingItem, symptoms: newVal })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Primary Causes (comma separated)</label>
                  <CommaSeparatedInput value={editingItem.causes || []} onChange={(newVal) => setEditingItem({ ...editingItem, causes: newVal })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinical Benefits (comma separated)</label>
                  <CommaSeparatedInput value={editingItem.benefits || []} onChange={(newVal) => setEditingItem({ ...editingItem, benefits: newVal })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                {/* Treatment steps editing in dialog */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-muted-foreground">Modify Treatment Process Steps ({editingItem.process?.length || 0})</h4>
                  <div className="space-y-2 border rounded-xl p-3 bg-secondary/5 max-h-40 overflow-y-auto">
                    {(editingItem.process || []).map((step: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-1.5 last:border-0 last:pb-0">
                        <div className="flex-1 mr-2">
                          <input 
                            type="text" 
                            value={step.step} 
                            onChange={(e) => {
                              const steps = [...(editingItem.process || [])];
                              steps[idx].step = e.target.value;
                              setEditingItem({ ...editingItem, process: steps });
                            }} 
                            placeholder="Step name" 
                            className="font-bold text-foreground border-b border-transparent hover:border-gray-300 focus:border-primary outline-none text-xs w-full bg-transparent"
                          />
                          <input 
                            type="text" 
                            value={step.detail} 
                            onChange={(e) => {
                              const steps = [...(editingItem.process || [])];
                              steps[idx].detail = e.target.value;
                              setEditingItem({ ...editingItem, process: steps });
                            }} 
                            placeholder="Step details description" 
                            className="text-[10px] text-muted-foreground border-b border-transparent hover:border-gray-300 focus:border-primary outline-none w-full bg-transparent mt-0.5"
                          />
                        </div>
                        <button type="button" onClick={() => setEditingItem({ ...editingItem, process: (editingItem.process || []).filter((_: any, i: number) => i !== idx) })} className="text-destructive hover:text-destructive/80 font-bold shrink-0 text-xs">Remove</button>
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditingItem({ ...editingItem, process: [...(editingItem.process || []), { step: "New Step", detail: "Step details here." }] })} 
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    + Add New Step Block
                  </button>
                </div>

                {/* FAQs editing in dialog */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-muted-foreground">Modify Treatment FAQs ({editingItem.faqs?.length || 0})</h4>
                  <div className="space-y-2 border rounded-xl p-3 bg-secondary/5 max-h-40 overflow-y-auto">
                    {(editingItem.faqs || []).map((faq: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-1.5 last:border-0 last:pb-0">
                        <div className="flex-1 mr-2">
                          <input 
                            type="text" 
                            value={faq.q} 
                            onChange={(e) => {
                              const faqs = [...(editingItem.faqs || [])];
                              faqs[idx].q = e.target.value;
                              setEditingItem({ ...editingItem, faqs });
                            }} 
                            placeholder="Question" 
                            className="font-bold text-foreground border-b border-transparent hover:border-gray-300 focus:border-primary outline-none text-xs w-full bg-transparent"
                          />
                          <input 
                            type="text" 
                            value={faq.a} 
                            onChange={(e) => {
                              const faqs = [...(editingItem.faqs || [])];
                              faqs[idx].a = e.target.value;
                              setEditingItem({ ...editingItem, faqs });
                            }} 
                            placeholder="Answer explanation" 
                            className="text-[10px] text-muted-foreground border-b border-transparent hover:border-gray-300 focus:border-primary outline-none w-full bg-transparent mt-0.5"
                          />
                        </div>
                        <button type="button" onClick={() => setEditingItem({ ...editingItem, faqs: (editingItem.faqs || []).filter((_: any, i: number) => i !== idx) })} className="text-destructive hover:text-destructive/80 font-bold shrink-0 text-xs">Remove</button>
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditingItem({ ...editingItem, faqs: [...(editingItem.faqs || []), { q: "New Question?", a: "Explain question here." }] })} 
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    + Add New FAQ Block
                  </button>
                </div>
              </div>
            )}

            {/* BLOGS EDITOR (Task 4 Uploader inside dialog) */}
            {section === "blogs" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Blog Title</label>
                  <input type="text" value={editingItem.title || ""} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Excerpt Text</label>
                  <input type="text" value={editingItem.excerpt || ""} onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Category</label>
                    <input type="text" value={editingItem.category || ""} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Read Minutes</label>
                    <input type="number" value={editingItem.readMins || 5} onChange={(e) => setEditingItem({ ...editingItem, readMins: parseInt(e.target.value) || 5 })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                
                {/* ImageSelector inside Blogs Editor */}
                <ImageSelector
                  label="Blog cover image banner"
                  value={editingItem.cover || ""}
                  onChange={(url) => setEditingItem({ ...editingItem, cover: url })}
                />
                
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Blog Body Content (separated by empty double-newlines)</label>
                  <textarea value={editingItem.body?.join("\n\n") || ""} onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value.split("\n\n").filter(Boolean) })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none h-40 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            {/* TESTIMONIALS EDITOR */}
            {section === "testimonials" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Patient Name</label>
                  <input type="text" value={editingItem.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Clinical Concern</label>
                    <input type="text" value={editingItem.concern || ""} onChange={(e) => setEditingItem({ ...editingItem, concern: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Google Rating (1-5)</label>
                    <select value={editingItem.rating || 5} onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) || 5 })} className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Testimonial Review Paragraph</label>
                  <textarea value={editingItem.text || ""} onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none h-32 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            {/* GALLERY EDITOR (Task 1 Selector inside dialog) */}
            {section === "gallery" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Caption / Room Name</label>
                  <input type="text" value={editingItem.caption || ""} onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Category</label>
                  <select value={editingItem.category || "Clinic"} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Doctor">Doctor Images</option>
                    <option value="Clinic">Clinic Images</option>
                    <option value="Treatment">Treatment Room</option>
                    <option value="Before & After">Before & After</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Related Service Link (Optional)</label>
                  <select
                    value={editingItem.serviceSlug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, serviceSlug: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">-- No Related Service --</option>
                    {galleryServicesList.map((s: any) => (
                      <option key={s.slug} value={s.slug}>{s.title}</option>
                    ))}
                  </select>
                </div>
                
                {/* ImageSelector inside Gallery Editor */}
                {editingItem.beforeSrc && editingItem.afterSrc ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ImageSelector
                      label="Before Image"
                      value={editingItem.beforeSrc || ""}
                      onChange={(url) => setEditingItem({ ...editingItem, beforeSrc: url })}
                    />
                    <ImageSelector
                      label="After Image"
                      value={editingItem.afterSrc || ""}
                      onChange={(url) => setEditingItem({ ...editingItem, afterSrc: url })}
                    />
                  </div>
                ) : (
                  <ImageSelector
                    label="Gallery image asset"
                    value={editingItem.src || ""}
                    onChange={(url) => setEditingItem({ ...editingItem, src: url })}
                  />
                )}
              </div>
            )}

            {/* FAQs EDITOR */}
            {section === "faqs" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Category</label>
                  <select value={editingItem.category || "General"} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="General">General Inquiries</option>
                    <option value="Safety">Safety & Skin</option>
                    <option value="Fees">Consult Fee & Price</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">FAQ Question</label>
                  <input type="text" value={editingItem.q || ""} onChange={(e) => setEditingItem({ ...editingItem, q: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">FAQ Explanation Answer</label>
                  <textarea value={editingItem.a || ""} onChange={(e) => setEditingItem({ ...editingItem, a: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none h-32 resize-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-2 border-t pt-4">
              <Button onClick={() => setEditingItem(null)} variant="outline" className="rounded-xl font-bold">Cancel</Button>
              <Button onClick={handleUpdateItem} disabled={saving} className="rounded-xl font-bold shadow-md">
                {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}