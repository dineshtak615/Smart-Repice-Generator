// src/components/FilterSidebar.jsx
import React from 'react';
import { X, Filter, Clock, Star, Zap, Leaf } from 'lucide-react';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  recipeCount,
  totalRecipes 
}) => {
  if (!isOpen) return null;

  const cookingTimeOptions = [
    { value: 'any', label: 'Any Time' },
    { value: '15', label: '15 min or less' },
    { value: '30', label: '30 min or less' },
    { value: '45', label: '45 min or less' },
    { value: '60', label: '60 min or less' }
  ];

  const difficultyOptions = [
    { value: 'any', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'healthy', label: 'Healthy' },
    { value: 'low-carb', label: 'Low Carb' }
  ];

  const cuisineOptions = [
    { value: 'any', label: 'Any Cuisine' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'asian', label: 'Asian' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'american', label: 'American' },
    { value: 'indian', label: 'Indian' }
  ];

  const sortOptions = [
    { value: 'matchScore', label: 'Best Match', icon: Zap },
    { value: 'cookingTime', label: 'Cooking Time', icon: Clock },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'calories', label: 'Lowest Calories', icon: Leaf }
  ];

  const handleDietaryChange = (diet) => {
    const updated = filters.dietary.includes(diet)
      ? filters.dietary.filter(d => d !== diet)
      : [...filters.dietary, diet];
    
    onFiltersChange({ ...filters, dietary: updated });
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      cookingTime: 'any',
      difficulty: 'any',
      maxCalories: '',
      dietary: [],
      cuisine: 'any',
      sortBy: 'matchScore'
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter !== 'any' && filter !== ''
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <Filter size={24} />
            <h3 style={styles.title}>Filters & Sorting</h3>
            <span style={styles.recipeCount}>
              {recipeCount} of {totalRecipes} recipes
            </span>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Filters Content */}
        <div style={styles.content}>
          {/* Sort By */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Sort By</h4>
            <div style={styles.sortOptions}>
              {sortOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    style={{
                      ...styles.sortOption,
                      ...(filters.sortBy === option.value && styles.sortOptionActive)
                    }}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                  >
                    <Icon size={16} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking Time */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Cooking Time</h4>
            <div style={styles.radioGroup}>
              {cookingTimeOptions.map(option => (
                <label key={option.value} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="cookingTime"
                    value={option.value}
                    checked={filters.cookingTime === option.value}
                    onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
                    style={styles.radioInput}
                  />
                  <span style={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Difficulty Level</h4>
            <div style={styles.radioGroup}>
              {difficultyOptions.map(option => (
                <label key={option.value} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={option.value}
                    checked={filters.difficulty === option.value}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    style={styles.radioInput}
                  />
                  <span style={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Calories */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Max Calories</h4>
            <div style={styles.caloriesInput}>
              <input
                type="number"
                placeholder="e.g., 500"
                value={filters.maxCalories}
                onChange={(e) => handleFilterChange('maxCalories', e.target.value)}
                style={styles.numberInput}
              />
              <span style={styles.caloriesUnit}>cal</span>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Dietary Preferences</h4>
            <div style={styles.checkboxGroup}>
              {dietaryOptions.map(option => (
                <label key={option.value} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.dietary.includes(option.value)}
                    onChange={() => handleDietaryChange(option.value)}
                    style={styles.checkboxInput}
                  />
                  <span style={styles.checkboxText}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Cuisine</h4>
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              style={styles.select}
            >
              {cuisineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            style={styles.clearButton}
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
          >
            Clear All Filters
          </button>
          <button 
            style={styles.applyButton}
            onClick={onClose}
          >
            Show Recipes
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
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
    width: '400px',
    maxWidth: '90vw',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--gray-200)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0.5rem 0 0.25rem',
    color: 'var(--gray-900)'
  },
  recipeCount: {
    fontSize: '0.875rem',
    color: 'var(--gray-600)'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    color: 'var(--gray-600)',
    ':hover': {
      backgroundColor: 'var(--gray-100)'
    }
  },
  content: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto'
  },
  filterSection: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 1rem',
    color: 'var(--gray-800)'
  },
  sortOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  sortOption: {
    padding: '0.75rem 1rem',
    border: '1px solid var(--gray-300)',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  },
  sortOptionActive: {
    borderColor: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.5rem 0'
  },
  radioInput: {
    margin: 0
  },
  radioText: {
    fontSize: '0.9rem',
    color: 'var(--gray-700)'
  },
  caloriesInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  numberInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid var(--gray-300)',
    borderRadius: '6px',
    fontSize: '0.9rem'
  },
  caloriesUnit: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)',
    minWidth: '30px'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.5rem 0'
  },
  checkboxInput: {
    margin: 0
  },
  checkboxText: {
    fontSize: '0.9rem',
    color: 'var(--gray-700)'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--gray-300)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    backgroundColor: 'white'
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid var(--gray-200)',
    display: 'flex',
    gap: '1rem'
  },
  clearButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid var(--gray-300)',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  applyButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '8px',
    background: 'var(--primary)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  }
};

export default FilterSidebar;