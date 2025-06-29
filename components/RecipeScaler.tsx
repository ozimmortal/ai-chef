"use client";

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recipe } from '@/types/recipe';

interface RecipeScalerProps {
  recipe: Recipe;
  onScaledRecipe: (scaledRecipe: Recipe) => void;
}

export function RecipeScaler({ recipe, onScaledRecipe }: RecipeScalerProps) {
  const [servings, setServings] = useState(recipe.servings);

  const scaleRecipe = (newServings: number) => {
    if (newServings < 1) return;
    
    const scaleFactor = newServings / recipe.servings;
    setServings(newServings);

    const scaledIngredients = recipe.ingredients.map(ingredient => ({
      ...ingredient,
      amount: Math.round((ingredient.amount * scaleFactor) * 100) / 100
    }));

    const scaledRecipe: Recipe = {
      ...recipe,
      servings: newServings,
      ingredients: scaledIngredients,
      calories: Math.round(recipe.calories * scaleFactor),
      macros: {
        protein: Math.round(recipe.macros.protein * scaleFactor),
        carbs: Math.round(recipe.macros.carbs * scaleFactor),
        fat: Math.round(recipe.macros.fat * scaleFactor),
        fiber: Math.round(recipe.macros.fiber * scaleFactor),
        sugar: Math.round(recipe.macros.sugar * scaleFactor),
        sodium: Math.round(recipe.macros.sodium * scaleFactor),
      }
    };

    onScaledRecipe(scaledRecipe);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recipe Scaling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scaleRecipe(servings - 1)}
            disabled={servings <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{servings}</div>
            <div className="text-sm text-gray-600">servings</div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => scaleRecipe(servings + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {servings !== recipe.servings && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Scaled from {recipe.servings} to {servings} servings
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scaleRecipe(recipe.servings)}
              className="mt-1 text-xs"
            >
              Reset to original
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}