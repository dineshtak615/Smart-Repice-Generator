// src/utils/formatNutrition.js

/**
 * Comprehensive nutrition formatting and scaling utilities
 */

// Nutrition thresholds for different dietary goals
const NUTRITION_THRESHOLDS = {
  calories: {
    low: 400,
    high: 800
  },
  protein: {
    low: 10,
    high: 30
  },
  carbs: {
    low: 20,
    high: 60
  },
  fat: {
    low: 5,
    high: 25
  },
  sugar: {
    low: 5,
    high: 15
  },
  sodium: {
    low: 140,
    high: 500
  }
};

// Daily Value percentages based on 2000 calorie diet
const DAILY_VALUES = {
  calories: 2000,
  protein: 50, // grams
  carbs: 300, // grams
  fat: 65, // grams
  saturatedFat: 20, // grams
  sugar: 50, // grams
  sodium: 2300, // mg
  fiber: 28, // grams
  cholesterol: 300 // mg
};

/**
 * Scale nutrition values based on serving sizes
 * @param {Object} nutrition - Nutrition object
 * @param {number} servings - Current number of servings
 * @param {number} targetServings - Target number of servings
 * @returns {Object} Scaled nutrition values
 */
export const scaleNutrition = (nutrition, servings, targetServings = 1) => {
  if (!nutrition || servings <= 0) return nutrition;
  
  const factor = targetServings / servings;
  
  const scaled = {};
  Object.keys(nutrition).forEach(key => {
    const value = nutrition[key];
    if (typeof value === 'number') {
      scaled[key] = Math.round(value * factor * 10) / 10; // Round to 1 decimal
    } else {
      scaled[key] = value;
    }
  });
  
  return scaled;
};

/**
 * Calculate Daily Value percentages
 * @param {Object} nutrition - Nutrition object
 * @returns {Object} DV percentages
 */
export const calculateDailyValues = (nutrition) => {
  if (!nutrition) return {};
  
  const dv = {};
  Object.keys(DAILY_VALUES).forEach(key => {
    if (nutrition[key] !== undefined) {
      const percentage = (nutrition[key] / DAILY_VALUES[key]) * 100;
      dv[`${key}DV`] = Math.min(Math.round(percentage * 10) / 10, 100); // Cap at 100%
    }
  });
  
  return dv;
};

/**
 * Format nutrition values with units
 * @param {Object} nutrition - Nutrition object
 * @returns {Object} Formatted nutrition strings
 */
export const formatNutritionValues = (nutrition) => {
  if (!nutrition) return {};
  
  const formatted = {};
  
  Object.keys(nutrition).forEach(key => {
    const value = nutrition[key];
    
    if (typeof value === 'number') {
      switch (key) {
        case 'calories':
          formatted[key] = `${value.toLocaleString()} cal`;
          break;
        case 'protein':
        case 'carbs':
        case 'fat':
        case 'sugar':
        case 'fiber':
        case 'saturatedFat':
          formatted[key] = `${value}g`;
          break;
        case 'sodium':
          formatted[key] = `${value}mg`;
          break;
        case 'cholesterol':
          formatted[key] = `${value}mg`;
          break;
        default:
          formatted[key] = value.toString();
      }
    } else {
      formatted[key] = value;
    }
  });
  
  return formatted;
};

/**
 * Get nutrition level (low, medium, high) based on thresholds
 * @param {string} nutrient - Nutrient name
 * @param {number} value - Nutrient value
 * @returns {string} Level indicator
 */
export const getNutritionLevel = (nutrient, value) => {
  const thresholds = NUTRITION_THRESHOLDS[nutrient];
  if (!thresholds || value === undefined) return 'unknown';
  
  if (value < thresholds.low) return 'low';
  if (value > thresholds.high) return 'high';
  return 'medium';
};

/**
 * Analyze recipe nutrition for dietary considerations
 * @param {Object} nutrition - Nutrition object
 * @returns {Object} Dietary analysis
 */
export const analyzeNutrition = (nutrition) => {
  if (!nutrition) return {};
  
  const analysis = {
    isHighProtein: nutrition.protein > 20,
    isLowCarb: nutrition.carbs < 30,
    isLowFat: nutrition.fat < 10,
    isLowCalorie: nutrition.calories < 400,
    isHighFiber: nutrition.fiber > 8,
    isLowSodium: nutrition.sodium < 140,
    isLowSugar: nutrition.sugar < 5
  };
  
  // Calculate nutrition score (0-100)
  let score = 50; // Base score
  
  // Positive factors
  if (analysis.isHighProtein) score += 10;
  if (analysis.isHighFiber) score += 10;
  if (analysis.isLowSugar) score += 10;
  if (analysis.isLowSodium) score += 10;
  
  // Balance calories
  if (nutrition.calories > 800) score -= 5;
  if (nutrition.calories < 200) score += 5;
  
  analysis.nutritionScore = Math.max(0, Math.min(100, Math.round(score)));
  analysis.nutritionGrade = getNutritionGrade(analysis.nutritionScore);
  
  return analysis;
};

/**
 * Convert nutrition score to letter grade
 * @param {number} score - Nutrition score (0-100)
 * @returns {string} Letter grade
 */
export const getNutritionGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

/**
 * Calculate macronutrient ratios
 * @param {Object} nutrition - Nutrition object
 * @returns {Object} Macronutrient ratios
 */
export const calculateMacroRatios = (nutrition) => {
  if (!nutrition || !nutrition.calories) return {};
  
  const proteinCals = nutrition.protein * 4;
  const carbCals = nutrition.carbs * 4;
  const fatCals = nutrition.fat * 9;
  const totalCals = proteinCals + carbCals + fatCals;
  
  if (totalCals === 0) return {};
  
  return {
    protein: Math.round((proteinCals / totalCals) * 100),
    carbs: Math.round((carbCals / totalCals) * 100),
    fat: Math.round((fatCals / totalCals) * 100)
  };
};

/**
 * Compare two nutrition profiles
 * @param {Object} nutrition1 - First nutrition object
 * @param {Object} nutrition2 - Second nutrition object
 * @returns {Object} Comparison results
 */
export const compareNutrition = (nutrition1, nutrition2) => {
  if (!nutrition1 || !nutrition2) return {};
  
  const comparison = {};
  const keys = new Set([...Object.keys(nutrition1), ...Object.keys(nutrition2)]);
  
  keys.forEach(key => {
    const val1 = nutrition1[key] || 0;
    const val2 = nutrition2[key] || 0;
    
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      const difference = val2 - val1;
      const percentage = val1 !== 0 ? (difference / val1) * 100 : 0;
      
      comparison[key] = {
        difference: Math.round(difference * 10) / 10,
        percentage: Math.round(percentage * 10) / 10,
        isBetter: getBetterIndicator(key, val1, val2)
      };
    }
  });
  
  return comparison;
};

/**
 * Determine if a value is better (for health)
 * @param {string} nutrient - Nutrient name
 * @param {number} oldVal - Original value
 * @param {number} newVal - New value
 * @returns {boolean|null} True if better, false if worse, null if neutral
 */
const getBetterIndicator = (nutrient, oldVal, newVal) => {
  const lowerIsBetter = ['calories', 'fat', 'saturatedFat', 'sugar', 'sodium', 'cholesterol'];
  const higherIsBetter = ['protein', 'fiber'];
  
  if (lowerIsBetter.includes(nutrient)) {
    return newVal < oldVal;
  } else if (higherIsBetter.includes(nutrient)) {
    return newVal > oldVal;
  }
  
  return null; // Neutral or not applicable
};

/**
 * Generate nutrition summary for display
 * @param {Object} nutrition - Nutrition object
 * @param {number} servings - Number of servings
 * @returns {Object} Summary object
 */
export const generateNutritionSummary = (nutrition, servings = 1) => {
  if (!nutrition) return null;
  
  const scaled = scaleNutrition(nutrition, servings, 1);
  const dv = calculateDailyValues(scaled);
  const formatted = formatNutritionValues(scaled);
  const analysis = analyzeNutrition(scaled);
  const macros = calculateMacroRatios(scaled);
  
  return {
    values: scaled,
    formatted,
    dailyValues: dv,
    analysis,
    macros,
    levels: Object.keys(scaled).reduce((acc, key) => {
      acc[key] = getNutritionLevel(key, scaled[key]);
      return acc;
    }, {})
  };
};

/**
 * Validate nutrition object structure
 * @param {Object} nutrition - Nutrition object to validate
 * @returns {Object} Validation result
 */
export const validateNutrition = (nutrition) => {
  if (!nutrition || typeof nutrition !== 'object') {
    return { isValid: false, errors: ['Nutrition data is required'] };
  }
  
  const errors = [];
  const required = ['calories', 'protein', 'carbs', 'fat'];
  
  required.forEach(field => {
    if (nutrition[field] === undefined || nutrition[field] === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof nutrition[field] !== 'number') {
      errors.push(`Invalid type for ${field}: expected number`);
    } else if (nutrition[field] < 0) {
      errors.push(`Invalid value for ${field}: cannot be negative`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
};

/**
 * Convert between different nutrition units
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Original unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertNutritionUnits = (value, fromUnit, toUnit) => {
  const conversions = {
    // Weight conversions
    'g->mg': (v) => v * 1000,
    'mg->g': (v) => v / 1000,
    'g->kg': (v) => v / 1000,
    'kg->g': (v) => v * 1000,
    
    // Energy conversions (approximate)
    'cal->kj': (v) => v * 4.184,
    'kj->cal': (v) => v / 4.184
  };
  
  const key = `${fromUnit}->${toUnit}`;
  const converter = conversions[key];
  
  if (converter) {
    return Math.round(converter(value) * 100) / 100;
  }
  
  return value; // Return original if conversion not found
};

export default {
  scaleNutrition,
  calculateDailyValues,
  formatNutritionValues,
  analyzeNutrition,
  calculateMacroRatios,
  compareNutrition,
  generateNutritionSummary,
  validateNutrition,
  convertNutritionUnits,
  getNutritionLevel,
  getNutritionGrade,
  NUTRITION_THRESHOLDS,
  DAILY_VALUES
};