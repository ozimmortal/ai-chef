export const ingredientCategories = {
  proteins: [
    'Chicken breast', 'Salmon', 'Tuna', 'Eggs', 'Greek yogurt', 'Tofu', 'Lentils', 
    'Black beans', 'Chickpeas', 'Ground turkey', 'Shrimp', 'Cottage cheese', 
    'Quinoa', 'Almonds', 'Peanut butter'
  ],
  vegetables: [
    'Spinach', 'Broccoli', 'Bell peppers', 'Tomatoes', 'Onions', 'Garlic', 
    'Carrots', 'Zucchini', 'Mushrooms', 'Avocado', 'Cucumber', 'Kale', 
    'Sweet potato', 'Cauliflower', 'Asparagus'
  ],
  grains: [
    'Brown rice', 'Oats', 'Whole wheat pasta', 'Quinoa', 'Barley', 'Bulgur', 
    'Wild rice', 'Whole wheat bread', 'Couscous', 'Farro'
  ],
  dairy: [
    'Milk', 'Greek yogurt', 'Cheese', 'Butter', 'Cream cheese', 'Mozzarella', 
    'Parmesan', 'Cheddar', 'Feta', 'Ricotta'
  ],
  pantry: [
    'Olive oil', 'Coconut oil', 'Honey', 'Maple syrup', 'Soy sauce', 'Balsamic vinegar', 
    'Lemon', 'Lime', 'Ginger', 'Basil', 'Oregano', 'Thyme', 'Paprika', 'Cumin'
  ],
  fruits: [
    'Bananas', 'Apples', 'Berries', 'Oranges', 'Lemons', 'Limes', 'Strawberries', 
    'Blueberries', 'Mango', 'Pineapple', 'Grapes', 'Peaches'
  ]
};

export const getAllIngredients = () => {
  return Object.values(ingredientCategories).flat();
};

export const searchIngredients = (query: string, limit: number = 10) => {
  const allIngredients = getAllIngredients();
  const filtered = allIngredients.filter(ingredient => 
    ingredient.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.slice(0, limit);
};

export const getIngredientSubstitutes = (ingredient: string): string[] => {
  const substitutes: Record<string, string[]> = {
    'Eggs': ['Flax eggs', 'Chia eggs', 'Applesauce', 'Mashed banana'],
    'Butter': ['Coconut oil', 'Olive oil', 'Avocado', 'Greek yogurt'],
    'Milk': ['Almond milk', 'Oat milk', 'Coconut milk', 'Soy milk'],
    'Sugar': ['Honey', 'Maple syrup', 'Stevia', 'Dates'],
    'Flour': ['Almond flour', 'Coconut flour', 'Oat flour', 'Rice flour'],
    'Chicken breast': ['Turkey breast', 'Tofu', 'Tempeh', 'Seitan'],
    'Ground beef': ['Ground turkey', 'Lentils', 'Mushrooms', 'Black beans'],
  };
  
  return substitutes[ingredient] || [];
};