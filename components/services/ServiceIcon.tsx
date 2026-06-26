import { ServiceItem } from "@/lib/services";

interface ServiceIconProps {
  type: ServiceItem["icon"];
}

export default function ServiceIcon({ type }: ServiceIconProps) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "weight-loss":
      return (
        <svg {...props}>
          <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "weight-gain":
      return (
        <svg {...props}>
          <path d="M12 21V3M8 17l4 4 4-4M8 7l4-4 4 4" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "muscle":
      return (
        <svg {...props}>
          <path d="M6.5 8a4.5 4.5 0 019 0v1.5a3 3 0 01-3 3h-3a3 3 0 01-3-3V8z" />
          <path d="M12 12.5V16M9 16h6" />
        </svg>
      );
    case "strength":
      return (
        <svg {...props}>
          <path d="M6 12h12M4 9v6M20 9v6M2 10v4M22 10v4" />
        </svg>
      );
    case "cardio":
      return (
        <svg {...props}>
          <path d="M3 12h4l2-4 4 8 2-4h6" />
        </svg>
      );
    case "personal":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20v-1a6 6 0 0112 0v1" />
        </svg>
      );
    default:
      return null;
  }
}
