export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  process: { step: string; detail: string }[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  imageUrl?: string;
};

export const services: Service[] = [
  {
    slug: "acne-treatment",
    title: "Acne Treatment",
    short: "Clear, calm skin with dermatologist-led acne protocols.",
    icon: "Sparkles",
    overview:
      "Personalised, evidence-based acne care combining medical-grade topicals, oral therapy when needed, and in-clinic procedures like comedone extraction and chemical peels for lasting clarity.",
    symptoms: [
      "Whiteheads, blackheads, papules and pustules",
      "Painful cystic or nodular acne",
      "Oily skin with enlarged pores",
      "Post-acne marks and scarring",
    ],
    causes: [
      "Hormonal fluctuations (PCOS, puberty, stress)",
      "Excess sebum and clogged follicles",
      "C. acnes bacterial overgrowth",
      "Diet, lifestyle and skincare triggers",
    ],
    process: [
      { step: "Skin Analysis", detail: "Detailed grading and trigger mapping." },
      { step: "Custom Plan", detail: "Topical + oral + procedure combination tailored to you." },
      { step: "In-clinic Care", detail: "Peels, extractions, LED therapy as indicated." },
      { step: "Maintenance", detail: "Long-term routine to prevent relapse and marks." },
    ],
    benefits: [
      "Visibly clearer skin in 4–8 weeks",
      "Controlled oil and reduced breakouts",
      "Minimised marks and scarring risk",
      "Confidence-restoring results",
    ],
    faqs: [
      { q: "How long does acne treatment take?", a: "Most patients see clear improvement within 6–8 weeks with consistent care." },
      { q: "Will my acne come back?", a: "A tailored maintenance plan dramatically lowers recurrence." },
    ],
  },
  {
    slug: "pigmentation-treatment",
    title: "Pigmentation Treatment",
    short: "Even-toned, luminous skin — melasma, dark spots and tan.",
    icon: "Sun",
    overview:
      "Targeted treatments for melasma, post-inflammatory pigmentation and uneven skin tone using medical peels, depigmenting serums and advanced light-based therapies.",
    symptoms: ["Dark patches on cheeks and forehead", "Sun-tan and uneven tone", "Dark circles and spots"],
    causes: ["UV exposure", "Hormonal shifts", "Inflammation post-acne", "Improper skincare"],
    process: [
      { step: "Pigment Mapping", detail: "Wood's lamp & clinical assessment." },
      { step: "Layered Plan", detail: "SPF, depigmenting actives, peels." },
      { step: "Boosters", detail: "Glutathione / mesotherapy as needed." },
    ],
    benefits: ["Brighter, even tone", "Reduced melasma & spots", "Glowing finish"],
    faqs: [
      { q: "Are the treatments safe for Indian skin?", a: "Yes — protocols are tuned for melanin-rich skin tones." },
    ],
  },
  {
    slug: "prp-therapy",
    title: "PRP Therapy",
    short: "Regrow, thicken and strengthen with your own growth factors.",
    icon: "Droplet",
    overview:
      "Platelet Rich Plasma therapy uses growth factors from your own blood to stimulate dormant follicles, improve hair density and accelerate skin repair.",
    symptoms: ["Diffuse hair thinning", "Receding hairline", "Post-pregnancy hair fall"],
    causes: ["Genetic alopecia", "Nutritional deficiencies", "Stress, post-illness"],
    process: [
      { step: "Blood Draw", detail: "Small sample, processed in-clinic." },
      { step: "PRP Extraction", detail: "Double-spin centrifuge for high platelet yield." },
      { step: "Scalp Injection", detail: "Microinjections into affected zones." },
    ],
    benefits: ["Thicker, denser hair", "Reduced shedding", "Safe, autologous"],
    faqs: [
      { q: "How many sessions are needed?", a: "Typically 4–6 sessions spaced 4 weeks apart." },
    ],
  },
  {
    slug: "hair-fall-treatment",
    title: "Hair Fall Treatment",
    short: "Stop hair loss with root-cause diagnostics and modern therapy.",
    icon: "Scissors",
    overview:
      "From trichoscopy to advanced therapies — minoxidil, oral protocols, mesotherapy and PRP — designed around your hair loss pattern.",
    symptoms: ["Excess hair on pillow / comb", "Visible scalp", "Widening parting"],
    causes: ["Androgenetic alopecia", "Thyroid / iron deficiency", "Telogen effluvium"],
    process: [
      { step: "Trichoscopy", detail: "High-magnification scalp analysis." },
      { step: "Lab Panel", detail: "Identify deficiencies & hormonal causes." },
      { step: "Treatment", detail: "Topicals + procedures + nutrition plan." },
    ],
    benefits: ["Reduced shedding in 8–12 weeks", "Regrowth in dormant zones"],
    faqs: [{ q: "Is treatment lifelong?", a: "Maintenance varies by cause; many patients reduce therapy over time." }],
  },
  {
    slug: "chemical-peel",
    title: "Chemical Peel",
    short: "Renew dull, congested skin with safe medical peels.",
    icon: "Layers",
    overview:
      "Customised glycolic, salicylic, mandelic and combination peels to brighten, smoothen and treat acne, pigmentation and ageing.",
    symptoms: ["Dull, congested skin", "Acne marks", "Open pores"],
    causes: ["Sun damage", "Dead-cell buildup", "Ageing"],
    process: [
      { step: "Prep", detail: "2-week priming routine." },
      { step: "Peel Session", detail: "Calibrated to skin type." },
      { step: "Recovery", detail: "Post-peel care to lock results." },
    ],
    benefits: ["Instant glow", "Smoother texture", "Reduced pigmentation"],
    faqs: [{ q: "How many sessions?", a: "A series of 4–6 sessions every 2–3 weeks works best." }],
  },
  {
    slug: "anti-aging-treatment",
    title: "Anti-aging Treatment",
    short: "Lift, firm and restore — naturally and elegantly.",
    icon: "Star",
    overview:
      "Botox, dermal fillers, skin boosters, microneedling RF and medical-grade skincare to slow visible signs of ageing.",
    symptoms: ["Fine lines & wrinkles", "Loss of firmness", "Dull skin"],
    causes: ["Collagen loss", "Sun damage", "Lifestyle"],
    process: [
      { step: "Consult", detail: "Facial assessment & goal mapping." },
      { step: "Procedure", detail: "Tox, fillers or energy-based devices." },
      { step: "Maintenance", detail: "Skincare & periodic touch-ups." },
    ],
    benefits: ["Natural-looking refresh", "Firmer skin", "Long-lasting glow"],
    faqs: [{ q: "Will I look frozen?", a: "Our approach prioritises natural movement and balance." }],
  },
  {
    slug: "skin-allergy-treatment",
    title: "Skin Allergy Treatment",
    short: "Find triggers, calm flare-ups and prevent recurrence.",
    icon: "Shield",
    overview:
      "Comprehensive evaluation of urticaria, eczema, contact dermatitis with allergy testing and personalised long-term management.",
    symptoms: ["Itching, hives, rashes", "Recurrent flare-ups", "Burning, redness"],
    causes: ["Food / contact allergens", "Stress", "Climate"],
    process: [
      { step: "Detailed History", detail: "Trigger identification." },
      { step: "Testing", detail: "Patch / blood tests as needed." },
      { step: "Management", detail: "Avoidance + medical therapy." },
    ],
    benefits: ["Reduced flare-ups", "Long-term comfort"],
    faqs: [{ q: "Are allergies curable?", a: "Most can be very well controlled with the right plan." }],
  },
  {
    slug: "scar-treatment",
    title: "Scar Treatment",
    short: "Smooth acne scars, surgical marks and keloids.",
    icon: "Activity",
    overview:
      "Microneedling RF, subcision, TCA CROSS, lasers and intralesional therapy — combined for visible scar improvement.",
    symptoms: ["Pitted acne scars", "Raised / keloid scars", "Stretch marks"],
    causes: ["Acne", "Injury / surgery", "Genetic tendency"],
    process: [
      { step: "Scar Mapping", detail: "Type & depth assessment." },
      { step: "Combination Plan", detail: "Tailored procedures." },
      { step: "Sessions", detail: "Spaced over months for remodelling." },
    ],
    benefits: ["Smoother texture", "Improved tone", "Boosted confidence"],
    faqs: [{ q: "Can scars vanish completely?", a: "Significant improvement is the realistic goal." }],
  },
  {
    slug: "nail-disorders",
    title: "Nail Disorders",
    short: "Expert care for fungal, brittle and discoloured nails.",
    icon: "Hand",
    overview:
      "Medical management of onychomycosis, psoriatic nails, paronychia and brittle nail syndromes.",
    symptoms: ["Discolouration", "Brittle / thickened nails", "Pain & swelling"],
    causes: ["Fungal infection", "Trauma", "Systemic conditions"],
    process: [
      { step: "Diagnosis", detail: "Clinical & microscopy." },
      { step: "Therapy", detail: "Topical / oral antifungals." },
      { step: "Follow-up", detail: "Periodic review until clear." },
    ],
    benefits: ["Healthy, clear nails", "Long-term resolution"],
    faqs: [{ q: "How long is treatment?", a: "Fungal nail therapy can take 3–6 months." }],
  },
  {
    slug: "cosmetology-procedures",
    title: "Cosmetology Procedures",
    short: "Carbon facials, hydrafacial, mesotherapy and more.",
    icon: "Wand2",
    overview:
      "Premium aesthetic procedures delivered safely by a qualified dermatologist for radiant, healthy skin.",
    symptoms: ["Dullness", "Dehydration", "Uneven texture"],
    causes: ["Lifestyle", "Pollution", "Ageing"],
    process: [
      { step: "Skin Goals", detail: "Personalised consultation." },
      { step: "Procedure", detail: "Hydrafacial / carbon peel / meso." },
      { step: "Glow Plan", detail: "Routine to extend results." },
    ],
    benefits: ["Instant radiance", "Smoother skin", "Zero downtime"],
    faqs: [{ q: "Is there downtime?", a: "Most procedures have no downtime." }],
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMins: number;
  cover: string;
  body: string[];
};

export const blogs: BlogPost[] = [
  {
    slug: "best-acne-treatments",
    title: "Best Acne Treatments That Actually Work",
    excerpt: "A dermatologist-curated guide to ingredients and procedures that clear acne for good.",
    category: "Acne",
    date: "2026-04-12",
    readMins: 6,
    cover: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=70",
    body: [
      "Acne is more than a skin issue — it's a hormonal, inflammatory and lifestyle puzzle that needs a layered plan.",
      "Medical-grade retinoids, salicylic acid, benzoyl peroxide and in-clinic peels form the backbone of effective therapy.",
      "Consistency, sun protection and patient-specific tweaks are what make protocols actually work.",
    ],
  },
  {
    slug: "prp-for-hair-loss",
    title: "PRP for Hair Loss: What to Expect",
    excerpt: "How platelet rich plasma stimulates regrowth — and who it works best for.",
    category: "Hair",
    date: "2026-03-22",
    readMins: 5,
    cover: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1200&q=70",
    body: [
      "PRP harnesses your own growth factors to reactivate dormant follicles.",
      "Best results typically appear after 4–6 sessions spaced a month apart.",
      "It is safest and most effective when combined with a tailored medical plan.",
    ],
  },
  {
    slug: "daily-skin-care-tips",
    title: "Daily Skin Care Tips From a Dermatologist",
    excerpt: "Simple, science-backed habits to keep skin healthy at every age.",
    category: "Skincare",
    date: "2026-02-14",
    readMins: 4,
    cover: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=70",
    body: [
      "Cleanse gently, moisturise consistently, and never skip sunscreen.",
      "Less is more — chasing trends often hurts the skin barrier.",
    ],
  },
  {
    slug: "pigmentation-solutions",
    title: "Pigmentation Solutions for Indian Skin",
    excerpt: "Why melasma is stubborn — and the layered plan that actually fades it.",
    category: "Pigmentation",
    date: "2026-01-30",
    readMins: 6,
    cover: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=70",
    body: [
      "Sun protection is non-negotiable for any pigmentation plan.",
      "Depigmenting actives plus calibrated peels deliver the best long-term results.",
    ],
  },
  {
    slug: "chemical-peel-benefits",
    title: "Chemical Peels: Benefits, Myths & Recovery",
    excerpt: "What peels can and cannot do, and how to choose the right one for your skin.",
    category: "Procedures",
    date: "2026-01-10",
    readMins: 5,
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=70",
    body: [
      "Peels exfoliate at controlled depths to renew skin and treat specific concerns.",
      "Medical peels are safe for Indian skin when chosen and performed correctly.",
    ],
  },
];

export type Testimonial = {
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  concern: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Rohan S.",
    initials: "RS",
    rating: 5,
    date: "3 weeks ago",
    text: "Great clinic. Dedicated staff and doctor has excellent communication and soft skills.",
    concern: "Acne",
  },
  {
    name: "Priya M.",
    initials: "PM",
    rating: 5,
    date: "1 month ago",
    text: "Very accurate diagnosis, clear explanation and effective treatment. Highly satisfied.",
    concern: "Pigmentation",
  },
  {
    name: "Aditya K.",
    initials: "AK",
    rating: 5,
    date: "2 months ago",
    text: "Highly recommended place for skin problems. Saw real improvement within weeks.",
    concern: "Hair Fall",
  },
  {
    name: "Sneha P.",
    initials: "SP",
    rating: 5,
    date: "2 months ago",
    text: "Dr. Jain is patient, thorough and never pushes unnecessary procedures. Felt safe and informed.",
    concern: "Melasma",
  },
  {
    name: "Vikram J.",
    initials: "VJ",
    rating: 4,
    date: "3 months ago",
    text: "Clinic is spotless and modern. PRP sessions were comfortable and results are visible.",
    concern: "PRP Therapy",
  },
  {
    name: "Anjali D.",
    initials: "AD",
    rating: 5,
    date: "4 months ago",
    text: "Honest pricing, science-backed treatment. My acne scars improved dramatically.",
    concern: "Scar Treatment",
  },
];

export const galleryImages = [
  // Doctor Images
  { src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1000&q=70", category: "Doctor", caption: "Dr. Amit Jain — Consultation" },
  { src: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1000&q=70", category: "Doctor", caption: "Dr. Amit Jain — In Clinic" },
  { src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1000&q=70", category: "Doctor", caption: "Dr. Amit Jain — Dermatology Expert" },
  // Clinic Images
  { src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&q=70", category: "Clinic", caption: "Reception Area" },
  { src: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1000&q=70", category: "Clinic", caption: "Consultation Room" },
  { src: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1000&q=70", category: "Clinic", caption: "Lobby & Waiting Area" },
  { src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&q=70", category: "Clinic", caption: "Clinic Exterior" },
  { src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&q=70", category: "Clinic", caption: "Modern Interiors" },
  // Treatment Images
  { src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1000&q=70", category: "Treatments", caption: "Procedure Suite" },
  { src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=70", category: "Treatments", caption: "Hydrafacial" },
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&q=70", category: "Treatments", caption: "Laser Suite" },
  // Before & After
  {
    beforeSrc: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=70",
    afterSrc: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=900&q=70",
    category: "Before & After",
    caption: "Acne Control Therapy"
  },
  {
    beforeSrc: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=900&q=70",
    afterSrc: "https://images.unsplash.com/photo-1614109800763-7b46d0a9ad44?w=900&q=70",
    category: "Before & After",
    caption: "Pigmentation & Tone Laser"
  },
  {
    beforeSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=900&q=70",
    afterSrc: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=70",
    category: "Before & After",
    caption: "PRP Hair Density Therapy"
  }
];

export const faqs = [
  { q: "Do I need an appointment to visit?", a: "Yes, appointments help us serve you on time. You can book online or via WhatsApp." },
  { q: "Are treatments safe for sensitive Indian skin?", a: "Absolutely. All protocols are evidence-based and calibrated for darker skin tones." },
  { q: "What is the consultation fee?", a: "Please contact the clinic for current fees. Transparent pricing, no hidden costs." },
  { q: "Do you treat both men and women?", a: "Yes, we treat patients of all ages and genders." },
  { q: "How soon will I see results?", a: "Most patients notice meaningful improvement within 4–8 weeks of starting therapy." },
];

export const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "15,000+", label: "Happy Patients" },
  { value: "4.8★", label: "Google Rating" },
  { value: "20+", label: "Treatments Offered" },
];