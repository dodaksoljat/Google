export enum Goal {
  HYPERTROPHY = "Hipertrofia",
  WEIGHT_LOSS = "Emagrecimento",
  CONDITIONING = "Condicionamento",
}

export enum Level {
  BEGINNER = "Iniciante",
  INTERMEDIATE = "Intermediário",
  ADVANCED = "Avançado",
}

export interface UserProfile {
  name?: string;
  age?: number;
  height: number; // in cm
  weight: number; // in kg
  goal: Goal | string;
  level: Level | string;
  availability: string;
  restrictions: string;
}

export interface Exercise {
  name: string;
  setsReps: string;
  rest: string;
  suggestedLoad: string;
  execution: string;
  videoSearchQuery: string; // For embedding a video search
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WeeklyPlan {
  title: string;
  days: WorkoutDay[];
}

export interface NutritionTip {
  category: string;
  tips: string[];
}

export interface NutritionPlan {
  title: string;
  dailyCalories?: string;
  macros?: {
    protein: string;
    carbs: string;
    fats: string;
  };
  recommendations: NutritionTip[];
}
