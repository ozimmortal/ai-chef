export interface Recipe {
  id: string;
  title: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  cookTime: string;
  prepTime: string;
  totalTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[];
  equipment: string[];
  tips: string[];
  nutrition: NutritionInfo;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  substitutes?: string[];
}

export interface RecipeStep {
  step: number;
  instruction: string;
  time?: number; // in minutes
  temperature?: string;
  tips?: string[];
}

export interface NutritionInfo {
  calories: number;
  totalFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbs: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
}

export interface SavedRecipe extends Recipe {
  savedAt: Date;
  rating?: number;
  notes?: string;
  collections: string[];
}

export interface ShoppingListItem {
  ingredient: string;
  amount: number;
  unit: string;
  checked: boolean;
  recipeId: string;
  recipeName: string;
}