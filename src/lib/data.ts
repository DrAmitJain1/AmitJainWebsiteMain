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
    slug: "vitiligo",
    title: "Vitiligo (Safed Daag)",
    short: "Restore skin color and pigment with advanced clinical therapies.",
    icon: "Shield",
    overview:
      "Vitiligo is a skin condition characterized by the loss of pigment, leading to white patches. Our clinic offers comprehensive treatments, including topical immunomodulators, oral steroids for stabilization, and advanced phototherapy to stimulate repigmentation.",
    symptoms: [
      "Patchy loss of skin color (depigmentation)",
      "Premature whitening or graying of scalp hair, eyelashes, or eyebrows",
      "Loss of color inside tissues of the mouth and nose",
    ],
    causes: [
      "Autoimmune response attacking melanocytes (pigment-producing cells)",
      "Genetic predisposition and family history",
      "Trigger events such as severe sunburn, stress, or chemical exposure",
    ],
    process: [
      { step: "Clinical Evaluation", detail: "Wood's lamp assessment to determine activity and extent." },
      { step: "Stabilization Phase", detail: "Medical therapy to stop the spreading of white patches." },
      { step: "Repigmentation", detail: "Targeted topicals, immunomodulators, and light therapies." },
      { step: "Follow-up", detail: "Routine mapping of pigment restoration." },
    ],
    benefits: [
      "Halts progression of active depigmentation",
      "Promotes natural pigment return and skin blending",
      "Boosts self-confidence and quality of life",
    ],
    faqs: [
      { q: "Is Vitiligo contagious?", a: "No, vitiligo is completely non-contagious and cannot spread from person to person." },
      { q: "Can pigment be fully restored?", a: "Many patients see significant repigmentation, especially on the face and trunk, with early treatment." },
    ],
  },
  {
    slug: "melasma",
    title: "Melasma (Wang)",
    short: "Targeted therapies to fade stubborn facial hyperpigmentation.",
    icon: "Sun",
    overview:
      "Melasma presents as dark, symmetrical brown patches on the face, commonly triggered by hormonal changes and sun exposure. We provide customized depigmenting protocols, medical peels, and protective skin barriers for long-term control.",
    symptoms: [
      "Symmetrical dark brown patches on cheeks, nose, forehead, or upper lip",
      "Hyperpigmentation worsening after sun exposure",
      "No itching or physical pain associated with the patches",
    ],
    causes: [
      "Hormonal fluctuations (pregnancy, oral contraceptives)",
      "UV and visible blue light exposure",
      "Genetic susceptibility and thyroid dysfunction",
    ],
    process: [
      { step: "Pigment Grading", detail: "Analyzing the depth of pigment (epidermal vs dermal)." },
      { step: "Active Phase", detail: "Prescription depigmenting agents and customized medical peels." },
      { step: "Skin Priming", detail: "Reinforcing the skin barrier with soothing agents." },
      { step: "Maintenance", detail: "Broad-spectrum sunscreen and non-hydroquinone maintenance creams." },
    ],
    benefits: [
      "Visible fading of dark patches",
      "More uniform, glowing skin tone",
      "Reduced risk of rebound hyperpigmentation",
    ],
    faqs: [
      { q: "Why does melasma return?", a: "Melasma is a chronic condition; UV exposure or hormonal shifts can reactivate pigment cells." },
      { q: "Are lasers safe for melasma?", a: "Yes, but only specific gentle wavelengths. Aggressive lasers can worsen melasma." },
    ],
  },
  {
    slug: "dark-spots",
    title: "Dark Spots",
    short: "Even out your skin tone by correcting sun spots and post-inflammatory marks.",
    icon: "Sun",
    overview:
      "Dark spots, or post-inflammatory hyperpigmentation (PIH), occur after skin inflammation, acne breakouts, or sun damage. We use advanced serums, chemical peels, and microdermabrasion to speed up cellular turnover and fade discoloration.",
    symptoms: [
      "Brown, red, or black spots left behind after acne or insect bites",
      "Flat freckle-like spots on sun-exposed skin areas",
      "Dull, uneven skin complexion",
    ],
    causes: [
      "Inflammatory conditions like acne, eczema, or injuries",
      "Chronic sun exposure and lack of photoprotection",
      "Aging and slow skin renewal cycles",
    ],
    process: [
      { step: "Skin Diagnostics", detail: "Identifying the cause of inflammation." },
      { step: "Cellular Renewal", detail: "AHA/BHA chemical peels to accelerate skin shedding." },
      { step: "Brightening Therapy", detail: "Targeted formulations containing Vitamin C, Kojic Acid, or Retinoids." },
      { step: "Protection", detail: "Daily application of tailored broad-spectrum sunscreen." },
    ],
    benefits: [
      "Rapid clearing of post-acne marks",
      "Refined skin texture and brightness",
      "Restoration of uniform complexion",
    ],
    faqs: [
      { q: "How long do dark spots take to fade?", a: "Epidermal spots can fade in 4–6 weeks, while deeper dermal spots may take a few months." },
      { q: "Can I prevent dark spots?", a: "Absolutely. Avoiding picking at acne and wearing sunscreen daily are key." },
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
    slug: "baldness",
    title: "Male / Female Baldness",
    short: "Comprehensive medical and PRP treatments for androgenetic alopecia.",
    icon: "User",
    overview:
      "Androgenetic alopecia, or pattern baldness, affects both men and women due to genetic and hormonal factors. We provide medical management (minoxidil, finasteride, peptides) combined with PRP and growth factor therapy to halt hair thinning and promote density.",
    symptoms: [
      "Gradual thinning on top of head",
      "Receding hairline (mostly in men)",
      "Widening of the hair part (mostly in women)",
    ],
    causes: [
      "Genetic sensitivity to Dihydrotestosterone (DHT)",
      "Hormonal changes and aging",
      "Nutritional deficiencies and chronic stress",
    ],
    process: [
      { step: "Scalp Analysis", detail: "High-magnification trichoscopy to assess follicle health." },
      { step: "Medical Blocks", detail: "DHT-blocking topicals and nutritional supplements." },
      { step: "Regrowth Therapy", detail: "In-clinic PRP (Platelet Rich Plasma) or mesotherapy sessions." },
      { step: "Monitoring", detail: "Progress photography and hair density mapping every 3 months." },
    ],
    benefits: [
      "Halts progressive hair thinning",
      "Stimulates dormant follicles for regrowth",
      "Thickens existing hair shafts",
    ],
    faqs: [
      { q: "Is pattern baldness reversible?", a: "Early stages are highly treatable with medical and PRP therapies; late stages may require hair transplants." },
      { q: "When will I see results?", a: "Stabilization occurs in 2-3 months, and visible regrowth is typical by 6 months." },
    ],
  },
  {
    slug: "std",
    title: "Sexually Transmitted Diseases",
    short: "Confidential diagnosis and effective treatment for intimate health concerns.",
    icon: "ShieldAlert",
    overview:
      "We offer highly confidential, professional consultations for sexually transmitted infections (STIs/STDs) affecting the skin and mucosa. Dr. Amit Jain provides expert diagnostic guidance and evidence-based drug therapy.",
    symptoms: [
      "Genital warts, bumps, or blisters",
      "Unexplained rashes or sores on the body, hands, or feet",
      "Itching, burning, or discharge",
    ],
    causes: [
      "Bacterial infections (Syphilis, Gonorrhea, Chlamydia)",
      "Viral infections (HSV, HPV, HIV)",
      "Fungal or parasitic infestations",
    ],
    process: [
      { step: "Private Consult", detail: "Strictly confidential detailed history taking." },
      { step: "Diagnostics", detail: "Serological tests, swabs, or scraping if required." },
      { step: "Targeted Treatment", detail: "Specific antiviral, antibiotic, or cryotherapeutic protocols." },
      { step: "Partner Counseling", detail: "Guidance on safety, prevention, and treatment of partners." },
    ],
    benefits: [
      "100% confidential and judgment-free environment",
      "Accurate, dermatologist-led diagnosis",
      "Prevents long-term systemic complications",
    ],
    faqs: [
      { q: "Are all STIs curable?", a: "Bacterial infections are fully curable with antibiotics, while viral STIs are highly manageable with antivirals." },
      { q: "How is confidentiality maintained?", a: "All medical records are strictly protected under privacy laws, and consultations are conducted behind closed doors." },
    ],
  },
  {
    slug: "skin-polishing",
    title: "Skin Polishing",
    short: "Exfoliate and resurface your skin for an instant smooth, radiant glow.",
    icon: "Sparkles",
    overview:
      "Skin polishing uses a diamond-tipped wand or micro-crystals to gently exfoliate the outermost layer of dead skin cells. It improves skin texture, reduces mild scarring, and enhances the absorption of clinical skincare products.",
    symptoms: [
      "Rough or uneven skin texture",
      "Dull, lifeless complexion",
      "Superficial blackheads and congested pores",
    ],
    causes: [
      "Accumulation of dead skin cells",
      "Environmental pollution and sun damage",
      "Slow natural skin exfoliation rate",
    ],
    process: [
      { step: "Double Cleansing", detail: "Deep cleaning to remove oil and impurities." },
      { step: "Microdermabrasion", detail: "Gentle abrasion using controlled vacuum pressure." },
      { step: "Soothing Pack", detail: "Infusing skin with hydrating hyaluronic acid or soothing vitamins." },
      { step: "Barrier Protection", detail: "Application of moisturizing cream and SPF." },
    ],
    benefits: [
      "Instant smoothness and glow",
      "Improves makeup application and skin feel",
      "Enhances penetration of home care products",
    ],
    faqs: [
      { q: "Does skin polishing hurt?", a: "No, it feels like a mild scratchy massage and is completely comfortable." },
      { q: "How often can I get it done?", a: "Once every 3–4 weeks is ideal for maintaining radiant skin." },
    ],
  },
  {
    slug: "fungal-infection",
    title: "Fungal Infection",
    short: "Quick relief and long-term cure for ringworm, athlete's foot, and yeast infections.",
    icon: "ShieldAlert",
    overview:
      "Fungal skin infections (Tinea/Ringworm, Candidiasis) are common in humid climates. We provide precise diagnosis and customized oral and topical antifungal regimens, focusing on preventing recurrence and drug resistance.",
    symptoms: [
      "Itchy, red, ring-shaped patches with raised edges",
      "Peeling, cracking, or scaling skin between toes",
      "Discolored or thickened nails",
    ],
    causes: [
      "Humid weather, sweating, and tight clothing",
      "Sharing personal items (towels, combs)",
      "Poor hygiene and compromised immunity",
    ],
    process: [
      { step: "Clinical Examination", detail: "Microscopic scraping (KOH mount) if required." },
      { step: "Symptom Relief", detail: "Anti-itch topicals to prevent scratching." },
      { step: "Antifungal Course", detail: "Prescribed course of oral and topical antifungals." },
      { step: "Hygiene Coaching", detail: "Crucial instructions to prevent relapse." },
    ],
    benefits: [
      "Rapid relief from intense itching",
      "Complete clearance of active fungal spores",
      "Reduced risk of infecting family members",
    ],
    faqs: [
      { q: "Why do fungal infections recur?", a: "Incomplete medication courses and humid conditions are the primary causes of recurrence." },
      { q: "Can I use over-the-counter steroid creams?", a: "No! Steroids temporarily mask symptoms but worsen the infection in the long run." },
    ],
  },
  {
    slug: "psoriasis",
    title: "Psoriasis",
    short: "Manage scaling, redness, and itching with advanced systemic and topical therapies.",
    icon: "Activity",
    overview:
      "Psoriasis is a chronic autoimmune condition that accelerates skin cell growth, leading to thick, red patches with silvery scales. We provide systemic medication, biologic therapies, and specialized topicals to manage flare-ups.",
    symptoms: [
      "Red patches of skin covered with thick, silvery scales",
      "Dry, cracked skin that may bleed or itch",
      "Stiff, swollen, or painful joints (psoriatic arthritis)",
    ],
    causes: [
      "Autoimmune acceleration of skin renewal cycle",
      "Genetic factors",
      "Triggers like stress, skin injury, or infections",
    ],
    process: [
      { step: "Grading Assessment", detail: "Calculating PASI score (Psoriasis Area and Severity Index)." },
      { step: "Topical Therapy", detail: "Salicylic acid, coal tar, and steroid-sparing creams." },
      { step: "Systemic Care", detail: "Oral immunomodulators or biologics for severe cases." },
      { step: "Lifestyle Coaching", detail: "Dietary and stress management guidance." },
    ],
    benefits: [
      "Significant clearing of scaly plaques",
      "Reduced itching and physical discomfort",
      "Prevention of joint involvement",
    ],
    faqs: [
      { q: "Is psoriasis curable?", a: "While not fully curable, it can be extremely well controlled with modern medications." },
      { q: "Does diet affect psoriasis?", a: "Yes, anti-inflammatory diets can help reduce the frequency and severity of flare-ups." },
    ],
  },
  {
    slug: "eczema",
    title: "Eczema (ISAB)",
    short: "Soothe dry, itchy, and inflamed skin with customized barrier repair protocols.",
    icon: "Sparkles",
    overview:
      "Atopic dermatitis or eczema causes dry, red, and intensely itchy skin. Our treatment focus is on repairing the skin barrier, identifying environmental allergens, and using targeted topical anti-inflammatory creams.",
    symptoms: [
      "Intense itching, especially at night",
      "Red to brownish-gray patches, commonly on hands, feet, and elbows",
      "Small, raised bumps that may leak fluid when scratched",
    ],
    causes: [
      "Genetically weak skin barrier (filaggrin deficiency)",
      "Overactive immune system responding to allergens",
      "Triggers like harsh soaps, wool, and climate changes",
    ],
    process: [
      { step: "Barrier Evaluation", detail: "Checking skin hydration levels and mapping triggers." },
      { step: "Active Treatment", detail: "Mild topical steroids or calcineurin inhibitors to calm inflammation." },
      { step: "Moisturization", detail: "Prescribing ceramide-rich barrier repair formulations." },
      { step: "Trigger Avoidance", detail: "Creating a customized list of lifestyle modifications." },
    ],
    benefits: [
      "Rapid relief from itching and sleep disruption",
      "Heals raw, cracked skin barrier",
      "Fewer flare-ups over time",
    ],
    faqs: [
      { q: "Can eczema be cured?", a: "It is a chronic condition, but proper skincare and barrier repair keep it inactive for long periods." },
      { q: "What soap should eczema patients use?", a: "Gentle, soap-free syndet bars or cleansing oils are recommended." },
    ],
  },
  {
    slug: "urticaria",
    title: "Urticaria (Pitt)",
    short: "Control hives, swelling, and itching with root-cause allergy identification.",
    icon: "AlertCircle",
    overview:
      "Urticaria, commonly known as hives or Pitt, presents as itchy, raised wheals on the skin, often accompanied by swelling (angioedema). We offer allergy testing, second-generation antihistamines, and advanced immunomodulators.",
    symptoms: [
      "Sudden appearance of itchy, red, or skin-colored wheals (welts)",
      "Wheals changing shape and disappearing within 24 hours",
      "Swelling of lips, eyelids, or throat (angioedema)",
    ],
    causes: [
      "Allergic reactions to foods, medications, or insect bites",
      "Physical triggers (heat, cold, pressure, exercise)",
      "Chronic autoimmune activation",
    ],
    process: [
      { step: "Trigger History", detail: "Pinpointing physical or dietary triggers." },
      { step: "Allergy Panels", detail: "Blood tests or skin prick tests if indicated." },
      { step: "Symptomatic Control", detail: "Customized combinations of non-drowsy antihistamines." },
      { step: "Long-term Control", detail: "Biologics (omalizumab) or immunomodulators for chronic hives." },
    ],
    benefits: [
      "Stops sudden hive outbreaks and itching",
      "Prevents emergency swelling (angioedema) episodes",
      "Restores peaceful daily routine",
    ],
    faqs: [
      { q: "How long does urticaria last?", a: "Acute urticaria resolves in under 6 weeks; chronic cases can last longer but are manageable." },
      { q: "Is urticaria dangerous?", a: "Standard hives are harmless, but swelling of the throat or difficulty breathing requires immediate emergency care." },
    ],
  },
  {
    slug: "skin-biopsy",
    title: "Skin Biopsy",
    short: "Precise histopathological diagnostics for accurate identification of complex skin conditions.",
    icon: "Search",
    overview:
      "A skin biopsy is a simple, in-office procedure where a tiny sample of skin is removed for laboratory examination. This is the gold standard for diagnosing atypical growths, chronic rashes, and complex skin disorders.",
    symptoms: [
      "Suspicious, changing, or non-healing moles",
      "Chronic skin rashes unresponsive to standard treatments",
      "Atypical skin growths or nodules",
    ],
    causes: [
      "Need for definitive microscopic diagnosis",
      "Rule out skin cancers or autoimmune conditions",
      "Identify rare cellular structures in the skin",
    ],
    process: [
      { step: "Local Anesthesia", detail: "Numbing the small target area completely." },
      { step: "Sample Collection", detail: "Punch, shave, or excisional biopsy (takes 5-10 minutes)." },
      { step: "Suturing & Dressing", detail: "Placing 1-2 tiny sutures if needed and sterile dressing." },
      { step: "Lab Analysis", detail: "Sending the sample for histopathological examination." },
    ],
    benefits: [
      "Provides accurate, definitive medical diagnosis",
      "Guides targeted, effective treatment planning",
      "Minimally invasive with negligible discomfort",
    ],
    faqs: [
      { q: "Will it leave a scar?", a: "A very tiny, faint line or dot may remain, which fades over time." },
      { q: "When will the reports arrive?", a: "Biopsy results typically take 5–7 working days." },
    ],
  },
  {
    slug: "drug-allergy",
    title: "Drug Allergy",
    short: "Emergency and routine care to identify and treat adverse reactions to medications.",
    icon: "ShieldAlert",
    overview:
      "Adverse drug reactions can present as mild rashes, hives, or severe blistering skin eruptions. We offer rapid diagnostic support, allergen identification, and emergency management to stabilize the skin and immune system.",
    symptoms: [
      "Widespread red skin rashes appearing after taking a medication",
      "Itching, hives, or swelling of the face",
      "Severe blistering, peeling skin, or mouth ulcers",
    ],
    causes: [
      "Immune reaction to drugs (antibiotics, pain relievers, antiseizure meds)",
      "Genetic hypersensitivity to specific pharmaceutical agents",
    ],
    process: [
      { step: "Drug History Mapping", detail: "Creating a chronological timeline of medications taken." },
      { step: "Acute Stabilization", detail: "Administering antihistamines, corticosteroids, or fluids." },
      { step: "Substitution", detail: "Recommending safe alternative drugs for your health conditions." },
      { step: "Patient Education", detail: "Providing a drug allergy card to present to other doctors." },
    ],
    benefits: [
      "Prevents life-threatening drug reactions",
      "Restores skin integrity and clears rashes",
      "Clear identification of lifetime allergens",
    ],
    faqs: [
      { q: "Can a drug allergy develop to a drug I took safely before?", a: "Yes, sensitization can happen over time, and the allergy can present on subsequent use." },
      { q: "What should I do during a severe reaction?", a: "Stop the suspected drug immediately and seek immediate medical attention." },
    ],
  },
  {
    slug: "leprosy",
    title: "Leprosy",
    short: "Dermatologist-led early detection, multi-drug therapy, and care for Hansen's disease.",
    icon: "Activity",
    overview:
      "Leprosy is a curable bacterial infection affecting the skin and nerves. Dr. Amit Jain provides confidential clinical assessments, early detection to prevent nerve damage, and supervises Multi-Drug Therapy (MDT) protocols.",
    symptoms: [
      "Pale or reddish patches of skin with loss of sensation (numbness)",
      "Weakness or numbness in hands, feet, or face",
      "Painless ulcers on the soles of feet",
    ],
    causes: [
      "Infection by the bacterium Mycobacterium leprae",
      "Prolonged close contact with untreated cases",
    ],
    process: [
      { step: "Sensory Mapping", detail: "Testing skin patches for hot, cold, touch, and pain sensation." },
      { step: "Nerve Palpation", detail: "Examining peripheral nerves for thickening or tenderness." },
      { step: "Slit-Skin Smear", detail: "Microscopic identification of the bacteria." },
      { step: "MDT Initiation", detail: "Starting the WHO-recommended Multi-Drug Therapy regimen." },
    ],
    benefits: [
      "Completely cures the infection",
      "Prevents permanent nerve damage and physical disability",
      "Fully stops transmission of the disease",
    ],
    faqs: [
      { q: "Is leprosy curable?", a: "Yes, leprosy is completely curable with a standard course of Multi-Drug Therapy." },
      { q: "How contagious is leprosy?", a: "It is very mildly contagious and becomes non-infectious within a few days of starting treatment." },
    ],
  },
  {
    slug: "skin-tags",
    title: "Skin Tags",
    short: "Quick, scar-free removal using radiofrequency, electrocautery, or cryotherapy.",
    icon: "Scissors",
    overview:
      "Skin tags and warts are benign skin growths that can be annoying or cosmetically unappealing. We offer instant, scar-free removal under local anesthesia using advanced electrocautery or radiofrequency ablation.",
    symptoms: [
      "Small, flesh-colored or brown growths hanging off the skin (tags)",
      "Rough, hard bumps on hands, feet, or face (warts)",
      "Growths catching on clothing or jewelry causing irritation",
    ],
    causes: [
      "Skin friction (commonly in neck, armpits, or groin)",
      "Human Papillomavirus (HPV) infection (for warts)",
      "Genetics, obesity, and insulin resistance",
    ],
    process: [
      { step: "Dermatoscopy", detail: "Confirming the growth is benign and mapping it." },
      { step: "Numbing", detail: "Applying a topical anesthetic cream or injecting a local anesthetic." },
      { step: "Ablation", detail: "Removing the growth cleanly using radiofrequency or electrocautery." },
      { step: "Post-care", detail: "Applying antibiotic ointment and healing dressing." },
    ],
    benefits: [
      "Instant removal in a single session",
      "Minimal to no bleeding or scarring",
      "Improves hygiene and cosmetic appearance",
    ],
    faqs: [
      { q: "Do skin tags grow back?", a: "Once removed, that specific tag will not grow back, though new ones can form in friction-prone areas." },
      { q: "Will wart removal require multiple sessions?", a: "Deep or viral warts may sometimes require 2-3 sessions for complete resolution." },
    ],
  },
  {
    slug: "hydra-facial",
    title: "Hydra Facial",
    short: "Premium multi-step hydration and deep cleansing treatment for instant skin rejuvenation.",
    icon: "Wand2",
    overview:
      "The Hydra Facial is a popular medical-grade resurfacing treatment. It combines deep cleansing, exfoliation, painless extraction, intense hydration, and antioxidant protection using a specialized vortex-fusion delivery system.",
    symptoms: [
      "Dull, dry, or dehydrated skin",
      "Congested pores, blackheads, and whiteheads",
      "Fine lines, loss of elasticity, and uneven skin tone",
    ],
    causes: [
      "Environmental pollution and buildup of impurities",
      "Dehydration and lack of nourishment in skin layers",
      "Sun damage and aging",
    ],
    process: [
      { step: "Cleanse & Peel", detail: "Gentle exfoliation to uncover a new layer of skin." },
      { step: "Extract & Hydrate", detail: "Painless vacuum suction to remove debris from pores." },
      { step: "Fuse & Protect", detail: "Saturating the skin surface with antioxidants and peptides." },
      { step: "LED Therapy", detail: "Blue light for acne control or red light for collagen stimulation." },
    ],
    benefits: [
      "Instant, camera-ready glow with zero downtime",
      "Deeply hydrated, plump, and smooth skin",
      "Cleanses pores and reduces congestion",
    ],
    faqs: [
      { q: "Is there any downtime after Hydra Facial?", a: "No, you can put on makeup and resume normal activities immediately." },
      { q: "How often should I get a Hydra Facial?", a: "Getting one facial every 4 weeks is recommended to maintain optimal skin health." },
    ],
  },
  {
    slug: "moles",
    title: "Moles",
    short: "Clinical screening for suspicious moles and aesthetic removal with advanced lasers.",
    icon: "Eye",
    overview:
      "Moles (nevi) are common skin growths that should be evaluated to rule out atypical changes. We provide expert dermatoscopic evaluation of moles and offer clean, aesthetic removal via radiofrequency or surgical excision.",
    symptoms: [
      "Flat or raised brown, black, or flesh-colored spots",
      "Mole changing in size, shape, color, or starting to itch",
      "Moles located in areas prone to constant rubbing",
    ],
    causes: [
      "Clustering of melanocytes (pigment cells)",
      "Genetic factors and sun exposure",
    ],
    process: [
      { step: "Dermatoscopic Audit", detail: "Checking moles using ABCDE cancer screening criteria." },
      { step: "Biopsy (if atypical)", detail: "Sending sample to histology if any warning signs exist." },
      { step: "RF / Excision", detail: "Precise removal using radiofrequency or a minor excisional stitch." },
      { step: "Healing Protocol", detail: "Guidelines to minimize scarring and promote skin blending." },
    ],
    benefits: [
      "Safe, dermatologically-controlled removal",
      "Early detection of atypical lesions",
      "Improves aesthetic appearance of the face/body",
    ],
    faqs: [
      { q: "Are all moles dangerous?", a: "No, the vast majority of moles are completely benign and safe." },
      { q: "Will mole removal leave a scar?", a: "Advanced radiofrequency removal leaves a minimal, barely noticeable mark that fades." },
    ],
  },
  {
    slug: "birth-marks",
    title: "Birth Marks (Janm Khoon)",
    short: "Targeted laser therapies to fade vascular and pigmented birthmarks safely.",
    icon: "Sparkles",
    overview:
      "Birthmarks appear at birth or shortly after and can be vascular (red/strawberry) or pigmented (brown/black). We offer targeted Q-switched and vascular laser therapies to fade these marks gradually and safely.",
    symptoms: [
      "Flat red or purple patches (port-wine stains)",
      "Raised bright red nodules (strawberry hemangiomas)",
      "Flat, light-brown patches (café-au-lait spots) or bluish-gray marks",
    ],
    causes: [
      "Abnormal development of blood vessels (vascular birthmarks)",
      "Localized overgrowth of pigment cells (pigmented birthmarks)",
    ],
    process: [
      { step: "Classification", detail: "Dermatologist analysis to determine birthmark type and depth." },
      { step: "Laser Calibration", detail: "Setting custom wavelengths based on melanin or hemoglobin target." },
      { step: "Laser Treatment", detail: "Precise laser pulses to break down pigment or shrink capillaries." },
      { step: "Post-Laser Calming", detail: "Applying cooling gels and barrier-repair creams." },
    ],
    benefits: [
      "Visibly lightens or clears permanent birthmarks",
      "Safe for pediatric and adult patients",
      "Non-invasive with minimal side effects",
    ],
    faqs: [
      { q: "How many laser sessions are required?", a: "Depending on depth and size, birthmarks usually require 6–10 sessions spaced 6 weeks apart." },
      { q: "Is the treatment painful?", a: "It feels like a rubber band snap; a topical numbing cream is applied for comfort." },
    ],
  },
  {
    slug: "chemical-peel",
    title: "Chemical Peelings",
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
    slug: "laser-hair-removal",
    title: "Hair removal Lasers",
    short: "Safe, painless, and permanent hair reduction for all skin types.",
    icon: "Zap",
    overview:
      "Laser Hair Reduction targets hair follicles with concentrated light energy to disrupt future growth. We use advanced, US-FDA approved laser systems designed for safe and permanent hair reduction on Indian skin.",
    symptoms: [
      "Unwanted facial or body hair",
      "Ingrown hairs and recurrent folliculitis (razor bumps)",
      "Thick, rapid hair growth due to hormonal conditions (PCOS)",
    ],
    causes: [
      "Genetics and racial characteristics",
      "Hormonal imbalances (excess androgens, PCOS)",
    ],
    process: [
      { step: "Hormonal Screening", detail: "Assessing underlying PCOS or thyroid triggers." },
      { step: "Preparation", detail: "Shaving the target area before laser delivery." },
      { step: "Chilled Laser", detail: "Applying cooling gel and delivering laser pulses safely." },
      { step: "Post-care", detail: "Applying post-procedure calming lotion and sunscreen." },
    ],
    benefits: [
      "Up to 90% permanent reduction in hair growth",
      "Painless sessions with advanced contact cooling",
      "Smoother skin without painful waxing or razor bumps",
    ],
    faqs: [
      { q: "How many sessions are needed?", a: "Typically 6–8 sessions are needed for optimal results, as hair grows in cycles." },
      { q: "Is it permanent?", a: "Yes, it provides long-term, permanent hair reduction; occasional touch-ups may be needed." },
    ],
  },
  {
    slug: "bindi-tattoo-removal",
    title: "Bindi Tattoo removal",
    short: "Advanced Q-switched laser technology to clear decorative or cosmetic tattoos.",
    icon: "Trash2",
    overview:
      "Tattoos, including bindi-style or decorative forehead tattoos, can be safely removed using advanced Q-Switched lasers. The laser breaks tattoo ink into microscopic particles that are naturally cleared by the body's immune system.",
    symptoms: [
      "Unwanted decorative or cosmetic tattoos",
      "Faded, blurred, or distorted tattoo ink",
      "Skin irritation or allergy caused by old tattoo ink",
    ],
    causes: [
      "Desire to remove cosmetic, professional, or personal tattoos",
    ],
    process: [
      { step: "Ink Assessment", detail: "Analyzing ink depth, color, and skin type." },
      { step: "Numbing", detail: "Applying strong topical anesthetic cream for 45 minutes." },
      { step: "Laser Treatment", detail: "Delivering high-energy Q-switched laser pulses." },
      { step: "Healing Care", detail: "Applying antibacterial ointment and a protective patch." },
    ],
    benefits: [
      "Highly effective ink clearance",
      "Minimizes risk of skin scarring",
      "Safe for sensitive facial skin",
    ],
    faqs: [
      { q: "Will the tattoo disappear completely?", a: "Most tattoos fade significantly or disappear entirely over multiple sessions." },
      { q: "Why does it take multiple sessions?", a: "Ink is layered deep in the skin; the immune system needs time to clear the shattered particles between sessions." },
    ],
  },
  {
    slug: "botox",
    title: "Botox",
    short: "Smooth out fine lines and dynamic wrinkles for a youthful, natural appearance.",
    icon: "Sparkles",
    overview:
      "Botox (Botulinum Toxin) injections temporarily relax the specific muscles responsible for dynamic facial expressions. This smooths out wrinkles, refines facial contours, and prevents new lines from setting in.",
    symptoms: [
      "Horizontal forehead lines and frown lines between eyebrows",
      "Crow's feet around the eyes",
      "Sagging jawline or prominent neck bands",
    ],
    causes: [
      "Repetitive muscle contractions from expressions",
      "Age-related collagen depletion and skin thinning",
    ],
    process: [
      { step: "Facial Analysis", detail: "Mapping active muscle movement during expressions." },
      { step: "Precise Marking", detail: "Identifying target injection points for a natural look." },
      { step: "Micro-injections", detail: "Administering tiny doses using ultra-fine needles." },
      { step: "Post-care", detail: "Avoiding lying down or strenuous exercise for 4 hours." },
    ],
    benefits: [
      "Smoother, younger-looking skin within 3–7 days",
      "Quick 15-minute lunchtime procedure",
      "Prevents the formation of deep permanent wrinkles",
    ],
    faqs: [
      { q: "How long does Botox last?", a: "Results typically last between 3 to 6 months; regular touch-ups maintain the look." },
      { q: "Does it look natural?", a: "Yes, when performed by a qualified dermatologist like Dr. Amit Jain, you will maintain natural expressions." },
    ],
  },
  {
    slug: "hyperhydrosis",
    title: "Hyperhydrosis",
    short: "Effective treatment for excessive underarm, palm, or foot sweating (Botox & medical).",
    icon: "Droplet",
    overview:
      "Hyperhidrosis refers to abnormally excessive sweating that is not related to heat or exercise. We offer highly effective treatments, including clinical antiperspirants, oral medications, and targeted Botox injections that temporarily block sweat glands.",
    symptoms: [
      "Excessive underarm sweating staining clothes",
      "Dripping wet palms and soles interfering with daily activities",
      "Recurrent fungal or bacterial skin infections in sweaty areas",
    ],
    causes: [
      "Overactive sweat glands triggered by the nervous system",
      "Genetic factors",
    ],
    process: [
      { step: "Diagnostic Mapping", detail: "Performing a starch-iodine test to identify overactive sweat areas." },
      { step: "Numbing", detail: "Applying anesthetic cream to ensure a comfortable procedure." },
      { step: "Botox Microinjections", detail: "Delivering Botox to block neural signals to sweat glands." },
      { step: "Follow-up", detail: "Assessing sweat reduction after 2 weeks." },
    ],
    benefits: [
      "Up to 80–90% reduction in sweating",
      "Dry, comfortable palms, feet, and underarms",
      "Boosts professional and social confidence",
    ],
    faqs: [
      { q: "How long do Botox results last for sweating?", a: "It provides relief for 6 to 12 months, which is longer than facial wrinkle treatments." },
      { q: "Are there any side effects?", a: "Mild temporary soreness or localized weakness is possible but rare." },
    ],
  },
  {
    slug: "nail-disorders",
    title: "Nail Problems",
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

export const getCategory = (slug: string) => {
  if (["prp-therapy", "hair-fall-treatment", "laser-hair-removal", "baldness"].includes(slug)) {
    return "Trichology";
  }
  if ([
    "anti-aging-treatment",
    "cosmetology-procedures",
    "skin-polishing",
    "hydra-facial",
    "chemical-peel",
    "chemical-peelings",
    "bindi-tattoo-removal",
    "botox"
  ].includes(slug)) {
    return "Cosmetology";
  }
  if ([
    "nail-disorders",
    "nail-problems",
    "skin-allergy-treatment",
    "skin-biopsy",
    "drug-allergy",
    "hyperhydrosis"
  ].includes(slug)) {
    return "Medical Care";
  }
  return "Dermatology";
};

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
  { src: "https://res.cloudinary.com/dntsjzbei/image/upload/v1780681530/yotg2haunjnbiblavmpb.png", category: "Doctor", caption: "Dr. Amit Jain — Consultation" },
  // { src: "https://res.cloudinary.com/dntsjzbei/image/upload/v1780681530/yotg2haunjnbiblavmpb.png", category: "Doctor", caption: "Dr. Amit Jain — In Clinic" },
  // { src: "https://res.cloudinary.com/dntsjzbei/image/upload/v1780681530/yotg2haunjnbiblavmpb.png", category: "Doctor", caption: "Dr. Amit Jain — Dermatology Expert" },
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