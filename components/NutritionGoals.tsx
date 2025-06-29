"use client";

import { useState } from 'react';
import { Target, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { calculateNutritionGoals } from '@/utils/nutrition';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'maintain' | 'lose' | 'gain';
}

interface NutritionGoalsProps {
  currentRecipe?: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  };
}

export function NutritionGoals({ currentRecipe }: NutritionGoalsProps) {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('user-profile', null);
  const [showSettings, setShowSettings] = useState(!profile);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const saveProfile = () => {
    if (tempProfile.age && tempProfile.gender && tempProfile.weight && 
        tempProfile.height && tempProfile.activityLevel && tempProfile.goal) {
      setProfile(tempProfile as UserProfile);
      setShowSettings(false);
    }
  };

  const goals = profile ? calculateNutritionGoals(
    profile.age,
    profile.gender,
    profile.weight,
    profile.height,
    profile.activityLevel,
    profile.goal
  ) : null;

  if (showSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Set Your Nutrition Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                value={tempProfile.age || ''}
                onChange={(e) => setTempProfile({...tempProfile, age: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <Select
                value={tempProfile.gender}
                onValueChange={(value: 'male' | 'female') => setTempProfile({...tempProfile, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <Input
                type="number"
                value={tempProfile.weight || ''}
                onChange={(e) => setTempProfile({...tempProfile, weight: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height (cm)</label>
              <Input
                type="number"
                value={tempProfile.height || ''}
                onChange={(e) => setTempProfile({...tempProfile, height: parseInt(e.target.value)})}
              />
            </div>
          </div>
     
          <div>
            <label className="block text-sm font-medium mb-1">Activity Level</label>
            <Select
              value={tempProfile.activityLevel}
              onValueChange={(value:'sedentary' | 'light' | 'moderate' | 'active' | 'very-active') => setTempProfile({...tempProfile, activityLevel: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <Select
              value={tempProfile.goal}
              onValueChange={(value: 'maintain' | 'lose' | 'gain') => setTempProfile({...tempProfile, goal: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={saveProfile} className="w-full">
            Save Profile & Calculate Goals
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Nutrition Goals
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {goals && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{goals.calories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{goals.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{goals.carbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{goals.fat}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>

            {currentRecipe && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-700">This Recipe vs Your Goals</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Calories</span>
                    <span className="text-sm font-medium">
                      {currentRecipe.calories} / {goals.calories} ({Math.round((currentRecipe.calories / goals.calories) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(currentRecipe.calories / goals.calories) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">Protein</span>
                    <span className="text-sm font-medium">
                      {currentRecipe.macros.protein}g / {goals.protein}g ({Math.round((currentRecipe.macros.protein / goals.protein) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(currentRecipe.macros.protein / goals.protein) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Carbs</span>
                    <span className="text-sm font-medium">
                      {currentRecipe.macros.carbs}g / {goals.carbs}g ({Math.round((currentRecipe.macros.carbs / goals.carbs) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(currentRecipe.macros.carbs / goals.carbs) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-600">Fat</span>
                    <span className="text-sm font-medium">
                      {currentRecipe.macros.fat}g / {goals.fat}g ({Math.round((currentRecipe.macros.fat / goals.fat) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(currentRecipe.macros.fat / goals.fat) * 100} className="h-2" />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}