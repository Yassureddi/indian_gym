export const SITE_NAME = "INDIAN GYM K N RAJU FITNESS";
export const SITE_SHORT_NAME = "KN Raju Fitness";
export const SITE_TAGLINE = "Transform Your Body, Elevate Your Life";
export const HERO_HEADLINE = "Become Stronger Than Yesterday";
export const SITE_DESCRIPTION =
  "Premium fitness studio in Visakhapatnam offering world-class training, personalized programs, and a luxury gym experience. Join INDIAN GYM K N RAJU FITNESS in Asilmetta, Vizag.";

export const CONTACT = {
  phone: "8142113631",
  whatsapp: "918142113631",
  instagram: "indian_gym23",
  instagramUrl: "https://www.instagram.com/indian_gym23/",
  addressLines: [
    "3rd Floor, 9-1-245",
    "Rama Talkies Rd, near Timpany School",
    "CBM Compound, Asilmetta",
    "Visakhapatnam, Andhra Pradesh 530003",
  ],
  address:
    "3rd Floor, 9-1-245, Rama Talkies Rd, near Timpany School, CBM Compound, Asilmetta, Visakhapatnam, Andhra Pradesh 530003",
  postalCode: "530003",
  area: "Asilmetta",
  hours: {
    weekday: {
      label: "Monday - Saturday",
      slots: ["5:00 AM - 11:00 AM", "5:00 PM - 9:00 PM"],
    },
    sunday: {
      label: "Sunday",
      slots: ["5:00 AM - 11:00 AM"],
    },
  },
  hoursSummary:
    "Mon-Sat: 5AM-11AM & 5PM-9PM | Sun: 5AM-11AM",
};

export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/indian_gym23/", icon: "instagram" },
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Membership Plans", shortLabel: "Membership" },
  { href: "/trainers", label: "Trainers" },
  { href: "/supplements", label: "Supplements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/transformation", label: "Transformations", shortLabel: "Transform" },
  { href: "/bmi-calculator", label: "BMI Calculator", shortLabel: "BMI" },
  { href: "/blogs", label: "Blogs" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

/** Shown directly in the desktop navbar */
export const NAV_LINKS_PRIMARY: NavLink[] = NAV_LINKS.filter((link) =>
  [
    "/",
    "/about",
    "/services",
    "/membership",
    "/trainers",
    "/supplements",
    "/contact",
  ].includes(link.href)
);

/** Grouped under the “More” menu on desktop */
export const NAV_LINKS_MORE: NavLink[] = NAV_LINKS.filter(
  (link) => !NAV_LINKS_PRIMARY.includes(link)
);

export const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "5000+", label: "Happy Members" },
  { value: "50+", label: "Expert Trainers" },
  { value: "100+", label: "Transformations" },
];

export const TRANSFORMATION_STATS = [
  { value: 5000, suffix: "+", label: "Lives Transformed" },
  { value: 100, suffix: "+", label: "Success Stories" },
  { value: 25000, suffix: " kg", label: "Total Weight Lost" },
  { value: 98, suffix: "%", label: "Member Satisfaction" },
];

export const TESTIMONIALS = [
  {
    id: "1",
    name: "Rahul Kumar",
    role: "Member since 2022",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote:
      "KN Raju Fitness changed my life completely. Lost 25kg in 6 months with their expert guidance and premium facilities.",
    rating: 5,
  },
  {
    id: "2",
    name: "Sneha Mehta",
    role: "Premium Member",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote:
      "The trainers here are world-class. The luxury atmosphere motivates me every single day. Best gym in Hyderabad!",
    rating: 5,
  },
  {
    id: "3",
    name: "Vikram Singh",
    role: "Elite Member",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    quote:
      "From day one, I felt like part of an elite fitness family. The equipment, coaches, and community are unmatched.",
    rating: 5,
  },
  {
    id: "4",
    name: "Ananya Reddy",
    role: "Member since 2023",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    quote:
      "The group classes and personal training combo helped me achieve goals I never thought possible. Truly premium experience.",
    rating: 5,
  },
];

export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/4761781/4761781-hd_1920_1080_25fps.mp4";

export const HERO_VIDEO_POSTER =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop";

export const SERVICES = [
  {
    id: "personal-training",
    title: "Personal Training",
    description:
      "One-on-one sessions tailored to your goals with certified elite trainers.",
    icon: "dumbbell",
    price: "From ₹2,999/mo",
  },
  {
    id: "group-classes",
    title: "Group Classes",
    description:
      "High-energy group workouts including HIIT, Zumba, Yoga, and CrossFit.",
    icon: "users",
    price: "From ₹1,499/mo",
  },
  {
    id: "strength-conditioning",
    title: "Strength & Conditioning",
    description:
      "Build muscle, increase power, and improve athletic performance.",
    icon: "strength",
    price: "From ₹1,999/mo",
  },
  {
    id: "nutrition",
    title: "Nutrition Coaching",
    description:
      "Custom meal plans and dietary guidance for optimal results.",
    icon: "nutrition",
    price: "From ₹999/mo",
  },
  {
    id: "cardio-zone",
    title: "Premium Cardio Zone",
    description:
      "State-of-the-art treadmills, bikes, and rowing machines.",
    icon: "cardio",
    price: "Included",
  },
  {
    id: "recovery",
    title: "Recovery & Wellness",
    description:
      "Sauna, steam room, and massage therapy for complete recovery.",
    icon: "spa",
    price: "From ₹799/mo",
  },
];

export const MEMBERSHIP_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 1499,
    period: "month",
    features: [
      "Gym floor access",
      "Locker facility",
      "Basic equipment",
      "Operating hours access",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 2999,
    period: "month",
    features: [
      "All Basic features",
      "Group classes unlimited",
      "Sauna & steam access",
      "Nutrition consultation",
      "Priority booking",
    ],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 4999,
    period: "month",
    features: [
      "All Premium features",
      "Personal trainer (8 sessions)",
      "Custom workout plan",
      "Body composition analysis",
      "Guest passes (2/month)",
      "24/7 access",
    ],
    popular: false,
  },
];

export const TRANSFORMATIONS = [
  {
    id: "1",
    name: "Rahul K.",
    duration: "6 months",
    weightLoss: "25 kg",
    before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=400&fit=crop",
    story: "Lost 25kg and gained confidence through dedicated training with our team.",
  },
  {
    id: "2",
    name: "Sneha M.",
    duration: "4 months",
    weightLoss: "18 kg",
    before: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1594381898411-8465977c892e?w=300&h=400&fit=crop",
    story: "Transformed my lifestyle with personalized nutrition and HIIT classes.",
  },
  {
    id: "3",
    name: "Vikram S.",
    duration: "8 months",
    weightLoss: "30 kg",
    before: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=300&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300&h=400&fit=crop",
    story: "From couch to marathon runner. The trainers here changed my life.",
  },
];

export const FAQS = [
  {
    question: "What are your operating hours?",
    answer:
      "We are open Monday to Saturday from 5:00 AM to 11:00 PM, and Sunday from 6:00 AM to 9:00 PM. Elite members enjoy 24/7 access.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! We offer a complimentary 3-day trial pass for new members. Visit our Free Trial page to sign up.",
  },
  {
    question: "What should I bring for my first visit?",
    answer:
      "Bring comfortable workout clothes, athletic shoes, a water bottle, and a valid ID. Towels are provided for Premium and Elite members.",
  },
  {
    question: "Can I freeze my membership?",
    answer:
      "Premium and Elite members can freeze their membership for up to 2 months per year for medical or travel reasons.",
  },
  {
    question: "Do you have personal trainers?",
    answer:
      "Yes, we have a team of certified personal trainers. Personal training sessions are included in Elite membership or available as add-ons.",
  },
  {
    question: "Is parking available?",
    answer:
      "Yes, we offer free parking for all members in our dedicated parking facility.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, credit/debit cards, UPI, and net banking. EMI options are available for annual memberships.",
  },
  {
    question: "Are group classes included?",
    answer:
      "Group classes are included in Premium and Elite memberships. Basic members can purchase class packs separately.",
  },
];
