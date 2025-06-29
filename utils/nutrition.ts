export const calculateNutritionGoals = (
  age: number,
  gender: 'male' | 'female',
  weight: number, // kg
  height: number, // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
  goal: 'maintain' | 'lose' | 'gain'
) => {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  };

  let calories = bmr * activityMultipliers[activityLevel];

  // Adjust for goal
  if (goal === 'lose') {
    calories -= 500; // 1 lb per week
  } else if (goal === 'gain') {
    calories += 500; // 1 lb per week
  }

  // Calculate macros (40% carbs, 30% protein, 30% fat)
  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.4) / 4);
  const fat = Math.round((calories * 0.3) / 9);

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    fiber: Math.round(calories / 1000 * 14), // 14g per 1000 calories
  };
};

export const getNutritionScore = (recipe: any) => {
  let score = 0;
  const maxScore = 100;

  // Protein content (0-25 points)
  const proteinRatio = recipe.macros.protein / (recipe.calories / 4);
  score += Math.min(25, proteinRatio * 100);

  // Fiber content (0-20 points)
  const fiberScore = Math.min(20, (recipe.macros.fiber / 25) * 20);
  score += fiberScore;

  // Calorie density (0-20 points)
  const caloriesPerGram = recipe.calories / 500; // assuming 500g serving
  if (caloriesPerGram < 1.5) score += 20;
  else if (caloriesPerGram < 2.5) score += 15;
  else if (caloriesPerGram < 4) score += 10;

  // Sodium content (0-15 points)
  if (recipe.macros.sodium < 600) score += 15;
  else if (recipe.macros.sodium < 1000) score += 10;
  else if (recipe.macros.sodium < 1500) score += 5;

  // Sugar content (0-10 points)
  if (recipe.macros.sugar < 10) score += 10;
  else if (recipe.macros.sugar < 20) score += 5;

  // Balanced macros (0-10 points)
  const totalMacros = recipe.macros.protein + recipe.macros.carbs + recipe.macros.fat;
  const proteinPercent = (recipe.macros.protein * 4) / recipe.calories * 100;
  const carbPercent = (recipe.macros.carbs * 4) / recipe.calories * 100;
  const fatPercent = (recipe.macros.fat * 9) / recipe.calories * 100;

  if (proteinPercent >= 15 && proteinPercent <= 35 && 
      carbPercent >= 25 && carbPercent <= 65 && 
      fatPercent >= 20 && fatPercent <= 35) {
    score += 10;
  }

  return Math.min(maxScore, Math.round(score));
};