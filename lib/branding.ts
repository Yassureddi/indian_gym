export const BRAND = {
  name: "INDIAN GYM K N RAJU FITNESS",
  shortName: "KN Raju Fitness",
  tagline: "Transform Your Body, Elevate Your Life",
  logo: {
    /** Drop your uploaded logo at public/brand/logo.png and set src below */
    src: "/brand/logo.svg",
    fallback: "/brand/logo.svg",
    alt: "INDIAN GYM K N RAJU FITNESS Logo",
  },
  colors: {
    primary: "#000000",
    secondary: "#D4AF37",
    text: "#FFFFFF",
    textMuted: "#A3A3A3",
    textSubtle: "#737373",
  },
} as const;

export type LogoVariant = "navbar" | "footer" | "login" | "icon";

export const LOGO_SIZES: Record<LogoVariant, { width: number; height: number }> = {
  navbar: { width: 48, height: 48 },
  footer: { width: 56, height: 56 },
  login: { width: 72, height: 72 },
  icon: { width: 32, height: 32 },
};
