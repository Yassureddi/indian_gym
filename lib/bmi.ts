export type Gender = "male" | "female";

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  dietSuggestion: string;
  workoutSuggestion: string;
  healthTip: string;
}

const DIET_SUGGESTIONS: Record<string, { male: string; female: string }> = {
  underweight: {
    male: "Increase caloric intake with protein-rich foods — eggs, chicken, paneer, oats, and healthy fats. Aim for 5-6 meals daily with a 300-500 calorie surplus.",
    female: "Focus on nutrient-dense meals with lean proteins, whole grains, nuts, and dairy. Include smoothies with protein powder and healthy fats like avocado and ghee.",
  },
  normal: {
    male: "Maintain a balanced diet with 30% protein, 40% carbs, and 30% healthy fats. Include plenty of vegetables, whole grains, lean meats, and stay hydrated with 3-4L water daily.",
    female: "Eat a colorful plate with lean protein, complex carbs, and healthy fats. Prioritize iron-rich foods, calcium sources, and 2.5-3L water. Portion control is key.",
  },
  overweight: {
    male: "Create a moderate calorie deficit (300-500 cal). Focus on high-protein, high-fiber meals. Reduce refined carbs and sugary drinks. Eat vegetables with every meal.",
    female: "Adopt a 300-400 calorie deficit with emphasis on protein and fiber. Choose whole foods over processed. Include green tea, salads, and portion-controlled meals.",
  },
  obese: {
    male: "Start with a structured 500-calorie deficit. Prioritize lean proteins, vegetables, and whole grains. Eliminate sugary beverages and fried foods. Consider our nutrition coaching.",
    female: "Follow a guided meal plan with 400-500 calorie deficit. Focus on lean proteins, leafy greens, and controlled portions. Our trainers can create a personalized nutrition program.",
  },
};

const WORKOUT_SUGGESTIONS: Record<string, { male: string; female: string }> = {
  underweight: {
    male: "Focus on compound strength training 4-5x/week — squats, deadlifts, bench press. Limit cardio to 1-2 sessions. Progressive overload with 8-12 rep ranges for muscle gain.",
    female: "Combine resistance training 3-4x/week with light cardio. Focus on glutes, legs, and upper body with moderate weights. Yoga for flexibility 1-2x/week.",
  },
  normal: {
    male: "Mix strength training 3-4x/week with cardio 2-3x/week. Include HIIT once a week. Balance push/pull/legs splits for overall fitness and maintenance.",
    female: "Combine strength training 3x/week with cardio and flexibility work. Try our group classes — yoga, Zumba, and HIIT for variety and sustained fitness.",
  },
  overweight: {
    male: "Start with 4-5 cardio sessions weekly (30-45 min) plus 2-3 strength sessions. Gradually increase intensity. Our HIIT classes accelerate fat burning effectively.",
    female: "Begin with brisk walking, cycling, or elliptical 4-5x/week. Add strength training 2-3x/week. Join our ladies' zone group classes for motivation and results.",
  },
  obese: {
    male: "Start with low-impact cardio — walking, cycling, swimming 5x/week (30 min). Add light resistance training 2x/week. Work with our personal trainers for a safe progression plan.",
    female: "Low-impact exercises first — walking, aqua aerobics, stationary bike. Gradually add bodyweight exercises. Our certified trainers specialize in safe weight loss programs.",
  },
};

function getCategoryKey(bmi: number): "underweight" | "normal" | "overweight" | "obese" {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function getBMIResult(
  bmi: number,
  age: number,
  gender: Gender
): BMIResult {
  const key = getCategoryKey(bmi);

  const categories: Record<
    "underweight" | "normal" | "overweight" | "obese",
    { label: string; color: string }
  > = {
    underweight: { label: "Underweight", color: "#60a5fa" },
    normal: { label: "Normal Weight", color: "#4ade80" },
    overweight: { label: "Overweight", color: "#fbbf24" },
    obese: { label: "Obese", color: "#f87171" },
  };

  const { label, color } = categories[key];

  const ageNote =
    age > 50
      ? " Given your age, prioritize joint-friendly exercises and consult a physician before starting intense programs."
      : age < 18
        ? " As a younger individual, focus on form and avoid extremely heavy lifting without supervision."
        : "";

  const healthTips: Record<string, string> = {
    underweight: "BMI alone doesn't measure body composition. Consider a body fat analysis at our gym for accurate insights.",
    normal: "Excellent! Regular check-ins and consistent training will help you maintain optimal health.",
    overweight: "Small consistent changes lead to lasting results. Our transformation programs have helped thousands succeed.",
    obese: "Your health journey starts with one step. Our expert trainers are ready to guide you safely and effectively.",
  };

  return {
    bmi,
    category: label,
    color,
    dietSuggestion: DIET_SUGGESTIONS[key][gender] + ageNote,
    workoutSuggestion: WORKOUT_SUGGESTIONS[key][gender] + ageNote,
    healthTip: healthTips[key],
  };
}

export const BMI_SCALE = [
  { range: "Below 18.5", label: "Underweight", color: "#60a5fa", max: 18.5 },
  { range: "18.5 – 24.9", label: "Normal", color: "#4ade80", max: 25 },
  { range: "25 – 29.9", label: "Overweight", color: "#fbbf24", max: 30 },
  { range: "30+", label: "Obese", color: "#f87171", max: 50 },
];
