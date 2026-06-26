import type { Metadata } from "next";
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  SEO_DEFAULTS,
  GLOBAL_KEYWORDS,
  PAGE_KEYWORDS,
  absoluteUrl,
} from "./seo/config";
import { SITE_NAME, SITE_DESCRIPTION } from "./constants";

export interface CreateMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  keywords = [],
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const isHome = title === "Home";
  const fullTitle = isHome ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const canonical = absoluteUrl(path || "/");
  const pageKeywords = path ? PAGE_KEYWORDS[path] ?? [] : PAGE_KEYWORDS["/"] ?? [];

  const allKeywords = [
    ...new Set([...GLOBAL_KEYWORDS, ...pageKeywords, ...keywords]),
  ];

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: fullTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    category: "Fitness",
    formatDetection: {
      telephone: true,
      email: false,
      address: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      locale: SEO_DEFAULTS.locale,
      url: canonical,
      siteName: SEO_DEFAULTS.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SEO_DEFAULTS.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SEO_DEFAULTS.twitterHandle,
      creator: SEO_DEFAULTS.twitterHandle,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    other: {
      "geo.region": "IN-AP",
      "geo.placename": "Visakhapatnam",
      "geo.position": "17.7231;83.3045",
      ICBM: "17.7231, 83.3045",
    },
  };

  if (ogType === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: authors ?? [SITE_NAME],
    };
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    metadata.verification = {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    };
  }

  return metadata;
}

export function createMetadata(
  titleOrOptions: string | CreateMetadataOptions,
  description?: string,
  path?: string
): Metadata {
  if (typeof titleOrOptions === "string") {
    return buildMetadata({
      title: titleOrOptions,
      description,
      path,
    });
  }
  return buildMetadata(titleOrOptions);
}

export const noIndexMetadata = (): Metadata =>
  buildMetadata({ title: "Private", noIndex: true });
