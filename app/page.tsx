"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngredientInput } from '@/components/IngredientInput';
import { RecipeCard } from '@/components/RecipeCard';
import { ChefAvatar } from '@/components/ChefAvatar';
import { NutritionGoals } from '@/components/NutritionGoals';
import { healthFilterOptions } from '@/utils/prompt';
import { Utensils, Sparkles, Heart, History, Target } from 'lucide-react';
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

interface GenerateResponse {
  recipe: Recipe;
  chefName: string;
  message: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState('balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [savedRecipes] = useLocalStorage<any[]>('saved-recipes', []);
  const [recipeHistory, setRecipeHistory] = useLocalStorage<GenerateResponse[]>('recipe-history', []);

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient to get started!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          healthFilter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data);
      
      // Add to history
      const newHistory = [data, ...recipeHistory.slice(0, 9)]; // Keep last 10
      setRecipeHistory(newHistory);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setIngredients([]);
    setHealthFilter('balanced');
    setRecipe(null);
    setError(null);
  };

  const loadRecipeFromHistory = (historicalRecipe: GenerateResponse) => {
    setRecipe(historicalRecipe);
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              AI Chef
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ingredients into delicious, healthy recipes instantly with advanced AI assistance
          </p>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved ({savedRecipes.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History ({recipeHistory.length})
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-8">
            {/* Chef Avatar */}
            <div className="mb-8">
              <ChefAvatar 
                isThinking={isGenerating} 
                message={!recipe && !isGenerating ? "What ingredients do you have? Let's create something amazing together! 👨‍🍳" : undefined}
              />
            </div>

            {/* Main Content */}
            {!recipe ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                      <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        What&apos;s in your kitchen?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Ingredient Input */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Your Ingredients
                        </label>
                        <IngredientInput
                          ingredients={ingredients}
                          onIngredientsChange={setIngredients}
                        />
                      </div>

                      {/* Health Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Dietary Preference (Optional)
                        </label>
                        <Select value={healthFilter} onValueChange={setHealthFilter}>
                          <SelectTrigger className="w-full text-base">
                            <SelectValue placeholder="Choose your preference..." />
                          </SelectTrigger>
                          <SelectContent>
                            {healthFilterOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-700 text-center">{error}</p>
                        </div>
                      )}

                      {/* Generate Button */}
                      <Button
                        onClick={generateRecipe}
                        disabled={isGenerating || ingredients.length === 0}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Your Recipe...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Generate Recipe
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <NutritionGoals />
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <RecipeCard
                    recipe={recipe.recipe}
                    chefName={recipe.chefName}
                    message={recipe.message}
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center mt-6">
                    <Button
                      onClick={generateRecipe}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Make Another Recipe
                    </Button>
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold px-6 py-2"
                    >
                      Start Over
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <NutritionGoals currentRecipe={recipe.recipe} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedRecipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved recipes yet</h3>
                  <p className="text-gray-500 mb-4">Save your favorite recipes to access them anytime</p>
                  <Button onClick={() => setActiveTab('generate')}>
                    Generate Your First Recipe
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((savedRecipe, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{savedRecipe.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{savedRecipe.cookTime}</span>
                        <span>{savedRecipe.servings} servings</span>
                        <span>{savedRecipe.calories} cal</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Saved on {new Date(savedRecipe.savedAt).toLocaleDateString()}
                      </p>
                      <Button
                        onClick={() => {
                          setRecipe({
                            recipe: savedRecipe,
                            chefName: savedRecipe.chefName,
                            message: `Welcome back! Here's your saved recipe: ${savedRecipe.title}`
                          });
                          setActiveTab('generate');
                        }}
                        className="w-full"
                      >
                        View Recipe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {recipeHistory.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <History className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipe history yet</h3>
                  <p className="text-gray-500 mb-4">Your generated recipes will appear here</p>
                  <Button onClick={() => setActiveTab('generate')}>
                    Generate Your First Recipe
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recipeHistory.map((historicalRecipe, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{historicalRecipe.recipe.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>{historicalRecipe.recipe.cookTime}</span>
                            <span>{historicalRecipe.recipe.servings} servings</span>
                            <span>{historicalRecipe.recipe.calories} cal</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            by {historicalRecipe.chefName}
                          </p>
                        </div>
                        <Button
                          onClick={() => loadRecipeFromHistory(historicalRecipe)}
                          variant="outline"
                        >
                          View Recipe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <NutritionGoals currentRecipe={recipe?.recipe} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 py-6 border-t border-gray-200">
          <p className="text-gray-500">
            Built with 🍳 by AI Chef • Powered by artificial intelligence
          </p>
        </div>
      </div>
    </div>
  );
}