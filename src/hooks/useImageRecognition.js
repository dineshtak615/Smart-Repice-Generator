// src/hooks/useImageRecognition.js
import { useState, useCallback, useRef } from 'react';

const PAT = import.meta.env.VITE_CLARIFAI_PAT;
const MODEL_ID = 'food-item-recognition';
const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044';

// Enhanced mock data with categories
const MOCK_INGREDIENTS = {
  vegetables: ['tomato', 'onion', 'garlic', 'carrot', 'bell pepper', 'broccoli', 'spinach', 'potato', 'cucumber'],
  fruits: ['apple', 'banana', 'orange', 'lemon', 'avocado', 'strawberry'],
  proteins: ['chicken', 'beef', 'fish', 'eggs', 'tofu', 'paneer', 'lentils'],
  grains: ['rice', 'pasta', 'bread', 'quinoa', 'oats'],
  dairy: ['milk', 'cheese', 'yogurt', 'butter'],
  herbs: ['basil', 'cilantro', 'parsley', 'mint', 'oregano']
};

// Common food items for validation
const COMMON_FOOD_ITEMS = new Set([
  'tomato', 'onion', 'garlic', 'carrot', 'bell pepper', 'broccoli', 'spinach', 'potato',
  'apple', 'banana', 'orange', 'lemon', 'avocado', 'strawberry',
  'chicken', 'beef', 'fish', 'eggs', 'tofu', 'paneer', 'lentils',
  'rice', 'pasta', 'bread', 'quinoa', 'oats',
  'milk', 'cheese', 'yogurt', 'butter',
  'basil', 'cilantro', 'parsley', 'mint', 'oregano'
]);

export const useImageRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const abortControllerRef = useRef(null);

  // Generate realistic mock ingredients
  const generateMockIngredients = useCallback(() => {
    const ingredients = [];
    const categories = Object.keys(MOCK_INGREDIENTS);
    
    // Pick 2-3 random categories
    const selectedCategories = categories
      .sort(() => 0.5 - Math.random())
      .slice(0, 2 + Math.floor(Math.random() * 2));
    
    // Add 1-2 ingredients from each selected category
    selectedCategories.forEach(category => {
      const categoryIngredients = MOCK_INGREDIENTS[category];
      const count = 1 + Math.floor(Math.random() * 2);
      const selected = categoryIngredients
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
      ingredients.push(...selected);
    });
    
    // Add some common ingredients
    const common = ['salt', 'pepper', 'oil', 'water'];
    ingredients.push(common[Math.floor(Math.random() * common.length)]);
    
    return [...new Set(ingredients)].slice(0, 8);
  }, []);

  // Filter and validate ingredients from API response
  const filterIngredients = useCallback((concepts) => {
    return concepts
      .map(concept => ({
        name: concept.name.toLowerCase().trim(),
        confidence: concept.value
      }))
      .filter(concept => {
        const isFoodItem = COMMON_FOOD_ITEMS.has(concept.name) || 
                          Array.from(COMMON_FOOD_ITEMS).some(food => 
                            concept.name.includes(food) || food.includes(concept.name)
                          );
        
        const isValidLength = concept.name.length >= 3 && concept.name.length <= 20;
        const hasValidCharacters = /^[a-z\s\-]+$/.test(concept.name);
        const isHighConfidence = concept.confidence > 0.7;
        
        return isFoodItem && isValidLength && hasValidCharacters && isHighConfidence;
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 12)
      .map(concept => concept.name);
  }, []);

  const detectIngredients = useCallback(async (file) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    setConfidence(0);

    try {
      // Use mock data if no PAT or in development
      if (!PAT || import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
        const mockIngredients = generateMockIngredients();
        setConfidence(85);
        return mockIngredients;
      }

      // Real API call
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const response = await fetch(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Key ${PAT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_app_id: { user_id: 'clarifai', app_id: 'main' },
            inputs: [{ data: { image: { base64 } } }]
          }),
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.outputs?.[0]?.data?.concepts) {
        throw new Error('Invalid response format from API');
      }

      const concepts = data.outputs[0].data.concepts;
      const ingredients = filterIngredients(concepts);
      
      // Calculate average confidence
      const avgConfidence = concepts.length > 0 
        ? concepts.reduce((sum, concept) => sum + concept.value, 0) / concepts.length
        : 0;

      setConfidence(Math.round(avgConfidence * 100));

      // Fallback to mock data if no ingredients detected
      if (ingredients.length === 0) {
        const mockIngredients = generateMockIngredients();
        setError('No ingredients detected. Using sample data.');
        return mockIngredients;
      }

      return ingredients;

    } catch (err) {
      // Handle abort separately
      if (err.name === 'AbortError') {
        return [];
      }

      console.error('Image recognition error:', err);
      
      // Fallback to mock data
      const mockIngredients = generateMockIngredients();
      setError('API unavailable. Using demo mode.');
      setConfidence(75);
      
      return mockIngredients;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [filterIngredients, generateMockIngredients]);

  // Cancel ongoing detection
  const cancelDetection = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  }, []);

  return {
    detectIngredients,
    loading,
    error,
    confidence,
    cancelDetection,
    isMockMode: !PAT || import.meta.env.DEV
  };
};

export default useImageRecognition;