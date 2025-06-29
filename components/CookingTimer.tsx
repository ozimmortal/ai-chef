"use client";

import { useState } from 'react';
import { Timer, Play, Pause, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRecipeTimer } from '@/hooks/useRecipeTimer';

interface CookingTimerProps {
  recipeSteps?: Array<{
    step: number;
    instruction: string;
    time?: number;
  }>;
}

export function CookingTimer({ recipeSteps = [] }: CookingTimerProps) {
  const { timers, addTimer, startTimer, pauseTimer, removeTimer } = useRecipeTimer();
  const [customName, setCustomName] = useState('');
  const [customMinutes, setCustomMinutes] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addCustomTimer = () => {
    if (customName && customMinutes) {
      addTimer(customName, parseInt(customMinutes));
      setCustomName('');
      setCustomMinutes('');
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addStepTimer = (step: any) => {
    if (step.time) {
      addTimer(`Step ${step.step}: ${step.instruction.slice(0, 30)}...`, step.time);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Cooking Timers
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recipe Step Timers */}
        {recipeSteps.filter(step => step.time).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Recipe Steps</h4>
            {recipeSteps
              .filter(step => step.time)
              .map((step) => (
                <div key={step.step} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">Step {step.step}</div>
                    <div className="text-xs text-gray-600">{step.time} minutes</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addStepTimer(step)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}

        {/* Custom Timer */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Add Custom Timer</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Timer name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Minutes"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="w-20"
            />
            <Button onClick={addCustomTimer} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Timers */}
        {timers.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Active Timers</h4>
            {timers.map((timer) => (
              <div
                key={timer.id}
                className={`p-3 rounded-lg border transition-colors ${
                  timer.isCompleted
                    ? 'bg-green-50 border-green-200'
                    : timer.isActive
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{timer.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-lg font-mono ${
                        timer.isCompleted ? 'text-green-600' : 
                        timer.remaining < 60 ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {formatTime(timer.remaining)}
                      </span>
                      {timer.isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          Done!
                        </Badge>
                      )}
                      {timer.isActive && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Running
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {!timer.isCompleted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => timer.isActive ? pauseTimer(timer.id) : startTimer(timer.id)}
                      >
                        {timer.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimer(timer.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {timers.length === 0 && recipeSteps.filter(step => step.time).length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Timer className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No timers active</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}