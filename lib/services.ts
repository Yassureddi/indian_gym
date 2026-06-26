export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  duration: string;
  cta: string;
  ctaHref: string;
  image: string;
  icon: "weight-loss" | "weight-gain" | "muscle" | "strength" | "cardio" | "personal";
}

export const FITNESS_SERVICES: ServiceItem[] = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    description:
      "Science-backed fat loss programs combining strategic cardio, resistance training, and nutrition guidance to help you shed pounds sustainably.",
    benefits: [
      "Custom calorie-deficit plans",
      "HIIT & fat-burning circuits",
      "Weekly progress tracking",
      "Nutrition coaching included",
    ],
    duration: "8–12 weeks program",
    cta: "Start Losing Weight",
    ctaHref: "/free-trial",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    icon: "weight-loss",
  },
  {
    id: "weight-gain",
    title: "Weight Gain",
    description:
      "Structured bulking programs designed for healthy weight gain through progressive overload, caloric surplus nutrition, and recovery optimization.",
    benefits: [
      "Personalized meal plans",
      "Compound movement focus",
      "Lean mass gain strategy",
      "Supplement guidance",
    ],
    duration: "10–16 weeks program",
    cta: "Begin Your Journey",
    ctaHref: "/free-trial",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop",
    icon: "weight-gain",
  },
  {
    id: "muscle-building",
    title: "Muscle Building",
    description:
      "Hypertrophy-focused training protocols to maximize muscle growth with periodized programs, form correction, and advanced split routines.",
    benefits: [
      "Hypertrophy split programs",
      "Form & technique coaching",
      "Progressive overload tracking",
      "Recovery protocols",
    ],
    duration: "12+ weeks program",
    cta: "Build Muscle Now",
    ctaHref: "/free-trial",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    icon: "muscle",
  },
  {
    id: "strength-training",
    title: "Strength Training",
    description:
      "Powerlifting and strength-focused programs to build raw power, increase lifts, and develop functional strength for everyday life.",
    benefits: [
      "1RM testing & programming",
      "Powerlifting techniques",
      "Accessory work plans",
      "Competition prep available",
    ],
    duration: "8–12 weeks program",
    cta: "Get Stronger",
    ctaHref: "/free-trial",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    icon: "strength",
  },
  {
    id: "cardio",
    title: "Cardio",
    description:
      "High-performance cardiovascular training including treadmill intervals, cycling, rowing, and endurance programs for heart health and stamina.",
    benefits: [
      "Zone-based cardio training",
      "Endurance building plans",
      "Heart rate monitoring",
      "Fat oxidation optimization",
    ],
    duration: "4–8 weeks program",
    cta: "Boost Endurance",
    ctaHref: "/free-trial",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
    icon: "cardio",
  },
  {
    id: "personal-training",
    title: "Personal Training",
    description:
      "One-on-one sessions with certified elite trainers for fully customized workout plans, accountability, and accelerated results.",
    benefits: [
      "Dedicated personal coach",
      "100% customized workouts",
      "Flexible scheduling",
      "Body composition analysis",
    ],
    duration: "Ongoing / Monthly plans",
    cta: "Book a Trainer",
    ctaHref: "/contact",
    image:
      "https://images.unsplash.com/photo-1540497077202-7a8b3d8e8f3e?w=600&h=400&fit=crop",
    icon: "personal",
  },
];
