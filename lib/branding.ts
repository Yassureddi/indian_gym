export const BRAND = {
  name: "INDIAN GYM K N RAJU FITNESS",
  shortName: "KN Raju Fitness",
  tagline: "Transform Your Body, Elevate Your Life",
  logo: {
    src: "/brand/logo.svg",
    fallback: "/brand/logo.svg",
    alt: "KN Raju Fitness — Be Strong logo",
  },
  loginLogo: {
    src: "/brand/login-logo.png",
    fallback: "/brand/login-logo.png",
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
  navbar: { width: 44, height: 44 },
  footer: { width: 50, height: 58 },
  login: { width: 180, height: 180 },
  hero: { width: 200, height: 232 },
  icon: { width: 34, height: 40 },
};
