import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildRecipePrompt } from '@/utils/prompt';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { ingredients, healthFilter } = await request.json();
    
    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one ingredient' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Build the prompt for Gemini
    const prompt = buildRecipePrompt(ingredients, healthFilter);

    // Get Gemini model - Updated to use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate recipe using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let recipeData;
    try {
      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      recipeData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Fallback to a structured response if parsing fails
      recipeData = {
        title: "AI-Generated Recipe",
        ingredients: ingredients.map((ing : string) => `1 portion ${ing}`),
        instructions: [
          "Prepare all ingredients",
          "Combine ingredients according to your preference",
          "Cook until done",
          "Season to taste",
          "Serve and enjoy!"
        ],
        calories: 300,
        macros: {
          protein: 20,
          carbs: 25,
          fat: 15,
          fiber: 5
        },
        cookTime: "20 minutes",
        servings: 2
      };
    }

    // Generate a random chef name
    const chefNames = ['Chef Marco', 'Chef Isabella', 'Chef Antonio', 'Chef Sofia', 'Chef Luigi', 'Chef Emma', 'Chef Oliver', 'Chef Maya'];
    const randomChef = chefNames[Math.floor(Math.random() * chefNames.length)];

    return NextResponse.json({
      recipe: recipeData,
      chefName: randomChef,
      message: `${randomChef} has created this delicious recipe just for you using AI! 🍳✨`
    });

  } catch (error) {
    console.error('Recipe generation error:', error);
    
    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'Invalid or missing Gemini API key. Please check your configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    );
  }
}