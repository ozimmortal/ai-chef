"use client";

import {  ShoppingCart, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingListItem } from '@/types/recipe';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ShoppingListProps {
  recipeIngredients?: Array<{
    name: string;
    amount: number;
    unit: string;
    recipeId: string;
    recipeName: string;
  }>;
}

export function ShoppingList({ recipeIngredients = [] }: ShoppingListProps) {
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>('shopping-list', []);

  const addToShoppingList = () => {
    const newItems = recipeIngredients.map(ingredient => ({
      ingredient: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      checked: false,
      recipeId: ingredient.recipeId,
      recipeName: ingredient.recipeName,
    }));

    // Merge with existing items, combining duplicates
    const updatedList = [...shoppingList];
    newItems.forEach(newItem => {
      const existingIndex = updatedList.findIndex(
        item => item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        // Combine amounts if same unit, otherwise add as separate item
        if (updatedList[existingIndex].unit === newItem.unit) {
          updatedList[existingIndex].amount += newItem.amount;
        } else {
          updatedList.push(newItem);
        }
      } else {
        updatedList.push(newItem);
      }
    });

    setShoppingList(updatedList);
  };

  const toggleItem = (index: number) => {
    const updated = [...shoppingList];
    updated[index].checked = !updated[index].checked;
    setShoppingList(updated);
  };

  const removeItem = (index: number) => {
    setShoppingList(shoppingList.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setShoppingList(shoppingList.filter(item => !item.checked));
  };

  const clearAll = () => {
    setShoppingList([]);
  };

  const checkedCount = shoppingList.filter(item => item.checked).length;
  const totalCount = shoppingList.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List
            {totalCount > 0 && (
              <Badge variant="secondary">
                {checkedCount}/{totalCount}
              </Badge>
            )}
          </CardTitle>
          
          {recipeIngredients.length > 0 && (
            <Button
              onClick={addToShoppingList}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Recipe
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {shoppingList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Your shopping list is empty</p>
            <p className="text-sm">Add ingredients from recipes to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {shoppingList.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    item.checked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(index)}
                  />
                  
                  <div className="flex-1">
                    <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : ''}`}>
                      {item.amount} {item.unit} {item.ingredient}
                    </div>
                    <div className="text-xs text-gray-500">
                      from {item.recipeName}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              {checkedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  className="flex-1"
                >
                  Clear Completed ({checkedCount})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}