"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ingredientCategories, searchIngredients } from '@/utils/ingredients';

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = searchIngredients(inputValue, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(ingredients.filter(item => item !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addIngredient(suggestions[0]);
      } else {
        addIngredient(inputValue);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addIngredient(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search and add ingredients..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            className="pl-10 text-base"
          />
        </div>

        {/* Auto-suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto shadow-lg">
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-orange-50 rounded-md transition-colors text-sm"
                  disabled={ingredients.includes(suggestion)}
                >
                  <span className={ingredients.includes(suggestion) ? 'text-gray-400' : 'text-gray-700'}>
                    {suggestion}
                  </span>
                  {ingredients.includes(suggestion) && (
                    <span className="text-xs text-gray-400 ml-2">(already added)</span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Selected Ingredients */}
      {ingredients.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Ingredients ({ingredients.length})</h4>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-2 hover:text-orange-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category Suggestions */}
      {ingredients.length === 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(ingredientCategories).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className="capitalize text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {selectedCategory && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 capitalize">
                Popular {selectedCategory}
              </h4>
              <div className="flex flex-wrap gap-2">
                {ingredientCategories[selectedCategory as keyof typeof ingredientCategories]
                  .slice(0, 12)
                  .map((ingredient) => (
                    <Button
                      key={ingredient}
                      variant="outline"
                      size="sm"
                      onClick={() => addIngredient(ingredient)}
                      className="h-8 text-xs hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {ingredient}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {!selectedCategory && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Quick Add</h4>
              <div className="flex flex-wrap gap-2">
                {['Chicken breast', 'Eggs', 'Spinach', 'Tomatoes', 'Onions', 'Garlic', 'Olive oil', 'Rice']
                  .map((ingredient) => (
                    <Button
                      key={ingredient}
                      variant="outline"
                      size="sm"
                      onClick={() => addIngredient(ingredient)}
                      className="h-8 text-xs hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {ingredient}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}