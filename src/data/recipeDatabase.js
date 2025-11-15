// src/data/recipeDatabase.js

// Enhanced recipe database with more metadata and structured data
export const recipeDatabase = [
  {
    id: 1,
    name: "Classic Spaghetti Carbonara",
    ingredients: ["spaghetti", "eggs", "parmesan cheese", "bacon", "black pepper", "garlic"],
    instructions: [
      "Cook spaghetti according to package instructions in salted water.",
      "While pasta cooks, fry bacon until crispy, then add minced garlic and cook for 1 minute.",
      "Whisk eggs and grated parmesan together in a bowl.",
      "Drain hot pasta and immediately combine with bacon mixture.",
      "Quickly mix in egg and cheese mixture off heat to create creamy sauce.",
      "Season with freshly ground black pepper and serve immediately."
    ],
    cookingTime: 20,
    prepTime: 10,
    totalTime: 30,
    difficulty: "medium",
    servings: 4,
    dietary: [],
    tags: ["pasta", "comfort food", "quick dinner"],
    nutrition: { 
      calories: 450, 
      protein: 20, 
      carbs: 55, 
      fat: 15,
      fiber: 3,
      sugar: 2,
      sodium: 800
    },
    cuisine: "Italian",
    image: "/images/carbonara.jpg",
    equipment: ["large pot", "skillet", "mixing bowl", "whisk"],
    tips: [
      "Use freshly grated parmesan for best results",
      "Don't overcook the eggs - they should coat the pasta, not scramble",
      "Reserve some pasta water to adjust sauce consistency"
    ]
  },
  {
    id: 2,
    name: "Vegetable Stir Fry",
    ingredients: ["broccoli", "carrot", "bell pepper", "soy sauce", "garlic", "ginger", "rice", "sesame oil"],
    instructions: [
      "Cook rice according to package instructions.",
      "Chop all vegetables into uniform bite-sized pieces.",
      "Heat sesame oil in a wok or large pan over high heat.",
      "Add minced garlic and ginger, stir for 30 seconds until fragrant.",
      "Add harder vegetables first (carrots, broccoli), then softer ones (bell peppers).",
      "Stir-fry for 4-5 minutes until vegetables are tender-crisp.",
      "Add soy sauce and toss to combine.",
      "Serve immediately over cooked rice."
    ],
    cookingTime: 15,
    prepTime: 15,
    totalTime: 30,
    difficulty: "easy",
    servings: 2,
    dietary: ["vegetarian", "vegan"],
    tags: ["quick", "healthy", "asian"],
    nutrition: { 
      calories: 320, 
      protein: 8, 
      carbs: 60, 
      fat: 6,
      fiber: 8,
      sugar: 12,
      sodium: 900
    },
    cuisine: "Asian",
    image: "/images/stir-fry.jpg",
    equipment: ["wok or large pan", "rice cooker", "cutting board", "knife"],
    tips: [
      "Cut vegetables uniformly for even cooking",
      "Keep the heat high for proper stir-frying",
      "Have all ingredients prepped before starting to cook"
    ]
  },
  {
    id: 3,
    name: "Greek Salad",
    ingredients: ["tomato", "cucumber", "red onion", "feta cheese", "olives", "olive oil", "lemon juice", "oregano", "green bell pepper"],
    instructions: [
      "Chop tomatoes, cucumber, and green bell pepper into bite-sized pieces.",
      "Thinly slice red onion and soak in cold water for 10 minutes to reduce sharpness.",
      "Combine all vegetables in a large bowl with olives.",
      "Crumble feta cheese on top.",
      "Whisk together olive oil, lemon juice, and dried oregano for the dressing.",
      "Pour dressing over salad and toss gently.",
      "Season with salt and pepper to taste.",
      "Let sit for 5-10 minutes before serving for flavors to meld."
    ],
    cookingTime: 10,
    prepTime: 15,
    totalTime: 25,
    difficulty: "easy",
    servings: 2,
    dietary: ["vegetarian", "gluten-free"],
    tags: ["salad", "fresh", "mediterranean"],
    nutrition: { 
      calories: 280, 
      protein: 10, 
      carbs: 15, 
      fat: 20,
      fiber: 4,
      sugar: 8,
      sodium: 700
    },
    cuisine: "Mediterranean",
    image: "/images/greek-salad.jpg",
    equipment: ["cutting board", "knife", "mixing bowl", "whisk"],
    tips: [
      "Use ripe, in-season tomatoes for best flavor",
      "Soak red onion to reduce harshness",
      "Don't overdress the salad"
    ]
  },
  {
    id: 4,
    name: "Chicken Curry",
    ingredients: ["chicken breast", "coconut milk", "curry powder", "onion", "garlic", "ginger", "rice", "vegetable oil", "salt"],
    instructions: [
      "Cook rice according to package instructions.",
      "Dice chicken breast into bite-sized pieces, season with salt.",
      "Heat oil in a large pot, sauté chopped onion until translucent.",
      "Add minced garlic and ginger, cook for 1 minute until fragrant.",
      "Add chicken pieces and cook until browned on all sides.",
      "Stir in curry powder and cook for 30 seconds to toast spices.",
      "Pour in coconut milk, bring to simmer, then reduce heat.",
      "Simmer for 15-20 minutes until chicken is cooked through and sauce thickens.",
      "Adjust seasoning and serve over cooked rice."
    ],
    cookingTime: 30,
    prepTime: 15,
    totalTime: 45,
    difficulty: "medium",
    servings: 4,
    dietary: ["gluten-free"],
    tags: ["curry", "comfort food", "spicy"],
    nutrition: { 
      calories: 520, 
      protein: 35, 
      carbs: 45, 
      fat: 22,
      fiber: 3,
      sugar: 6,
      sodium: 600
    },
    cuisine: "Indian",
    image: "/images/chicken-curry.jpg",
    equipment: ["large pot", "cutting board", "knife", "rice cooker"],
    tips: [
      "Toast curry powder briefly to enhance flavor",
      "Use full-fat coconut milk for creamier sauce",
      "Let curry rest for 10 minutes before serving for better flavor"
    ]
  },
  {
    id: 5,
    name: "Avocado Toast with Optional Toppings",
    ingredients: ["bread", "avocado", "lemon juice", "red pepper flakes", "salt", "pepper", "olive oil"],
    instructions: [
      "Toast bread until golden brown and crisp.",
      "While bread toasts, halve avocado and remove pit.",
      "Scoop avocado into a bowl, add lemon juice, salt, and pepper.",
      "Mash avocado with a fork to desired consistency.",
      "Spread avocado mixture evenly on warm toast.",
      "Drizzle with olive oil and sprinkle with red pepper flakes.",
      "Add optional toppings like sliced radish, microgreens, or fried egg.",
      "Serve immediately."
    ],
    cookingTime: 5,
    prepTime: 5,
    totalTime: 10,
    difficulty: "easy",
    servings: 1,
    dietary: ["vegetarian", "vegan"],
    tags: ["breakfast", "quick", "healthy"],
    nutrition: { 
      calories: 250, 
      protein: 6, 
      carbs: 25, 
      fat: 15,
      fiber: 8,
      sugar: 2,
      sodium: 300
    },
    cuisine: "American",
    image: "/images/avocado-toast.jpg",
    equipment: ["toaster", "bowl", "fork"],
    tips: [
      "Use ripe but firm avocados",
      "Add lemon juice to prevent browning",
      "Serve immediately for best texture"
    ]
  },
  {
    id: 6,
    name: "Beef Tacos with Fresh Toppings",
    ingredients: ["ground beef", "taco shells", "lettuce", "tomato", "cheese", "sour cream", "taco seasoning", "onion", "lime"],
    instructions: [
      "Brown ground beef in a skillet over medium heat, breaking it up.",
      "Add chopped onion and cook until softened.",
      "Stir in taco seasoning and a splash of water, simmer for 5 minutes.",
      "While beef cooks, chop lettuce and tomato, grate cheese.",
      "Warm taco shells according to package directions.",
      "Assemble tacos with beef, lettuce, tomato, and cheese.",
      "Top with sour cream and a squeeze of fresh lime juice.",
      "Serve with your favorite hot sauce."
    ],
    cookingTime: 20,
    prepTime: 15,
    totalTime: 35,
    difficulty: "easy",
    servings: 4,
    dietary: [],
    tags: ["mexican", "family friendly", "quick"],
    nutrition: { 
      calories: 380, 
      protein: 25, 
      carbs: 30, 
      fat: 18,
      fiber: 3,
      sugar: 4,
      sodium: 850
    },
    cuisine: "Mexican",
    image: "/images/beef-tacos.jpg",
    equipment: ["skillet", "cutting board", "knife", "grater"],
    tips: [
      "Drain excess fat from beef for less greasy tacos",
      "Warm taco shells for better texture",
      "Set up a taco bar for easy assembly"
    ]
  },
  {
    id: 7,
    name: "Hearty Vegetable Soup",
    ingredients: ["carrot", "celery", "onion", "potato", "vegetable broth", "tomato", "herbs", "garlic", "olive oil", "bay leaf"],
    instructions: [
      "Chop all vegetables into uniform pieces.",
      "Heat olive oil in a large pot over medium heat.",
      "Sauté onion, carrot, and celery until softened (5-7 minutes).",
      "Add minced garlic and cook for 1 minute until fragrant.",
      "Add potatoes, diced tomatoes, vegetable broth, and bay leaf.",
      "Bring to boil, then reduce heat and simmer for 25-30 minutes.",
      "Remove bay leaf, season with herbs, salt, and pepper.",
      "Serve hot with crusty bread."
    ],
    cookingTime: 35,
    prepTime: 15,
    totalTime: 50,
    difficulty: "easy",
    servings: 6,
    dietary: ["vegetarian", "vegan", "gluten-free"],
    tags: ["soup", "comfort food", "healthy"],
    nutrition: { 
      calories: 180, 
      protein: 5, 
      carbs: 35, 
      fat: 2,
      fiber: 6,
      sugar: 8,
      sodium: 700
    },
    cuisine: "International",
    image: "/images/vegetable-soup.jpg",
    equipment: ["large pot", "cutting board", "knife", "ladle"],
    tips: [
      "Chop vegetables evenly for consistent cooking",
      "Don't overcook vegetables - they should retain some texture",
      "Soup tastes better the next day as flavors develop"
    ]
  }
];

// Additional utility functions for recipe database
export const getRecipeById = (id) => {
  return recipeDatabase.find(recipe => recipe.id === id);
};

export const getRecipesByDiet = (dietary) => {
  return recipeDatabase.filter(recipe => 
    recipe.dietary.includes(dietary.toLowerCase())
  );
};

export const getRecipesByCuisine = (cuisine) => {
  return recipeDatabase.filter(recipe => 
    recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
  );
};

export const getRecipesByCookingTime = (maxTime) => {
  return recipeDatabase.filter(recipe => recipe.totalTime <= maxTime);
};

export const getRecipesByDifficulty = (difficulty) => {
  return recipeDatabase.filter(recipe => 
    recipe.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
};

export const searchRecipes = (query) => {
  const searchTerm = query.toLowerCase();
  return recipeDatabase.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    recipe.cuisine.toLowerCase().includes(searchTerm)
  );
};

export const getRandomRecipe = () => {
  const randomIndex = Math.floor(Math.random() * recipeDatabase.length);
  return recipeDatabase[randomIndex];
};

// Enhanced ingredient list with categories
export const ingredientCategories = {
  proteins: [
    "chicken breast", "ground beef", "salmon fillet", "eggs", "tofu", 
    "tempeh", "black beans", "chickpeas", "lentils"
  ],
  vegetables: [
    "broccoli", "carrot", "bell pepper", "tomato", "cucumber", 
    "red onion", "garlic", "ginger", "asparagus", "mushrooms", 
    "zucchini", "potato", "celery", "lettuce"
  ],
  dairy: [
    "milk", "butter", "cheese", "parmesan cheese", "feta cheese", 
    "sour cream", "yogurt"
  ],
  grains: [
    "spaghetti", "rice", "bread", "tortillas", "quinoa", 
    "arborio rice", "flour", "taco shells"
  ],
  oils: [
    "olive oil", "vegetable oil", "sesame oil", "coconut oil"
  ],
  seasonings: [
    "soy sauce", "salt", "pepper", "black pepper", "red pepper flakes",
    "curry powder", "taco seasoning", "oregano", "herbs", "lemon juice",
    "vinegar", "sugar", "honey", "maple syrup", "baking powder",
    "baking soda", "vanilla extract"
  ]
};

// Get all unique ingredients from all recipes
export const getAllIngredients = () => {
  const allIngredients = new Set();
  recipeDatabase.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      allIngredients.add(ingredient.toLowerCase());
    });
  });
  return Array.from(allIngredients).sort();
};

// Get recipes that can be made with minimal additional ingredients
export const getRecipesWithMinimalMissing = (availableIngredients, maxMissing = 3) => {
  const availableSet = new Set(availableIngredients.map(i => i.toLowerCase()));
  
  return recipeDatabase.map(recipe => {
    const recipeSet = new Set(recipe.ingredients.map(i => i.toLowerCase()));
    const missing = [...recipeSet].filter(ing => !availableSet.has(ing));
    
    return {
      ...recipe,
      missingCount: missing.length,
      missingIngredients: missing
    };
  })
  .filter(recipe => recipe.missingCount <= maxMissing)
  .sort((a, b) => a.missingCount - b.missingCount);
};

// Dummy ingredient list for testing (comprehensive)
export const dummyIngredients = [
  // Proteins
  "chicken breast", "ground beef", "salmon fillet", "eggs", "bacon", "tofu",
  
  // Vegetables
  "broccoli", "carrot", "bell pepper", "tomato", "cucumber", "red onion",
  "garlic", "ginger", "asparagus", "mushrooms", "zucchini", "potato",
  "celery", "lettuce", "green bell pepper",
  
  // Dairy
  "milk", "butter", "cheese", "parmesan cheese", "feta cheese", "sour cream",
  "yogurt", "coconut milk",
  
  // Grains
  "spaghetti", "rice", "bread", "tortillas", "quinoa", "arborio rice",
  "flour", "taco shells", "white wine",
  
  // Oils & Condiments
  "olive oil", "vegetable oil", "sesame oil", "soy sauce", "lemon juice",
  "maple syrup", "honey",
  
  // Seasonings
  "salt", "pepper", "black pepper", "red pepper flakes", "curry powder",
  "taco seasoning", "oregano", "herbs", "vanilla extract", "baking powder",
  "baking soda", "chocolate chips", "brown sugar", "olives"
];