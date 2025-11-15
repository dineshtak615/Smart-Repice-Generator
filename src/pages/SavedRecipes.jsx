// src/pages/SavedRecipes.jsx
import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  ChefHat, 
  Search, 
  Filter, 
  Grid3X3,
  List,
  Clock,
  Star,
  Zap,
  Trash2,
  Play,
  Share2,
  BookOpen,
  TrendingUp,
  Plus,
  Download,
  Upload,
  Calendar,
  Tag
} from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SavedRecipes = ({ navigateTo }) => {
  const [savedRecipes, setSavedRecipes] = useLocalStorage('savedRecipes', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'cookingTime', 'rating', 'name'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'quick', 'favorite', etc.

  // Built-in sample recipes for demonstration
  const sampleRecipes = [
    {
      id: 'sample-1',
      name: "Classic Mediterranean Bowl",
      cookingTime: 25,
      difficulty: "easy",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ingredients: ['quinoa', 'cherry tomatoes', 'cucumber', 'feta cheese', 'kalamata olives', 'red onion', 'olive oil', 'lemon juice'],
      description: "A fresh and healthy Mediterranean bowl packed with flavors and nutrients.",
      cuisine: "Mediterranean",
      tags: ['healthy', 'vegetarian', 'quick'],
      nutrition: {
        calories: 420,
        protein: 15,
        carbs: 45,
        fat: 22,
        fiber: 8
      },
      savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'sample-2',
      name: "Creamy Mushroom Risotto",
      cookingTime: 40,
      difficulty: "medium",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ingredients: ['arborio rice', 'mixed mushrooms', 'white wine', 'parmesan cheese', 'vegetable broth', 'onion', 'garlic', 'butter'],
      description: "Creamy Italian risotto with earthy mushrooms and parmesan cheese.",
      cuisine: "Italian",
      tags: ['comfort food', 'vegetarian', 'creamy'],
      nutrition: {
        calories: 380,
        protein: 12,
        carbs: 55,
        fat: 14,
        fiber: 4
      },
      savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      id: 'sample-3',
      name: "Speedy Chicken Stir Fry",
      cookingTime: 15,
      difficulty: "easy",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ingredients: ['chicken breast', 'bell peppers', 'broccoli', 'soy sauce', 'ginger', 'garlic', 'sesame oil', 'green onions'],
      description: "Quick and healthy stir fry with colorful vegetables and tender chicken.",
      cuisine: "Asian",
      tags: ['quick', 'high-protein', 'gluten-free'],
      nutrition: {
        calories: 320,
        protein: 28,
        carbs: 18,
        fat: 16,
        fiber: 5
      },
      savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];

  // Add sample recipes if no saved recipes exist
  const addSampleRecipes = () => {
    if (savedRecipes.length === 0) {
      setSavedRecipes(sampleRecipes);
    }
  };

  const filteredAndSortedRecipes = useMemo(() => {
    let recipes = [...savedRecipes];

    // Apply search filter
    if (searchQuery) {
      recipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Apply category filters
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'quick':
          recipes = recipes.filter(recipe => recipe.cookingTime <= 20);
          break;
        case 'favorite':
          recipes = recipes.filter(recipe => recipe.rating >= 4.5);
          break;
        case 'healthy':
          recipes = recipes.filter(recipe => 
            recipe.nutrition?.calories < 400 || 
            recipe.tags?.includes('healthy')
          );
          break;
        case 'vegetarian':
          recipes = recipes.filter(recipe => 
            recipe.tags?.includes('vegetarian') || 
            !recipe.ingredients.some(ing => 
              ['chicken', 'beef', 'pork', 'fish'].some(meat => ing.toLowerCase().includes(meat))
            )
          );
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'cookingTime':
        recipes.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      case 'rating':
        recipes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        recipes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
      default:
        recipes.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
        break;
    }

    return recipes;
  }, [savedRecipes, searchQuery, sortBy, activeFilter]);

  const getRecipeStats = () => {
    const total = savedRecipes.length;
    const quickRecipes = savedRecipes.filter(recipe => recipe.cookingTime <= 20).length;
    const favoriteCuisine = getFavoriteCuisine();
    const totalCookingTime = savedRecipes.reduce((total, recipe) => total + recipe.cookingTime, 0);
    const highRated = savedRecipes.filter(recipe => recipe.rating >= 4.5).length;
    const totalTags = getTotalTags();
    
    return { total, quickRecipes, favoriteCuisine, totalCookingTime, highRated, totalTags };
  };

  const getFavoriteCuisine = () => {
    const cuisineCount = savedRecipes.reduce((acc, recipe) => {
      acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(cuisineCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  };

  const getTotalTags = () => {
    const allTags = savedRecipes.flatMap(recipe => recipe.tags || []);
    return new Set(allTags).size;
  };

  const clearAllRecipes = () => {
    if (window.confirm('Are you sure you want to clear all saved recipes? This action cannot be undone.')) {
      setSavedRecipes([]);
      setSelectedRecipes(new Set());
    }
  };

  const deleteSelectedRecipes = () => {
    if (selectedRecipes.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRecipes.size} selected recipe${selectedRecipes.size > 1 ? 's' : ''}?`)) {
      const updatedRecipes = savedRecipes.filter(recipe => !selectedRecipes.has(recipe.id));
      setSavedRecipes(updatedRecipes);
      setSelectedRecipes(new Set());
    }
  };

  const toggleRecipeSelection = (recipeId) => {
    const newSelected = new Set(selectedRecipes);
    if (newSelected.has(recipeId)) {
      newSelected.delete(recipeId);
    } else {
      newSelected.add(recipeId);
    }
    setSelectedRecipes(newSelected);
  };

  const selectAllRecipes = () => {
    if (selectedRecipes.size === filteredAndSortedRecipes.length) {
      setSelectedRecipes(new Set());
    } else {
      setSelectedRecipes(new Set(filteredAndSortedRecipes.map(recipe => recipe.id)));
    }
  };

  const exportRecipes = () => {
    const dataStr = JSON.stringify(savedRecipes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-recipes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRecipes = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRecipes = JSON.parse(e.target.result);
        if (Array.isArray(importedRecipes)) {
          setSavedRecipes(prev => [...prev, ...importedRecipes]);
          alert(`Successfully imported ${importedRecipes.length} recipes!`);
        } else {
          alert('Invalid recipe file format.');
        }
      } catch (error) {
        alert('Error reading recipe file. Please make sure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const getQuickestRecipe = () => {
    return filteredAndSortedRecipes.reduce((quickest, current) => 
      current.cookingTime < quickest.cookingTime ? current : quickest, filteredAndSortedRecipes[0]
    );
  };

  const getHighestRatedRecipe = () => {
    return filteredAndSortedRecipes.reduce((highest, current) => 
      (current.rating || 0) > (highest.rating || 0) ? current : highest, filteredAndSortedRecipes[0]
    );
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'quickest':
        const quickest = getQuickestRecipe();
        // Navigate to recipe detail or start cooking
        alert(`Starting with: ${quickest.name} (${quickest.cookingTime} minutes)`);
        break;
      case 'highestRated':
        const highestRated = getHighestRatedRecipe();
        alert(`Starting with: ${highestRated.name} (⭐ ${highestRated.rating})`);
        break;
      case 'startCooking':
        if (filteredAndSortedRecipes.length > 0) {
          const randomRecipe = filteredAndSortedRecipes[Math.floor(Math.random() * filteredAndSortedRecipes.length)];
          alert(`Let's cook: ${randomRecipe.name}!`);
        }
        break;
    }
  };

  const stats = getRecipeStats();

  return (
    <main style={styles.main}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <div style={styles.titleWrapper}>
              <Heart size={48} fill="var(--error)" color="var(--error)" />
              <div>
                <h1 style={styles.title}>Saved Recipes</h1>
                <p style={styles.subtitle}>
                  Your personal collection of favorite recipes
                </p>
              </div>
            </div>
            
            <div style={styles.headerActions}>
              {savedRecipes.length > 0 ? (
                <>
                  <button 
                    style={styles.actionButton}
                    onClick={() => navigateTo('ingredients')}
                  >
                    <BookOpen size={20} />
                    Find More Recipes
                  </button>
                  <button 
                    style={styles.importExportButton}
                    onClick={exportRecipes}
                  >
                    <Download size={20} />
                    Export
                  </button>
                  <label style={styles.importExportButton}>
                    <Upload size={20} />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importRecipes}
                      style={styles.fileInput}
                    />
                  </label>
                </>
              ) : (
                <button 
                  style={styles.actionButton}
                  onClick={addSampleRecipes}
                >
                  <Plus size={20} />
                  Add Sample Recipes
                </button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {savedRecipes.length > 0 && (
            <div style={styles.statsSection}>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                    <div style={styles.statNumber}>{stats.total}</div>
                    <div style={styles.statLabel}>Total Saved</div>
                  </div>
                </div>
                
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <div style={styles.statNumber}>{stats.quickRecipes}</div>
                    <div style={styles.statLabel}>Quick Recipes</div>
                  </div>
                </div>
                
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={styles.statNumber}>
                      {Math.round(stats.totalCookingTime / savedRecipes.length)}min
                    </div>
                    <div style={styles.statLabel}>Avg. Time</div>
                  </div>
                </div>
                
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div style={styles.statNumber}>{stats.favoriteCuisine}</div>
                    <div style={styles.statLabel}>Favorite Cuisine</div>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <div style={styles.statNumber}>{stats.highRated}</div>
                    <div style={styles.statLabel}>Highly Rated</div>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Tag size={20} />
                  </div>
                  <div>
                    <div style={styles.statNumber}>{stats.totalTags}</div>
                    <div style={styles.statLabel}>Unique Tags</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      {savedRecipes.length > 0 && (
        <div style={styles.controlsBar}>
          <div style={styles.controlsLeft}>
            {/* Search Input */}
            <div style={styles.searchContainer}>
              <Search size={20} color="var(--gray-400)" />
              <input
                type="text"
                placeholder="Search by name, ingredients, cuisine, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Quick Filters */}
            <div style={styles.filterButtons}>
              {[
                { key: 'all', label: 'All', icon: ChefHat },
                { key: 'quick', label: 'Quick', icon: Zap },
                { key: 'favorite', label: 'Top Rated', icon: Star },
                { key: 'healthy', label: 'Healthy', icon: Heart },
                { key: 'vegetarian', label: 'Vegetarian', icon: BookOpen }
              ].map(filter => (
                <button
                  key={filter.key}
                  style={{
                    ...styles.filterBtn,
                    ...(activeFilter === filter.key && styles.filterBtnActive)
                  }}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  <filter.icon size={16} />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Selection Controls */}
            {selectedRecipes.size > 0 && (
              <div style={styles.selectionControls}>
                <span style={styles.selectionCount}>
                  {selectedRecipes.size} selected
                </span>
                <button 
                  style={styles.deleteSelectedBtn}
                  onClick={deleteSelectedRecipes}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div style={styles.controlsRight}>
            {/* Sort Dropdown */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="recent">Recently Saved</option>
              <option value="cookingTime">Cooking Time</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>

            {/* View Mode Toggle */}
            <div style={styles.viewToggle}>
              <button
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === 'grid' && styles.viewBtnActive)
                }}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === 'list' && styles.viewBtnActive)
                }}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>

            {/* Clear All Button */}
            <button 
              style={styles.clearAllBtn}
              onClick={clearAllRecipes}
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Recipes Grid */}
      <div style={styles.content}>
        {savedRecipes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyContent}>
              <Heart size={80} color="var(--gray-300)" />
              <h2 style={styles.emptyTitle}>No Saved Recipes Yet</h2>
              <p style={styles.emptyText}>
                Start building your recipe collection by saving recipes you love, or add our sample recipes to get started.
              </p>
              <div style={styles.emptyActions}>
                <button 
                  style={styles.primaryButton}
                  onClick={() => navigateTo('ingredients')}
                >
                  <BookOpen size={20} />
                  Browse Recipes
                </button>
                <button 
                  style={styles.secondaryButton}
                  onClick={addSampleRecipes}
                >
                  <Plus size={20} />
                  Add Sample Recipes
                </button>
                <button 
                  style={styles.tertiaryButton}
                  onClick={() => navigateTo('results')}
                >
                  <TrendingUp size={20} />
                  View Recommendations
                </button>
              </div>
            </div>
          </div>
        ) : filteredAndSortedRecipes.length === 0 ? (
          <div style={styles.noResults}>
            <Search size={48} color="var(--gray-300)" />
            <h3 style={styles.noResultsTitle}>No Recipes Found</h3>
            <p style={styles.noResultsText}>
              No saved recipes match your search criteria. Try adjusting your filters or search terms.
            </p>
            <div style={styles.noResultsActions}>
              <button 
                style={styles.clearSearchBtn}
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear Filters
              </button>
              <button 
                style={styles.secondaryButton}
                onClick={() => navigateTo('ingredients')}
              >
                Find More Recipes
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Selection Header */}
            {filteredAndSortedRecipes.length > 0 && (
              <div style={styles.bulkSelection}>
                <label style={styles.selectAllLabel}>
                  <input
                    type="checkbox"
                    checked={selectedRecipes.size === filteredAndSortedRecipes.length}
                    onChange={selectAllRecipes}
                    style={styles.checkbox}
                  />
                  Select All ({filteredAndSortedRecipes.length} recipes)
                </label>
                <div style={styles.bulkActions}>
                  <span style={styles.recipeCount}>
                    Showing {filteredAndSortedRecipes.length} of {savedRecipes.length} recipes
                  </span>
                </div>
              </div>
            )}

            {/* Recipes Grid/List */}
            <div style={{
              ...styles.recipesContainer,
              ...(viewMode === 'list' && styles.recipesList)
            }}>
              {filteredAndSortedRecipes.map(recipe => (
                <div key={recipe.id} style={styles.recipeWrapper}>
                  {viewMode === 'list' && (
                    <input
                      type="checkbox"
                      checked={selectedRecipes.has(recipe.id)}
                      onChange={() => toggleRecipeSelection(recipe.id)}
                      style={styles.recipeCheckbox}
                    />
                  )}
                  <RecipeCard
                    recipe={recipe}
                    isSaved={true}
                    onToggleSave={() => {
                      // Remove from saved
                      setSavedRecipes(prev => prev.filter(r => r.id !== recipe.id));
                    }}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    showMatchScore={false}
                    showTags={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions Footer */}
      {filteredAndSortedRecipes.length > 0 && (
        <div style={styles.quickActions}>
          <div style={styles.quickActionsContent}>
            <span style={styles.quickActionsText}>
              Ready to cook? Start with:
            </span>
            <div style={styles.quickActionButtons}>
              <button 
                style={styles.quickActionBtn}
                onClick={() => handleQuickAction('quickest')}
              >
                <Zap size={16} />
                Quickest Recipe
              </button>
              <button 
                style={styles.quickActionBtn}
                onClick={() => handleQuickAction('highestRated')}
              >
                <Star size={16} />
                Highest Rated
              </button>
              <button 
                style={styles.quickActionBtn}
                onClick={() => handleQuickAction('startCooking')}
              >
                <Play size={16} />
                Start Cooking
              </button>
            </div>
          </div>
        </div>
      )}
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
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.25rem',
    color: 'var(--gray-900)'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--gray-600)',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--primary-dark)',
      transform: 'translateY(-1px)'
    }
  },
  importExportButton: {
    padding: '0.75rem 1.5rem',
    background: 'var(--gray-100)',
    color: 'var(--gray-700)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    position: 'relative',
    ':hover': {
      background: 'var(--gray-200)',
      transform: 'translateY(-1px)'
    }
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  statsSection: {
    borderTop: '1px solid var(--gray-200)',
    paddingTop: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  statCard: {
    background: 'var(--primary-light)',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  },
  statIcon: {
    width: '48px',
    height: '48px',
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
    color: 'var(--primary-dark)'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)',
    fontWeight: '500'
  },
  controlsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  controlsLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'var(--gray-100)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    minWidth: '300px'
  },
  searchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '1rem',
    flex: 1,
    '::placeholder': {
      color: 'var(--gray-400)'
    }
  },
  filterButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '0.5rem 1rem',
    background: 'var(--gray-100)',
    color: 'var(--gray-700)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--gray-200)'
    }
  },
  filterBtnActive: {
    background: 'var(--primary)',
    color: 'white'
  },
  selectionControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  selectionCount: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--primary)'
  },
  deleteSelectedBtn: {
    padding: '0.5rem 1rem',
    background: 'var(--error)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--error-dark)',
      transform: 'translateY(-1px)'
    }
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  sortSelect: {
    padding: '0.75rem 1rem',
    border: '1px solid var(--gray-300)',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--primary)'
    }
  },
  viewToggle: {
    display: 'flex',
    background: 'var(--gray-100)',
    borderRadius: '8px',
    padding: '0.25rem'
  },
  viewBtn: {
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--gray-200)'
    }
  },
  viewBtnActive: {
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    ':hover': {
      background: 'white'
    }
  },
  clearAllBtn: {
    padding: '0.75rem 1rem',
    background: 'var(--error-light)',
    color: 'var(--error)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--error)',
      color: 'white',
      transform: 'translateY(-1px)'
    }
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  emptyContent: {
    textAlign: 'center',
    maxWidth: '500px'
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
  emptyActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    padding: '1rem 2rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'var(--primary-dark)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  },
  secondaryButton: {
    padding: '1rem 2rem',
    background: 'var(--gray-100)',
    color: 'var(--gray-700)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'var(--gray-200)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  },
  tertiaryButton: {
    padding: '1rem 2rem',
    background: 'var(--success-light)',
    color: 'var(--success-dark)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'var(--success)',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  },
  noResults: {
    textAlign: 'center',
    padding: '4rem 1rem',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  noResultsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--gray-800)',
    margin: '1.5rem 0 0.5rem'
  },
  noResultsText: {
    fontSize: '1rem',
    color: 'var(--gray-600)',
    margin: '0 0 2rem'
  },
  noResultsActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  clearSearchBtn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--primary-dark)',
      transform: 'translateY(-1px)'
    }
  },
  bulkSelection: {
    background: 'var(--primary-light)',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  selectAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    fontWeight: '600',
    color: 'var(--primary-dark)'
  },
  bulkActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  recipeCount: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)',
    fontWeight: '500'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
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
  recipeWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  recipeCheckbox: {
    marginTop: '1rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
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
      color: 'white',
      transform: 'translateY(-1px)'
    }
  }
};

export default SavedRecipes;