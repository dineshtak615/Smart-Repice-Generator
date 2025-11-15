// src/utils/ingredientParser.js

// Comprehensive ingredient parsing utilities
const UNITS = [
  'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 
  'tsp', 'teaspoon', 'teaspoons', 'oz', 'ounce', 'ounces',
  'lb', 'pound', 'pounds', 'g', 'gram', 'grams', 
  'kg', 'kilogram', 'kilograms', 'ml', 'milliliter', 'milliliters',
  'l', 'liter', 'liters', 'pinch', 'pinches', 'dash', 'dashes',
  'clove', 'cloves', 'bunch', 'bunches', 'can', 'cans',
  'package', 'packages', 'jar', 'jars', 'bottle', 'bottles'
];

const PREPARATIONS = [
  'chopped', 'minced', 'sliced', 'diced', 'grated', 'fresh', 'frozen',
  'dried', 'cooked', 'raw', 'peeled', 'seeded', 'cubed', 'crushed',
  'mashed', 'whipped', 'beaten', 'softened', 'melted', 'toasted',
  'roasted', 'grilled', 'fried', 'boiled', 'steamed', 'baked'
];

const MEASUREMENTS = [
  'small', 'medium', 'large', 'extra large', 'xl',
  'thin', 'thick', 'fine', 'coarse', 'whole', 'halved',
  'quartered', 'crumbled', 'packed', 'loose'
];

const COMMON_INGREDIENTS = [
  // Vegetables
  'tomato', 'onion', 'garlic', 'carrot', 'bell pepper', 'broccoli', 'spinach',
  'potato', 'cucumber', 'lettuce', 'celery', 'mushroom', 'eggplant', 'zucchini',
  'cauliflower', 'cabbage', 'corn', 'pea', 'bean', 'asparagus', 'kale',
  
  // Fruits
  'apple', 'banana', 'orange', 'lemon', 'lime', 'avocado', 'strawberry',
  'blueberry', 'raspberry', 'grape', 'watermelon', 'pineapple', 'mango',
  
  // Proteins
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'egg',
  'tofu', 'tempeh', 'paneer', 'lentil', 'chickpea', 'bean',
  
  // Grains
  'rice', 'pasta', 'noodle', 'bread', 'quinoa', 'oat', 'wheat', 'flour',
  'cereal', 'barley', 'couscous',
  
  // Dairy
  'milk', 'cheese', 'yogurt', 'butter', 'cream', 'mayonnaise',
  
  // Herbs & Spices
  'basil', 'cilantro', 'parsley', 'mint', 'oregano', 'thyme', 'rosemary',
  'ginger', 'turmeric', 'cinnamon', 'pepper', 'salt', 'sugar',
  
  // Oils & Condiments
  'oil', 'vinegar', 'honey', 'soy sauce', 'ketchup', 'mustard'
];

// Enhanced parsing function
export const parseIngredients = (text) => {
  if (!text || !text.trim()) return [];

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => {
      // Filter out empty lines and common non-ingredient patterns
      return line && 
             !line.startsWith('-') &&
             !line.startsWith('*') &&
             !line.match(/^[0-9]+\.$/) && // Numbered lists
             line.length > 2; // Minimum length
    });

  const parsedIngredients = lines.map(line => {
    try {
      return parseIngredientLine(line);
    } catch (error) {
      console.warn('Failed to parse line:', line, error);
      return null;
    }
  });

  // Filter out nulls and duplicates, prioritize common ingredients
  const uniqueIngredients = [...new Set(parsedIngredients.filter(Boolean))];
  
  return prioritizeIngredients(uniqueIngredients);
};

// Parse a single ingredient line
const parseIngredientLine = (line) => {
  let cleaned = line.toLowerCase();
  
  // Remove quantities and measurements
  cleaned = removeQuantities(cleaned);
  cleaned = removeUnits(cleaned);
  cleaned = removePreparations(cleaned);
  cleaned = removeMeasurements(cleaned);
  cleaned = removeParentheticals(cleaned);
  cleaned = removeTrailingModifiers(cleaned);
  
  // Extract the main ingredient
  const ingredient = extractMainIngredient(cleaned);
  
  return ingredient ? normalizeIngredient(ingredient) : null;
};

// Remove numeric quantities and fractions
const removeQuantities = (text) => {
  return text
    .replace(/^\d+\/\d+\s?/, '') // Fractions at start
    .replace(/^\d+\.?\d*\s?/, '') // Numbers at start
    .replace(/\s\d+\/\d+\s/g, ' ') // Fractions in middle
    .replace(/\s\d+\.?\d*\s/g, ' ') // Numbers in middle
    .replace(/\b\d+\b/g, '') // Standalone numbers
    .trim();
};

// Remove measurement units
const removeUnits = (text) => {
  const unitPattern = new RegExp(`\\b(${UNITS.join('|')})\\b`, 'gi');
  return text.replace(unitPattern, '').trim();
};

// Remove preparation terms
const removePreparations = (text) => {
  const prepPattern = new RegExp(`\\b(${PREPARATIONS.join('|')})\\b`, 'gi');
  return text.replace(prepPattern, '').trim();
};

// Remove size/quality measurements
const removeMeasurements = (text) => {
  const measurePattern = new RegExp(`\\b(${MEASUREMENTS.join('|')})\\b`, 'gi');
  return text.replace(measurePattern, '').trim();
};

// Remove parenthetical content
const removeParentheticals = (text) => {
  return text
    .replace(/\([^)]*\)/g, '') // Remove (parentheses)
    .replace(/\[[^\]]*\]/g, '') // Remove [brackets]
    .trim();
};

// Remove trailing modifiers after commas/semicolons
const removeTrailingModifiers = (text) => {
  return text
    .replace(/[,;].*$/, '') // Remove everything after comma/semicolon
    .replace(/\b(optional|divided|as needed|to taste).*$/i, '') // Remove common trailing phrases
    .trim();
};

// Extract the main ingredient from cleaned text
const extractMainIngredient = (text) => {
  if (!text) return null;
  
  // Split by common conjunctions
  const parts = text.split(/\s+(?:and|or|with|plus)\s+/);
  const mainPart = parts[0].trim();
  
  if (!mainPart) return null;
  
  // Check if it's a common ingredient
  const isCommon = COMMON_INGREDIENTS.some(ing => 
    mainPart.includes(ing) || ing.includes(mainPart)
  );
  
  if (isCommon) {
    return mainPart;
  }
  
  // For less common ingredients, take the last 1-3 words
  const words = mainPart.split(/\s+/).filter(word => word.length > 2);
  
  if (words.length <= 3) {
    return words.join(' ');
  }
  
  // Take the most specific part (usually the last few words)
  return words.slice(-2).join(' ');
};

// Normalize ingredient names
const normalizeIngredient = (ingredient) => {
  if (!ingredient) return null;
  
  return ingredient
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/\b(?:a|an|the)\s+/gi, '') // Remove articles
    .trim();
};

// Prioritize ingredients (common ones first, remove very short ones)
const prioritizeIngredients = (ingredients) => {
  return ingredients
    .filter(ing => ing && ing.length >= 3) // Minimum length
    .sort((a, b) => {
      const aIsCommon = COMMON_INGREDIENTS.some(ci => a.includes(ci) || ci.includes(a));
      const bIsCommon = COMMON_INGREDIENTS.some(ci => b.includes(ci) || ci.includes(b));
      
      if (aIsCommon && !bIsCommon) return -1;
      if (!aIsCommon && bIsCommon) return 1;
      return a.localeCompare(b);
    })
    .slice(0, 20); // Limit to reasonable number
};

// Additional utility functions
export const validateIngredient = (ingredient) => {
  if (!ingredient || ingredient.length < 2) return false;
  
  // Check if it's mostly alphabetic
  const alphaRatio = ingredient.replace(/[^a-z]/gi, '').length / ingredient.length;
  if (alphaRatio < 0.6) return false;
  
  // Check against common stop words
  const stopWords = ['and', 'or', 'with', 'for', 'the', 'a', 'an'];
  if (stopWords.includes(ingredient.toLowerCase())) return false;
  
  return true;
};

export const suggestAlternatives = (ingredient) => {
  const alternatives = COMMON_INGREDIENTS.filter(common =>
    common.includes(ingredient) || ingredient.includes(common)
  );
  return alternatives.slice(0, 3);
};

export const parseIngredientsWithDetails = (text) => {
  const ingredients = parseIngredients(text);
  
  return ingredients.map(ingredient => ({
    name: ingredient,
    isCommon: COMMON_INGREDIENTS.some(ci => 
      ingredient.includes(ci) || ci.includes(ingredient)
    ),
    alternatives: suggestAlternatives(ingredient),
    category: getIngredientCategory(ingredient)
  }));
};

const getIngredientCategory = (ingredient) => {
  const categories = {
    vegetables: ['tomato', 'onion', 'garlic', 'carrot', 'bell pepper', 'broccoli', 'spinach', 'potato', 'cucumber', 'lettuce', 'celery', 'mushroom', 'eggplant', 'zucchini', 'cauliflower', 'cabbage', 'corn', 'pea', 'bean', 'asparagus', 'kale'],
    fruits: ['apple', 'banana', 'orange', 'lemon', 'lime', 'avocado', 'strawberry', 'blueberry', 'raspberry', 'grape', 'watermelon', 'pineapple', 'mango'],
    proteins: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'egg', 'tofu', 'tempeh', 'paneer', 'lentil', 'chickpea', 'bean'],
    grains: ['rice', 'pasta', 'noodle', 'bread', 'quinoa', 'oat', 'wheat', 'flour', 'cereal', 'barley', 'couscous'],
    dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'mayonnaise'],
    herbs: ['basil', 'cilantro', 'parsley', 'mint', 'oregano', 'thyme', 'rosemary', 'ginger', 'turmeric', 'cinnamon'],
    other: ['oil', 'vinegar', 'honey', 'soy sauce', 'ketchup', 'mustard', 'salt', 'pepper', 'sugar']
  };
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => ingredient.includes(item) || item.includes(ingredient))) {
      return category;
    }
  }
  
  return 'other';
};

// Test function for development
export const testParser = (text) => {
  console.log('Input:', text);
  console.log('Parsed:', parseIngredients(text));
  console.log('Detailed:', parseIngredientsWithDetails(text));
};