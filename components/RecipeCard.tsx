"use client";

import { useState } from 'react';
import { Clock, Users, Zap, ChefHat, Heart, Share2, Timer, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeScaler } from './RecipeScaler';
import { ShoppingList } from './ShoppingList';
import { CookingTimer } from './CookingTimer';
import { getNutritionScore } from '@/utils/nutrition';
import { getIngredientSubstitutes } from '@/utils/ingredients';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar?: number;
    sodium?: number;
  };
  cookTime: string;
  servings: number;
  difficulty?: string;
  cuisine?: string;
  equipment?: string[];
  tips?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  chefName: string;
  message: string;
}

export function RecipeCard({ recipe, chefName, message }: RecipeCardProps) {
          
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>('saved-recipes', []);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe >(recipe);
  const [activeTab, setActiveTab] = useState('recipe');
  
  //const totalMacros = recipe.macros.protein + recipe.macros.carbs + recipe.macros.fat;
  
  const macroPercentages = {
    protein: (recipe.macros.protein * 4 / recipe.calories) * 100,
    carbs: (recipe.macros.carbs * 4 / recipe.calories) * 100,
    fat: (recipe.macros.fat * 9 / recipe.calories) * 100
  };

  const nutritionScore = getNutritionScore(recipe);
  const isSaved = savedRecipes.some(saved => saved.title === recipe.title);

  const saveRecipe = () => {
    if (!isSaved) {
      const savedRecipe = {
        ...recipe,
        id: Date.now().toString(),
        savedAt: new Date(),
        chefName,
      };
      setSavedRecipes([...savedRecipes, savedRecipe]);
    }
  };

  const shareRecipe = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this ${recipe.title} recipe created by AI Chef!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const recipeText = `${recipe.title}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`;
      navigator.clipboard.writeText(recipeText);
      alert('Recipe copied to clipboard!');
    }
  };

  const shoppingListItems = currentRecipe.ingredients.map((ingredient) => ({
    name: ingredient,
    amount: 1,
    unit: 'portion',
    recipeId: 'current',
    recipeName: currentRecipe.title,
  }));

  const recipeSteps = currentRecipe.instructions.map((instruction, index) => ({
    step: index + 1,
    instruction,
    time: instruction.toLowerCase().includes('cook') || instruction.toLowerCase().includes('bake') ? 
          parseInt(instruction.match(/(\d+)\s*min/)?.[1] || '0') || undefined : undefined
  }));

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Chef Message */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
        <p className="text-orange-800 font-medium text-center">
          {message}
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-2">{currentRecipe.title}</CardTitle>
              <div className="flex items-center gap-4 text-orange-100">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{currentRecipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{currentRecipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">{currentRecipe.calories} cal</span>
                </div>
                {currentRecipe.difficulty && (
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    <span className="text-sm">{currentRecipe.difficulty}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={saveRecipe}
                className="text-white hover:bg-white/20"
                disabled={isSaved}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareRecipe}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="recipe">Recipe</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="scale">Scale</TabsTrigger>
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
              <TabsTrigger value="cooking">Cooking</TabsTrigger>
            </TabsList>

            <TabsContent value="recipe" className="p-6 space-y-6">
              {/* Nutrition Score */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">Nutrition Score</h4>
                    <p className="text-sm text-green-600">Based on nutritional balance and health factors</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-700">{nutritionScore}</div>
                    <div className="text-sm text-green-600">/ 100</div>
                  </div>
                </div>
                <Progress value={nutritionScore} className="mt-2 h-2 bg-green-100" />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{currentRecipe.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentRecipe.macros.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentRecipe.macros.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{currentRecipe.macros.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>

              {/* Equipment */}
              {currentRecipe.equipment && currentRecipe.equipment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Equipment Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentRecipe.equipment.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Ingredients</h3>
                <div className="grid gap-3">
                  {currentRecipe.ingredients.map((ingredient, index) => {
                    const substitutes = getIngredientSubstitutes(ingredient);
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <span className="text-gray-700 font-medium">{ingredient}</span>
                          {substitutes.length > 0 && (
                            <div className="mt-1">
                              <span className="text-xs text-gray-500">Substitutes: </span>
                              <span className="text-xs text-blue-600">{substitutes.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Instructions</h3>
                <div className="space-y-4">
                  {currentRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <Badge 
                        variant="outline" 
                        className="min-w-[32px] h-8 flex items-center justify-center bg-orange-100 text-orange-700 border-orange-300 font-bold"
                      >
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{instruction}</p>
                        {instruction.toLowerCase().includes('cook') || instruction.toLowerCase().includes('bake') ? (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Timer className="h-3 w-3 mr-1" />
                              Timer recommended
                            </Badge>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {currentRecipe.tips && currentRecipe.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Chef&apos;s Tips
                  </h3>
                  <div className="space-y-2">
                    {currentRecipe.tips.map((tip, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                        <p className="text-yellow-800 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="p-6">
              {/* Detailed Macro Breakdown */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Macro Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600 font-medium">Protein</span>
                      <span className="text-sm font-medium">{macroPercentages.protein.toFixed(0)}% ({currentRecipe.macros.protein}g)</span>
                    </div>
                    <Progress value={macroPercentages.protein} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600 font-medium">Carbohydrates</span>
                      <span className="text-sm font-medium">{macroPercentages.carbs.toFixed(0)}% ({currentRecipe.macros.carbs}g)</span>
                    </div>
                    <Progress value={macroPercentages.carbs} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-600 font-medium">Fat</span>
                      <span className="text-sm font-medium">{macroPercentages.fat.toFixed(0)}% ({currentRecipe.macros.fat}g)</span>
                    </div>
                    <Progress value={macroPercentages.fat} className="h-3" />
                  </div>
                </div>

                {/* Additional Nutrition Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-700">{currentRecipe.macros.fiber}g</div>
                    <div className="text-sm text-gray-600">Fiber</div>
                  </div>
                  {currentRecipe.macros.sugar && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{currentRecipe.macros.sugar}g</div>
                      <div className="text-sm text-gray-600">Sugar</div>
                    </div>
                  )}
                  {currentRecipe.macros.sodium && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{currentRecipe.macros.sodium}mg</div>
                      <div className="text-sm text-gray-600">Sodium</div>
                    </div>
                  )}
                </div>

                {/* Nutrition Score Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Nutrition Score: {nutritionScore}/100</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• Protein content: {macroPercentages.protein.toFixed(0)}% of calories</p>
                    <p>• Fiber: {currentRecipe.macros.fiber}g per serving</p>
                    <p>• Balanced macronutrient distribution</p>
                    {currentRecipe.macros.sodium && <p>• Sodium: {currentRecipe.macros.sodium}mg</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scale" className="p-6">
            {
              <RecipeScaler
                    recipe={currentRecipe as any } // Escape type checking
                    onScaledRecipe={(scaled: any) => setCurrentRecipe(scaled)}
                  />
                  }
            </TabsContent>

            <TabsContent value="shopping" className="p-6">
              <ShoppingList recipeIngredients={shoppingListItems} />
            </TabsContent>

            <TabsContent value="cooking" className="p-6">
              <CookingTimer recipeSteps={recipeSteps} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}