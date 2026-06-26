import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  CONTACT,
  SOCIAL_LINKS,
} from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://knrajufitness.com";

export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=630&fit=crop&q=80";

export const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  description: SITE_DESCRIPTION,
  tagline: SITE_TAGLINE,
  locale: "en_IN",
  twitterHandle: "@indian_gym23",
  geo: {
    latitude: 17.7231,
    longitude: 83.3045,
  },
  areaServed: "Visakhapatnam, Andhra Pradesh, India",
};

export const GLOBAL_KEYWORDS = [
  "gym Visakhapatnam",
  "fitness center Vizag",
  "KN Raju Fitness",
  "Indian Gym Visakhapatnam",
  "gym near Srinagar Vizag",
  "personal training Visakhapatnam",
  "weight training gym",
  "bodybuilding gym Vizag",
  "ladies gym Visakhapatnam",
  "gym membership Vizag",
  "CBM Compound gym",
  "Rama Talkies Road gym",
];

export const PAGE_KEYWORDS: Record<string, string[]> = {
  "/": [
    "best gym Visakhapatnam",
    "premium fitness studio Vizag",
    "gym with personal trainer",
  ],
  "/about": ["about KN Raju Fitness", "gym history Visakhapatnam"],
  "/membership": ["gym membership price Vizag", "monthly gym fee Visakhapatnam"],
  "/services": ["weight loss program", "muscle building training Vizag"],
  "/trainers": ["certified gym trainers Visakhapatnam"],
  "/gallery": ["gym photos Vizag", "fitness studio gallery"],
  "/contact": ["gym contact Visakhapatnam", "gym phone number Vizag"],
  "/free-trial": ["free gym trial Vizag", "gym trial pass Visakhapatnam"],
  "/blogs": ["fitness tips", "gym nutrition blog"],
  "/faqs": ["gym FAQ", "membership questions"],
  "/bmi-calculator": ["BMI calculator", "body mass index tool"],
  "/transformation": ["weight loss transformation", "gym success stories"],
};

export function getSocialProfiles() {
  return SOCIAL_LINKS.map((link) => link.href).filter(Boolean);
}

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return path === "" || path === "/"
    ? SITE_URL
    : `${SITE_URL}${normalized}`;
}

export function getOpeningHoursSpecification() {
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "05:00",
      closes: "11:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "17:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "05:00",
      closes: "11:00",
    },
  ];
}

export function getGymAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: CONTACT.addressLines.slice(0, 3).join(", "),
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "530016",
    addressCountry: "IN",
  };
}
