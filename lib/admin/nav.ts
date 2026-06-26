export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/members", label: "Members", icon: "members" },
  { href: "/admin/attendance", label: "Attendance", icon: "attendance" },
  { href: "/admin/payments", label: "Payments", icon: "payments" },
  { href: "/admin/membership-plans", label: "Membership Plans", icon: "plans" },
  { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
  { href: "/admin/blogs", label: "Blogs", icon: "blogs" },
  { href: "/admin/trainers", label: "Trainers", icon: "trainers" },
  { href: "/admin/notifications", label: "Notifications", icon: "notifications" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
] as const;

export type AdminIconName = (typeof ADMIN_NAV)[number]["icon"];
