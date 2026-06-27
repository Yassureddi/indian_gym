export const ADMIN_NAV_MAIN = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/members", label: "Members", icon: "members" },
  { href: "/admin/payments", label: "Payments", icon: "payments" },
  { href: "/admin/notifications", label: "Notifications", icon: "notifications" },
  { href: "/admin/membership-plans", label: "Membership Plans", icon: "plans" },
] as const;

export const ADMIN_NAV_SUPPLEMENTS = [
  { href: "/admin/supplements", label: "Supplements", icon: "supplements" },
  { href: "/admin/store", label: "Store", icon: "store" },
  { href: "/admin/store-sales", label: "Store Sales", icon: "storeSales" },
  { href: "/admin/supplement-orders", label: "Supplement Orders", icon: "orders" },
] as const;

export const ADMIN_NAV_CONTENT = [
  { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
  { href: "/admin/blogs", label: "Blogs", icon: "blogs" },
  { href: "/admin/trainers", label: "Trainers", icon: "trainers" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
] as const;

export const ADMIN_NAV = [
  ...ADMIN_NAV_MAIN,
  ...ADMIN_NAV_SUPPLEMENTS,
  ...ADMIN_NAV_CONTENT,
] as const;

export type AdminIconName =
  | (typeof ADMIN_NAV_MAIN)[number]["icon"]
  | (typeof ADMIN_NAV_SUPPLEMENTS)[number]["icon"]
  | (typeof ADMIN_NAV_CONTENT)[number]["icon"];

export const SUPPLEMENT_NAV_PATHS = ADMIN_NAV_SUPPLEMENTS.map((item) => item.href);
