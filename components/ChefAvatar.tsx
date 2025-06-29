"use client";

import { ChefHat as Chef } from 'lucide-react';

interface ChefAvatarProps {
  isThinking?: boolean;
  message?: string;
}

export function ChefAvatar({ isThinking = false, message }: ChefAvatarProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Speech Bubble */}
        {(message || isThinking) && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 border border-gray-200 min-w-[200px] animate-in fade-in duration-300">
            <div className="text-sm text-center text-gray-700">
              {isThinking ? (
                <div className="flex items-center justify-center gap-1">
                  <span>Cooking up something delicious</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : (
                message
              )}
            </div>
            {/* Speech bubble arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}

        {/* Avatar */}
        <div className={`w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
          isThinking ? 'animate-pulse scale-110' : 'hover:scale-105'
        }`}>
          <Chef className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}