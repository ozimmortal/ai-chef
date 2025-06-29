import { useState, useEffect, useCallback } from 'react';

interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  remaining: number;
  isActive: boolean;
  isCompleted: boolean;
}

export function useRecipeTimer() {
  const [timers, setTimers] = useState<Timer[]>([]);

  const addTimer = useCallback((name: string, minutes: number) => {
    const timer: Timer = {
      id: Date.now().toString(),
      name,
      duration: minutes * 60,
      remaining: minutes * 60,
      isActive: false,
      isCompleted: false,
    };
    setTimers(prev => [...prev, timer]);
    return timer.id;
  }, []);

  const startTimer = useCallback((id: string) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, isActive: true } : timer
    ));
  }, []);

  const pauseTimer = useCallback((id: string) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, isActive: false } : timer
    ));
  }, []);

  const removeTimer = useCallback((id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(timer => {
        if (timer.isActive && timer.remaining > 0) {
          const newRemaining = timer.remaining - 1;
          if (newRemaining === 0) {
            // Timer completed - you could add notification here
            return { ...timer, remaining: 0, isActive: false, isCompleted: true };
          }
          return { ...timer, remaining: newRemaining };
        }
        return timer;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    timers,
    addTimer,
    startTimer,
    pauseTimer,
    removeTimer,
  };
}