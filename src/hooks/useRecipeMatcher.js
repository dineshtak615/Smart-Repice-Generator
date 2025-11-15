// src/hooks/useRecipeMatcher.js
import { recipeDatabase } from '../data/recipeDatabase';
import { substitutionMap, getSubstitutions, findPossibleSubstitutes } from '../utils/substitutionMap';

export const useRecipeMatcher = (userIngredients = [], options = {}) => {
  const {
    threshold = 0.3,
    includeSubstitutions = true,
    maxResults = 20,
    sortBy = 'matchScore',
    dietaryRestrictions = [],
    maxCookingTime = null,
    difficultyLevels = []
  } = options;

  if (!userIngredients.length) return [];

  // Normalize user ingredients
  const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase().trim());
  const userSet = new Set(normalizedUserIngredients);

  // Calculate matches for all recipes
  const scoredRecipes = recipeDatabase
    .map(recipe => {
      const recipeSet = new Set(
        recipe.ingredients.map(i => i.toLowerCase().trim())
      );

      // Direct matches
      const directMatches = [...userSet].filter(ing => recipeSet.has(ing));

      // Substitution matches (user ingredients that can substitute for recipe ingredients)
      let substitutionMatches = [];
      let substitutionsUsed = [];
      
      if (includeSubstitutions) {
        [...userSet].forEach(userIng => {
          const possibleSubs = findPossibleSubstitutes(userIng);
          possibleSubs.forEach(sub => {
            if (recipeSet.has(sub) && !directMatches.includes(userIng)) {
              substitutionMatches.push(userIng);
              substitutionsUsed.push({
                original: sub,
                substitute: userIng,
                quality: getSubstitutionQuality(sub, userIng)
              });
            }
          });
        });

        // Also check if recipe ingredients can be substituted by user ingredients
        [...recipeSet].forEach(recipeIng => {
          if (!directMatches.includes(recipeIng) && !userSet.has(recipeIng)) {
            const possibleSubs = getSubstitutions(recipeIng);
            possibleSubs.forEach(sub => {
              if (userSet.has(sub) && !substitutionMatches.includes(sub)) {
                substitutionMatches.push(sub);
                substitutionsUsed.push({
                  original: recipeIng,
                  substitute: sub,
                  quality: getSubstitutionQuality(recipeIng, sub)
                });
              }
            });
          }
        });
      }

      // Combine all matches
      const allMatches = [...new Set([...directMatches, ...substitutionMatches])];
      
      // Calculate effective recipe ingredients (including substitutable ones)
      const effectiveRecipeIngredients = new Set([...recipeSet]);
      substitutionsUsed.forEach(sub => {
        effectiveRecipeIngredients.add(sub.original);
      });

      // Calculate scores
      const intersection = new Set(allMatches);
      const union = new Set([...userSet, ...effectiveRecipeIngredients]);

      const jaccardScore = intersection.size / union.size;
      const coverageScore = intersection.size / effectiveRecipeIngredients.size;
      
      // Penalty for poor quality substitutions
      const poorQualitySubs = substitutionsUsed.filter(sub => 
        sub.quality === 'fair'
      ).length;
      const substitutionPenalty = poorQualitySubs * 0.1;

      // Combined score (weighted towards coverage with substitution penalty)
      const finalScore = Math.max(0, (jaccardScore * 0.3) + (coverageScore * 0.7) - substitutionPenalty);

      // Calculate match percentage for display
      const matchPercentage = (intersection.size / effectiveRecipeIngredients.size) * 100;

      return {
        ...recipe,
        matchScore: finalScore,
        matchPercentage: Math.round(matchPercentage),
        matchedIngredients: [...intersection],
        missingIngredients: [...effectiveRecipeIngredients].filter(
          ing => !intersection.has(ing)
        ),
        substitutionsUsed: [...new Set(substitutionsUsed)],
        directMatches,
        substitutionMatches: [...new Set(substitutionMatches)],
        hasPoorSubstitutions: poorQualitySubs > 0
      };
    })
    .filter(recipe => {
      // Apply threshold filter
      if (recipe.matchScore < threshold) return false;
      
      // Apply dietary restrictions filter
      if (dietaryRestrictions.length > 0) {
        const meetsDietary = dietaryRestrictions.every(restriction =>
          recipe.dietary.includes(restriction.toLowerCase())
        );
        if (!meetsDietary) return false;
      }
      
      // Apply cooking time filter
      if (maxCookingTime && recipe.cookingTime > maxCookingTime) return false;
      
      // Apply difficulty filter
      if (difficultyLevels.length > 0 && 
          !difficultyLevels.includes(recipe.difficulty.toLowerCase())) {
        return false;
      }
      
      return true;
    });

  // Sort recipes based on sortBy parameter
  const sortedRecipes = scoredRecipes.sort((a, b) => {
    switch (sortBy) {
      case 'cookingTime':
        return a.cookingTime - b.cookingTime;
      case 'matchPercentage':
        return b.matchPercentage - a.matchPercentage;
      case 'calories':
        return a.nutrition.calories - b.nutrition.calories;
      case 'ingredientCount':
        return a.missingIngredients.length - b.missingIngredients.length;
      default:
        return b.matchScore - a.matchScore;
    }
  });

  // Limit results
  return sortedRecipes.slice(0, maxResults);
};

// Helper function to calculate substitution quality
const getSubstitutionQuality = (original, substitute) => {
  const excellentSubs = [
    'tofu→chicken', 'lentils→ground beef', 'almond milk→milk',
    'margarine→butter', 'tamari→soy sauce', 'maple syrup→honey'
  ];
  
  const goodSubs = [
    'mushrooms→beef', 'applesauce→egg', 'coconut oil→butter',
    'zucchini→pasta', 'nutritional yeast→cheese', 'banana→egg'
  ];
  
  const substitutionKey = `${original}→${substitute}`;
  const reverseKey = `${substitute}→${original}`;
  
  if (excellentSubs.includes(substitutionKey) || excellentSubs.includes(reverseKey)) {
    return 'excellent';
  }
  if (goodSubs.includes(substitutionKey) || goodSubs.includes(reverseKey)) {
    return 'good';
  }
  return 'fair';
};

// Additional hook for getting substitution suggestions
export const useIngredientSubstitutions = (ingredient) => {
  const substitutions = getSubstitutions(ingredient);
  const canSubstituteFor = findPossibleSubstitutes(ingredient);
  
  return {
    substitutions: substitutions.map(sub => ({
      ingredient: sub,
      quality: getSubstitutionQuality(ingredient, sub)
    })),
    canSubstituteFor: canSubstituteFor.map(original => ({
      original,
      quality: getSubstitutionQuality(original, ingredient)
    }))
  };
};

// Hook for analyzing ingredient usage
export const useIngredientAnalysis = (userIngredients = []) => {
  const matches = useRecipeMatcher(userIngredients, { threshold: 0.1 });
  
  const mostCommonMissing = matches.reduce((acc, recipe) => {
    recipe.missingIngredients.forEach(ingredient => {
      acc[ingredient] = (acc[ingredient] || 0) + 1;
    });
    return acc;
  }, {});

  const suggestedPurchases = Object.entries(mostCommonMissing)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([ingredient]) => ingredient);

  const bestMatches = matches
    .filter(recipe => recipe.matchPercentage >= 80)
    .slice(0, 3);

  return {
    suggestedPurchases,
    bestMatches,
    totalPossibleRecipes: matches.length,
    highConfidenceMatches: bestMatches.length
  };
};