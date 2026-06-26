export const BRAND = {
  name: "INDIAN GYM K N RAJU FITNESS",
  shortName: "KN Raju Fitness",
  tagline: "Transform Your Body, Elevate Your Life",
  logo: {
    src: "/brand/be-strong-logo.png",
    fallback: "/brand/be-strong-logo.png",
    alt: "KN Raju Fitness — Be Strong bull logo",
  },
  loginLogo: {
    src: "/brand/be-strong-logo.png",
    fallback: "/brand/be-strong-logo.png",
    alt: "KN Raju Fitness — Be Strong",
  },
  colors: {
    primary: "#000000",
    secondary: "#D4AF37",
    text: "#FFFFFF",
    textMuted: "#A3A3A3",
    textSubtle: "#737373",
  },
} as const;

export type LogoVariant = "navbar" | "footer" | "login" | "hero" | "icon";

export const LOGO_SIZES: Record<LogoVariant, { width: number; height: number }> = {
  navbar: { width: 48, height: 54 },
  footer: { width: 72, height: 81 },
  login: { width: 200, height: 225 },
  hero: { width: 240, height: 270 },
  icon: { width: 40, height: 45 },
};
