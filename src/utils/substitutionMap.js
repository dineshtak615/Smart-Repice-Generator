// src/utils/substitutionMap.js

// Comprehensive ingredient substitution mapping
export const substitutionMap = {
  // Protein substitutions
  'chicken': ['tofu', 'tempeh', 'seitan', 'chickpeas', 'white beans'],
  'chicken breast': ['tofu', 'tempeh', 'seitan', 'jackfruit'],
  'beef': ['mushrooms', 'jackfruit', 'lentils', 'black beans', 'tofu'],
  'ground beef': ['lentils', 'mushrooms', 'walnuts', 'textured vegetable protein'],
  'pork': ['tofu', 'tempeh', 'mushrooms', 'jackfruit'],
  'bacon': ['tempeh bacon', 'coconut bacon', 'mushroom bacon', 'eggplant bacon'],
  'fish': ['tofu', 'chickpeas', 'jackfruit', 'hearts of palm'],
  'salmon': ['marinated carrots', 'smoked tofu', 'tomato slices'],
  'eggs': ['flax egg', 'chia egg', 'applesauce', 'banana', 'yogurt', 'silken tofu'],
  'egg': ['flax egg', 'chia egg', 'applesauce', 'banana', 'yogurt'],
  
  // Dairy substitutions
  'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk', 'rice milk'],
  'butter': ['margarine', 'coconut oil', 'olive oil', 'avocado', 'applesauce'],
  'cheese': ['nutritional yeast', 'vegan cheese', 'tofu', 'cashew cheese'],
  'parmesan cheese': ['nutritional yeast', 'vegan parmesan', 'cashew parmesan'],
  'feta cheese': ['tofu feta', 'cashew feta', 'vegan feta'],
  'cream': ['coconut cream', 'cashew cream', 'silken tofu', 'avocado'],
  'sour cream': ['greek yogurt', 'coconut cream', 'cashew sour cream'],
  'yogurt': ['coconut yogurt', 'soy yogurt', 'almond yogurt', 'applesauce'],
  
  // Oil and fat substitutions
  'olive oil': ['avocado oil', 'coconut oil', 'vegetable oil', 'canola oil', 'grapeseed oil'],
  'vegetable oil': ['olive oil', 'canola oil', 'avocado oil', 'coconut oil'],
  'canola oil': ['olive oil', 'avocado oil', 'vegetable oil', 'coconut oil'],
  
  // Grain and flour substitutions
  'white rice': ['brown rice', 'quinoa', 'cauliflower rice', 'barley', 'farro'],
  'brown rice': ['white rice', 'quinoa', 'cauliflower rice', 'millet'],
  'pasta': ['zucchini noodles', 'spaghetti squash', 'rice noodles', 'lentil pasta'],
  'spaghetti': ['zucchini noodles', 'spaghetti squash', 'shirataki noodles'],
  'flour': ['almond flour', 'coconut flour', 'oat flour', 'whole wheat flour'],
  'bread': ['lettuce wraps', 'collard greens', 'portobello mushrooms', 'rice cakes'],
  'tortillas': ['lettuce leaves', 'collard greens', 'coconut wraps', 'rice paper'],
  
  // Vegetable substitutions
  'onion': ['shallots', 'leeks', 'green onions', 'onion powder'],
  'garlic': ['garlic powder', 'shallots', 'chives', 'asafoetida'],
  'ginger': ['ginger powder', 'galangal', 'turmeric'],
  'potato': ['sweet potato', 'cauliflower', 'parsnips', 'turnips'],
  'tomato': ['red bell pepper', 'tomatillos', 'sun-dried tomatoes'],
  'bell pepper': ['poblano peppers', 'anaheim peppers', 'carrots'],
  'mushrooms': ['eggplant', 'zucchini', 'tofu', 'tempeh'],
  'carrot': ['sweet potato', 'butternut squash', 'parsnips'],
  'broccoli': ['cauliflower', 'brussels sprouts', 'asparagus'],
  
  // Legume substitutions
  'black beans': ['kidney beans', 'pinto beans', 'lentils', 'chickpeas'],
  'chickpeas': ['white beans', 'lentils', 'black beans', 'tofu'],
  'lentils': ['split peas', 'black beans', 'chickpeas', 'ground meat'],
  
  // Flavor and seasoning substitutions
  'soy sauce': ['tamari', 'coconut aminos', 'liquid aminos', 'miso paste'],
  'salt': ['soy sauce', 'tamari', 'miso paste', 'nutritional yeast'],
  'sugar': ['honey', 'maple syrup', 'agave nectar', 'coconut sugar'],
  'honey': ['maple syrup', 'agave nectar', 'brown rice syrup', 'molasses'],
  'vinegar': ['lemon juice', 'lime juice', 'white wine', 'verjuice'],
  'lemon juice': ['lime juice', 'vinegar', 'white wine', 'citric acid'],
  'mayonnaise': ['greek yogurt', 'avocado', 'hummus', 'vegan mayonnaise']
};

// Enhanced substitution helper functions
export const getSubstitutions = (ingredient) => {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  return substitutionMap[normalizedIngredient] || [];
};

export const findPossibleSubstitutes = (ingredient) => {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  const directSubs = getSubstitutions(normalizedIngredient);
  
  // Find reverse substitutions (what can this ingredient substitute for?)
  const reverseSubs = Object.entries(substitutionMap)
    .filter(([_, substitutes]) => 
      substitutes.some(sub => sub.toLowerCase() === normalizedIngredient)
    )
    .map(([original]) => original);
  
  return [...new Set([...directSubs, ...reverseSubs])];
};

export const getSubstitutionQuality = (original, substitute) => {
  const qualityTiers = {
    excellent: ['tofu→chicken', 'lentils→ground beef', 'almond milk→milk'],
    good: ['mushrooms→beef', 'applesauce→egg', 'coconut oil→butter'],
    fair: ['banana→egg', 'zucchini→pasta', 'nutritional yeast→cheese']
  };
  
  const substitutionKey = `${original}→${substitute}`;
  
  for (const [tier, pairs] of Object.entries(qualityTiers)) {
    if (pairs.includes(substitutionKey)) {
      return tier;
    }
  }
  
  return 'good'; // Default assumption
};

// Get all possible substitutions for multiple ingredients
export const getBulkSubstitutions = (ingredients) => {
  return ingredients.reduce((acc, ingredient) => {
    acc[ingredient] = getSubstitutions(ingredient);
    return acc;
  }, {});
};