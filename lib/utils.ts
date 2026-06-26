export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): {
  category: string;
  color: string;
  advice: string;
} {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      color: "#60a5fa",
      advice: "Consider consulting a nutritionist to develop a healthy weight gain plan.",
    };
  }
  if (bmi < 25) {
    return {
      category: "Normal Weight",
      color: "#4ade80",
      advice: "Great! Maintain your healthy lifestyle with regular exercise and balanced nutrition.",
    };
  }
  if (bmi < 30) {
    return {
      category: "Overweight",
      color: "#fbbf24",
      advice: "Focus on a balanced diet and regular cardio. Our trainers can help create a plan.",
    };
  }
  return {
    category: "Obese",
    color: "#f87171",
    advice: "We recommend consulting our fitness experts for a personalized transformation program.",
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
