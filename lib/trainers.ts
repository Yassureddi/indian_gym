export interface TrainerSocial {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
  certificates: string[];
  social: TrainerSocial;
}

export const TRAINERS: Trainer[] = [
  {
    id: "1",
    name: "K N Raju",
    role: "Founder & Head Trainer",
    specialty: "Bodybuilding & Strength",
    experience: "15+ Years",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=600&fit=crop",
    bio: "Founder of INDIAN GYM with over 15 years of transforming lives through elite strength and bodybuilding programs.",
    certificates: [
      "ACE Certified Personal Trainer",
      "ISSA Bodybuilding Specialist",
      "Sports Nutrition Certification",
    ],
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
    },
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Senior Fitness Coach",
    specialty: "HIIT & Weight Loss",
    experience: "8+ Years",
    image:
      "https://images.unsplash.com/photo-1594381898411-8465977c892e?w=500&h=600&fit=crop",
    bio: "Specialized in high-intensity interval training and sustainable weight management for lasting results.",
    certificates: [
      "NASM Certified Personal Trainer",
      "HIIT Specialist Certification",
      "Weight Management Coach",
    ],
    social: {
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
  },
  {
    id: "3",
    name: "Arjun Reddy",
    role: "Strength Coach",
    specialty: "Powerlifting & CrossFit",
    experience: "10+ Years",
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&h=600&fit=crop",
    bio: "Competitive powerlifter and CrossFit coach helping members achieve peak strength and athletic performance.",
    certificates: [
      "CrossFit Level 2 Trainer",
      "USAPL Powerlifting Coach",
      "Functional Movement Screen",
    ],
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
  },
  {
    id: "4",
    name: "Meera Patel",
    role: "Yoga & Wellness Instructor",
    specialty: "Yoga & Flexibility",
    experience: "6+ Years",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=600&fit=crop",
    bio: "Certified yoga instructor focusing on mind-body wellness, flexibility, and holistic recovery programs.",
    certificates: [
      "RYT 500 Yoga Alliance",
      "Pilates Mat Certification",
      "Meditation & Breathwork Coach",
    ],
    social: {
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
  },
  {
    id: "5",
    name: "Rohit Verma",
    role: "Nutrition & Cardio Specialist",
    specialty: "Nutrition & Endurance",
    experience: "7+ Years",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
    bio: "Expert in sports nutrition and cardiovascular programming for fat loss and endurance athletes.",
    certificates: [
      "Precision Nutrition Level 1",
      "ISSA Nutrition Specialist",
      "Marathon Coaching Certification",
    ],
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
  },
  {
    id: "6",
    name: "Anjali Desai",
    role: "Ladies Fitness Coach",
    specialty: "Women's Fitness & Toning",
    experience: "5+ Years",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop",
    bio: "Dedicated ladies' zone coach specializing in toning, postnatal fitness, and confidence-building programs.",
    certificates: [
      "ACE Women's Fitness Specialist",
      "Pre & Postnatal Exercise Certified",
      "Group Fitness Instructor",
    ],
    social: {
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
  },
];
