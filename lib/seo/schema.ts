import { FAQS, SITE_NAME, CONTACT } from "@/lib/constants";
import type { BlogItem } from "@/lib/blog";
import type { Trainer } from "@/lib/trainers";
import { MEMBERSHIP_PLANS } from "@/lib/membership";
import {
  SITE_URL,
  SEO_DEFAULTS,
  getSocialProfiles,
  getOpeningHoursSpecification,
  getGymAddress,
  absoluteUrl,
} from "./config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    description: SEO_DEFAULTS.description,
    sameAs: getSocialProfiles(),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+91-${CONTACT.phone}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SEO_DEFAULTS.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blogs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HealthClub", "SportsActivityLocation"],
    "@id": `${SITE_URL}/#gym`,
    name: SITE_NAME,
    description: SEO_DEFAULTS.description,
    url: SITE_URL,
    image: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop",
      `${SITE_URL}/brand/logo.png`,
    ],
    telephone: `+91-${CONTACT.phone}`,
    email: `info@${new URL(SITE_URL).hostname}`,
    address: getGymAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO_DEFAULTS.geo.latitude,
      longitude: SEO_DEFAULTS.geo.longitude,
    },
    openingHoursSpecification: getOpeningHoursSpecification(),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
    areaServed: SEO_DEFAULTS.areaServed,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`,
    sameAs: getSocialProfiles(),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema(blog: Pick<BlogItem, "id" | "title" | "excerpt" | "image" | "date">) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image,
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blogs/${blog.id}`),
    },
  };
}

export function serviceListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fitness Programs",
    itemListElement: [
      "Weight Loss",
      "Weight Gain",
      "Muscle Building",
      "Strength Training",
      "Cardio Training",
      "Personal Training",
    ].map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@id": `${SITE_URL}/#gym` },
        areaServed: SEO_DEFAULTS.areaServed,
      },
    })),
  };
}

export function membershipOfferSchema() {
  const offers = MEMBERSHIP_PLANS.flatMap((plan) =>
    plan.categories.map((category) => ({
      plan,
      category,
    }))
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gym Membership Plans",
    itemListElement: offers.map(({ plan, category }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: `${plan.name} · ${category.name}`,
        price: category.price,
        priceCurrency: "INR",
        description: category.features.join(". "),
        seller: { "@id": `${SITE_URL}/#gym` },
        url: absoluteUrl("/membership"),
      },
    })),
  };
}

export function trainersListSchema(trainers: Trainer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gym Trainers",
    itemListElement: trainers.map((trainer, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: trainer.name,
        jobTitle: trainer.role,
        description: trainer.bio,
        image: trainer.image,
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  };
}

export function homePageSchema() {
  return [
    organizationSchema(),
    websiteSchema(),
    localBusinessSchema(),
  ];
}
