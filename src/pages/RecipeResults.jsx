// src/pages/RecipeResults.jsx
import React, { useState, useMemo, useEffect } from 'react';

import { 
  Filter, 
  ChefHat, 
  Sparkles, 
  ArrowLeft, 
  SlidersHorizontal,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Leaf,
  Loader2,
  AlertCircle
} from 'lucide-react';
import RecipeCard from '../components/RecipeCard';

// Create a simple fallback FilterSidebar if the component is missing
const FallbackFilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  if (!isOpen) return null;

  return (
    <div style={fallbackStyles.overlay}>
      <div style={fallbackStyles.sidebar}>
        <div style={fallbackStyles.header}>
          <h3>Filters</h3>
          <button onClick={onClose} style={fallbackStyles.closeButton}>×</button>
        </div>
        <div style={fallbackStyles.content}>
          <p>Filter sidebar component is loading...</p>
          <button 
            onClick={onClose}
            style={fallbackStyles.closeBtn}
          >
            Close Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const fallbackStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  sidebar: {
    width: '300px',
    backgroundColor: 'white',
    padding: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  content: {
    textAlign: 'center'
  },
  closeBtn: {
    padding: '0.5rem 1rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

const RecipeResults = ({
  userIngredients = [],
  matchedRecipes = [],
  savedRecipes = [],
  toggleSaveRecipe,
  navigateTo
}) => {
  const [filters, setFilters] = useState({
    cookingTime: 'any',
    difficulty: 'any',
    maxCalories: '',
    dietary: [],
    cuisine: 'any',
    sortBy: 'matchScore'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [filterSidebarError, setFilterSidebarError] = useState(false);

  // Try to import FilterSidebar with error handling
  const [FilterSidebarComponent, setFilterSidebarComponent] = useState(() => FallbackFilterSidebar);

  useEffect(() => {
    // Dynamically import FilterSidebar with error handling
    const loadFilterSidebar = async () => {
      try {
        const module = await import('../components/FilterSidebar');
        setFilterSidebarComponent(() => module.default);
        setFilterSidebarError(false);
      } catch (error) {
        console.warn('FilterSidebar component not found, using fallback:', error);
        setFilterSidebarError(true);
        setFilterSidebarComponent(() => FallbackFilterSidebar);
      }
    };

    loadFilterSidebar();
  }, []);

  // Simulate loading and recipe generation
  useEffect(() => {
    console.log('RecipeResults mounted with:', { 
      userIngredients, 
      matchedRecipes,
      ingredientsCount: userIngredients.length 
    });
    
    if (userIngredients.length > 0) {
      // Simulate API call delay
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log('Loading complete, showing recipes');
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [userIngredients, matchedRecipes]);

  // Generate mock recipes if none provided
  const generatedRecipes = useMemo(() => {
    console.log('Generating recipes with ingredients:', userIngredients);
    
    if (matchedRecipes && matchedRecipes.length > 0) {
      console.log('Using provided matchedRecipes:', matchedRecipes.length);
      return matchedRecipes;
    }

    if (!userIngredients || userIngredients.length === 0) {
      console.log('No user ingredients provided');
      return [];
    }

    // Generate mock recipes based on ingredients
    const mockRecipes = [
      {
        id: 1,
        name: `Delicious ${userIngredients[0]} Recipe`,
        cookingTime: 25,
        difficulty: "easy",
        rating: 4.5,
        matchScore: 92,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        ingredients: userIngredients,
        description: `A wonderful recipe using your ingredients: ${userIngredients.join(', ')}`,
        cuisine: "International",
        nutrition: {
          calories: 350,
          protein: 15,
          carbs: 45,
          fat: 12
        },
        dietary: ['vegetarian']
      },
      {
        id: 2,
        name: `Quick ${userIngredients.slice(0, 2).join(' & ')} Dish`,
        cookingTime: 15,
        difficulty: "easy",
        rating: 4.3,
        matchScore: 88,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        ingredients: [...userIngredients, 'olive oil', 'salt', 'pepper'],
        description: `Fast and easy meal perfect for busy days using ${userIngredients.join(', ')}`,
        cuisine: "Mediterranean",
        nutrition: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 10
        },
        dietary: ['vegetarian', 'gluten-free']
      },
      {
        id: 3,
        name: `Hearty ${userIngredients[0]} Bowl`,
        cookingTime: 35,
        difficulty: "medium",
        rating: 4.7,
        matchScore: 85,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        ingredients: [...userIngredients, 'quinoa', 'lemon', 'herbs'],
        description: `Nutritious and filling bowl featuring ${userIngredients.join(', ')}`,
        cuisine: "Healthy",
        nutrition: {
          calories: 420,
          protein: 18,
          carbs: 55,
          fat: 15
        },
        dietary: ['vegetarian', 'healthy']
      }
    ];

    console.log('Generated mock recipes:', mockRecipes.length);
    return mockRecipes;
  }, [userIngredients, matchedRecipes]);

  const filteredRecipes = useMemo(() => {
    let recipes = [...generatedRecipes];
    console.log('Filtering recipes:', recipes.length);

    // Apply filters
    recipes = recipes.filter(recipe => {
      if (filters.cookingTime !== 'any' && recipe.cookingTime > parseInt(filters.cookingTime)) return false;
      if (filters.difficulty !== 'any' && recipe.difficulty !== filters.difficulty) return false;
      if (filters.maxCalories && recipe.nutrition.calories > parseInt(filters.maxCalories)) return false;
      if (filters.dietary.length > 0 && !filters.dietary.some(d => recipe.dietary.includes(d))) return false;
      if (filters.cuisine !== 'any' && recipe.cuisine !== filters.cuisine) return false;
      return true;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'cookingTime':
        recipes.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      case 'calories':
        recipes.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
        break;
      case 'rating':
        recipes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // matchScore
        recipes.sort((a, b) => b.matchScore - a.matchScore);
    }

    console.log('Filtered recipes:', recipes.length);
    return recipes;
  }, [generatedRecipes, filters]);

  const getMatchStats = () => {
    const totalRecipes = generatedRecipes.length;
    const perfectMatches = generatedRecipes.filter(recipe => 
      recipe.matchScore >= 90
    ).length;
    const goodMatches = generatedRecipes.filter(recipe => 
      recipe.matchScore >= 70 && recipe.matchScore < 90
    ).length;

    return { totalRecipes, perfectMatches, goodMatches };
  };

  const getCookingTimeStats = () => {
    const quickRecipes = generatedRecipes.filter(recipe => recipe.cookingTime <= 20).length;
    const mediumRecipes = generatedRecipes.filter(recipe => recipe.cookingTime > 20 && recipe.cookingTime <= 40).length;
    return { quickRecipes, mediumRecipes };
  };

  const stats = getMatchStats();
  const timeStats = getCookingTimeStats();

  if (isLoading) {
    return (
      <main style={styles.loadingMain}>
        <div style={styles.loadingContent}>
          <Loader2 size={48} style={styles.spinner} />
          <h2 style={styles.loadingTitle}>Finding Perfect Recipes...</h2>
          <p style={styles.loadingText}>
            Searching through our database for recipes with: {userIngredients.join(', ')}
          </p>
          <div style={styles.loadingProgress}>
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userIngredients.length) {
    return (
      <main style={styles.emptyMain}>
        <div style={styles.emptyContent}>
          <ChefHat size={80} color="var(--gray-400)" />
          <h2 style={styles.emptyTitle}>No Ingredients Provided</h2>
          <p style={styles.emptyText}>
            Let's start by adding the ingredients you have on hand
          </p>
          <button 
            onClick={() => navigateTo('ingredients')} 
            style={styles.backBtn}
          >
            <ArrowLeft size={20} />
            Add Ingredients
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button 
            onClick={() => navigateTo('ingredients')}
            style={styles.backButton}
          >
            <ArrowLeft size={20} />
            Back to Ingredients
          </button>
          
          <div style={styles.titleSection}>
            <div style={styles.titleWrapper}>
              <h1 style={styles.title}>
                <Sparkles size={32} color="var(--primary)" />
                Recipe Recommendations
              </h1>
              <p style={styles.subtitle}>
                Found {generatedRecipes.length} recipes matching your {userIngredients.length} ingredients
              </p>
            </div>
            
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div style={styles.statNumber}>{stats.perfectMatches}</div>
                  <div style={styles.statLabel}>Perfect Matches</div>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={styles.statNumber}>{timeStats.quickRecipes}</div>
                  <div style={styles.statLabel}>Quick Recipes</div>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <Star size={20} />
                </div>
                <div>
                  <div style={styles.statNumber}>{stats.goodMatches}</div>
                  <div style={styles.statLabel}>Good Matches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning if FilterSidebar failed to load */}
      {filterSidebarError && (
        <div style={styles.warningBanner}>
          <AlertCircle size={16} />
          <span>Some filter features may not be available. Using basic filters.</span>
        </div>
      )}

      {/* Controls Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.controlsLeft}>
          <div style={styles.resultsInfo}>
            <span style={styles.resultsCount}>
              {filteredRecipes.length} of {generatedRecipes.length} recipes
            </span>
            {filteredRecipes.length !== generatedRecipes.length && (
              <span style={styles.filteredBadge}>
                Filtered
              </span>
            )}
          </div>
        </div>
        
        <div style={styles.controlsRight}>
          {/* View Mode Toggle */}
          <div style={styles.viewToggle}>
            <button
              style={{
                ...styles.viewBtn,
                ...(viewMode === 'grid' && styles.viewBtnActive)
              }}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              style={{
                ...styles.viewBtn,
                ...(viewMode === 'list' && styles.viewBtnActive)
              }}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>

          {/* Filter Button */}
          <button 
            style={styles.filterBtn}
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal size={20} />
            Filters
            {Object.values(filters).some(filter => 
              Array.isArray(filter) ? filter.length > 0 : filter !== 'any' && filter !== ''
            ) && (
              <span style={styles.filterDot}></span>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div style={styles.results}>
        {filteredRecipes.length === 0 ? (
          <div style={styles.emptyResults}>
            <div style={styles.emptyResultsContent}>
              <ChefHat size={64} color="var(--gray-300)" />
              <h3 style={styles.emptyResultsTitle}>No Recipes Match Your Filters</h3>
              <p style={styles.emptyResultsText}>
                Try adjusting your filters to see more recipes
              </p>
              <button 
                style={styles.resetFiltersBtn}
                onClick={() => setFilters({
                  cookingTime: 'any',
                  difficulty: 'any',
                  maxCalories: '',
                  dietary: [],
                  cuisine: 'any',
                  sortBy: 'matchScore'
                })}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            ...styles.recipesContainer,
            ...(viewMode === 'list' && styles.recipesList)
          }}>
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                userIngredients={userIngredients}
                isSaved={savedRecipes.some(r => r.id === recipe.id)}
                onToggleSave={() => toggleSaveRecipe && toggleSaveRecipe(recipe)}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                showMatchScore={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      {filteredRecipes.length > 0 && (
        <div style={styles.quickActions}>
          <div style={styles.quickActionsContent}>
            <span style={styles.quickActionsText}>
              Can't decide? Try one of our top picks:
            </span>
            <div style={styles.quickActionButtons}>
              <button style={styles.quickActionBtn}>
                <Zap size={16} />
                Quickest Recipe
              </button>
              <button style={styles.quickActionBtn}>
                <Leaf size={16} />
                Healthiest Option
              </button>
              <button style={styles.quickActionBtn}>
                <Star size={16} />
                Highest Rated
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use the dynamically loaded FilterSidebar */}
      <FilterSidebarComponent
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        recipeCount={filteredRecipes.length}
        totalRecipes={generatedRecipes.length}
      />

      {/* Enhanced Debug Info */}
      <div style={styles.debugInfo}>
        <p><strong>Debug Info:</strong></p>
        <p>User Ingredients: {userIngredients.join(', ') || 'None'}</p>
        <p>Generated Recipes: {generatedRecipes.length}</p>
        <p>Filtered Recipes: {filteredRecipes.length}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Filter Sidebar: {filterSidebarError ? 'Fallback' : 'Loaded'}</p>
        <p>View Mode: {viewMode}</p>
      </div>
    </main>
  );
};

const styles = {
  main: { 
    flex: 1, 
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)',
    minHeight: '100vh'
  },
  loadingMain: {
    flex: 1,
    padding: '4rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)',
    minHeight: '100vh'
  },
  loadingContent: {
    textAlign: 'center',
    maxWidth: '500px'
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    color: 'var(--primary)',
    marginBottom: '1.5rem'
  },
  loadingTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--gray-800)',
    margin: '0 0 1rem'
  },
  loadingText: {
    fontSize: '1.1rem',
    color: 'var(--gray-600)',
    margin: '0 0 2rem',
    lineHeight: '1.5'
  },
  loadingProgress: {
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'var(--gray-200)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'var(--primary)',
    borderRadius: '3px',
    animation: 'progress 2s ease-in-out infinite'
  },
  emptyMain: {
    flex: 1,
    padding: '4rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)',
    minHeight: '100vh'
  },
  emptyContent: {
    textAlign: 'center',
    maxWidth: '400px'
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--gray-800)',
    margin: '1.5rem 0 0.5rem'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: 'var(--gray-600)',
    margin: '0 0 2rem',
    lineHeight: '1.5'
  },
  backBtn: {
    padding: '1rem 2rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
    ':hover': {
      background: 'var(--primary-dark)',
      transform: 'translateY(-2px)'
    }
  },
  header: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backButton: {
    background: 'var(--gray-100)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--gray-700)',
    transition: 'all 0.2s ease',
    marginBottom: '1.5rem',
    ':hover': {
      background: 'var(--gray-200)'
    }
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  titleWrapper: {
    flex: 1
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: 'var(--gray-900)'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--gray-600)',
    margin: 0
  },
  statsGrid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  statCard: {
    background: 'var(--primary-light)',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '140px'
  },
  statIcon: {
    width: '40px',
    height: '40px',
    background: 'var(--primary)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary)'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--gray-600)',
    fontWeight: '500'
  },
  controlsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    padding: '1rem 0',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  controlsLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  resultsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  resultsCount: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--gray-700)'
  },
  filteredBadge: {
    background: 'var(--warning-light)',
    color: 'var(--warning-dark)',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  viewToggle: {
    display: 'flex',
    background: 'var(--gray-100)',
    borderRadius: '8px',
    padding: '0.25rem'
  },
  viewBtn: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  viewBtnActive: {
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  filterBtn: {
    padding: '0.75rem 1.5rem',
    background: 'white',
    border: '2px solid var(--gray-300)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    position: 'relative',
    ':hover': {
      borderColor: 'var(--primary)',
      transform: 'translateY(-1px)'
    }
  },
  filterDot: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '8px',
    height: '8px',
    background: 'var(--primary)',
    borderRadius: '50%'
  },
  results: { 
    maxWidth: '1200px', 
    margin: '0 auto',
    minHeight: '400px'
  },
  recipesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  recipesList: {
    gridTemplateColumns: '1fr',
    gap: '1rem'
  },
  emptyResults: {
    textAlign: 'center',
    padding: '4rem 1rem',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  emptyResultsContent: {
    maxWidth: '400px',
    margin: '0 auto'
  },
  emptyResultsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--gray-800)',
    margin: '1.5rem 0 0.5rem'
  },
  emptyResultsText: {
    fontSize: '1rem',
    color: 'var(--gray-600)',
    margin: '0 0 2rem'
  },
  resetFiltersBtn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--primary-dark)'
    }
  },
  quickActions: {
    maxWidth: '1200px',
    margin: '3rem auto 0',
    padding: '1.5rem',
    background: 'var(--success-light)',
    borderRadius: '16px',
    border: '1px solid var(--success)'
  },
  quickActionsContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  quickActionsText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--success-dark)'
  },
  quickActionButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  quickActionBtn: {
    padding: '0.75rem 1.25rem',
    background: 'white',
    border: '1px solid var(--success)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--success-dark)',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--success)',
      color: 'white'
    }
  },
  warningBanner: {
    backgroundColor: 'var(--warning-light)',
    border: '1px solid var(--warning)',
    color: 'var(--warning-dark)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    margin: '0 auto 1rem',
    maxWidth: '1200px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem'
  },
  debugInfo: {
    marginTop: '2rem',
    padding: '1rem',
    background: 'var(--gray-100)',
    borderRadius: '8px',
    fontSize: '0.8rem',
    color: 'var(--gray-600)',
    maxWidth: '1200px',
    margin: '2rem auto 0'
  }
};

export default RecipeResults;