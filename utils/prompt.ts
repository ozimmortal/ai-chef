export const buildRecipePrompt = (ingredients: string[], filter: string) => {
  const ingredientList = ingredients.join(', ');
  
  const filterInstructions = {
    'balanced': 'balanced and nutritious with a good mix of macronutrients',
    'low-carb': 'low in carbohydrates (under 15g carbs per serving)',
    'high-protein': 'high in protein (at least 25g protein per serving)',
    'vegan': 'completely vegan with no animal products',
    'keto': 'ketogenic-friendly with very low carbs and high healthy fats',
    'mediterranean': 'Mediterranean-style with olive oil, herbs, and fresh ingredients'
  };

  const filterText = filterInstructions[filter as keyof typeof filterInstructions] || 'balanced and nutritious';
  
  const prompt = `You are a professional AI chef specializing in healthy, delicious recipes with advanced nutritional knowledge.

Create a comprehensive recipe using primarily these ingredients: ${ingredientList}.

Make the recipe ${filterText}.

IMPORTANT: Respond with ONLY a valid JSON object in this exact format:

{
  "title": "Creative and appetizing recipe name",
  "ingredients": [
    "2 large eggs",
    "1 cup fresh spinach, chopped",
    "1 medium tomato, diced"
  ],
  "instructions": [
    "Preheat a non-stick pan over medium heat",
    "Whisk eggs in a bowl with salt and pepper",
    "Add spinach to the pan and cook for 2 minutes until wilted",
    "Pour in eggs and cook for 3-4 minutes, stirring gently",
    "Add diced tomatoes and cook for another 2 minutes",
    "Serve immediately while hot"
  ],
  "calories": 285,
  "macros": {
    "protein": 22,
    "carbs": 8,
    "fat": 18,
    "fiber": 4,
    "sugar": 6,
    "sodium": 320
  },
  "cookTime": "15 minutes",
  "prepTime": "5 minutes",
  "totalTime": "20 minutes",
  "servings": 2,
  "difficulty": "Easy",
  "cuisine": "Mediterranean",
  "equipment": ["Non-stick pan", "Mixing bowl", "Whisk"],
  "tips": [
    "Don't overcook the eggs to keep them creamy",
    "Add cheese for extra richness if desired",
    "Serve with whole grain toast for a complete meal"
  ]
}

Requirements:
- Use realistic ingredient quantities with proper measurements
- Provide 5-8 clear, detailed cooking steps with specific times and temperatures
- Calculate accurate nutritional information including sugar and sodium
- Include prep time, cook time, and total time
- Specify difficulty level (Easy/Medium/Hard)
- Add cuisine type if applicable
- List essential equipment needed
- Include 2-4 helpful cooking tips
- Make it suitable for home cooking with common kitchen tools
- Ensure the recipe is flavorful, satisfying, and nutritionally balanced

Respond with ONLY the JSON object, no additional text or formatting.`;

  return prompt;
};

export const healthFilterOptions = [
  { value: 'balanced', label: 'Balanced & Nutritious' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'high-protein', label: 'High Protein' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto Friendly' },
  { value: 'mediterranean', label: 'Mediterranean' }
];